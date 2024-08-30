import Fastify from "fastify";
import { logger } from "./lib/logger";
import taskRouter from "./route/task";
import healthRouter from "./route/health";
import { cors, corsOptions } from "./middleware/cors";

const server = Fastify({
  logger: logger,
});

// Register CORs
server.register(cors, corsOptions);

// Register routes
server.register(taskRouter, { prefix: "/task" });
server.register(healthRouter, { prefix: "/" });

const PORT = 4002;
server.listen({ port: PORT, host: "0.0.0.0" }, (err, _) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
