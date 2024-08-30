import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { metricsRegistry } from "../../middleware/metrics";

const metricsRouter = async (fastify: FastifyInstance) => {
  fastify.get("/", indexHandler);
};

/**
 * Endpoint to expose metrics for Prometheus to scrape
 * @param _ - The request object
 * @param res - The response object
 */
const indexHandler = async (_: FastifyRequest, res: FastifyReply) => {
  res.header("Content-Type", metricsRegistry.contentType);
  try {
    const metrics = await metricsRegistry.metrics();
    res.send(metrics);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default metricsRouter;
