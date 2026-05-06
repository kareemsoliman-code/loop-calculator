// One-shot script: sets the bot's default menu button to a Web App.
// Use this if you don't want to keep bot.js running. Requires BOT_TOKEN and WEB_APP_URL.
//
//   node scripts/set-menu.js
//
// Or directly with curl:
//   curl -X POST "https://api.telegram.org/bot<TOKEN>/setChatMenuButton" \
//     -H "Content-Type: application/json" \
//     -d '{"menu_button":{"type":"web_app","text":"Open Calculator","web_app":{"url":"<URL>"}}}'

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

if (!BOT_TOKEN || !WEB_APP_URL) {
  console.error('Missing BOT_TOKEN or WEB_APP_URL in env.');
  process.exit(1);
}

(async () => {
  const body = {
    menu_button: {
      type: 'web_app',
      text: 'Open Calculator',
      web_app: { url: WEB_APP_URL },
    },
  };
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
  if (!json.ok) process.exit(1);
})();
