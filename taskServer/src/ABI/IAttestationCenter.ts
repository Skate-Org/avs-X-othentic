import { parseAbi } from "viem";

export const Attestation_EVENT_ABI = parseAbi([
  "event TaskSubmited(address operator, uint32 taskNumber, string proofOfTask, bytes data, uint16 taskDefinitionId)",
  "event TaskRejected(address operator, uint32 taskNumber, string proofOfTask, bytes data, uint16 taskDefinitionId)",
] as const);
