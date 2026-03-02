// server.js — Минимальный Express-сервер для VPS
// Раздаёт статику из dist/ и обрабатывает POST /api/lead

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───
app.use(express.json());

// ─── CORS для API ───
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── Rate limiting (in-memory) ───
const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  if (!limit || now > limit.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (limit.count >= 3) return false;
  limit.count++;
  return true;
}

// Очистка старых записей каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimitStore) {
    if (now > limit.resetAt) rateLimitStore.delete(ip);
  }
}, 300000);

// ─── Helpers ───
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}

async function sendToTelegram(data) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram credentials not configured');
    return false;
  }

  const requestTypeLabels = {
    selection: 'Подбор комплектации',
    testdrive: 'Тест-драйв',
    both: 'Подбор + тест-драйв',
  };

  const clientTypeLabels = {
    individual: 'Физлицо',
    legal: 'Юрлицо',
    leasing: 'Лизинг',
  };

  const message = `🔔 <b>Новая заявка TRACKER</b>

<b>Что нужно:</b> ${requestTypeLabels[data.request_type] || data.request_type}
<b>Тип клиента:</b> ${clientTypeLabels[data.client_type] || data.client_type}
<b>Имя:</b> ${data.name}
<b>Телефон:</b> ${formatPhone(data.phone)}

${data.source ? `<b>Источник:</b> ${data.source}` : ''}
${data.page_url ? `<b>Страница:</b> ${data.page_url}` : ''}
${data.utm_source || data.utm_medium || data.utm_campaign ? `<b>UTM:</b> ${data.utm_source || '-'} / ${data.utm_medium || '-'} / ${data.utm_campaign || '-'}` : ''}

<b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' })}`;

  // Отправляем на основной чат
  const response1 = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    }
  );

  // Отправляем на второй чат
  const chatId2 = process.env.TELEGRAM_CHAT_ID_2;
  if (chatId2) {
    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId2,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );
  }

  return response1.ok;
}

async function sendToEmail(data) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Resend API key not configured');
    return false;
  }

  const requestTypeLabels = {
    selection: 'Подбор комплектации',
    testdrive: 'Тест-драйв',
    both: 'Подбор + тест-драйв',
  };

  const clientTypeLabels = {
    individual: 'Физлицо',
    legal: 'Юрлицо',
    leasing: 'Лизинг',
  };

  const emailHtml = `
<h2>🔔 Новая заявка с сайта TRACKER</h2>
<p><strong>Что нужно:</strong> ${requestTypeLabels[data.request_type]}</p>
<p><strong>Тип клиента:</strong> ${clientTypeLabels[data.client_type]}</p>
<p><strong>Имя:</strong> ${data.name}</p>
<p><strong>Телефон:</strong> ${formatPhone(data.phone)}</p>
<hr>
${data.source ? `<p><strong>Источник:</strong> ${data.source}</p>` : ''}
${data.utm_source ? `<p><strong>UTM:</strong> ${data.utm_source} / ${data.utm_medium} / ${data.utm_campaign}</p>` : ''}
<p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TRACKER ATV <noreply@trackeratv.ru>',
        to: [process.env.EMAIL_TO || 'zerbig66@yandex.ru'],
        subject: `Заявка: ${data.name} (${requestTypeLabels[data.request_type]})`,
        html: emailHtml,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

// ─── API endpoint ───
app.post('/api/lead', async (req, res) => {
  try {
    const data = req.body;

    // Валидация
    if (!data.name || String(data.name).length < 2) {
      return res.status(400).json({ ok: false, error: 'Имя обязательно (минимум 2 символа)' });
    }

    if (!data.phone || String(data.phone).length !== 11) {
      return res.status(400).json({ ok: false, error: 'Неверный формат телефона' });
    }

    // Honeypot
    if (data.website) {
      return res.status(400).json({ ok: false, error: 'Bot detected' });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ ok: false, error: 'Слишком много запросов. Подождите минуту.' });
    }

    // Отправка в Telegram
    const telegramSuccess = await sendToTelegram(data);
    if (!telegramSuccess) {
      throw new Error('Failed to send to Telegram');
    }

    // Email (не критично)
    await sendToEmail(data);

    return res.json({ ok: true });
  } catch (error) {
    console.error('Lead API error:', error);
    return res.status(500).json({ ok: false, error: 'Не удалось отправить заявку' });
  }
});

// ─── Статика из dist/ ───
app.use(express.static(join(__dirname, 'dist')));

// ─── SPA fallback — все маршруты → index.html ───
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// ─── Старт ───
app.listen(PORT, () => {
  console.log(`✅ TRACKER server running on port ${PORT}`);
});