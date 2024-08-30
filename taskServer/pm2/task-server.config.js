module.exports = {
  apps: [
    {
      name: "TaskServer Web",
      script: "dist/subprocess/web/index.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        ENVIRONMENT: "production",
      },
    },
  ],
};
