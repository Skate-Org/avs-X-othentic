import { watchExecution, collectExecution } from "./periphery.service";

import { metisClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { METIS_GATEWAY, METIS_GATEWAY_GENESIS } from "../../../common/const";

const metis_CHECKPOINT = "progress/periphery.metis.json";

async function main() {
  const metisConfig: CollectorConfig = {
    context: "metis Collection Process",
    genesisBlock: METIS_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: metisClient, gatewayAddress: METIS_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: metisClient, gatewayAddress: METIS_GATEWAY }),
    getBlockNumber: async () => await metisClient.getBlockNumber(),
    checkpointFile: metis_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(metisConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
