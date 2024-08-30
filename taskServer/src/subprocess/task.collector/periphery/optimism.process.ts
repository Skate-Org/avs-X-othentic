import { watchExecution, collectExecution } from "./periphery.service";

import { optimismClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { OPTIMISM_GATEWAY, OPTIMISM_GATEWAY_GENESIS } from "../../../common/const";

const OPTIMISM_CHECKPOINT = "progress/periphery.optimism.json";

async function main() {
  const optimismConfig: CollectorConfig = {
    context: "Optimism Collection Process",
    genesisBlock: OPTIMISM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: optimismClient, gatewayAddress: OPTIMISM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: optimismClient, gatewayAddress: OPTIMISM_GATEWAY }),
    getBlockNumber: async () => await optimismClient.getBlockNumber(),
    checkpointFile: OPTIMISM_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(optimismConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
