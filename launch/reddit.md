# Reddit drafts (not posted)

Best fits: r/chrome, r/privacy, r/ChatGPT, r/ClaudeAI. Read each sub's self-promo rules first. r/privacy and r/chrome usually want the code link up front.

## r/privacy / r/chrome

**Title:** I made a free, open-source extension that shows which of your extensions can read your ChatGPT/Claude chats

**Body:**
After the Urban VPN thing (8M+ installs quietly capturing AI chats) and the fake AI sidebars that hit 900K users, the advice everywhere was "audit your extension permissions". I tried. It's 3 minutes per extension and Chrome doesn't make it easy.

So I built ChatSnitch. Click it and it lists every extension that can read ChatGPT, Claude, Gemini, DeepSeek, Perplexity, Grok, Copilot and a few others, with a plain-English reason and a Turn off button.

One thing I learned building it: `chrome.management` doesn't report content-script access, which is exactly how the sidebar stealers worked. So it also parses Chrome's permission warnings, which do include it.

Trust stuff, since it's an extension that inspects extensions:
- one permission (`management`), no site access
- `connect-src 'none'` in its CSP, so it can't make network requests at all
- under 300 lines of JS: github.com/Swastikkkkk/chatsnitch

Limits: it shows what an extension *can* do, not whether it's actually stealing. Dark mode extensions need all-sites access and show up as low risk.

Not on the Web Store yet (load unpacked for now). Feedback on the risk scoring welcome.

## r/ChatGPT / r/ClaudeAI (shorter)

**Title:** PSA + tool: some Chrome extensions can read every AI chat you've had. Here's how to check yours

**Body:** 3 incidents in the last year (900K, 8M+, 470K+ affected). I built a free open-source checker, no network access, shows which extensions can read chatgpt.com / claude.ai and lets you turn them off. Code: github.com/Swastikkkkk/chatsnitch
