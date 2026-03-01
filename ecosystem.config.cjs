// ecosystem.config.cjs — PM2 конфигурация
module.exports = {
  apps: [{
    name: 'tracker-atv',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '256M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Эти значения ОБЯЗАТЕЛЬНО задать на сервере:
      // TELEGRAM_BOT_TOKEN: '',
      // TELEGRAM_CHAT_ID: '',
      // RESEND_API_KEY: '',
      // EMAIL_TO: '',
    },
  }],
};
