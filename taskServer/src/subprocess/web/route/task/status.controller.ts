import type { FastifyRequest, FastifyReply } from "fastify";
import { getTasks, type GetTaskParams } from "./status.service";

export async function statusHandler(
  request: FastifyRequest<{
    Querystring: {
      limit?: string;
      offset?: string;
      taskId?: string;
      chainId?: string;
      appAddress?: string;
      user?: string;
      kernelTxHash?: string;
      avsTxHash?: string;
      status?: "DETECTED" | "APPROVED" | "REJECTED" | "EXECUTED";
    };
  }>,
  reply: FastifyReply,
) {
  try {
    const query = request.query;

    if (!!query.limit && Number(query.limit) > 500) {
      return reply.status(400).send({ message: "Max 500 tasks per query", data: null });
    }

    const taskParams: GetTaskParams = {
      ...query,
      taskId: query.taskId !== undefined ? Number(query.taskId) : undefined,
      chainId: query.chainId !== undefined ? Number(query.chainId) : undefined,
      limit: query.limit !== undefined ? Number(query.limit) : 100,
      offset: query.offset !== undefined ? Number(query.offset) : 0,
    };

    const tasks = await getTasks(taskParams);
    const returnTasks = tasks.map((task) => {
      const { id, createdAt, lastUpdatedAt, peripheryTxHash, chainId, ...rest } = task;
      return { chainId: Number(chainId), ...rest };
    });
    return reply.status(200).send({ data: returnTasks });
  } catch (error) {
    reply.log.error(`CODE 500: Internal Server Error ${error}`);
    return reply.status(500).send({ message: "500: Internal Server Error", data: null });
  }
}
