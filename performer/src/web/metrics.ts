import { Registry, collectDefaultMetrics, Counter, Gauge } from "prom-client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import "dotenv/config";

// Prometheus setup
const metricsRegistry = new Registry();
metricsRegistry.setDefaultLabels({
  app: "skate-avs-Performer",
});
collectDefaultMetrics({ register: metricsRegistry });

const taskCounter = new Counter({
  name: "task_submitted_count",
  help: "Total number of tasks submitted",
  registers: [metricsRegistry],
});

const taskSuccessCounter = new Counter({
  name: "task_success_count",
  help: "Total number of successfully submitted tasks",
  registers: [metricsRegistry],
});

const taskErrorCounter = new Counter({
  name: "task_error_count",
  help: "Total number of errors during task submission",
  registers: [metricsRegistry],
});

const taskDataGauge = new Gauge({
  name: "task_data",
  help: "Gauge for tracking task data",
  labelNames: ["taskId", "user", "appAddress", "chainId", "taskDefinitionId", "taskCalldata", "transactionHash"],
  registers: [metricsRegistry],
});

const metricsGET = async (_: FastifyRequest, reply: FastifyReply) => {
  reply.header("Content-Type", metricsRegistry.contentType);
  reply.send(await metricsRegistry.metrics());
};

//////////////// EXPORTS /////////////////
const metrics = {
  taskCounter,
  taskSuccessCounter,
  taskErrorCounter,
  taskDataGauge,
};

const metricsRouter = async (fastify: FastifyInstance) => {
  fastify.get("/", metricsGET);
};

export { metrics, metricsRouter };
