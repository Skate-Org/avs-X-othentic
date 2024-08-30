import { watchExecution, collectExecution } from "./periphery.service";

import { zetaClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { ZETA_GATEWAY, ZETA_GATEWAY_GENESIS } from "../../../common/const";

const zeta_CHECKPOINT = "progress/periphery.zeta.json";

async function main() {
  const zetaConfig: CollectorConfig = {
    context: "zeta Collection Process",
    genesisBlock: ZETA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: zetaClient, gatewayAddress: ZETA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: zetaClient, gatewayAddress: ZETA_GATEWAY }),
    getBlockNumber: async () => await zetaClient.getBlockNumber(),
    checkpointFile: zeta_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(zetaConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
