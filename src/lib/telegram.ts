const TELEGRAM_BOT_TOKEN = "8322913869:AAFW3XwBzMsFYCn6QsGgMFNXFXP3C7UFijI";
const DEFAULT_CHAT_ID = "5548194689"; // Your retrieved Chat ID

export const sendTelegramMessage = async (message: string, chatId: string = DEFAULT_CHAT_ID) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Telegram message failed:', await response.text());
    }
    return response.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};
