import { parseAbi, parseAbiParameters } from "viem";

export const TaskSubmitted_EVENT_ABI = parseAbi([
  "event TaskSubmitted(uint256 taskId, Task task)",
  `struct Task { address appAddress; bytes taskCalldata; address user; uint256 chainId; }`,
] as const);

export const AvsTask_ABIParameter = parseAbiParameters([
  "AvsIntent[] verifiedIntents",
  "struct AvsIntent { uint256 taskId; address appAddress; bytes taskCalldata; address user; uint256 chainId; address messageBox; bytes32 transactionHash; }",
] as const);
