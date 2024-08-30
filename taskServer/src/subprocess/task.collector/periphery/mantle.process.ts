import { watchExecution, collectExecution } from "./periphery.service";

import { mantleClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { MANTLE_GATEWAY, MANTLE_GATEWAY_GENESIS } from "../../../common/const";

const mantle_CHECKPOINT = "progress/periphery.mantle.json";

async function main() {
  const mantleConfig: CollectorConfig = {
    context: "mantle Collection Process",
    genesisBlock: MANTLE_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: mantleClient, gatewayAddress: MANTLE_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: mantleClient, gatewayAddress: MANTLE_GATEWAY }),
    getBlockNumber: async () => await mantleClient.getBlockNumber(),
    checkpointFile: mantle_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(mantleConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
