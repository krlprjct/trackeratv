# Гайд: Переезд trackeratv.ru на VPS (Beget)

## Что имеем

- Сервер Beget: `185.225.34.114`, Ubuntu 24.04, root-доступ
- Домен `trackeratv.ru` на reg.ru
- Репозиторий на GitHub: `krlprjct/trackeratv`
- Telegram Bot API работает с сервера (проверено)

---

## ЧАСТЬ 1 — Ты делаешь на своём маке

### 1.1 Запуши код на GitHub

Новый репозиторий создавать НЕ нужно. Используй существующий `krlprjct/trackeratv` — серверные файлы (server.js, deploy.sh и т.д.) уже в нём.

```bash
cd "/Users/kirill/Downloads/tracker-atv copy"
git add .
git commit -m "feat: vps deploy, second telegram chat"
git push
```

Если git ругается на lock-файл:
```bash
rm -f .git/index.lock
```

Всё. Твоя часть пока закончена. Дальше — сервер.

---

## ЧАСТЬ 2 — Друг делает на сервере (SSH)

### 2.1 Подключиться к серверу

```bash
ssh root@185.225.34.114
```
Ввести пароль от Beget.

### 2.2 Обновить систему

```bash
apt update && apt upgrade -y
```

### 2.3 Установить Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

### 2.4 Установить Nginx (это веб-сервер)

**Зачем нужен Nginx?** Он делает 3 вещи:
- Раздаёт сайт по HTTPS (SSL-сертификат)
- Отдаёт статические файлы (картинки, CSS, JS) быстро
- Перенаправляет запросы формы (/api/lead) на Node.js-сервер

```bash
apt install -y nginx
```

### 2.5 Установить PM2 (менеджер процессов)

**Зачем нужен PM2?** Он держит Node.js-сервер запущенным 24/7, перезапускает при падении.

```bash
npm install -g pm2
```

### 2.6 Установить Certbot (SSL-сертификат)

```bash
apt install -y certbot python3-certbot-nginx
```

### 2.7 Склонировать проект

```bash
git clone https://github.com/krlprjct/trackeratv.git /var/www/tracker-atv
cd /var/www/tracker-atv
```

### 2.8 Установить зависимости и собрать сайт

```bash
npm ci --production=false
npm install express
npm run build
```

После этого в папке `dist/` появится готовый сайт.

### 2.9 Создать .env файл (СЕКРЕТНЫЕ КЛЮЧИ)

**Этот файл НИКОГДА не попадает в git. Только на сервере.**

```bash
nano /var/www/tracker-atv/.env
```

Вставить (заменить значения на реальные):

```
PORT=3000
TELEGRAM_BOT_TOKEN=8324181488:AAF_hRkEV09jVu|_vgqVv0dZG6fWjwk0TAS8
TELEGRAM_CHAT_ID=ОСНОВНОЙ_CHAT_ID_СЮДА
TELEGRAM_CHAT_ID_2=1391134515
RESEND_API_KEY=re_ТВОЙ_RESEND_API_KEY
EMAIL_TO=zerbig66@yandex.ru
```

Сохранить: `Ctrl+O` → `Enter` → `Ctrl+X`

### 2.10 Настроить Nginx

```bash
cp /var/www/tracker-atv/nginx.conf.example /etc/nginx/sites-available/trackeratv.ru
ln -sf /etc/nginx/sites-available/trackeratv.ru /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
```

Пока SSL нет, временно отключить HTTPS-блок:
```bash
nano /etc/nginx/sites-available/trackeratv.ru
```

Закомментировать весь блок `server { listen 443 ... }` (добавить `#` в начало каждой строки). Оставить только блок `listen 80` и поменять `return 301` на:

```nginx
server {
    listen 80;
    server_name trackeratv.ru www.trackeratv.ru;

    root /var/www/tracker-atv/dist;
    index index.html;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2|woff|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Проверить и перезапустить:
```bash
nginx -t
systemctl reload nginx
```

### 2.11 Запустить Node.js-сервер через PM2

```bash
cd /var/www/tracker-atv
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

