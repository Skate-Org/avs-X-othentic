import cron from "node-cron";
import { updateBalanceMessage } from "../service/slack";

updateBalanceMessage();

// Alert balances every 2 minutes
const FREQUENCY_MINUTE = 2;
cron.schedule(`*/${FREQUENCY_MINUTE} * * * *`, updateBalanceMessage);
