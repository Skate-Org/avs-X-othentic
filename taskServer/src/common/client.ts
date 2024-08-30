import { createPublicClient, http } from "viem";
import {
  AVS_RPC,
  SKATE_RPC,
  POLYGON_RPC,
  ARBITRUM_RPC,
  OPTIMISM_RPC,
  BNB_RPC,
  BASE_RPC,
  ETHEREUM_RPC,
  ZORA_RPC,
  ZETA_RPC,
  BLAST_RPC,
  FANTOM_RPC,
  LINEA_RPC,
  MODE_RPC,
  SCROLL_RPC,
  MANTA_RPC,
  KROMA_RPC,
  XAI_RPC,
  INEVM_RPC,
  CELO_RPC,
  TAIKO_RPC,
  XLAYER_RPC,
  MORPH_RPC,
  METIS_RPC,
  GNOSIS_RPC,
  MANTLE_RPC,
} from "./const";

const avsClient = createPublicClient({
  transport: http(AVS_RPC),
  pollingInterval: 1_000,
});
const skateClient = createPublicClient({
  transport: http(SKATE_RPC),
  pollingInterval: 1_000,
});
export { avsClient, skateClient };

//// Supported Periphery chains
// 1. Base
export const baseClient = createPublicClient({
  transport: http(BASE_RPC),
});
// 2. Optimism
export const optimismClient = createPublicClient({
  transport: http(OPTIMISM_RPC),
});
// 3. Arbitrum
export const arbitrumClient = createPublicClient({
  transport: http(ARBITRUM_RPC),
});
// 4. BSC
export const bnbClient = createPublicClient({
  transport: http(BNB_RPC),
});
// 5. Polygon
export const polygonClient = createPublicClient({
  transport: http(POLYGON_RPC),
});
// 6. Ethereum
export const ethereumClient = createPublicClient({
  transport: http(ETHEREUM_RPC),
});
// 7. Zora
export const zoraClient = createPublicClient({
  transport: http(ZORA_RPC),
});
// 8. Zeta
export const zetaClient = createPublicClient({
  transport: http(ZETA_RPC),
});
// 9. Blast
export const blastClient = createPublicClient({
  transport: http(BLAST_RPC),
});
// 10. Fantom
export const fantomClient = createPublicClient({
  transport: http(FANTOM_RPC),
});
// 11. Linea
export const lineaClient = createPublicClient({
  transport: http(LINEA_RPC),
});
// 12. Mode
export const modeClient = createPublicClient({
  transport: http(MODE_RPC),
});
// 13. Scroll
export const scrollClient = createPublicClient({
  transport: http(SCROLL_RPC),
});
// 14. Manta
export const mantaClient = createPublicClient({
  transport: http(MANTA_RPC),
});
// 15. Kroma
export const kromaClient = createPublicClient({
  transport: http(KROMA_RPC),
});
// 16. Xai
export const xaiClient = createPublicClient({
  transport: http(XAI_RPC),
});
// 17. InEVM
export const inEVMClient = createPublicClient({
  transport: http(INEVM_RPC),
});
// 18. Celo
export const celoClient = createPublicClient({
  transport: http(CELO_RPC),
});
// 19. Taiko
export const taikoClient = createPublicClient({
  transport: http(TAIKO_RPC),
});
// 20. XLayer
export const xLayerClient = createPublicClient({
  transport: http(XLAYER_RPC),
});
// 21. Morph
export const morphClient = createPublicClient({
  transport: http(MORPH_RPC),
});
// 22. Metis
export const metisClient = createPublicClient({
  transport: http(METIS_RPC),
});
// 23. Gnosis
export const gnosisClient = createPublicClient({
  transport: http(GNOSIS_RPC),
});
// 24. Mantle
export const mantleClient = createPublicClient({
  transport: http(MANTLE_RPC),
});
