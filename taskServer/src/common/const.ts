import "dotenv/config";

// Kernel
export const SKATE_RPC = process.env.SKATE_HTTP_RPC as string;
export const MESSAGE_BOX = process.env.MESSAGE_BOX as `0x${string}`;
export const MESSAGE_BOX_GENESIS_BLOCK = Number(process.env.MESSAGE_BOX_GENESIS_BLOCK);

// AVS
export const AVS_RPC = process.env.AVS_HTTP_RPC as string;
export const ATTESTATION_CENTER = process.env.ATTESTATION_CENTER as `0x${string}`;
export const ATTESTATION_CENTER_GENESIS_BLOCK = Number(process.env.ATTESTATION_CENTER_GENESIS_BLOCK);

//// Periphery ////
// 1. Base
export const BASE_RPC = process.env.BASE_HTTP_RPC as `https://${string}`;
export const BASE_GATEWAY = process.env.BASE_GATEWAY as `0x${string}`;
export const BASE_GATEWAY_GENESIS = Number(process.env.BASE_GATEWAY_GENESIS);
// 2. Optimism
export const OPTIMISM_RPC = process.env.OPTIMISM_HTTP_RPC as `https://${string}`;
export const OPTIMISM_GATEWAY = process.env.OPTIMISM_GATEWAY as `0x${string}`;
export const OPTIMISM_GATEWAY_GENESIS = Number(process.env.OPTIMISM_GATEWAY_GENESIS);
// 3. Arbitrum
export const ARBITRUM_RPC = process.env.ARBITRUM_HTTP_RPC as `https://${string}`;
export const ARBITRUM_GATEWAY = process.env.ARBITRUM_GATEWAY as `0x${string}`;
export const ARBITRUM_GATEWAY_GENESIS = Number(process.env.ARBITRUM_GATEWAY_GENESIS);
// 4. BSC
export const BNB_RPC = process.env.BNB_HTTP_RPC as `https://${string}`;
export const BNB_GATEWAY = process.env.BNB_GATEWAY as `0x${string}`;
export const BNB_GATEWAY_GENESIS = Number(process.env.BNB_GATEWAY_GENESIS);
// 5. Polygon
export const POLYGON_RPC = process.env.POLYGON_HTTP_RPC as string;
export const POLYGON_GATEWAY = process.env.POLYGON_GATEWAY as `0x${string}`;
export const POLYGON_GATEWAY_GENESIS = Number(process.env.POLYGON_GATEWAY_GENESIS);
// 6. Ethereum
export const ETHEREUM_RPC = process.env.ETHEREUM_HTTP_RPC as string;
export const ETHEREUM_GATEWAY = process.env.ETHEREUM_GATEWAY as `0x${string}`;
export const ETHEREUM_GATEWAY_GENESIS = Number(process.env.ETHEREUM_GATEWAY_GENESIS);
// 7. Zora
export const ZORA_RPC = process.env.ZORA_HTTP_RPC as string;
export const ZORA_GATEWAY = process.env.ZORA_GATEWAY as `0x${string}`;
export const ZORA_GATEWAY_GENESIS = Number(process.env.ZORA_GATEWAY_GENESIS);
// 8. ZETA
export const ZETA_RPC = process.env.ZETA_HTTP_RPC as string;
export const ZETA_GATEWAY = process.env.ZETA_GATEWAY as `0x${string}`;
export const ZETA_GATEWAY_GENESIS = Number(process.env.ZETA_GATEWAY_GENESIS);
// 9. Blast
export const BLAST_RPC = process.env.BLAST_HTTP_RPC as string;
export const BLAST_GATEWAY = process.env.BLAST_GATEWAY as `0x${string}`;
export const BLAST_GATEWAY_GENESIS = Number(process.env.BLAST_GATEWAY_GENESIS);
// 10. Fantom
export const FANTOM_RPC = process.env.FANTOM_HTTP_RPC as string;
export const FANTOM_GATEWAY = process.env.FANTOM_GATEWAY as `0x${string}`;
export const FANTOM_GATEWAY_GENESIS = Number(process.env.FANTOM_GATEWAY_GENESIS);
// 11. Linea
export const LINEA_RPC = process.env.LINEA_HTTP_RPC as string;
export const LINEA_GATEWAY = process.env.LINEA_GATEWAY as `0x${string}`;
export const LINEA_GATEWAY_GENESIS = Number(process.env.LINEA_GATEWAY_GENESIS);
// 12. Mode
export const MODE_RPC = process.env.MODE_HTTP_RPC as string;
export const MODE_GATEWAY = process.env.MODE_GATEWAY as `0x${string}`;
export const MODE_GATEWAY_GENESIS = Number(process.env.MODE_GATEWAY_GENESIS);
// 13. Scroll
export const SCROLL_RPC = process.env.SCROLL_HTTP_RPC as string;
export const SCROLL_GATEWAY = process.env.SCROLL_GATEWAY as `0x${string}`;
export const SCROLL_GATEWAY_GENESIS = Number(process.env.SCROLL_GATEWAY_GENESIS);
// 14. Manta
export const MANTA_RPC = process.env.MANTA_HTTP_RPC as string;
export const MANTA_GATEWAY = process.env.MANTA_GATEWAY as `0x${string}`;
export const MANTA_GATEWAY_GENESIS = Number(process.env.MANTA_GATEWAY_GENESIS);
// 15. Kroma
export const KROMA_RPC = process.env.KROMA_HTTP_RPC as string;
export const KROMA_GATEWAY = process.env.KROMA_GATEWAY as `0x${string}`;
export const KROMA_GATEWAY_GENESIS = Number(process.env.KROMA_GATEWAY_GENESIS);
// 16. Xai
export const XAI_RPC = process.env.XAI_HTTP_RPC as string;
export const XAI_GATEWAY = process.env.XAI_GATEWAY as `0x${string}`;
export const XAI_GATEWAY_GENESIS = Number(process.env.XAI_GATEWAY_GENESIS);
// 17. InEVM
export const INEVM_RPC = process.env.INEVM_HTTP_RPC as string;
export const INEVM_GATEWAY = process.env.INEVM_GATEWAY as `0x${string}`;
export const INEVM_GATEWAY_GENESIS = Number(process.env.INEVM_GATEWAY_GENESIS);
// 18. Celo
export const CELO_RPC = process.env.CELO_HTTP_RPC as string;
export const CELO_GATEWAY = process.env.CELO_GATEWAY as `0x${string}`;
export const CELO_GATEWAY_GENESIS = Number(process.env.CELO_GATEWAY_GENESIS);
// 19. TAIKO
export const TAIKO_RPC = process.env.TAIKO_HTTP_RPC as string;
export const TAIKO_GATEWAY = process.env.TAIKO_GATEWAY as `0x${string}`;
export const TAIKO_GATEWAY_GENESIS = Number(process.env.TAIKO_GATEWAY_GENESIS);
// 20. XLAYER
export const XLAYER_RPC = process.env.XLAYER_HTTP_RPC as string;
export const XLAYER_GATEWAY = process.env.XLAYER_GATEWAY as `0x${string}`;
export const XLAYER_GATEWAY_GENESIS = Number(process.env.XLAYER_GATEWAY_GENESIS);
// 21. Morph
export const MORPH_RPC = process.env.MORPH_HTTP_RPC as string;
export const MORPH_GATEWAY = process.env.MORPH_GATEWAY as `0x${string}`;
export const MORPH_GATEWAY_GENESIS = Number(process.env.MORPH_GATEWAY_GENESIS);
// 22. Metis
export const METIS_RPC = process.env.METIS_HTTP_RPC as string;
export const METIS_GATEWAY = process.env.METIS_GATEWAY as `0x${string}`;
export const METIS_GATEWAY_GENESIS = Number(process.env.METIS_GATEWAY_GENESIS);
// 23. Gnosis
export const GNOSIS_RPC = process.env.GNOSIS_HTTP_RPC as string;
export const GNOSIS_GATEWAY = process.env.GNOSIS_GATEWAY as `0x${string}`;
export const GNOSIS_GATEWAY_GENESIS = Number(process.env.GNOSIS_GATEWAY_GENESIS);
// 24. Mantle
export const MANTLE_RPC = process.env.MANTLE_HTTP_RPC as string;
export const MANTLE_GATEWAY = process.env.MANTLE_GATEWAY as `0x${string}`;
export const MANTLE_GATEWAY_GENESIS = Number(process.env.MANTLE_GATEWAY_GENESIS);
