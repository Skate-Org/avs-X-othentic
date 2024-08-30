import { serializeSignature, type Log } from "viem";
import { keccak256, encodeAbiParameters, parseAbiParameters } from "viem";
import { privateKeyToAccount, sign } from "viem/accounts";

import { TaskSubmitted_EVENT_ABI, AvsTask_ABIParameter } from "../ABI/IMessageBox";
import { exponentialRetry } from "../lib/helper";
import { logger } from "../lib/logger";
import "dotenv/config";
import fs from "fs";

const MESSAGE_BOX = process.env.MESSAGE_BOX_ADDRESS as `0x${string}`;
const PERFORMER_PRIVATE_KEY = process.env.PERFORMER_PRIVATE_KEY as `0x${string}`;
const OTHENTIC_AGGREGATOR_RPC = process.env.OTHENTIC_AGGREGATOR_RPC as string;

const performer = privateKeyToAccount(PERFORMER_PRIVATE_KEY);

var jsonRpcRequestID = 1;

// Task object structure
class Task {
  proofOfTask: string;
  data: `0x${string}`;
  taskDefinitionId: number;
  lives: number;

  constructor(proofOfTask: string, data: `0x${string}`, taskDefinitionId: number) {
    this.proofOfTask = proofOfTask;
    this.data = data;
    this.taskDefinitionId = taskDefinitionId;
    this.lives = 1; // NOTE: allow for delayed execution once if failed (maybe server down)
  }
}

// Execution queue and failed cache
const executionQueue: Task[] = [];
const failedCache: Map<number, Task> = new Map<number, Task>();
let resumeExecutionQueue: () => void;

async function* taskIterator() {
  while (true) {
    while (executionQueue.length > 0) {
      yield executionQueue.shift()!;
    }
    // NOTE: efficiently pause the event loop to save resource.
    await new Promise<void>((resolve) => {
      resumeExecutionQueue = resolve;
    });
  }
}

/**
 * NOTE: check the function signature with othentic stateless rollup framework
 */
async function sendTask(task: Task) {
  const { proofOfTask, data, taskDefinitionId } = task;
  const message = encodeAbiParameters(parseAbiParameters(["string", "bytes", "address", "uint16"]), [
    proofOfTask,
    data,
    performer.address,
    taskDefinitionId,
  ]);
  const messageHash = keccak256(message);

  const signature = serializeSignature(await sign({ hash: messageHash, privateKey: PERFORMER_PRIVATE_KEY }));

  const jsonRpcBody = {
    jsonrpc: "2.0",
    method: "sendTask",
    params: [proofOfTask, data, taskDefinitionId, performer.address, signature],
    id: jsonRpcRequestID++,
  };

  const { success, result, errors } = await exponentialRetry({
    fn: async () => {
      const taskChannelResponse = await fetch(OTHENTIC_AGGREGATOR_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonRpcBody),
      });
      return taskChannelResponse;
    },
    context: "Performer::sendTask",
  });

  if (success) {
    logger.info("sendTask::Response:\n %O", result);
  } else {
    logger.error("sendTask::Errors:\n %O", errors);
    if (task.lives > 0) {
      task.lives -= 1;
      executionQueue.push(task);
    } else {
      failedCache.set(jsonRpcRequestID, task);
    }
  }
}

async function processEvents(
  taskSubmittedLogs: Log<bigint, number, false, (typeof TaskSubmitted_EVENT_ABI)[0], undefined>[],
) {
  const tasks = [];

  // NOTE: futures version should group by taskDefinitionId
  const taskDefinitionId = 0; // Keep it 0 until we have more customized business logic
  for (const log of taskSubmittedLogs) {
    const { taskId, task } = log.args;
    if (taskId == undefined || task == undefined) {
      continue;
    }

    // Store information in the map
    const t = {
      taskId: Number(taskId),
      appAddress: task.appAddress,
      taskCalldata: task.taskCalldata,
      user: task.user,
      chainId: Number(task.chainId),
      messageBox: MESSAGE_BOX,
      taskDefinitionId,
      transactionHash: log.transactionHash,
    };

    tasks.push({
      ...t,
      taskId: BigInt(t.taskId),
      chainId: BigInt(t.chainId),
      taskDefinitionId: BigInt(t.taskDefinitionId),
    });
  }

  const encodedData = encodeAbiParameters(AvsTask_ABIParameter, [tasks]);
  console.log("Encoded data length: ", encodedData.length);
  fs.appendFile("log.txt", encodedData + "\n", (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    } else {
      console.log("Data written to log.txt");
    }
  });

  // TODO: Upload data to IPFS and use IPFS hash as the proofOfTask
  const proofOfTask = "<Some IPFS CID or other resource ID>";

  const task = new Task(proofOfTask, encodedData, taskDefinitionId);
  executionQueue.push(task);
  if (resumeExecutionQueue) {
    resumeExecutionQueue();
  }
}

async function processExecutionQueue(): Promise<void> {
  for await (const task of taskIterator()) {
    await sendTask(task);
  }
}

function getFakeLogs(number = 200) {
  const logs: Log<bigint, number, false, (typeof TaskSubmitted_EVENT_ABI)[0], undefined>[] = [];
  const logTemplate: any = {
    args: {
      taskId: BigInt(1),
      task: {
        appAddress: "0x454E2a552df6DD1106C52637C3442780993b065b",
        taskCalldata:
          "0x40c10f1900000000000000000000000000e3cc76da72cf673e4429e2d527388956af61ef0000000000000000000000000000000000000000000000000000000000000001",
        user: "0x00E3CC76DA72cF673E4429E2d527388956af61ef",
        chainId: BigInt(80002),
      },
    },
    transactionHash: "0xd29e58083b9fde041e0df3b175d2bbe22b5308087f4fac4db54e0f253f3c8b90",
  };

  for (let i = 0; i < number; i++) {
    const newLog = { ...logTemplate };
    newLog.args.taskId = BigInt(i);
    logs.push(newLog);
  }

  logs.push(logTemplate);

  return logs;
}

export default async function main() {
  const logs = getFakeLogs(1000);
  await processEvents(logs);
  setInterval(async () => {
    await processEvents(logs);
  }, 15_000);

  // NOTE: watch and process live
  processExecutionQueue();
}

main();
