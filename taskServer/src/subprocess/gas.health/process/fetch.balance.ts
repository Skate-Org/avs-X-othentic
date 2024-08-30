import cron from "node-cron";
import { fetchBalances } from "../service/balance";

fetchBalances();

// Fetch balances every 2 minutes
const FREQUENCY_MINUTE = 2;
cron.schedule(`*/${FREQUENCY_MINUTE} * * * *`, fetchBalances);
