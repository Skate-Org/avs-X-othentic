import { prismaClient } from "../../../../common/db";

export type CountParams = {
  status?: "DETECTED" | "APPROVED" | "REJECTED" | "EXECUTED";
};

export async function countTasks(filter: CountParams): Promise<number> {
  const whereClause: any = {};

  if (filter.status !== undefined) {
    whereClause.status = filter.status;
  }

  return await prismaClient.task.count({
    where: whereClause,
  });
}
