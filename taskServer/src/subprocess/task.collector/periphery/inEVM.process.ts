import { watchExecution, collectExecution } from "./periphery.service";

import { inEVMClient } from "../../../common/client";
import { type CollectorConfig, startCollectionProcess } from "../utils";
import { INEVM_GATEWAY, INEVM_GATEWAY_GENESIS } from "../../../common/const";

const inEVM_CHECKPOINT = "progress/periphery.inEVM.json";

async function main() {
  const inEVMConfig: CollectorConfig = {
    context: "inEVM Collection Process",
    genesisBlock: INEVM_GATEWAY_GENESIS,
    collectFunction: (fromBlock, toBlock) =>
      collectExecution({ client: inEVMClient, gatewayAddress: INEVM_GATEWAY }, { fromBlock, toBlock }),
    watchFunction: () => watchExecution({ client: inEVMClient, gatewayAddress: INEVM_GATEWAY }),
    getBlockNumber: async () => await inEVMClient.getBlockNumber(),
    checkpointFile: inEVM_CHECKPOINT,
  };

  await Promise.all([startCollectionProcess(inEVMConfig)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
