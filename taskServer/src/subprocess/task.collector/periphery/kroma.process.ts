import { watchExecution, collectExecution } from "./periphery.service";

import { kromaClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { KROMA_GATEWAY, KROMA_GATEWAY_GENESIS } from "../../../common/const";

const kroma_CHECKPOINT = "progress/periphery.kroma.json";

async function main() {
  const kromaConfig: CollectorConfig = {
    context: "kroma Collection Process",
    genesisBlock: KROMA_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: kromaClient, gatewayAddress: KROMA_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: kromaClient, gatewayAddress: KROMA_GATEWAY }),
    getBlockNumber: async () => await kromaClient.getBlockNumber(),
    checkpointFile: kroma_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(kromaConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
