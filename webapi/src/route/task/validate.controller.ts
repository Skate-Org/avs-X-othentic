import type { FastifyRequest, FastifyReply } from "fastify";
import { validateProofOfTask } from "./validate.service";

export async function validateHandler(
  request: FastifyRequest<{
    Body: {
      proofOfTask: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { proofOfTask } = request.body;
  try {
    const result = await validateProofOfTask(proofOfTask);
    request.log.debug(`Got request from ${request.ip}: ${{ body: request.body }}`);
    return reply.status(200).send({ data: result });
  } catch (error) {
    reply.log.error(`500: Internal Server Error ${error}`);
    return reply.status(500).send({ message: "Internal Server Error", data: null });
  }
}
