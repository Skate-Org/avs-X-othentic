import { watchExecution, collectExecution } from "./periphery.service";

import { fantomClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { FANTOM_GATEWAY, FANTOM_GATEWAY_GENESIS } from "../../../common/const";

const fantom_CHECKPOINT = "progress/periphery.fantom.json";

async function main() {
  const fantomConfig: CollectorConfig = {
    context: "fantom Collection Process",
    genesisBlock: FANTOM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: fantomClient, gatewayAddress: FANTOM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: fantomClient, gatewayAddress: FANTOM_GATEWAY }),
    getBlockNumber: async () => await fantomClient.getBlockNumber(),
    checkpointFile: fantom_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(fantomConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
