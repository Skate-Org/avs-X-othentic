import "dotenv/config";
import {
  arbitrumClient,
  baseClient,
  blastClient,
  bnbClient,
  celoClient,
  ethereumClient,
  fantomClient,
  gnosisClient,
  inEVMClient,
  kromaClient,
  lineaClient,
  mantaClient,
  mantleClient,
  metisClient,
  modeClient,
  morphClient,
  optimismClient,
  polygonClient,
  scrollClient,
  skateClient,
  taikoClient,
  xaiClient,
  xLayerClient,
  zetaClient,
  zoraClient,
} from "../../../common/client";

import fs from "fs";
import path from "path";
import { CACHE_DIR } from "./common";
import { logger } from "../../../common/logger";

// WARN: Must call this from root directory using the pm2.config or equivalent node invocation.
export const FILE_PATH = path.resolve(CACHE_DIR, "balances.json");

const TARGET_ADDRESS = "0x00E3CC76DA72cF673E4429E2d527388956af61ef";
const LOW_GAS = BigInt(5 * 10 ** 16);

export type BalanceMap = {
  [key: number]: {
    name: string;
    explorer: string;
    balance: string;
    normalized_balance: string;
    native_token: string;
    healthy: boolean;
  };
};

export async function fetchBalances() {
  const balances = await Promise.all([
    baseClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    optimismClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    arbitrumClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    bnbClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    polygonClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    ethereumClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    zoraClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    zetaClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    blastClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    fantomClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    lineaClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }), // NOTE: Not supported on FE
    modeClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    scrollClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    mantaClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    kromaClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    xaiClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    inEVMClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }), // NOTE: Not supported on FE
    celoClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    taikoClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    xLayerClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    morphClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    mantleClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    skateClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }), // NOTE: KERNEL
    metisClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
    gnosisClient.getBalance({ address: TARGET_ADDRESS, blockTag: "latest" }),
  ]);

  let balanceMap: {
    [key: number]: {
      name: string;
      explorer: string;
      balance: string;
      normalized_balance: string;
      native_token: string;
      healthy: boolean;
    };
  } = {
    85432: {
      name: "Base",
      explorer: `${process.env.BASE_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[0].toString(),
      normalized_balance: (Number(balances[0]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[0] > LOW_GAS,
    },
    11155420: {
      name: "Optimism",
      explorer: `${process.env.OPTIMISM_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[1].toString(),
      normalized_balance: (Number(balances[1]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[1] > LOW_GAS,
    },
    421614: {
      name: "Arbitrum",
      explorer: `${process.env.ARBITRUM_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[2].toString(),
      normalized_balance: (Number(balances[2]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[2] > LOW_GAS,
    },
    97: {
      name: "BSC",
      explorer: `${process.env.BNB_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[3].toString(),
      normalized_balance: (Number(balances[3]) / 10 ** 18).toString(),
      native_token: "BSC",
      healthy: balances[3] > LOW_GAS,
    },
    80002: {
      name: "Polygon",
      explorer: `${process.env.POLYGON_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[4].toString(),
      normalized_balance: (Number(balances[4]) / 10 ** 18).toString(),
      native_token: "MATIC",
      healthy: balances[4] > LOW_GAS,
    },
    11155111: {
      name: "Ethereum",
      explorer: `${process.env.ETHEREUM_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[5].toString(),
      normalized_balance: (Number(balances[5]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[5] > LOW_GAS,
    },
    999999999: {
      name: "Zora",
      explorer: `${process.env.ZORA_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[6].toString(),
      normalized_balance: (Number(balances[6]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[6] > LOW_GAS,
    },
    7001: {
      name: "Zeta",
      explorer: `${process.env.ZETA_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[7].toString(),
      normalized_balance: (Number(balances[7]) / 10 ** 18).toString(),
      native_token: "tZeta",
      healthy: balances[7] > LOW_GAS,
    },
    168587773: {
      name: "Blast",
      explorer: `${process.env.BLAST_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[8].toString(),
      normalized_balance: (Number(balances[8]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[8] > LOW_GAS,
    },
    4002: {
      name: "Fantom",
      explorer: `${process.env.FANTOM_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[9].toString(),
      normalized_balance: (Number(balances[9]) / 10 ** 18).toString(),
      native_token: "FTM",
      healthy: balances[9] > LOW_GAS,
    },
    59141: {
      name: "Linea",
      explorer: `${process.env.LINEA_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[10].toString(),
      normalized_balance: (Number(balances[10]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[10] > LOW_GAS,
    },
    919: {
      name: "Mode",
      explorer: `${process.env.MODE_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[11].toString(),
      normalized_balance: (Number(balances[11]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[11] > LOW_GAS,
    },
    534351: {
      name: "Scroll",
      explorer: `${process.env.SCROLL_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[12].toString(),
      normalized_balance: (Number(balances[12]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[12] > LOW_GAS,
    },
    3441006: {
      name: "Manta",
      explorer: `${process.env.MANTA_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[13].toString(),
      normalized_balance: (Number(balances[13]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[13] > LOW_GAS,
    },
    2358: {
      name: "Kroma",
      explorer: `${process.env.KROMA_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[14].toString(),
      normalized_balance: (Number(balances[14]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[14] > LOW_GAS,
    },
    37714555429: {
      name: "Xai",
      explorer: `${process.env.XAI_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[15].toString(),
      normalized_balance: (Number(balances[15]) / 10 ** 18).toString(),
      native_token: "Xai",
      healthy: balances[15] > LOW_GAS,
    },
    2424: {
      name: "inEVM",
      explorer: `${process.env.INEVM_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[16].toString(),
      normalized_balance: (Number(balances[16]) / 10 ** 18).toString(),
      native_token: "INJ",
      healthy: balances[16] > LOW_GAS,
    },
    44787: {
      name: "Celo",
      explorer: `${process.env.CELO_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[17].toString(),
      normalized_balance: (Number(balances[17]) / 10 ** 18).toString(),
      native_token: "CELO",
      healthy: balances[17] > LOW_GAS,
    },
    167009: {
      name: "Taiko",
      explorer: `${process.env.TAIKO_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[18].toString(),
      normalized_balance: (Number(balances[18]) / 10 ** 18).toString(),
      native_token: "Holesky-ETH",
      healthy: balances[18] > LOW_GAS,
    },
    195: {
      name: "xLayer",
      explorer: `${process.env.XLAYER_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[19].toString(),
      normalized_balance: (Number(balances[19]) / 10 ** 18).toString(),
      native_token: "OKX",
      healthy: balances[19] > LOW_GAS,
    },
    2710: {
      name: "Morph",
      explorer: `${process.env.MORPH_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[20].toString(),
      normalized_balance: (Number(balances[20]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[20] > LOW_GAS,
    },
    5003: {
      name: "Mantle",
      explorer: `${process.env.MANTLE_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[21].toString(),
      normalized_balance: (Number(balances[21]) / 10 ** 18).toString(),
      native_token: "MNT",
      healthy: balances[21] > LOW_GAS,
    },
    5051: {
      name: "Skate Kernel",
      explorer: `${process.env.MESSAGE_BOX_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[22].toString(),
      normalized_balance: (Number(balances[22]) / 10 ** 18).toString(),
      native_token: "Sepolia-ETH",
      healthy: balances[22] > LOW_GAS,
    },
    59902: {
      name: "Metis",
      explorer: `${process.env.METIS_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[23].toString(),
      normalized_balance: (Number(balances[23]) / 10 ** 18).toString(),
      native_token: "sMETIS",
      healthy: balances[23] > LOW_GAS,
    },
    10200: {
      name: "Gnosis",
      explorer: `${process.env.GNOSIS_EXPLORER!}/address/${TARGET_ADDRESS}`,
      balance: balances[24].toString(),
      normalized_balance: (Number(balances[24]) / 10 ** 18).toString(),
      native_token: "GNO",
      healthy: balances[24] > LOW_GAS,
    },
  };

  // Save balanceMap to JSON file
  fs.writeFileSync(FILE_PATH, JSON.stringify(balanceMap, null, 2));
  logger.info(`Balance fetched and saved to JSON. AT ${new Date().toUTCString()}`)
}

export function getBalances() {
  const balanceMap: BalanceMap = JSON.parse(fs.readFileSync(FILE_PATH, "utf8")) as BalanceMap;
  return balanceMap;
}