Последняя команда выведет строку типа `sudo env PATH=...` — скопировать и выполнить её. Это сделает автозапуск при перезагрузке сервера.

### 2.12 Проверить что всё работает

```bash
curl http://localhost:3000/api/lead -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест","phone":"79222200491","request_type":"testdrive","client_type":"individual"}'
```

Если вернёт `{"ok":true}` и пришло сообщение в Telegram — всё работает.

---

## ЧАСТЬ 3 — Ты делаешь: смена DNS на reg.ru

### 3.1 Зайти в reg.ru

1. reg.ru → Мои домены → `trackeratv.ru` → DNS-серверы
2. Переключить на **DNS-серверы reg.ru** (убрать Cloudflare: evelyn.ns.cloudflare.com и weston.ns.cloudflare.com)
3. Подождать пока reg.ru активирует свои DNS (может занять до 15 минут)

### 3.2 Настроить DNS-записи

В разделе DNS добавить:

| Тип | Хост | Значение |
|-----|------|----------|
| A | @ | 185.225.34.114 |
| A | www | 185.225.34.114 |

Для Resend (отправка писем) добавить DNS-записи, которые у тебя сейчас на Cloudflare:

| Тип | Хост | Значение |
|-----|------|----------|
| MX | send | feedback-smtp.eu-west-1.amazonses.com (приоритет 10) |
| TXT | send | v=spf1 include:amazonses.com ~all |
| TXT | resend._domainkey | (скопируй DKIM-ключ из Cloudflare DNS) |
| TXT | _dmarc | v=DMARC1; p=none; |

**ВАЖНО:** Скопируй ВСЕ DNS-записи с Cloudflare (из раздела DNS → Records) в reg.ru ПЕРЕД сменой DNS-серверов, чтобы ничего не потерять.

### 3.3 Подождать пропагации DNS

Смена DNS-серверов занимает от 15 минут до 24 часов (обычно 1-2 часа).

Проверить:
```bash
nslookup trackeratv.ru
```

Когда покажет `185.225.34.114` — DNS обновился.

---

## ЧАСТЬ 4 — Друг делает: SSL-сертификат

После того как DNS начал отдавать IP сервера:

```bash
certbot --nginx -d trackeratv.ru -d www.trackeratv.ru --agree-tos -m zerbig66@yandex.ru
```

Certbot автоматически:
- Получит бесплатный SSL-сертификат от Let's Encrypt
- Настроит Nginx на HTTPS
- Добавит автоматическое продление

После этого восстановить оригинальный nginx.conf:
```bash
cp /var/www/tracker-atv/nginx.conf.example /etc/nginx/sites-available/trackeratv.ru
certbot --nginx -d trackeratv.ru -d www.trackeratv.ru
nginx -t && systemctl reload nginx
```

---

## ЧАСТЬ 5 — Безопасность сервера

### 5.1 Создать обычного пользователя (не работать под root)

```bash
adduser tracker
usermod -aG sudo tracker
```

### 5.2 Настроить файрвол

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 5.3 Отключить вход по паролю (после настройки SSH-ключей)

Сначала на маке:
```bash
ssh-copy-id root@185.225.34.114
```

Потом на сервере:
```bash
nano /etc/ssh/sshd_config
# Найти PasswordAuthentication и поставить no
systemctl restart sshd
```

---

## Как обновлять сайт в будущем

### На маке:
```bash
cd "/Users/kirill/Downloads/tracker-atv copy"
# внести изменения
git add .
git commit -m "описание изменений"
git push
```

### На сервере:
```bash
cd /var/www/tracker-atv
git pull
npm run build
pm2 restart tracker-atv
```

---

## Полезные команды для друга

```bash
pm2 status              # статус сервера
pm2 logs tracker-atv    # логи (ошибки)
pm2 restart tracker-atv # перезапуск
nginx -t                # проверка конфига nginx
systemctl reload nginx  # перезагрузка nginx
nano /var/www/tracker-atv/.env  # редактировать токены
```
