import { watchExecution, collectExecution } from "./periphery.service";

import { taikoClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { TAIKO_GATEWAY, TAIKO_GATEWAY_GENESIS } from "../../../common/const";

const taiko_CHECKPOINT = "progress/periphery.taiko.json";

async function main() {
  const taikoConfig: CollectorConfig = {
    context: "taiko Collection Process",
    genesisBlock: TAIKO_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: taikoClient, gatewayAddress: TAIKO_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: taikoClient, gatewayAddress: TAIKO_GATEWAY }),
    getBlockNumber: async () => await taikoClient.getBlockNumber(),
    checkpointFile: taiko_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(taikoConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
