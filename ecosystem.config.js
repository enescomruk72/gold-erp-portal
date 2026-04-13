module.exports = {
  apps: [
    {
      name: "gold-erp-portal",
      cwd: "/home/bkns-software-portal/htdocs/portal.bkns-software.com/app",

      script: "node_modules/next/dist/bin/next",
      args: "start --port 5174",

      instances: 1, // Next SSR için genelde 1
      exec_mode: "fork", // cluster kullanma

      autorestart: true,
      watch: false,

      max_memory_restart: "512M",

      env: {
        NODE_ENV: "production",
        PORT: 5174,
      },

      error_file: "../logs/pm2-error.log",
      out_file: "../logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
