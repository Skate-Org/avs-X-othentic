import { watchExecution, collectExecution } from "./periphery.service";

import { xaiClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { XAI_GATEWAY, XAI_GATEWAY_GENESIS } from "../../../common/const";

const xai_CHECKPOINT = "progress/periphery.xai.json";

async function main() {
  const xaiConfig: CollectorConfig = {
    context: "xai Collection Process",
    genesisBlock: XAI_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: xaiClient, gatewayAddress: XAI_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: xaiClient, gatewayAddress: XAI_GATEWAY }),
    getBlockNumber: async () => await xaiClient.getBlockNumber(),
    checkpointFile: xai_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(xaiConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
