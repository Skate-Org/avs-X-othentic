module.exports = {
  apps: [
    // 1. Chains No 1-6
    {
      name: "Collect Group 1",
      script: "dist/subprocess/task.collector/periphery/_group1_.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 2. Chains No 7-12
    {
      name: "Collect Group 2",
      script: "dist/subprocess/task.collector/periphery/_group2_.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 3. Chains No 13-18
    {
      name: "Collect Group 3",
      script: "dist/subprocess/task.collector/periphery/_group3_.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    // 4. Chains No 19-24
    {
      name: "Collect Group 4",
      script: "dist/subprocess/task.collector/periphery/_group4_.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
  ],
};
