import { watchExecution, collectExecution } from "./periphery.service";

import { mantaClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { MANTA_GATEWAY, MANTA_GATEWAY_GENESIS } from "../../../common/const";

const manta_CHECKPOINT = "progress/periphery.manta.json";

async function main() {
  const mantaConfig: CollectorConfig = {
    context: "manta Collection Process",
    genesisBlock: MANTA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: mantaClient, gatewayAddress: MANTA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: mantaClient, gatewayAddress: MANTA_GATEWAY }),
    getBlockNumber: async () => await mantaClient.getBlockNumber(),
    checkpointFile: manta_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(mantaConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
