const defaultConfig = {
  restart_delay: "5000",
  max_restarts: "100",
  max_memory_restart: "5G",
  autorestart: true,
};

module.exports = {
  apps: [
    {
      ...defaultConfig,
      name: "dApp Frontend",
      script: "env-cmd",
      args: "-f ./build/.env node ./build/bin/www.js",
      env: {
      	NODE_ENV: "production",
      },
    },
    {
      ...defaultConfig,
      name: "Nginx Proxy",
      cwd: "packages/prod-proxy/",
      script: "bin/use_tmp.sh",
    },
  ],
};
