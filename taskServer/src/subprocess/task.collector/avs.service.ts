import { checksumAddress, decodeAbiParameters, Log } from "viem";
import { AvsIntent_ABIParameter } from "../../ABI/IMessageBox";
import { Attestation_EVENT_ABI } from "../../ABI/IAttestationCenter";
import { ATTESTATION_CENTER } from "../../common/const";
import { avsClient } from "../../common/client";
import { prismaClient } from "../../common/db";
import { exponentialRetry } from "../../common/lib";
import { logger } from "../../common/logger";

type ApproveLog = Log<bigint, number, false, (typeof Attestation_EVENT_ABI)[0], undefined>;
async function processAttestationApprovedLogs(logs: ApproveLog[]) {
  const tasks = [];
  const dbUpdates: ReturnType<typeof prismaClient.task.update>[] = [];

  for (const log of logs) {
    const { operator: performer, taskNumber, proofOfTask, data } = log.args;
    if (performer == undefined || data == undefined || taskNumber == undefined || proofOfTask == undefined) {
      logger.error("Invalid log: %O", log);
      continue;
    }

    const { from: aggRaw } = await avsClient.getTransaction({ hash: log.transactionHash });
    // NOTE: uses EIP-55 for backwards compatibility, avs chain is known by all entity.
    const aggregator = checksumAddress(aggRaw);

    try {
      const decodedTasks = decodeAbiParameters(AvsIntent_ABIParameter, data)[0];

      decodedTasks.forEach((t) => {
        const dbUpdate = prismaClient.task.update({
          where: {
            taskId_messageBox: {
              taskId: Number(t.taskId),
              messageBox: t.messageBox,
            },
            status: "DETECTED",
          },
          data: {
            status: "APPROVED",
            performer,
            aggregator,
            avsTxHash: log.transactionHash,
            avsTaskNumber: taskNumber,
            proofOfTask,
          },
        });
        dbUpdates.push(dbUpdate);
      });

      tasks.push(...decodedTasks);
    } catch {
      logger.error("Can't decode data, maybe malformed or deprecated");
    }
  }

  const { success } = await exponentialRetry({
    fn: async () => {
      return prismaClient.$transaction(dbUpdates);
    },
  });
  return { data: tasks, saved: success };
}

type RejectLog = Log<bigint, number, false, (typeof Attestation_EVENT_ABI)[1], undefined>;
// NOTE: this function is almost identical to `processAttestationApprovedLogs` since the 2 event signature are identical.
// Though it is implemented as 2 methods to ensure modularity for future updates (if any)
async function processAttestationRejectedLogs(logs: RejectLog[]) {
  const tasks = [];
  const dbUpdates: ReturnType<typeof prismaClient.task.update>[] = [];

  for (const log of logs) {
    const { operator: performer, taskNumber, proofOfTask, data } = log.args;
    if (performer == undefined || data == undefined || taskNumber == undefined || proofOfTask == undefined) {
      logger.error("Invalid log: %O", log);
      continue;
    }

    const { from: rawAggregator } = await avsClient.getTransaction({ hash: log.transactionHash });
    const aggregator = checksumAddress(rawAggregator, await avsClient.getChainId());

    try {
      const decodedTasks = decodeAbiParameters(AvsIntent_ABIParameter, data)[0];

      decodedTasks.forEach((t) => {
        const dbUpdate = prismaClient.task.update({
          where: {
            taskId_messageBox: {
              taskId: Number(t.taskId),
              messageBox: t.messageBox,
            },
            status: "DETECTED",
          },
          data: {
            status: "REJECTED",
            performer,
            aggregator,
            avsTxHash: log.transactionHash,
            avsTaskNumber: taskNumber,
            proofOfTask,
          },
        });
        dbUpdates.push(dbUpdate);
      });

      tasks.push(...decodedTasks);
    } catch {
      logger.info("Can't decode data, maybe malformed or deprecated");
    }
  }

  const { success } = await exponentialRetry({
    fn: async () => {
      return prismaClient.$transaction(dbUpdates);
    },
  });
  return { data: tasks, saved: success };
}

export async function collectAttestation(fromBlock: bigint, toBlock: bigint | undefined) {
  const approvedLogs = await avsClient.getContractEvents({
    address: ATTESTATION_CENTER,
    abi: Attestation_EVENT_ABI,
    eventName: "TaskSubmited",
    fromBlock,
    toBlock,
  });
  const rejectedLogs = await avsClient.getContractEvents({
    address: ATTESTATION_CENTER,
    abi: Attestation_EVENT_ABI,
    eventName: "TaskRejected",
    fromBlock,
    toBlock,
  });

  const { data: approvedData, saved: saveAppproves } = await processAttestationApprovedLogs(approvedLogs);
  const { data: rejectedData, saved: saveRejects } = await processAttestationRejectedLogs(rejectedLogs);

  return {
    data: [...approvedData, ...rejectedData],
    saved: saveAppproves && saveRejects,
  };
}

export async function watchAttestation(callbackObj?: {
  approveCallback?: (logs: ApproveLog[], data?: any, saved?: boolean) => any;
  rejectCallback?: (logs: RejectLog[], data?: any, saved?: boolean) => any;
}) {
  const unwatchApprovedLogs = avsClient.watchContractEvent({
    address: ATTESTATION_CENTER,
    abi: Attestation_EVENT_ABI,
    eventName: "TaskSubmited",
    onLogs: async (logs) => {
      const { data, saved } = await processAttestationApprovedLogs(logs);
      if (!!callbackObj && !!callbackObj.approveCallback) {
        await callbackObj.approveCallback(logs, data, saved);
      }
    },
  });
  const unwatchRejectedLogs = avsClient.watchContractEvent({
    address: ATTESTATION_CENTER,
    abi: Attestation_EVENT_ABI,
    eventName: "TaskRejected",
    onLogs: async (logs) => {
      const { data, saved } = await processAttestationRejectedLogs(logs);
      if (!!callbackObj && !!callbackObj.rejectCallback) {
        await callbackObj.rejectCallback(logs, data, saved);
      }
    },
  });
  return () => {
    unwatchApprovedLogs();
    unwatchRejectedLogs();
  };
}
