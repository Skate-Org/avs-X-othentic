import Fastify from "fastify";
import { logger } from "../lib/logger";
import { metricsRouter } from "./metrics";
import { instructionRouter } from "./instruction";

const server = Fastify({
  logger: logger,
});

server.register(metricsRouter, { prefix: "/metrics" });
server.register(instructionRouter, { prefix: "/instruction" });

export function startWebServer(port: number) {
  server.listen({ port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Server for manual instructions listening on ${address}`);
  });
}
