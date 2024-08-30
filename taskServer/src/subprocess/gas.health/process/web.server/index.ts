import Fastify from "fastify";
import healthRouter from "./route/health";
import { logger } from "../../../../common/logger";
import { rateLimit, rateLimitOptions } from "./middleware/rateLimiter";

const app = Fastify({
  logger: logger,
});

// Custom rate limiter
app.register(rateLimit, rateLimitOptions);

// // NOTE: enable this if DDoS occurs.
// import { validateKeyMiddleware } from './middleware/validAPIKey';
// app.addHook('onRequest', validateKeyMiddleware);

// Routes
app.register(healthRouter, { prefix: "/" });

const PORT = 8008;
app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info({ address }, `Task server started`);
});
