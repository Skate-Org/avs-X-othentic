import { watchExecution, collectExecution } from "./periphery.service";
import { type CollectorConfig, startCollectionProcess } from "../utils";

import { baseClient } from "../../../common/client";
import { BASE_GATEWAY, BASE_GATEWAY_GENESIS } from "../../../common/const";
import { optimismClient } from "../../../common/client";
import { OPTIMISM_GATEWAY, OPTIMISM_GATEWAY_GENESIS } from "../../../common/const";
import { arbitrumClient } from "../../../common/client";
import { ARBITRUM_GATEWAY, ARBITRUM_GATEWAY_GENESIS } from "../../../common/const";
import { bnbClient } from "../../../common/client";
import { BNB_GATEWAY, BNB_GATEWAY_GENESIS } from "../../../common/const";
import { polygonClient } from "../../../common/client";
import { POLYGON_GATEWAY, POLYGON_GATEWAY_GENESIS } from "../../../common/const";
import { ethereumClient } from "../../../common/client";
import { ETHEREUM_GATEWAY, ETHEREUM_GATEWAY_GENESIS } from "../../../common/const";

// NOTE: number 1 - 6
const BASE_CHECKPOINT = "progress/periphery.base.json";
const OPTIMISM_CHECKPOINT = "progress/periphery.optimism.json";
const ARBITRUM_CHECKPOINT = "progress/periphery.arbitrum.json";
const BNB_CHECKPOINT = "progress/periphery.bnb.json";
const POLYGON_CHECKPOINT = "progress/periphery.polygon.json";
const ethereum_CHECKPOINT = "progress/periphery.ethereum.json";

async function main() {
  const baseConfig: CollectorConfig = {
    context: "Base Collection Process",
    genesisBlock: BASE_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: baseClient, gatewayAddress: BASE_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: baseClient, gatewayAddress: BASE_GATEWAY }),
    getBlockNumber: async () => await baseClient.getBlockNumber(),
    checkpointFile: BASE_CHECKPOINT,
  };
  const optimismConfig: CollectorConfig = {
    context: "Optimism Collection Process",
    genesisBlock: OPTIMISM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: optimismClient, gatewayAddress: OPTIMISM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: optimismClient, gatewayAddress: OPTIMISM_GATEWAY }),
    getBlockNumber: async () => await optimismClient.getBlockNumber(),
    checkpointFile: OPTIMISM_CHECKPOINT,
  };
  const arbitrumConfig: CollectorConfig = {
    context: "Arbitrum Collection Process",
    genesisBlock: ARBITRUM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: arbitrumClient, gatewayAddress: ARBITRUM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: arbitrumClient, gatewayAddress: ARBITRUM_GATEWAY }),
    getBlockNumber: async () => await arbitrumClient.getBlockNumber(),
    checkpointFile: ARBITRUM_CHECKPOINT,
  };
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
  const polygonConfig: CollectorConfig = {
    context: "Polygon Collection Process",
    genesisBlock: POLYGON_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: polygonClient, gatewayAddress: POLYGON_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: polygonClient, gatewayAddress: POLYGON_GATEWAY }),
    getBlockNumber: polygonClient.getBlockNumber,
    checkpointFile: POLYGON_CHECKPOINT,
  };
  const ethereumConfig: CollectorConfig = {
    context: "ethereum Collection Process",
    genesisBlock: ETHEREUM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: ethereumClient, gatewayAddress: ETHEREUM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: ethereumClient, gatewayAddress: ETHEREUM_GATEWAY }),
    getBlockNumber: async () => await ethereumClient.getBlockNumber(),
    checkpointFile: ethereum_CHECKPOINT,
  };

  await Promise.all([
    startCollectionProcess(baseConfig),
    startCollectionProcess(optimismConfig),
    startCollectionProcess(arbitrumConfig),
    startCollectionProcess(bnbConfig),
    startCollectionProcess(polygonConfig),
    startCollectionProcess(ethereumConfig),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
