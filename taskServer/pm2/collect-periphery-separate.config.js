module.exports = {
  apps: [
    // 1. Base
    {
      name: "Collect Periphery-Base",
      script: "dist/subprocess/task.collector/periphery/base.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 2. Optimism
    {
      name: "Collect Periphery-Optimism",
      script: "dist/subprocess/task.collector/periphery/optimism.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 3. Arbitrum
    {
      name: "Collect Periphery-Arbitrum",
      script: "dist/subprocess/task.collector/periphery/arbitrum.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 4. BSC
    {
      name: "Collect Periphery-BSC",
      script: "dist/subprocess/task.collector/periphery/bnb.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 5. Polygon
    {
      name: "Collect Periphery-Polygon",
      script: "dist/subprocess/task.collector/periphery/polygon.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 6. Ethereum
    {
      name: "Collect Periphery-Ethereum",
      script: "dist/subprocess/task.collector/periphery/ethereum.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 7. Zora
    {
      name: "Collect Periphery-Zora",
      script: "dist/subprocess/task.collector/periphery/zora.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 8. Zeta
    {
      name: "Collect Periphery-Zeta",
      script: "dist/subprocess/task.collector/periphery/zeta.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 9. Blast
    {
      name: "Collect Periphery-Blast",
      script: "dist/subprocess/task.collector/periphery/blast.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 10. Fantom
    {
      name: "Collect Periphery-Fantom",
      script: "dist/subprocess/task.collector/periphery/fantom.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 11. Linea
    {
      name: "Collect Periphery-Linea",
      script: "dist/subprocess/task.collector/periphery/linea.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 12. Mode
    {
      name: "Collect Periphery-Mode",
      script: "dist/subprocess/task.collector/periphery/mode.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 13. Scroll
    {
      name: "Collect Periphery-Scroll",
      script: "dist/subprocess/task.collector/periphery/scroll.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 14. Manta
    {
      name: "Collect Periphery-Manta",
      script: "dist/subprocess/task.collector/periphery/manta.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 15. Kroma
    {
      name: "Collect Periphery-Kroma",
      script: "dist/subprocess/task.collector/periphery/kroma.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 16. Xai
    {
      name: "Collect Periphery-Xai",
      script: "dist/subprocess/task.collector/periphery/xai.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 17. InEVM
    {
      name: "Collect Periphery-InEVM",
      script: "dist/subprocess/task.collector/periphery/inEVM.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 18. Celo
    {
      name: "Collect Periphery-Celo",
      script: "dist/subprocess/task.collector/periphery/celo.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 19. Taiko
    {
      name: "Collect Periphery-Taiko",
      script: "dist/subprocess/task.collector/periphery/taiko.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 20. xLAyer
    {
      name: "Collect Periphery-XLayer",
      script: "dist/subprocess/task.collector/periphery/xLayer.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 21. Morph
    {
      name: "Collect Periphery-Morph",
      script: "dist/subprocess/task.collector/periphery/morph.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 22. Metis
    {
      name: "Collect Periphery-Metis",
      script: "dist/subprocess/task.collector/periphery/metis.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 23. Gnosis
    {
      name: "Collect Periphery-Gnosis",
      script: "dist/subprocess/task.collector/periphery/gnosis.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 24. Mantle
    {
      name: "Collect Periphery-Mantle",
      script: "dist/subprocess/task.collector/periphery/mantle.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
  ],
};
