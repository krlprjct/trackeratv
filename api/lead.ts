import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory rate limiting (простая защита от спама)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60000 }); // 1 минута
    return true;
  }

  if (limit.count >= 3) {
    return false; // Больше 3 запросов в минуту
  }

  limit.count++;
  return true;
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}

function validateRequest(body: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push('Имя обязательно и должно содержать минимум 2 символа');
  }

  if (!body.phone || typeof body.phone !== 'string') {
    errors.push('Телефон обязателен');
  } else {
    const cleaned = body.phone.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      errors.push('Телефон должен содержать 11 цифр');
    }
  }

  if (!body.request_type || typeof body.request_type !== 'string') {
    errors.push('Выберите, что вам нужно');
  }

  if (!body.client_type || typeof body.client_type !== 'string') {
    errors.push('Выберите тип клиента');
  }

  // Honeypot check (скрытое поле для ботов)
  if (body.website) {
    errors.push('Spam detected');
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true };
}

async function sendToTelegram(data: any): Promise<boolean> {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error('Telegram credentials not configured');
  }

  const requestTypeLabels: Record<string, string> = {
    selection: 'Подбор комплектации',
    testdrive: 'Тест-драйв',
    both: 'Подбор + тест-драйв',
  };

  const clientTypeLabels: Record<string, string> = {
    individual: 'Физлицо',
    legal: 'Юрлицо',
    leasing: 'Лизинг',
  };

  const message = `🔔 <b>Новая заявка TRACKER</b>

<b>Что нужно:</b> ${requestTypeLabels[data.request_type] || data.request_type}
<b>Тип клиента:</b> ${clientTypeLabels[data.client_type] || data.client_type}
<b>Имя:</b> ${data.name}
<b>Телефон:</b> ${formatPhone(data.phone)}
${data.usage ? `<b>Сценарий:</b> ${data.usage}` : ''}

${data.source ? `<b>Источник:</b> ${data.source}` : ''}
${data.page_url ? `<b>Страница:</b> ${data.page_url}` : ''}
${data.utm_source || data.utm_medium || data.utm_campaign ? `<b>UTM:</b> ${data.utm_source || '-'} / ${data.utm_medium || '-'} / ${data.utm_campaign || '-'}${data.utm_content ? ` / ${data.utm_content}` : ''}${data.utm_term ? ` / ${data.utm_term}` : ''}` : ''}

<b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Telegram API error:', error);
    return false;
  }

  return true;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ 
      ok: false, 
      error: 'Слишком много запросов. Подождите минуту.' 
    });
  }

  // Валидация
  const validation = validateRequest(req.body);
  if (!validation.valid) {
    return res.status(400).json({ 
      ok: false, 
      error: validation.errors?.join(', ') 
    });
  }

  try {
    // Отправка в Telegram
    const success = await sendToTelegram(req.body);
    
    if (!success) {
      throw new Error('Failed to send to Telegram');
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error processing lead:', error);
    return res.status(500).json({ 
      ok: false, 
      error: 'Не удалось отправить заявку. Попробуйте позже.' 
    });
  }
}