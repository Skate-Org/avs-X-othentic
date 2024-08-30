import pino from "pino";
import env from "dotenv";
env.config();

const isDevelopment = process.env.ENVIRONMENT == "development";
export const logger = pino({
  level: isDevelopment ? "info" : "error",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
