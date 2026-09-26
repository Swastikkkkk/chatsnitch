# X launch thread (draft, not posted)

Attach brag.mp4 to tweet 1.

**1/4**
that "Read and change all your data on all websites" popup you clicked through?

it includes your ChatGPT and Claude chats.

built ChatSnitch this week. one click, it shows which of your extensions can read them

**2/4**
this isn't hypothetical. extensions caught reading AI chats:

900K users, Dec 2025 (OX Security)
8M+ installs, Dec 2025 (Koi Security)
470K+ users, Jun 2026 (G DATA)

every write-up ends with "check your permissions manually". nobody does

**3/4**
the fun part: Chrome's own management API hides content-script access, which is exactly how the sidebar stealers read your chats

so ChatSnitch also parses Chrome's permission warnings. caught stuff the API alone misses

**4/4**
one permission. no network access at all. under 300 lines of JS you can read in 5 min

free + open source: chatsnitch.vercel.app
code: github.com/Swastikkkkk/chatsnitch

#buildinpublic
