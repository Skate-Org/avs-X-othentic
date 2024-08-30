import { Log } from "viem";
import { TaskSubmitted_EVENT_ABI } from "../../ABI/IMessageBox";
import { MESSAGE_BOX } from "../../common/const";
import { skateClient } from "../../common/client";
import { prismaClient } from "../../common/db";
import { exponentialRetry } from "../../common/lib";
import { logger } from "../../common/logger";

type TaskSubmittedLog = Log<bigint, number, false, (typeof TaskSubmitted_EVENT_ABI)[0], undefined>;
async function processMessageBoxLogs(logs: TaskSubmittedLog[]) {
  const tasks = [];
  const dbCreates: ReturnType<typeof prismaClient.task.create>[] = [];

  // NOTE: futures version should group by taskDefinitionId
  const taskDefinitionId = 0; // Keep it 0 until we have more customized business logic
  for (const log of logs) {
    const {
      args: { taskId, task },
      transactionHash,
    } = log;
    if (taskId == undefined || task == undefined) {
      logger.error("Invalid log: %O", log);
      continue;
    }

    // Store information in the map
    const dbTask = {
      taskId: Number(taskId),
      appAddress: task.appAddress,
      taskCalldata: task.taskCalldata,
      user: task.user,
      chainId: Number(task.chainId),
      messageBox: MESSAGE_BOX,
      taskDefinitionId,
      kernelTxHash: transactionHash,
    };
    tasks.push(dbTask);

    const dbCreate = prismaClient.task.create({
      data: {
        ...dbTask,
        status: "DETECTED",
      },
    });
    dbCreates.push(dbCreate);
  }

  const { success } = await exponentialRetry({
    fn: async () => {
      return prismaClient.$transaction(dbCreates);
    },
  });

  return {
    data: tasks,
    saved: success,
  };
}

async function collectIntent(fromBlock: bigint, toBlock: bigint | undefined) {
  const logs = await skateClient.getContractEvents({
    address: MESSAGE_BOX,
    abi: TaskSubmitted_EVENT_ABI,
    eventName: "TaskSubmitted",
    fromBlock,
    toBlock,
  });
  return processMessageBoxLogs(logs);
}

async function watchIntent(callbackObj?: {
  callback?: (logs: TaskSubmittedLog[], data?: any, saved?: boolean) => any;
}) {
  const unwatch = skateClient.watchContractEvent({
    address: MESSAGE_BOX,
    abi: TaskSubmitted_EVENT_ABI,
    eventName: "TaskSubmitted",
    onLogs: async (logs) => {
      const { data, saved } = await processMessageBoxLogs(logs);
      if (!!callbackObj && !!callbackObj.callback) {
        await callbackObj.callback(logs, data, saved);
      }
    },
  });
  return unwatch;
}

export { collectIntent, watchIntent };
