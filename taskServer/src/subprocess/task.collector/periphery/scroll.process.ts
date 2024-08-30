import { watchExecution, collectExecution } from "./periphery.service";

import { scrollClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { SCROLL_GATEWAY, SCROLL_GATEWAY_GENESIS } from "../../../common/const";

const scroll_CHECKPOINT = "progress/periphery.scroll.json";

async function main() {
  const scrollConfig: CollectorConfig = {
    context: "scroll Collection Process",
    genesisBlock: SCROLL_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: scrollClient, gatewayAddress: SCROLL_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: scrollClient, gatewayAddress: SCROLL_GATEWAY }),
    getBlockNumber: async () => await scrollClient.getBlockNumber(),
    checkpointFile: scroll_CHECKPOINT,
    maxBlockRange: 500n,
  };

  await Promise.all([startCollectionProcess(scrollConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
