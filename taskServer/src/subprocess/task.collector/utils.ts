import fs from "fs";
import path from "path";
import { promisify } from "util";
import { logger } from "../../common/logger";
import { collectIntent } from "./kernel.service";
import { collectExecution } from "./periphery/periphery.service";
import { collectAttestation } from "./avs.service";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export interface Interval {
  start: number;
  end: number;
}

export async function loadCheckpoint(filePath: string): Promise<Interval[]> {
  try {
    const data = await readFileAsync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    } else {
      throw error;
    }
  }
}

export async function saveCheckpoint(filePath: string, intervals: Interval[]) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });

    const data = JSON.stringify(intervals, null, 2);
    await writeFileAsync(filePath, data, "utf8");
  } catch (error) {
    logger.error("Error saving checkpoint:", error);
    throw error;
  }
}

export async function mergeIntervals(intervals: Interval[]): Promise<Interval[]> {
  if (intervals.length === 0) return intervals;

  intervals.sort((a, b) => a.start - b.start);
  const merged: Interval[] = [intervals[0]];

  // Start loop from the second interval
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];
    // merge overlaps
    if (current.start <= last.end + 1) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }
  return merged;
}

type CollectorOutput = ReturnType<typeof collectIntent | typeof collectExecution | typeof collectAttestation>;
type Collector = (fromBlock: bigint, toBlock: bigint | undefined) => CollectorOutput;

export interface CollectorConfig {
  context: string;
  genesisBlock: number;
  collectFunction: Collector;
  watchFunction: () => Promise<() => void>;
  getBlockNumber: () => Promise<bigint>;
  checkpointFile: string;
  maxBlockRange?: bigint;
  archivedRpc?: boolean;
}

const MAX_BLOCK_RANGE = 1000n; // Maximum block range
const BACKUP_INTERVAL = 120_000; // 2 minutes

export async function startCollectionProcess({
  archivedRpc = true,
  maxBlockRange = MAX_BLOCK_RANGE,
  ...config
}: CollectorConfig) {
  logger.info(`Starting ${config.checkpointFile} collection process...`);

  let intervals = await loadCheckpoint(config.checkpointFile);

  if (archivedRpc) {
    let startBlock: bigint;
    // 1.a Collect past data
    // NOTE: do thrice to make sure we don't miss any block
    for (let it = 0; it < 3; it++) {
      startBlock = intervals.length > 0 ? BigInt(intervals[intervals.length - 1].end + 1) : BigInt(config.genesisBlock);
      intervals.push({ start: Number(startBlock), end: Number(startBlock) });
      const currentBlock = await config.getBlockNumber();
      while (startBlock <= currentBlock) {
        const endBlock = startBlock + maxBlockRange - 1n <= currentBlock ? startBlock + maxBlockRange : currentBlock;
        const { data, saved } = await config.collectFunction(startBlock, endBlock);
        if (data.length > 0) {
          logger.info(
            `${config.context}::Collected ${data.length} events from ${startBlock} to ${endBlock}. Saved to DB? ${saved}`,
          );
        }
        // save progress, write latency << block latency
        intervals[intervals.length - 1].end = Number(endBlock);
        intervals = await mergeIntervals(intervals);
        await saveCheckpoint(config.checkpointFile, intervals);

        // new iteration
        startBlock = endBlock + 1n;
      }
    }
  } else {
    // 1.b Directly collect from current blocks
    const currentBlock = await config.getBlockNumber();

    intervals.push({ start: Number(currentBlock), end: Number(currentBlock) });
    intervals = await mergeIntervals(intervals);
  }

  // 2. Watch for any new data
  const unwatch = await config.watchFunction();
  const backUpUnwatch = setInterval(async () => {
    intervals[intervals.length - 1].end = Number(await config.getBlockNumber());
    await saveCheckpoint(config.checkpointFile, intervals);
  }, BACKUP_INTERVAL);

  const cleanup = async () => {
    clearInterval(backUpUnwatch);
    unwatch();
    intervals[intervals.length - 1].end = Number(await config.getBlockNumber());
    await saveCheckpoint(config.checkpointFile, intervals);
  };

  process.on("SIGINT", async () => {
    logger.info(`SIGINT exit ${config.context}`);
    await cleanup();
    process.exit();
  });

  process.on("SIGTERM", async () => {
    logger.info(`SIGTERM exit ${config.context}`);
    await cleanup();
    process.exit();
  });

  process.on("exit", async (code) => {
    logger.info(`Process exit with code: ${code}`);
    await cleanup();
  });

  process.on("uncaughtException", async (error) => {
    logger.error(`Uncaught exception: ${error}`);
    await cleanup();
    process.exit(1); // Exit with failure
  });
}
