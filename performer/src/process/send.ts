import { serializeSignature } from "viem";
import { keccak256, encodeAbiParameters, parseAbiParameters } from "viem";
import { sign } from "viem/accounts";
import { metrics } from "../web/metrics";
import { exponentialRetry } from "../lib/helper";
import { logger } from "../lib/logger";
import { DecodedLog, Task, logsToAVSTask } from "../lib/decode";
import { PERFORMER, OTHENTIC_AGGREGATOR_RPC, PERFORMER_KEY } from "../lib/static";
import { newConsumer } from "../lib/mpsc";

const executionQ: Task[] = [];
const logQ: DecodedLog[] = [];
const failedCache: Map<number, Task> = new Map<number, Task>();

let resumeExecution: null | (() => void) = null; // Function to forcefully resume execution.
async function* taskIterator() {
  const MIN_DELAY = 50; // Minimum delay in milliseconds
  const MAX_DELAY = 800; // Maximum delay in milliseconds
  let delay = MIN_DELAY;

  while (true) {
    if (executionQ.length > 0) {
      yield executionQ.shift()!;
      delay = MIN_DELAY; // Reset delay when there are tasks
    } else {
      // Pause and wait for new tasks without blocking the event loop
      await new Promise<void>((resolve) => {
        resumeExecution = resolve;
        setTimeout(resolve, delay);
      });
      // Increase delay up to the maximum if the queue is still empty
      delay = Math.min(delay * 2, MAX_DELAY);
    }
  }
}
/**
 * NOTE: check the function signature with othentic stateless rollup framework
 */
var jsonRpcRequestID = 1;
async function sendTask(task: Task) {
  const { proofOfTask, data, taskDefinitionId } = task;
  const message = encodeAbiParameters(parseAbiParameters(["string", "bytes", "address", "uint16"]), [
    proofOfTask,
    data,
    PERFORMER.address,
    taskDefinitionId,
  ]);
  const messageHash = keccak256(message);

  const signature = serializeSignature(await sign({ hash: messageHash, privateKey: PERFORMER_KEY }));

  const jsonRpcBody = {
    jsonrpc: "2.0",
    method: "sendTask",
    params: [proofOfTask, data, taskDefinitionId, PERFORMER.address, signature],
    id: jsonRpcRequestID++,
  };

  metrics.taskCounter.inc();

  const { success, result, errors } = await exponentialRetry({
    fn: async () => {
      const response = await fetch(OTHENTIC_AGGREGATOR_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonRpcBody),
      });
      if (response.status >= 200 && response.status < 300) {
        // If the response is 2xx, return the JSON data
        return response.json();
      } else if (response.status >= 300 && response.status < 400) {
        // If the response is 3xx, handle redirection logic if needed
        logger.warn(`Redirection response: ${response.status}`);
        return null; // or handle redirection appropriately
      } else {
        // If the response status code is not 2xx or 3xx, throw an error
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    },
    context: "Performer::sendTask",
  });

  if (success) {
    logger.info({ result }, "sendTask::Response: ");
    metrics.taskSuccessCounter.inc();
  } else {
    logger.error({ errors }, "sendTask::Errors: ");
    if (task.lives > 0) {
      task.lives -= 1;
      executionQ.push(task);
    } else {
      failedCache.set(jsonRpcRequestID, task);
      metrics.taskErrorCounter.inc();
    }
  }
}

async function executeSendTask(): Promise<void> {
  for await (const task of taskIterator()) {
    await sendTask(task).then(async () => {});
  }
}

function processLogQAndResumeExecution() {
  if (logQ.length == 0) {
    return false;
  }
  const avsTask = logsToAVSTask(logQ);
  executionQ.push(avsTask);
  logQ.length = 0;

  if (resumeExecution) {
    resumeExecution();
  }
  return true;
}

const EXECUTION_TIMEOUT = 30_000; // Timeout to force process without full log bundle, i.e. logs.size < BUNDLE_SIZE
export default async function main() {
  const consumer = newConsumer();
  setInterval(() => {
    const isExecuted = processLogQAndResumeExecution();
    if (isExecuted) {
      logger.info(`${EXECUTION_TIMEOUT}ms Time out, proceeds with execution`);
    }
  }, EXECUTION_TIMEOUT);

  const BUNDLE_SIZE = 100;
  consumer.on("connection", (socket) => {
    socket.on("data", (raw: Buffer) => {
      const data = JSON.parse(raw.toString());
      logQ.push(...data);
      if (logQ.length >= BUNDLE_SIZE) {
        logger.info(`Bundle of ${BUNDLE_SIZE} logs collected, proceeds with execution`);
        processLogQAndResumeExecution();
      }
    });
  });
  executeSendTask();
}

main();
