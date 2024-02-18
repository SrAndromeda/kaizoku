import TelegramBot from 'node-telegram-bot-api';
import { prisma } from '../db/client';

export const sendNotification = async (title: string, body: string, url?: string) => {
  const settings = await prisma.settings.findFirstOrThrow();
  let auth = ``;
  let authHeader = ``;

  if (settings.telegramEnabled && settings.telegramChatId && settings.telegramToken) {
    const bot = new TelegramBot(settings.telegramToken);
    const message = `
<b>${title}</b>

${body}

${url || ''}
    `;
    await bot.sendMessage(settings.telegramChatId, message, {
      parse_mode: 'HTML',
      disable_notification: settings.telegramSendSilently,
    });
  }

  if (settings.appriseEnabled && settings.appriseHost && settings.appriseUrls.length !== 0) {
    const appriseServiceUrl = new URL(
      '/notify',
      settings.appriseHost.toLowerCase().startsWith('http') ? settings.appriseHost : `http://${settings.appriseHost}`,
    ).href;
    await fetch(appriseServiceUrl, {
      body: JSON.stringify({
        urls: settings.appriseUrls,
        title,
        body: `${body} ${url}`,
        format: 'html',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }

  if (settings.ntfyEnabled && settings.ntfyHost && settings.ntfyTopic) {
    if (settings.ntfyUsername && settings.ntfyPassword) {
      auth = `${settings.ntfyUsername}:${settings.ntfyPassword}`;
      authHeader = `Basic ${Buffer.from(auth).toString('base64')}`;
    }
    await fetch(settings.ntfyHost, {
      body: JSON.stringify({
        topic: settings.ntfyTopic,
        title,
        message: `${body} ${url}`,
        tags: ['Info'],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      method: 'POST',
    });
  }
};
