import { watchExecution, collectExecution } from "./periphery.service";

import { xLayerClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { XLAYER_GATEWAY, XLAYER_GATEWAY_GENESIS } from "../../../common/const";

const xLayer_CHECKPOINT = "progress/periphery.xLayer.json";

async function main() {
  const xLayerConfig: CollectorConfig = {
    context: "xLayer Collection Process",
    genesisBlock: XLAYER_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: xLayerClient, gatewayAddress: XLAYER_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: xLayerClient, gatewayAddress: XLAYER_GATEWAY }),
    getBlockNumber: async () => await xLayerClient.getBlockNumber(),
    checkpointFile: xLayer_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(xLayerConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
