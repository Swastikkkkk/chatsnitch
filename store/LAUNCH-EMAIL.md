# Waitlist launch email

Send once, when ChatSnitch is live on the Chrome Web Store (or Edge Add-ons).

## How it's sent
Tell Claude "send the ChatSnitch launch email". It will:
1. Read `waitlist_pending` in the launchpad Supabase project (slug `chatsnitch`).
2. Send one individual email per address from your connected Gmail. Never CC or BCC a list.
3. Set `notified_at` on each row right after its email goes out, so a re-run never double-sends.
4. Report how many went out, and any that bounced.

For more than ~300 people, switch to a proper sender (Resend or Postmark) to stay within Gmail's daily limits and keep deliverability.

## Email

**Subject:** ChatSnitch is on the Chrome Web Store

**Body:**

Hi,

You asked to hear when ChatSnitch was on the Chrome Web Store. It is now:

{{STORE_URL}}

One click to install, no Developer mode needed. Open it and you'll see which of your extensions can read your ChatGPT, Claude and Gemini chats, with a Turn off button for each.

Same as before: one permission, no network access, open source.

That's the one email I promised. You won't hear from me again unless you star or follow the repo:
https://github.com/Swastikkkkk/chatsnitch

Thanks for waiting,
Swastik
