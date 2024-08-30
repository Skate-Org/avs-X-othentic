import { watchExecution, collectExecution } from "./periphery.service";

import { ethereumClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { ETHEREUM_GATEWAY, ETHEREUM_GATEWAY_GENESIS } from "../../../common/const";

const ethereum_CHECKPOINT = "progress/periphery.ethereum.json";

async function main() {
  const ethereumConfig: CollectorConfig = {
    context: "ethereum Collection Process",
    genesisBlock: ETHEREUM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: ethereumClient, gatewayAddress: ETHEREUM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: ethereumClient, gatewayAddress: ETHEREUM_GATEWAY }),
    getBlockNumber: async () => await ethereumClient.getBlockNumber(),
    checkpointFile: ethereum_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(ethereumConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
