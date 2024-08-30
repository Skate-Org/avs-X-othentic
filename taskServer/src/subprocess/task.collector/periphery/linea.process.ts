import { watchExecution, collectExecution } from "./periphery.service";

import { lineaClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { LINEA_GATEWAY, LINEA_GATEWAY_GENESIS } from "../../../common/const";

const linea_CHECKPOINT = "progress/periphery.linea.json";

async function main() {
  const lineaConfig: CollectorConfig = {
    context: "linea Collection Process",
    genesisBlock: LINEA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: lineaClient, gatewayAddress: LINEA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: lineaClient, gatewayAddress: LINEA_GATEWAY }),
    getBlockNumber: async () => await lineaClient.getBlockNumber(),
    checkpointFile: linea_CHECKPOINT,
    maxBlockRange: 500n,
  };

  await Promise.all([startCollectionProcess(lineaConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
