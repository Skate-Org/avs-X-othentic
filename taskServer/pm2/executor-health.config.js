module.exports = {
  apps: [
    {
      name: "Executor Health - Fetch Balance",
      script: "dist/subprocess/gas.health/process/fetch.balance.js",
    },
    {
      name: "Executor Health - Slack Update",
      script: "dist/subprocess/gas.health/process/update.balance.js",
    },
    {
      name: "Executor Health - Slack Alert",
      script: "dist/subprocess/gas.health/process/alert.balance.js",
    },
    {
      name: "Executor Health - Web Server",
      script: "dist/subprocess/gas.health/process/web.server/index.js",
    },
  ],
};
