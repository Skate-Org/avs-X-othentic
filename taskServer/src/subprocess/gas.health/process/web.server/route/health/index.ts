import { FastifyInstance } from "fastify";
import { balanceHandler } from "./balance.controller";

const healthRouter = async (fastify: FastifyInstance) => {
  fastify.get("/", (_, reply) => {
    reply.status(200).send({ message: "Ok" });
  });

  fastify.get("/balance", balanceHandler);
};

export default healthRouter;
