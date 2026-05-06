// Loop Calculator Telegram bot.
// Token is read from the BOT_TOKEN env var (or .env file). Never commit your token.
// WEB_APP_URL must be the GitHub Pages URL for index.html.

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

if (!BOT_TOKEN) {
  console.error('Missing BOT_TOKEN. Set it in .env or your environment.');
  process.exit(1);
}
if (!WEB_APP_URL || !WEB_APP_URL.startsWith('https://')) {
  console.error('Missing or invalid WEB_APP_URL. Must be an https:// URL (your GitHub Pages URL).');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const replyKeyboard = {
  reply_markup: {
    keyboard: [[{ text: 'Open Loop Calculator', web_app: { url: WEB_APP_URL } }]],
    resize_keyboard: true,
    is_persistent: true,
  },
};

async function setMenuButton() {
  try {
    await bot.setChatMenuButton({
      menu_button: JSON.stringify({
        type: 'web_app',
        text: 'Open Calculator',
        web_app: { url: WEB_APP_URL },
      }),
    });
    console.log('Default menu button set to Web App.');
  } catch (err) {
    console.error('Failed to set menu button:', err.message);
  }
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Tap the button below to open the Loop Value Calculator.',
    replyKeyboard
  );
});

bot.on('message', (msg) => {
  if (msg.text && msg.text.startsWith('/')) return; // commands handled elsewhere
  bot.sendMessage(msg.chat.id, 'Tap to open the calculator:', replyKeyboard);
});

bot.on('polling_error', (err) => console.error('polling_error:', err.message));

setMenuButton();
console.log('Bot is running. Press Ctrl+C to stop.');
