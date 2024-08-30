import { watchExecution, collectExecution } from "./periphery.service";
import { type CollectorConfig, startCollectionProcess } from "../utils";

import { zoraClient } from "../../../common/client";
import { ZORA_GATEWAY, ZORA_GATEWAY_GENESIS } from "../../../common/const";
import { zetaClient } from "../../../common/client";
import { ZETA_GATEWAY, ZETA_GATEWAY_GENESIS } from "../../../common/const";
import { blastClient } from "../../../common/client";
import { BLAST_GATEWAY, BLAST_GATEWAY_GENESIS } from "../../../common/const";
import { fantomClient } from "../../../common/client";
import { FANTOM_GATEWAY, FANTOM_GATEWAY_GENESIS } from "../../../common/const";
import { lineaClient } from "../../../common/client";
import { LINEA_GATEWAY, LINEA_GATEWAY_GENESIS } from "../../../common/const";
import { modeClient } from "../../../common/client";
import { MODE_GATEWAY, MODE_GATEWAY_GENESIS } from "../../../common/const";

const zora_CHECKPOINT = "progress/periphery.zora.json";
const zeta_CHECKPOINT = "progress/periphery.zeta.json";
const BLAST_CHECKPOINT = "progress/periphery.blast.json";
const fantom_CHECKPOINT = "progress/periphery.fantom.json";
const linea_CHECKPOINT = "progress/periphery.linea.json";
const mode_CHECKPOINT = "progress/periphery.mode.json";

// NOTE: number 7 - 12
async function main() {
  const zoraConfig: CollectorConfig = {
    context: "zora Collection Process",
    genesisBlock: ZORA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: zoraClient, gatewayAddress: ZORA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: zoraClient, gatewayAddress: ZORA_GATEWAY }),
    getBlockNumber: async () => await zoraClient.getBlockNumber(),
    checkpointFile: zora_CHECKPOINT,
  };
  const zetaConfig: CollectorConfig = {
    context: "zeta Collection Process",
    genesisBlock: ZETA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: zetaClient, gatewayAddress: ZETA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: zetaClient, gatewayAddress: ZETA_GATEWAY }),
    getBlockNumber: async () => await zetaClient.getBlockNumber(),
    checkpointFile: zeta_CHECKPOINT,
  };
  const blastConfig: CollectorConfig = {
    context: "Blast Collection Process",
    genesisBlock: BLAST_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: blastClient, gatewayAddress: BLAST_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: blastClient, gatewayAddress: BLAST_GATEWAY }),
    getBlockNumber: async () => await blastClient.getBlockNumber(),
    checkpointFile: BLAST_CHECKPOINT,
  };
  const fantomConfig: CollectorConfig = {
    context: "fantom Collection Process",
    genesisBlock: FANTOM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: fantomClient, gatewayAddress: FANTOM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: fantomClient, gatewayAddress: FANTOM_GATEWAY }),
    getBlockNumber: async () => await fantomClient.getBlockNumber(),
    checkpointFile: fantom_CHECKPOINT,
  };
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

  await Promise.all([
    startCollectionProcess(zoraConfig),
    startCollectionProcess(zetaConfig),
    startCollectionProcess(blastConfig),
    startCollectionProcess(fantomConfig),
    // startCollectionProcess(lineaConfig),
    startCollectionProcess(modeConfig),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
