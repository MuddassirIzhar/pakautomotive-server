module.exports = {
    apps: [
      {
        name: "PakAutomotive",
        script: "ts-node ./src/index.ts",
        instances: 1,
        max_memory_restart: "300M",
        // Logging
        out_file: "./out.log",
        error_file: "./error.log",
        merge_logs: true,
        log_date_format: "DD-MM HH:mm:ss Z",
        log_type: "log",
        // Env Specific Config
        env_production: {
          NODE_ENV: "production",
          PORT: 8080,
          exec_mode: "cluster_mode",
        },
        env_development: {
          NODE_ENV: "development",
          PORT: 8080,
          watch: true,
          watch_delay: 1000,
          // ignore_watch: [
          //   "./src"
          // ],
        },
      },
    ],
  };