import Fastify from "fastify";
import taskRouter from "./route/task";
import metricsRouter from "./route/metrics";
import healthRouter from "./route/health";
import { logger } from "../../common/logger";
import { metricsMiddleware } from "./middleware/metrics";
import { rateLimit, rateLimitOptions } from "./middleware/rateLimiter";
import { cors, corsOptions } from "./middleware/cors";

const app = Fastify({
  logger: logger,
});

// Register CORS
app.register(cors, corsOptions);

// Custom rate limiter
app.register(rateLimit, rateLimitOptions);

// // NOTE: enable this if DDoS occurs.
// import { validateKeyMiddleware } from './middleware/validAPIKey';
// app.addHook('onRequest', validateKeyMiddleware);

// Metrics middleware
app.addHook("onRequest", metricsMiddleware);

// Routes
app.register(taskRouter, { prefix: "/task" });
app.register(metricsRouter, { prefix: "/metrics" });
app.register(healthRouter, { prefix: "/" });

const PORT = 5051;
app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info({ address }, `Task server started`);
});
