import { watchExecution, collectExecution } from "./periphery.service";
import { type CollectorConfig, startCollectionProcess } from "../utils";

import { scrollClient } from "../../../common/client";
import { SCROLL_GATEWAY, SCROLL_GATEWAY_GENESIS } from "../../../common/const";
import { celoClient } from "../../../common/client";
import { CELO_GATEWAY, CELO_GATEWAY_GENESIS } from "../../../common/const";
import { mantaClient } from "../../../common/client";
import { MANTA_GATEWAY, MANTA_GATEWAY_GENESIS } from "../../../common/const";
import { kromaClient } from "../../../common/client";
import { KROMA_GATEWAY, KROMA_GATEWAY_GENESIS } from "../../../common/const";
import { xaiClient } from "../../../common/client";
import { XAI_GATEWAY, XAI_GATEWAY_GENESIS } from "../../../common/const";
import { inEVMClient } from "../../../common/client";
import { INEVM_GATEWAY, INEVM_GATEWAY_GENESIS } from "../../../common/const";

const scroll_CHECKPOINT = "progress/periphery.scroll.json";
const manta_CHECKPOINT = "progress/periphery.manta.json";
const kroma_CHECKPOINT = "progress/periphery.kroma.json";
const xai_CHECKPOINT = "progress/periphery.xai.json";
const inEVM_CHECKPOINT = "progress/periphery.inEVM.json";
const celo_CHECKPOINT = "progress/periphery.celo.json";

// NOTE: number 13 - 18
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
  const mantaConfig: CollectorConfig = {
    context: "manta Collection Process",
    genesisBlock: MANTA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: mantaClient, gatewayAddress: MANTA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: mantaClient, gatewayAddress: MANTA_GATEWAY }),
    getBlockNumber: async () => await mantaClient.getBlockNumber(),
    checkpointFile: manta_CHECKPOINT,
  };
  const kromaConfig: CollectorConfig = {
    context: "kroma Collection Process",
    genesisBlock: KROMA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: kromaClient, gatewayAddress: KROMA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: kromaClient, gatewayAddress: KROMA_GATEWAY }),
    getBlockNumber: async () => await kromaClient.getBlockNumber(),
    checkpointFile: kroma_CHECKPOINT,
  };
  const xaiConfig: CollectorConfig = {
    context: "xai Collection Process",
    genesisBlock: XAI_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: xaiClient, gatewayAddress: XAI_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: xaiClient, gatewayAddress: XAI_GATEWAY }),
    getBlockNumber: async () => await xaiClient.getBlockNumber(),
    checkpointFile: xai_CHECKPOINT,
  };
  const inEVMConfig: CollectorConfig = {
    context: "inEVM Collection Process",
    genesisBlock: INEVM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: inEVMClient, gatewayAddress: INEVM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: inEVMClient, gatewayAddress: INEVM_GATEWAY }),
    getBlockNumber: async () => await inEVMClient.getBlockNumber(),
    checkpointFile: inEVM_CHECKPOINT,
  };
  const celoConfig: CollectorConfig = {
    context: "Celo Collection Process",
    genesisBlock: CELO_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: celoClient, gatewayAddress: CELO_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: celoClient, gatewayAddress: CELO_GATEWAY }),
    getBlockNumber: async () => await celoClient.getBlockNumber(),
    checkpointFile: celo_CHECKPOINT,
  };

  await Promise.all([
    startCollectionProcess(scrollConfig),
    startCollectionProcess(mantaConfig),
    startCollectionProcess(kromaConfig),
    startCollectionProcess(xaiConfig),
    // startCollectionProcess(inEVMConfig),
    startCollectionProcess(celoConfig),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
