import { watchExecution, collectExecution } from "./periphery.service";

import { modeClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { MODE_GATEWAY, MODE_GATEWAY_GENESIS } from "../../../common/const";

const mode_CHECKPOINT = "progress/periphery.mode.json";

async function main() {
  const modeConfig: CollectorConfig = {
    context: "mode Collection Process",
    genesisBlock: MODE_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: modeClient, gatewayAddress: MODE_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: modeClient, gatewayAddress: MODE_GATEWAY }),
    getBlockNumber: async () => await modeClient.getBlockNumber(),
    checkpointFile: mode_CHECKPOINT,
    maxBlockRange: 500n,
  };

  await Promise.all([startCollectionProcess(modeConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
