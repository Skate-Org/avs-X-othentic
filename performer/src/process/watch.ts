import { TaskSubmitted_EVENT_ABI } from "../ABI/IMessageBox";
import { decodeEventLogs } from "../lib/decode";
import { MESSAGE_BOX, skateClient } from "../lib/static";
import { newProducer } from "../lib/mpsc";

export default async function main() {
  const logProducer = newProducer();

  // NOTE: watch and process live
  skateClient.watchContractEvent({
    address: MESSAGE_BOX,
    abi: TaskSubmitted_EVENT_ABI,
    eventName: "TaskSubmitted",
    strict: true,
    async onLogs(logs) {
      const decodedLogs = decodeEventLogs(logs);
      logProducer.write(JSON.stringify(decodedLogs));
    },
  });
}

main();
