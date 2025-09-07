module.exports = {
  apps: [
    {
      name: 'balco-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/balco',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/balco-error.log',
      out_file: '/var/log/pm2/balco-out.log',
      log_file: '/var/log/pm2/balco-combined.log',
      time: true
    }
  ]
};
