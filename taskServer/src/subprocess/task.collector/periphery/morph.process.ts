import { watchExecution, collectExecution } from "./periphery.service";

import { morphClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { MORPH_GATEWAY, MORPH_GATEWAY_GENESIS } from "../../../common/const";

const morph_CHECKPOINT = "progress/periphery.morph.json";

async function main() {
  const morphConfig: CollectorConfig = {
    context: "morph Collection Process",
    genesisBlock: MORPH_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: morphClient, gatewayAddress: MORPH_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: morphClient, gatewayAddress: MORPH_GATEWAY }),
    getBlockNumber: async () => await morphClient.getBlockNumber(),
    checkpointFile: morph_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(morphConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
