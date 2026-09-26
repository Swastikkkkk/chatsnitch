# ChatSnitch

See which of your Chrome extensions can read your AI chats.

Security researchers keep catching extensions that copy ChatGPT, Claude and Gemini conversations to someone else's server: 900K users in December 2025 (OX Security), 8M+ installs the same month (Koi Security), another 470K+ in June 2026 (G DATA). Every write-up ends with "review your extension permissions". ChatSnitch does that review in one click.

## What it does

Click the icon and it lists every installed extension that can read ChatGPT, Claude, Gemini, Copilot, DeepSeek, Perplexity, Grok, Meta AI, Mistral or Poe, with:

- **Risk level**: high, check this, or low, with the reasons spelled out
- **Why**: reads every site or asks for AI sites by name, reads cookies, watches network traffic, injects code, reads the clipboard, was installed by another program
- **Turn off / Remove** buttons right there

It catches content-script access too. `chrome.management` leaves that out, and it's exactly how the AI-sidebar stealers read chats, so ChatSnitch also parses Chrome's own permission warnings.

## Why you can trust it

- One permission: `management`. No site access.
- `connect-src 'none'` in its CSP. It cannot make network requests.
- Under 300 lines of plain JS in `extension/`. No build step, no dependencies.

## Install (until it's on the Web Store)

1. Download this repo and unzip it.
2. Open `chrome://extensions`, turn on **Developer mode**.
3. **Load unpacked** and pick the `extension` folder.

Works in Chrome, Edge and Brave.

## Repo layout

| Path | What |
|---|---|
| `extension/` | The extension. `analyze.js` is the scoring logic, `popup.*` is the UI. |
| `tests/` | `npm test`: 19 tests on real Chrome warning strings and scoring. |
| `web/` | Landing site (live at https://chatsnitch.vercel.app): Vite, React, Tailwind, GSAP, Aceternity UI, React Bits. Waitlist + cookieless analytics on Supabase. |
| `supabase/migrations/` | Shared "launchpad" schema used by every launch site. |
| `brag-output/` | Launch video (`brag.mp4`), poster, plan, share copy. |
| `launch/` | X thread, Reddit posts and reel script drafts. |

## Develop

```bash
npm test                  # extension logic
cd web && npm install
cp .env.example .env      # fill in Supabase URL + publishable key
npm run dev
```

## How it was verified

Loaded into a real Chromium next to five decoy extensions (a "Free VPN" with cookies and webRequest, an AI sidebar that reads chatgpt.com/claude.ai via content scripts, a grammar tool, a dark mode, a tab counter). It flagged the four that can read AI chats, left the tab counter alone, and Turn off disabled the VPN.

## Limits

- Shows what an extension is *allowed* to do, not whether it's stealing.
- Site access you restricted to "On click" still shows as granted.
- Hidden all-sites access is parsed from Chrome's English wording. Named domains work in any language.
- No Firefox yet.

MIT licensed.
