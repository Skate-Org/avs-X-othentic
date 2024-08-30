import { watchExecution, collectExecution } from "./periphery.service";

import { celoClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { CELO_GATEWAY, CELO_GATEWAY_GENESIS } from "../../../common/const";

const celo_CHECKPOINT = "progress/periphery.celo.json";

async function main() {
  const celoConfig: CollectorConfig = {
    context: "Celo Collection Process",
    genesisBlock: CELO_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: celoClient, gatewayAddress: CELO_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: celoClient, gatewayAddress: CELO_GATEWAY }),
    getBlockNumber: async () => await celoClient.getBlockNumber(),
    checkpointFile: celo_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(celoConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
