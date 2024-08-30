import { encodeAbiParameters, Log } from "viem";
import { TaskSubmitted_EVENT_ABI, AvsTask_ABIParameter } from "../ABI/IMessageBox";
import { MESSAGE_BOX } from "../lib/static";

// Task object structure
class Task {
  proofOfTask: string;
  data: `0x${string}`;
  taskDefinitionId: number;
  lives: number;
  constructor(proofOfTask: string, data: `0x${string}`, taskDefinitionId: number) {
    this.proofOfTask = proofOfTask;
    this.data = data;
    this.taskDefinitionId = taskDefinitionId;
    this.lives = 0; // NOTE: allow for retime execution if failed (maybe executor/relayer process down)
  }
}
type TaskSubmitted_Log = Log<bigint, number, false, (typeof TaskSubmitted_EVENT_ABI)[0], true>;
type DecodedLog = ReturnType<typeof decodeLog>;
export { TaskSubmitted_Log, DecodedLog, Task };

function decodeLog(log: TaskSubmitted_Log) {
  const { taskId, task } = log.args;
  return {
    taskId: taskId.toString(),
    appAddress: task.appAddress,
    taskCalldata: task.taskCalldata,
    user: task.user,
    chainId: task.chainId.toString(),
    messageBox: MESSAGE_BOX,
    transactionHash: log.transactionHash,
  };
}

export function decodeEventLogs(taskSubmittedLogs: TaskSubmitted_Log[]): DecodedLog[] {
  const decodedLogs = taskSubmittedLogs.map(decodeLog);
  return decodedLogs;
}

export function logsToAVSTask(decodedLogs: DecodedLog[]) {
  const abiLogs = decodedLogs.map((l) => ({
    ...l,
    taskId: BigInt(l.taskId),
    chainId: BigInt(l.chainId),
  }));

  const encodedData = encodeAbiParameters(AvsTask_ABIParameter, [abiLogs]);

  // TODO: Upload most of the data to DA instead of L2 chains.
  const proofOfTask = "<In future versions: CID of a DA blob>";

  const TASK_DEFINITION_ID = 0;
  const avsTask = new Task(proofOfTask, encodedData, TASK_DEFINITION_ID);

  return avsTask;
}
