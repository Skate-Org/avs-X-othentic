import { FastifyReply, FastifyRequest } from "fastify";
import { getBalances } from "../../../../service/balance";

export async function balanceHandler(_: FastifyRequest, reply: FastifyReply) {
  const balanceMap = getBalances();
  reply.status(200).send(balanceMap);
}
