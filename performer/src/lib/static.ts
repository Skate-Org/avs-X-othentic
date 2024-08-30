import { createPublicClient, webSocket } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";

const MESSAGE_BOX = process.env.MESSAGE_BOX_ADDRESS as `0x${string}`;
const OTHENTIC_AGGREGATOR_RPC = process.env.OTHENTIC_AGGREGATOR_RPC as string;
const PERFORMER_KEY = process.env.PERFORMER_PRIVATE_KEY as `0x${string}`;
const PERFORMER = privateKeyToAccount(process.env.PERFORMER_PRIVATE_KEY as `0x${string}`);

const skateClient = createPublicClient({
  transport: webSocket(process.env.SKATE_RPC),
});

export { MESSAGE_BOX, OTHENTIC_AGGREGATOR_RPC, PERFORMER, PERFORMER_KEY, skateClient };
