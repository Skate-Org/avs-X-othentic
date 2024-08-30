import { watchExecution, collectExecution } from "./periphery.service";

import { zoraClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { ZORA_GATEWAY, ZORA_GATEWAY_GENESIS } from "../../../common/const";

const zora_CHECKPOINT = "progress/periphery.zora.json";

async function main() {
  const zoraConfig: CollectorConfig = {
    context: "zora Collection Process",
    genesisBlock: ZORA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: zoraClient, gatewayAddress: ZORA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: zoraClient, gatewayAddress: ZORA_GATEWAY }),
    getBlockNumber: async () => await zoraClient.getBlockNumber(),
    checkpointFile: zora_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(zoraConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
