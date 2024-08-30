import { watchAttestation, collectAttestation } from "./avs.service";

import { avsClient } from "../../common/client";
import { type CollectorConfig, startCollectionProcess } from "./utils";
import { ATTESTATION_CENTER_GENESIS_BLOCK } from "../../common/const";
import { logger } from "../../common/logger";

const INTENT_CHECKPOINT = "progress/avs.json";

async function main() {
  const context = "AVS Collection Process";
  const avsConfig: CollectorConfig = {
    context,
    genesisBlock: ATTESTATION_CENTER_GENESIS_BLOCK,
    collectFunction: collectAttestation,
    watchFunction: () =>
      watchAttestation({
        approveCallback: (logs, _, saved) => {
          if (logs.length > 0) {
            logger.info(`${context}::Collected ${logs.length} APPROVED event(s) from AVS. Saved to DB? ${saved}`);
          }
        },
        rejectCallback: (logs, _, saved) => {
          if (logs.length > 0) {
            logger.info(`${context}::Collected ${logs.length} REJECTED event(s) from AVS. Saved to DB? ${saved}`);
          }
        },
      }),
    getBlockNumber: avsClient.getBlockNumber,
    checkpointFile: INTENT_CHECKPOINT,
    maxBlockRange: 5_000n,
  };

  await startCollectionProcess(avsConfig);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
