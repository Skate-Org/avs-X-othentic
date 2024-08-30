import { Log, PublicClient } from "viem";
import { TaskExecuted_EVENT_ABI } from "../../../ABI/ISkateGateway";
import { prismaClient } from "../../../common/db";
import { exponentialRetry } from "../../../common/lib";
import { logger } from "../../../common/logger";

async function processGatewayLogs(logs: Log<bigint, number, false, (typeof TaskExecuted_EVENT_ABI)[0], undefined>[]) {
  const tasks = [];
  const dbUpdates: ReturnType<typeof prismaClient.task.update>[] = [];

  for (const log of logs) {
    const {
      args: { taskId, task },
      transactionHash,
    } = log;
    if (taskId == undefined || task == undefined) {
      logger.error("Invalid log: %O", log);
      continue;
    }

    const dbUpdate = prismaClient.task.update({
      where: {
        taskId_appAddress: {
          taskId: Number(taskId),
          appAddress: task.appAddress,
        },
      },
      data: {
        status: "EXECUTED",
        peripheryTxHash: transactionHash,
      },
    });
    dbUpdates.push(dbUpdate);

    tasks.push(task);
  }

  const { success } = await exponentialRetry({
    fn: async () => {
      return prismaClient.$transaction(dbUpdates);
    },
  });

  return {
    data: tasks,
    saved: success,
  };
}

async function collectExecution(
  { client, gatewayAddress }: { client: PublicClient; gatewayAddress: `0x${string}` },
  { fromBlock, toBlock }: { fromBlock: bigint; toBlock: bigint | undefined },
) {
  const logs = await client.getContractEvents({
    address: gatewayAddress,
    abi: TaskExecuted_EVENT_ABI,
    eventName: "TaskExecuted",
    fromBlock,
    toBlock,
  });
  return processGatewayLogs(logs);
}

async function watchExecution(
  { client, gatewayAddress }: { client: PublicClient; gatewayAddress: `0x${string}` },
  callbackObj?: {
    callback?: (logs: Log<bigint, number, false, (typeof TaskExecuted_EVENT_ABI)[0], undefined>[]) => any;
  },
) {
  const unwatch = client.watchContractEvent({
    address: gatewayAddress,
    abi: TaskExecuted_EVENT_ABI,
    eventName: "TaskExecuted",
    onLogs: async (logs) => {
      await processGatewayLogs(logs);
      if (!!callbackObj && !!callbackObj.callback) {
        await callbackObj.callback(logs);
      }
    },
  });
  return unwatch;
}

export { collectExecution, watchExecution };
