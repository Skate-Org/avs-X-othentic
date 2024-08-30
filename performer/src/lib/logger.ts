import pino from "pino";
import "dotenv/config";

const isDevelopment = process.env.ENVIRONMENT == "development";

export const logger = pino({
  level: isDevelopment ? "debug" : "error",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "hostname",
        },
      }
    : undefined,
});
