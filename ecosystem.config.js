module.exports = {
  apps: [
    {
      name: 'solar-backend',
      cwd: '/var/www/solar/s/b',
      script: 'npm',
      args: 'run dev',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
