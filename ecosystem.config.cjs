// PM2 Cluster Configuration for AWS EC2 Multi-Core Servers
module.exports = {
  apps: [
    {
      name: 'bxstrength-api',
      script: 'npx',
      args: 'tsx server.ts',
      instances: 'max', // Scale across all available CPU cores on AWS EC2
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      max_memory_restart: '1G',
      restart_delay: 3000
    }
  ]
};
