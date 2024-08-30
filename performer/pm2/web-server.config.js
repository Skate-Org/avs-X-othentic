module.exports = {
  apps: [
    {
      name: "Performer Web Server",
      script: "dist/process/web.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        ENVIRONMENT: "production",
      },
    },
  ],
};
