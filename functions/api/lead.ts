// functions/api/lead.ts
interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  RESEND_API_KEY: string;
  EMAIL_TO: string;
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (limit.count >= 3) {
    return false;
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

async function sendToTelegram(data: any, env: Env): Promise<boolean> {
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

${data.source ? `<b>Источник:</b> ${data.source}` : ''}
${data.page_url ? `<b>Страница:</b> ${data.page_url}` : ''}
${data.utm_source || data.utm_medium || data.utm_campaign ? `<b>UTM:</b> ${data.utm_source || '-'} / ${data.utm_medium || '-'} / ${data.utm_campaign || '-'}` : ''}

<b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' })}`;

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    }
  );

  return response.ok;
}

async function sendToEmail(data: any, env: Env): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    console.warn('Resend API key not configured');
    return false;
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
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'TRACKER ATV <noreply@trackeratv.ru>',
        to: [env.EMAIL_TO || 'zerbig66@yandex.ru'],
        subject: `Заявка: ${data.name} (${requestTypeLabels[data.request_type]})`,
        html: emailHtml
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const data = await request.json();

    // Валидация
    if (!data.name || data.name.length < 2) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Имя обязательно (минимум 2 символа)' }),
        { status: 400, headers }
      );
    }

    if (!data.phone || data.phone.length !== 11) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Неверный формат телефона' }),
        { status: 400, headers }
      );
    }

    // Honeypot
    if (data.website) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Bot detected' }),
        { status: 400, headers }
      );
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Слишком много запросов. Подождите минуту.' }),
        { status: 429, headers }
      );
    }

    // Отправка в Telegram
    const telegramSuccess = await sendToTelegram(data, env);
    
    if (!telegramSuccess) {
      throw new Error('Failed to send to Telegram');
    }

    // Отправка на Email (не критично)
    await sendToEmail(data, env);

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Не удалось отправить заявку' }),
      { status: 500, headers }
    );
  }
}