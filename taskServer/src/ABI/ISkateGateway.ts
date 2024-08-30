import { parseAbi } from "viem";

export const TaskExecuted_EVENT_ABI = parseAbi([
  "event TaskExecuted(uint256 taskId, Task task)",
  `struct Task { address appAddress; bytes taskCalldata; address user; uint256 chainId; }`,
] as const);
