import { watchExecution, collectExecution } from "./periphery.service";

import { blastClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { BLAST_GATEWAY, BLAST_GATEWAY_GENESIS } from "../../../common/const";

const BLAST_CHECKPOINT = "progress/periphery.blast.json";

async function main() {
  const blastConfig: CollectorConfig = {
    context: "Blast Collection Process",
    genesisBlock: BLAST_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: blastClient, gatewayAddress: BLAST_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: blastClient, gatewayAddress: BLAST_GATEWAY }),
    getBlockNumber: async () => await blastClient.getBlockNumber(),
    checkpointFile: BLAST_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(blastConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
