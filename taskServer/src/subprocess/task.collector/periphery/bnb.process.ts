import { watchExecution, collectExecution } from "./periphery.service";

import { bnbClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { BNB_GATEWAY, BNB_GATEWAY_GENESIS } from "../../../common/const";

const BNB_CHECKPOINT = "progress/periphery.bnb.json";

async function main() {
  const bnbConfig: CollectorConfig = {
    context: "BnB Collection Process",
    genesisBlock: BNB_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: bnbClient, gatewayAddress: BNB_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: bnbClient, gatewayAddress: BNB_GATEWAY }),
    getBlockNumber: async () => await bnbClient.getBlockNumber(),
    checkpointFile: BNB_CHECKPOINT,
    archivedRpc: false,
  };

  await Promise.all([startCollectionProcess(bnbConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
