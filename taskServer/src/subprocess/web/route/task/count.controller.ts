import type { FastifyRequest, FastifyReply } from "fastify";
import { countTasks } from "./count.service";

export async function countHandler(
  request: FastifyRequest<{
    Querystring: {
      status?: "DETECTED" | "APPROVED" | "REJECTED" | "EXECUTED";
    };
  }>,
  reply: FastifyReply,
) {
  try {
    const query = request.query;
    const count = await countTasks(query);
    return reply.status(200).send({ count });
  } catch (error) {
    reply.log.error(`CODE 500: Internal Server Error ${error}`);
    return reply.status(500).send({ message: "500: Internal Server Error", data: null });
  }
}
