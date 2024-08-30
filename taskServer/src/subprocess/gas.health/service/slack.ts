import { WebClient } from "@slack/web-api";
import { BalanceMap, getBalances } from "./balance";
import path from "path";
import fs from "fs";
import { CACHE_DIR } from "./common";
import { logger } from "../../../common/logger";

const slackAccessToken = process.env.SLACK_ACCESS_TOKEN;
let slackClient = new WebClient(slackAccessToken);
if (!slackAccessToken) {
  throw new Error("No Slack token configured!");
}

const slackAlertChannel = process.env.SLACK_ALERT_CHANNEL!;
if (!slackAlertChannel) {
  throw new Error("Slack Alert Channel not specified!");
}
export async function checkAndAlertUnhealthyBalances() {
  const balanceMap = getBalances();
  const { message: alertMessage, requireAlert } = generateAlertMessage(balanceMap);
  if (requireAlert) {
    await slackClient.chat.postMessage({
      channel: slackAlertChannel,
      text: alertMessage,
    });
    logger.warn(`Unhealthy status alerted on Slack. AT ${new Date().toUTCString()}`)
  }
}
function generateAlertMessage(balanceMap: BalanceMap) {
  let message = `<!everyone> 🚨🚨🚨 ALERT 🚨🚨🚨\n\n`;
  let requireAlert = false;
  for (const chainId in balanceMap) {
    if (!balanceMap[chainId].healthy) {
      message += `${balanceMap[chainId].name} (id=${chainId}) | `;
      message += `${balanceMap[chainId].normalized_balance} (${balanceMap[chainId].native_token}) | `;
      message += `<${balanceMap[chainId].explorer}|Explorer Link>\n`;
      requireAlert = true;
    }
  }

  return { message, requireAlert };
}

export const TS_FILE_PATH = path.resolve(CACHE_DIR, "slack_message_ts.txt");
// Function to read the message timestamp from a file
function readMessageTs(): string | undefined {
  try {
    return fs.readFileSync(TS_FILE_PATH, 'utf8');
  } catch (error) {
    console.log("No message cached!");
    return undefined;
  }
}
let messageTs = readMessageTs();

const slackInformationChannel = process.env.SLACK_INFORMATION_CHANNEL!;
if (!slackAlertChannel) {
  throw new Error("Slack executor balance information Channel not specified!");
}
export async function updateBalanceMessage() {
  const balanceMessage = generateBalanceMessage();

  if (!messageTs) {
    // Post the initial message
    const result = await slackClient.chat.postMessage({
      channel: slackInformationChannel,
      text: balanceMessage,
    });
    if (result.ts) {
      messageTs = result.ts; // Store the timestamp of the initial message
      fs.writeFileSync(TS_FILE_PATH, messageTs);
      logger.info(`Balance posted on Slack. AT ${new Date().toUTCString()}`)
    } else {
      logger.error(`Failed to retrieve message timestamp (ts) from Slack API response. AT ${new Date().toUTCString()}`)
    }
  } else {
    // Update the existing message
    await slackClient.chat.update({
      channel: slackInformationChannel,
      ts: messageTs, // Reference the original message by its timestamp
      text: balanceMessage,
      as_user: true,
    });
    logger.info(`Balance updated on Slack. AT ${new Date().toUTCString()}`)
  }
}

// Function to generate the balance message
function generateBalanceMessage(): string {
  let message = `🔄 Executor Balances (update every 2 minutes):\n------------------------------------------\n\n`;

  const balanceMap = getBalances();
  for (const chainId in balanceMap) {
    message += `${balanceMap[chainId].name} (id=${chainId}) | `;
    message += `${balanceMap[chainId].normalized_balance} (${balanceMap[chainId].native_token}) | `;
    message += `<${balanceMap[chainId].explorer}|Explorer Link>\n`;
  }

  return message;
}
