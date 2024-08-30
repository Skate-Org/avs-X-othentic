import net from "net";
import fs from "fs";
import { logger } from "./logger";

export const EXECUTION_SOCKET = "/tmp/performer_SkateKernel_logs.sock";

export const newProducer = () => net.createConnection(EXECUTION_SOCKET);
export const newConsumer = () => {
  const consumer = net.createServer();
  if (fs.existsSync(EXECUTION_SOCKET)) {
    logger.info("Socket file exists! Clean then recreate...");
    fs.unlinkSync(EXECUTION_SOCKET);
    logger.info("Done!");
  }
  consumer.listen(EXECUTION_SOCKET, () => {
    logger.info(`Listening on ${EXECUTION_SOCKET}`);
  });
  return consumer;
};
