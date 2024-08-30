import { watchIntent, collectIntent } from "./kernel.service";

import { skateClient } from "../../common/client";
import { type CollectorConfig, startCollectionProcess } from "./utils";
import { MESSAGE_BOX_GENESIS_BLOCK } from "../../common/const";
import { logger } from "../../common/logger";

const INTENT_CHECKPOINT = "progress/kernel.json";

async function main() {
  const context = "Skate Kernel Collection Process";
  const intentConfig: CollectorConfig = {
    context,
    genesisBlock: MESSAGE_BOX_GENESIS_BLOCK,
    collectFunction: collectIntent,
    watchFunction: () =>
      watchIntent({
        callback: (logs, _, saved) => {
          if (logs.length > 0) {
            logger.info(
              `${context}::Collected ${logs.length} TaskSubmitted event(s) from MessageBox. Saved to DB? ${saved}`,
            );
          }
        },
      }),
    getBlockNumber: skateClient.getBlockNumber,
    checkpointFile: INTENT_CHECKPOINT,
    maxBlockRange: 10000n,
  };

  await startCollectionProcess(intentConfig);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
