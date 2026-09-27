# ChatSnitch store submission kit

Everything needed for the Chrome Web Store and Microsoft Edge Add-ons. Copy and paste.

Package: `chatsnitch.zip` from the latest GitHub release (manifest v3, version in manifest.json).

## Store listing

**Name:** ChatSnitch: who can read your AI chats

**Summary (132 chars max):**
See which of your extensions can read ChatGPT, Claude and Gemini chats. One permission, no network access, open source.

**Category:** Privacy & Security (Chrome: "Privacy & Security" / Edge: "Privacy and security")

**Language:** English

**Description:**
Some Chrome extensions have been caught copying people's AI conversations to their own servers: 900K users in December 2025, 8M+ installs the same month, another 470K+ in June 2026. The usual advice is "review your extension permissions", which takes minutes per extension.

ChatSnitch does it in one click.

What you get:
• How many of your extensions can read your AI chats right now
• A risk level for each: high risk, check this, or low
• The reasons in plain words: reads every site, asked for claude.ai by name, reads your cookies, watches network traffic, injects code, reads your clipboard, installed by another program
• Turn off or Remove right there, and Turn back on any time

Covers ChatGPT, Claude, Gemini, Copilot, DeepSeek, Perplexity, Grok, Meta AI, Mistral and Poe. Works in every Chrome language.

It also catches access that Chrome's own extension API doesn't report (content scripts), which is how the AI-sidebar stealers read chats.

Built to be trusted:
• One permission: "management". No access to any website.
• No network access at all, enforced in its security policy.
• No data collected. Nothing leaves your browser.
• Open source, under 300 lines: https://github.com/Swastikkkkk/chatsnitch

ChatSnitch shows what an extension is allowed to do, not whether it is misusing that access. A dark-mode extension needs all-sites access to work, so those show as low risk.

**Website:** https://chatsnitch.vercel.app
**Support URL:** https://github.com/Swastikkkkk/chatsnitch/issues

## Images (in this folder)
- Icon 128×128: `extension/icons/128.png`
- Screenshots 1280×800: `screenshot-1.png`, `screenshot-2.png`, `screenshot-3.png`
- Small promo tile 440×280: `promo-small-440x280.png`
- Marquee 1400×560 (optional): `promo-marquee-1400x560.png`

## Privacy practices tab (Chrome) / Privacy (Edge)

**Single purpose:**
Show the user which of their installed extensions can access AI chat websites, explain why in plain language, and let them turn those extensions off.

**Permission justification, `management`:**
Needed to list the user's installed extensions, read their declared permissions and permission warnings to determine which can access AI chat sites, and to disable, re-enable or uninstall an extension when the user clicks the button to do so. This is the extension's only permission.

**Remote code:** No, I am not using remote code. All code is packaged; the content security policy sets `script-src 'self'` and `connect-src 'none'`.

**Data usage:** Does not collect any of the listed data types. (Leave every box unchecked.)
Certify all three:
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** https://github.com/Swastikkkkk/chatsnitch/blob/main/PRIVACY.md

## Distribution
Visibility: Public. Regions: All. Price: Free.

## Steps
**Chrome Web Store** (one-time US$5 registration, your Google account):
1. https://chrome.google.com/webstore/devconsole → register, pay the fee, verify your email.
2. New item → upload `chatsnitch.zip`.
3. Paste the fields above into Store listing and Privacy practices, upload the images.
4. Submit for review. Review usually takes from a few days to a couple of weeks.

**Microsoft Edge Add-ons** (free, your Microsoft account):
1. https://partner.microsoft.com/dashboard/microsoftedge → enroll (no fee).
2. Create new extension → upload the same `chatsnitch.zip`.
3. Same listing text, images and privacy answers.
4. Submit.
