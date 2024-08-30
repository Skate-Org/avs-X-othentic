module.exports = {
  apps: [
    {
      name: "Performer Sender",
      script: "dist/process/send.js",
      exec_mode: "fork", // Fork mode for a single instance
      instances: 1,
    },
  ],
};
