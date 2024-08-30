import { watchExecution, collectExecution } from "./periphery.service";
import { type CollectorConfig, startCollectionProcess } from "../utils";

import { mantleClient, taikoClient } from "../../../common/client";
import { MANTLE_GATEWAY, MANTLE_GATEWAY_GENESIS, TAIKO_GATEWAY, TAIKO_GATEWAY_GENESIS } from "../../../common/const";
import { xLayerClient } from "../../../common/client";
import { XLAYER_GATEWAY, XLAYER_GATEWAY_GENESIS } from "../../../common/const";
import { morphClient } from "../../../common/client";
import { MORPH_GATEWAY, MORPH_GATEWAY_GENESIS } from "../../../common/const";
import { metisClient } from "../../../common/client";
import { METIS_GATEWAY, METIS_GATEWAY_GENESIS } from "../../../common/const";
import { gnosisClient } from "../../../common/client";
import { GNOSIS_GATEWAY, GNOSIS_GATEWAY_GENESIS } from "../../../common/const";

const taiko_CHECKPOINT = "progress/periphery.taiko.json";
const xLayer_CHECKPOINT = "progress/periphery.xLayer.json";
const morph_CHECKPOINT = "progress/periphery.morph.json";
const metis_CHECKPOINT = "progress/periphery.metis.json";
const gnosis_CHECKPOINT = "progress/periphery.gnosis.json";
const mantle_CHECKPOINT = "progress/periphery.mantle.json";

// NOTE: number 19 - 23
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
  const xLayerConfig: CollectorConfig = {
    context: "xLayer Collection Process",
    genesisBlock: XLAYER_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: xLayerClient, gatewayAddress: XLAYER_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: xLayerClient, gatewayAddress: XLAYER_GATEWAY }),
    getBlockNumber: async () => await xLayerClient.getBlockNumber(),
    checkpointFile: xLayer_CHECKPOINT,
  };
  const morphConfig: CollectorConfig = {
    context: "morph Collection Process",
    genesisBlock: MORPH_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: morphClient, gatewayAddress: MORPH_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: morphClient, gatewayAddress: MORPH_GATEWAY }),
    getBlockNumber: async () => await morphClient.getBlockNumber(),
    checkpointFile: morph_CHECKPOINT,
  };
  const metisConfig: CollectorConfig = {
    context: "metis Collection Process",
    genesisBlock: METIS_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: metisClient, gatewayAddress: METIS_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: metisClient, gatewayAddress: METIS_GATEWAY }),
    getBlockNumber: async () => await metisClient.getBlockNumber(),
    checkpointFile: metis_CHECKPOINT,
  };
  const gnosisConfig: CollectorConfig = {
    context: "gnosis Collection Process",
    genesisBlock: GNOSIS_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: gnosisClient, gatewayAddress: GNOSIS_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: gnosisClient, gatewayAddress: GNOSIS_GATEWAY }),
    getBlockNumber: async () => await gnosisClient.getBlockNumber(),
    checkpointFile: gnosis_CHECKPOINT,
  };
  const mantleConfig: CollectorConfig = {
    context: "mantle Collection Process",
    genesisBlock: MANTLE_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: mantleClient, gatewayAddress: MANTLE_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: mantleClient, gatewayAddress: MANTLE_GATEWAY }),
    getBlockNumber: async () => await mantleClient.getBlockNumber(),
    checkpointFile: mantle_CHECKPOINT,
  };

  await Promise.all([
    startCollectionProcess(taikoConfig),
    startCollectionProcess(xLayerConfig),
    startCollectionProcess(morphConfig),
    startCollectionProcess(metisConfig),
    startCollectionProcess(gnosisConfig),
    startCollectionProcess(mantleConfig),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
