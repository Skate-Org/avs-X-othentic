// taskRetrieverService.ts
import { Task } from "@prisma/client";
import { prismaClient } from "../../../../common/db";

type GetTaskParams = {
  limit: number;
  offset: number;
  taskId?: number;
  appAddress?: string;
  user?: string;
  chainId?: number;
  kernelTxHash?: string;
  avsTxHash?: string;
  status?: string;
};

async function getTasks(params: GetTaskParams): Promise<Task[]> {
  const { taskId, appAddress, user, chainId, kernelTxHash, avsTxHash, status: taskStatus } = params;

  const whereClause: any = {};

  if (appAddress !== undefined) {
    whereClause.appAddress = appAddress;
  }

  if (taskId !== undefined) {
    whereClause.taskId = taskId;
  }

  if (user !== undefined) {
    whereClause.user = user;
  }

  if (chainId !== undefined) {
    whereClause.chainId = chainId;
  }

  if (kernelTxHash !== undefined) {
    whereClause.kernelTxHash = kernelTxHash;
  }

  if (avsTxHash !== undefined) {
    whereClause.avsTxHash = avsTxHash;
  }

  if (taskStatus !== undefined) {
    whereClause.status = taskStatus;
  }

  return await prismaClient.task.findMany({
    where: whereClause,
    take: params.limit,
    skip: params.offset,
    orderBy: {
      taskId: "desc",
    },
  });
}

export { getTasks, GetTaskParams };
