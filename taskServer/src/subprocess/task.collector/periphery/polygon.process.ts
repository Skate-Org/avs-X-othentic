import { watchExecution, collectExecution } from "./periphery.service";

import { polygonClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { POLYGON_GATEWAY, POLYGON_GATEWAY_GENESIS } from "../../../common/const";

const POLYGON_CHECKPOINT = "progress/periphery.polygon.json";

async function main() {
  const polygonConfig: CollectorConfig = {
    context: "Polygon Collection Process",
    genesisBlock: POLYGON_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: polygonClient, gatewayAddress: POLYGON_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: polygonClient, gatewayAddress: POLYGON_GATEWAY }),
    getBlockNumber: polygonClient.getBlockNumber,
    checkpointFile: POLYGON_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(polygonConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
