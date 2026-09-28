from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, ListFlowable, ListItem

RED = colors.HexColor("#E5484D"); MUTED = colors.HexColor("#555555")
h1 = ParagraphStyle("h1", fontName="Times-Bold", fontSize=26, leading=30, spaceAfter=4)
sub = ParagraphStyle("sub", fontName="Times-Italic", fontSize=13, leading=17, textColor=MUTED, spaceAfter=10)
h2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=RED, spaceBefore=12, spaceAfter=4, keepWithNext=1)
body = ParagraphStyle("b", fontName="Helvetica", fontSize=10.5, leading=15)
cell = ParagraphStyle("c", parent=body, fontSize=9.5, leading=12.5)

doc = SimpleDocTemplate("ChatSnitch-Project-Description.pdf", pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=18*mm, bottomMargin=16*mm,
                        title="ChatSnitch: Project Description", author="Swastik")
s = [Paragraph("ChatSnitch", h1),
     Paragraph("See which Chrome extensions can read your AI chats", sub),
     Image("/home/user/chatsnitch/.github/assets/social-card.png", width=170*mm, height=85*mm),
     Paragraph("Overview", h2),
     Paragraph("ChatSnitch is a free, open-source Chrome extension (Manifest V3) that shows which of your installed browser extensions "
               "can read your conversations on ChatGPT, Claude, Gemini and other AI chat sites. One click gives a count, a risk level for "
               "each extension, and the reasons in plain words, with Turn off and Remove buttons right in the popup. It works in Chrome, Edge, Brave and other Chromium browsers.", body),
     Paragraph("The problem", h2),
     Paragraph("Extensions keep getting caught reading AI conversations and sending them to third-party servers. Reviewing permissions by hand takes minutes per extension, and most people have around twenty.", body),
     Spacer(1, 4)]
t = Table([[Paragraph(x, cell) for x in r] for r in [
    ["<b>When</b>", "<b>What happened</b>", "<b>Scale</b>"],
    ["Dec 2025", "Two fake AI extensions, one with Google's Featured badge, exfiltrated ChatGPT and DeepSeek chats (OX Security)", "900K users"],
    ["Dec 2025", "Urban VPN Proxy and 7 sister extensions auto-updated into capturing chats on ChatGPT, Claude, Gemini and more (Koi Security)", "8M+ installs"],
    ["Jun 2026", "Smart Sidebar, Chat AI and Urban VPN caught spying on eight AI chat sites (G DATA)", "470K+ users"]]],
    colWidths=[22*mm, 116*mm, 32*mm])
t.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), colors.HexColor("#F1F1F3")), ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#CCCCD2")),
                       ("VALIGN", (0,0), (-1,-1), "TOP"), ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4)]))
s += [t, Paragraph("What you get", h2)]
def bl(items): return ListFlowable([ListItem(Paragraph(i, body), leftIndent=12) for i in items], bulletType="bullet", start="•", leftIndent=12)
s += [bl(["<b>A count</b> of extensions that can see your AI chats right now",
          "<b>A risk level</b> for each: high risk, check this, or low",
          "<b>Plain-word reasons</b>: reads every site, asked for claude.ai by name, reads cookies, watches network traffic, injects code, reads the clipboard, installed by another program",
          "<b>Turn off / Remove</b> in the popup, and Turn back on if you change your mind"]),
      Paragraph("How it decides", h2),
      Paragraph("The scoring lives in <font name='Courier'>extension/analyze.js</font>, about 160 lines with no dependencies.", body), Spacer(1, 3),
      bl(["<b>Collect access.</b> Reads host permissions from <font name='Courier'>chrome.management</font>, and parses Chrome's own permission warnings back into match patterns to catch content-script access. It asks Chrome for its exact wording of \"all websites\" in the user's language, so it works in every UI language.",
          "<b>Match AI sites.</b> Checks Chrome match patterns against each AI chat domain, erring toward flagging.",
          "<b>Score.</b> Named AI domains score higher than \"all sites\". Cookies, webRequest, scripting, debugger, clipboard and native messaging each add risk; sideloaded installs add the most."]),
      Paragraph("Why you can trust it", h2),
      bl(["<b>One permission:</b> <font name='Courier'>management</font>. It lists extensions and can turn them off.",
          "<b>No site access.</b> It cannot read any page, your chats included.",
          "<b>No network.</b> <font name='Courier'>connect-src 'none'</font> in its content security policy.",
          "<b>Small.</b> Under 300 lines of plain JavaScript, no build step, MIT licensed."]),
      Paragraph("Limits and roadmap", h2),
      Paragraph("ChatSnitch shows what an extension is <i>allowed</i> to do, not whether it is actually stealing. No Firefox build yet. "
                "Roadmap: Chrome Web Store listing, Firefox support, an alert when an update adds AI-site access, and a shareable report for IT teams. Multi-language support shipped in v0.2.0.", body),
      Paragraph("Tech and links", h2),
      Paragraph("Extension: plain JavaScript, Manifest V3, 23 unit tests on the analyzer. Landing site: Vite, React, Tailwind, with Supabase for the waitlist and cookieless analytics.<br/>"
                "Website: chatsnitch.vercel.app &nbsp;·&nbsp; Code: github.com/Swastikkkkk/chatsnitch &nbsp;·&nbsp; Built by Swastik", body)]
doc.build(s)
