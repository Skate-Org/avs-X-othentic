module.exports = {
  apps: [
    {
      name: "Performer Watcher",
      script: "dist/process/watch.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
  ],
};
