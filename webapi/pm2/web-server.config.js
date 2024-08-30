module.exports = {
  apps: [
    {
      name: "AVS Web API",
      script: "dist/index.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        ENVIRONMENT: "production",
      },
    },
  ],
};
