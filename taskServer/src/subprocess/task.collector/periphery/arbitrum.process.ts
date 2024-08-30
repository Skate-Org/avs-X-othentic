import { watchExecution, collectExecution } from "./periphery.service";

import { arbitrumClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { ARBITRUM_GATEWAY, ARBITRUM_GATEWAY_GENESIS } from "../../../common/const";

const ARBITRUM_CHECKPOINT = "progress/periphery.arbitrum.json";

async function main() {
  const arbitrumConfig: CollectorConfig = {
    context: "Arbitrum Collection Process",
    genesisBlock: ARBITRUM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: arbitrumClient, gatewayAddress: ARBITRUM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: arbitrumClient, gatewayAddress: ARBITRUM_GATEWAY }),
    getBlockNumber: async () => await arbitrumClient.getBlockNumber(),
    checkpointFile: ARBITRUM_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(arbitrumConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
