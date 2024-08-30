import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { MESSAGE_BOX, skateClient } from "../lib/static";
import { TaskSubmitted_EVENT_ABI } from "../ABI/IMessageBox";
import { decodeEventLogs } from "../lib/decode";
import { newProducer } from "../lib/mpsc";
import "dotenv/config"

// TODO: update this to push into same Execution Queue
const fetchTxPOST = async (
  request: FastifyRequest<{
    Body: { kernelTxHash: `0x${string}` };
    Headers: { 'api-key': string };
  }>,
  reply: FastifyReply,
) => {
  const API_KEY = process.env.API_KEY; // Replace with your actual API key
  const apiKey = request.headers['api-key'];
  if (apiKey !== API_KEY) {
    return reply.status(401).send({ status: "error", message: "Unauthorized: Invalid API key" });
  }
  try {
    const { kernelTxHash } = request.body;
    const { blockNumber } = await skateClient.getTransactionReceipt({ hash: kernelTxHash });
    const logs = await skateClient.getContractEvents({
      address: MESSAGE_BOX,
      abi: TaskSubmitted_EVENT_ABI,
      eventName: "TaskSubmitted",
      fromBlock: blockNumber, // CHANGE THIS
      toBlock: blockNumber, // CHANGE THIS
      strict: true,
    });
    if (logs.length > 0) {
      const logProducer = newProducer();
      logProducer.write(JSON.stringify(decodeEventLogs(logs)));
      return reply.send({ status: "success", message: `${logs.length} TaskSubmitted events detected` });
    } else {
      return reply.status(404).send({ status: "error", message: "No MessageBox.TaskSubmitted log found!" });
    }
  } catch (err: any) {
    if (err.name === "InvalidParamsRpcError") {
      return reply.status(400).send({ status: "error", message: "Invalid transaction hash format" });
    }
    if (err.name === "TransactionReceiptNotFoundError") {
      return reply.status(500).send({ status: "error", message: "Transaction with specified hash does not exist" });
    }
    console.error(`${err}\n\nError name: ${err.name}`);
    return reply.status(500).send({ status: "error", message: "Internal fetch error" });
  }
};

const instructionRouter = async (fastify: FastifyInstance) => {
  fastify.post("/fetch-tx", fetchTxPOST);
};

export { instructionRouter };
