# Loop Calculator — Telegram Mini App

A self-contained HTML calculator for evaluating capital-deployment "loops" by throughput, duration, ROI per cycle, and probability of success. It computes annualized profit and ROI, lets you stress-test the probability assumption, and is wrapped in a Telegram bot that launches it as a Web App from a chat or channel.

- **Live calculator (GitHub Pages):** https://kareemsoliman-code.github.io/loop-calculator/
- **Bot:** [@Loopcalc_bot](https://t.me/Loopcalc_bot)

The HTML page is fully client-side. Loops are stored in a **secret GitHub Gist** so all viewers see the same data; a small `localStorage` cache enables instant render and offline fallback.

## Editing the shared data

Anyone opening the calculator sees the latest data **read-only**. To edit:

1. Click **🔒 Edit mode** in the header.
2. Paste a GitHub PAT with `gist` scope (create one [here](https://github.com/settings/tokens/new?scopes=gist&description=loop-calc)).
3. The token is stored only in your browser's `localStorage` — it never appears in the page source, never goes to GitHub Pages, and is sent only to `api.github.com` over HTTPS.
4. Add/edit/delete loops; each change PATCHes the gist. Other viewers see the update on their next reload.

Click **🔓 Exit edit** to clear the token from your device.

> **Note:** The gist is owned by **kareemsoliman-code**, so only that account's PAT can write. Other accounts' tokens will be rejected. To allow multi-writer setups you'd need a small backend (Supabase, Firebase, Cloudflare Worker, etc.).

---

## Repo layout

```
.
├── index.html          # The calculator (served by GitHub Pages)
├── bot.js              # Long-running Telegram bot (polling)
├── scripts/set-menu.js # One-shot script to set the chat menu button
├── package.json
├── .env.example
└── .gitignore
```

---

## Run the bot locally

You need Node.js 18 or newer.

```bash
git clone https://github.com/kareemsoliman-code/loop-calculator.git
cd loop-calculator
cp .env.example .env
# edit .env and fill in BOT_TOKEN and WEB_APP_URL=https://kareemsoliman-code.github.io/loop-calculator/
npm install
npm start
```

`npm start` connects to Telegram via long polling, sets the bot's default menu button to open the Web App, and replies to every message with a button labeled **Open Loop Calculator**.

### Set the menu button without running the bot

If you only want the persistent menu button (no polling server), run:

```bash
npm run set-menu
```

Or call the Telegram Bot API directly:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{"menu_button":{"type":"web_app","text":"Open Calculator","web_app":{"url":"<WEB_APP_URL>"}}}'
```

---

## Add the bot to a Telegram channel

Telegram **channels** don't support Web App keyboard buttons or chat menu buttons in the same way as private chats — those features are bound to one-on-one chats with the bot. The cleanest UX for a channel is to post a message with a **URL button** that opens the calculator.

1. Open your channel → **Manage Channel** → **Administrators** → **Add Admin**.
2. Search for your bot by `@username` and add it. Grant **Post Messages** permission (uncheck the rest).
3. Post a pinned message with an inline URL button. Easiest: send this from a chat where the bot is admin, or run a one-shot from your machine:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "@your_channel_username",
    "text": "Open the Loop Value Calculator:",
    "reply_markup": {
      "inline_keyboard": [[{"text":"Open Calculator","url":"<WEB_APP_URL>"}]]
    }
  }'
```

4. Pin that message so it stays at the top of the channel.

For a **group** (not a channel), add the bot as a regular member and any user can DM the bot to get the Web App keyboard button.

---

## Update the GitHub Pages site

Edit `index.html`, commit, push to `main`. Pages republishes automatically (usually within ~30 seconds).
