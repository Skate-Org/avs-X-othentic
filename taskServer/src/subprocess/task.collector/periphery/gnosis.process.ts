import { watchExecution, collectExecution } from "./periphery.service";

import { gnosisClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { GNOSIS_GATEWAY, GNOSIS_GATEWAY_GENESIS } from "../../../common/const";

const gnosis_CHECKPOINT = "progress/periphery.gnosis.json";

async function main() {
  const gnosisConfig: CollectorConfig = {
    context: "gnosis Collection Process",
    genesisBlock: GNOSIS_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: gnosisClient, gatewayAddress: GNOSIS_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: gnosisClient, gatewayAddress: GNOSIS_GATEWAY }),
    getBlockNumber: async () => await gnosisClient.getBlockNumber(),
    checkpointFile: gnosis_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(gnosisConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
