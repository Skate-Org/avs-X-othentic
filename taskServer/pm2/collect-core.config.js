module.exports = {
  apps: [
    {
      name: "Collect Kernel",
      script: "dist/subprocess/task.collector/kernel.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
    {
      name: "Collect AVS",
      script: "dist/subprocess/task.collector/avs.process.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
  ],
};
