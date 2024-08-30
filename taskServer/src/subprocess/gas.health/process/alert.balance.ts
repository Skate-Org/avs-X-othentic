import cron from "node-cron";
import { checkAndAlertUnhealthyBalances } from "../service/slack";

checkAndAlertUnhealthyBalances();

// Alert balances every 5 minutes
const FREQUENCY_MINUTE = 5;
cron.schedule(`*/${FREQUENCY_MINUTE} * * * *`, checkAndAlertUnhealthyBalances);
