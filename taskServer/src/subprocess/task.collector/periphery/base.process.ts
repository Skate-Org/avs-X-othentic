import { watchExecution, collectExecution } from "./periphery.service";

import { baseClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { BASE_GATEWAY, BASE_GATEWAY_GENESIS } from "../../../common/const";

const BASE_CHECKPOINT = "progress/periphery.base.json";

async function main() {
  const baseConfig: CollectorConfig = {
    context: "Base Collection Process",
    genesisBlock: BASE_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: baseClient, gatewayAddress: BASE_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: baseClient, gatewayAddress: BASE_GATEWAY }),
    getBlockNumber: async () => await baseClient.getBlockNumber(),
    checkpointFile: BASE_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(baseConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
