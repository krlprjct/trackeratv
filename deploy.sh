#!/bin/bash
# deploy.sh — Скрипт первого деплоя на VPS
# Запускать на сервере: bash deploy.sh

set -e

APP_DIR="/var/www/tracker-atv"
REPO_URL="https://github.com/YOUR_USER/tracker-atv.git"  # ← замени на свой репо

echo "══════════════════════════════════════"
echo "  TRACKER ATV — Deploy to VPS"
echo "══════════════════════════════════════"

# 1. Обновление системы
echo "→ Обновление системы..."
sudo apt update && sudo apt upgrade -y

# 2. Установка Node.js 20
echo "→ Установка Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
echo "  Node: $(node -v), npm: $(npm -v)"

# 3. Установка PM2
echo "→ Установка PM2..."
sudo npm install -g pm2

# 4. Установка Nginx
echo "→ Установка Nginx..."
sudo apt install -y nginx

# 5. Установка Certbot для SSL
echo "→ Установка Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# 6. Клонирование/обновление проекта
echo "→ Деплой проекта..."
if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR"
    git pull
else
    sudo mkdir -p "$APP_DIR"
    sudo chown $USER:$USER "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# 7. Установка зависимостей и билд
echo "→ Установка зависимостей..."
npm ci --production=false
npm install express

echo "→ Сборка проекта..."
npm run build

# 8. Создание .env
if [ ! -f "$APP_DIR/.env" ]; then
    echo "→ Создание .env файла..."
    cat > "$APP_DIR/.env" << 'ENVEOF'
PORT=3000
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
RESEND_API_KEY=your_resend_key_here
EMAIL_TO=zerbig66@yandex.ru
ENVEOF
    echo "  ⚠️  ОБЯЗАТЕЛЬНО отредактируй .env: nano $APP_DIR/.env"
fi

# 9. Настройка Nginx
echo "→ Настройка Nginx..."
sudo cp "$APP_DIR/nginx.conf.example" /etc/nginx/sites-available/trackeratv.ru
sudo ln -sf /etc/nginx/sites-available/trackeratv.ru /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 10. SSL-сертификат
echo "→ Получение SSL-сертификата..."
echo "  Убедись, что DNS уже указывает A-запись на IP этого сервера!"
read -p "  DNS настроен? (y/n): " dns_ready
if [ "$dns_ready" = "y" ]; then
    sudo certbot --nginx -d trackeratv.ru -d www.trackeratv.ru --non-interactive --agree-tos -m zerbig66@yandex.ru
fi

# 11. Запуск через PM2
echo "→ Запуск приложения..."
cd "$APP_DIR"
pm2 delete tracker-atv 2>/dev/null || true
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup | tail -1 | bash

echo ""
echo "══════════════════════════════════════"
echo "  ✅ Деплой завершён!"
echo ""
echo "  Сайт: https://trackeratv.ru"
echo "  Логи: pm2 logs tracker-atv"
echo "  Статус: pm2 status"
echo ""
echo "  ⚠️  Не забудь:"
echo "  1. Отредактировать .env с реальными ключами"
echo "  2. Настроить DNS A-запись на IP сервера"
echo "  3. Перенести DNS-записи Resend (SPF, DKIM)"
echo "══════════════════════════════════════"
