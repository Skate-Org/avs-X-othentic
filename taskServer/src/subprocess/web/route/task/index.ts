import { FastifyInstance } from "fastify";
import { statusHandler } from "./status.controller";
import { countHandler } from "./count.controller";

const taskRouter = async (fastify: FastifyInstance) => {
  fastify.get("/status", statusHandler);
  fastify.get("/count", countHandler);
};

export default taskRouter;
