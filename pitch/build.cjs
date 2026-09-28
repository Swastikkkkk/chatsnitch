const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "ChatSnitch: Short Pitch";
pres.author = "Swastik";

const BG = "0A0A0C", CARD = "15161A", FG = "FFFFFF", MUTED = "9A9AA5", RED = "FF5A5F", AMBER = "F5A742", GREEN = "4ADE80";
const H = "Cambria", B = "Calibri";
const ASSETS = "/home/user/chatsnitch/";

function base(n, notes) {
  const s = pres.addSlide();
  s.background = { color: BG };
  if (n) s.addText(`ChatSnitch  ·  ${n}/6`, { x: 0.5, y: 5.15, w: 5, h: 0.3, fontFace: B, fontSize: 10, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes(notes);
  return s;
}
function title(s, t) {
  s.addText(t, { x: 0.5, y: 0.4, w: 9, h: 0.9, fontFace: H, fontSize: 32, bold: true, color: FG, margin: 0, valign: "top", isTextBox: true });
}

// 1. Title
let s = base(0, "ChatSnitch tells you, in one click, which of your Chrome extensions can read your AI chats.");
s.addImage({ path: ASSETS + "store/screenshot-1.png", x: 4.9, y: 0.35, w: 4.9, h: 3.06, sizing: { type: "cover", w: 4.9, h: 3.06 } });
s.addText("SHORT PITCH", { x: 0.5, y: 0.5, w: 4, h: 0.3, fontFace: B, fontSize: 12, bold: true, charSpacing: 4, color: RED, margin: 0, isTextBox: true });
s.addText("ChatSnitch", { x: 0.5, y: 1.0, w: 4.3, h: 0.9, fontFace: H, fontSize: 48, bold: true, color: FG, margin: 0, isTextBox: true });
s.addText("See which Chrome extensions can read your AI chats", { x: 0.5, y: 2.0, w: 4.2, h: 1.1, fontFace: H, fontSize: 22, color: MUTED, margin: 0, valign: "top", isTextBox: true });
["Free", "Open source", "1 permission"].forEach((t, i) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5 + i * 1.5, y: 3.5, w: 1.35, h: 0.4, fill: { color: CARD }, line: { color: "33343B", width: 1 }, rectRadius: 0.2 });
  s.addText(t, { x: 0.5 + i * 1.5, y: 3.5, w: 1.35, h: 0.4, fontFace: B, fontSize: 12, color: FG, align: "center", valign: "middle", margin: 0, isTextBox: true });
});
s.addText("Swastik  ·  github.com/Swastikkkkk/chatsnitch", { x: 0.5, y: 4.85, w: 9, h: 0.3, fontFace: B, fontSize: 12, color: MUTED, margin: 0, isTextBox: true });

// 2. Problem
s = base(2, "Every report ends with 'review your extension permissions'. Nobody does, because it takes minutes per extension and most people have twenty.");
title(s, "Extensions caught reading chats");
const stats = [
  ["900K", "users hit by two fake AI extensions, one with Google's Featured badge", "Dec 2025"],
  ["8M+", "installs of Urban VPN and 7 sister extensions that auto-updated into chat capture", "Dec 2025"],
  ["470K+", "users of extensions caught spying on eight AI chat sites", "Jun 2026"],
];
stats.forEach(([n, d, w], i) => {
  const x = 0.5 + i * 3.05;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 2.85, h: 2.5, fill: { color: CARD }, line: { color: "26272D", width: 1 }, rectRadius: 0.12 });
  s.addText(n, { x: x + 0.25, y: 1.75, w: 2.4, h: 0.9, fontFace: H, fontSize: 44, bold: true, color: RED, margin: 0, isTextBox: true });
  s.addText(d, { x: x + 0.25, y: 2.65, w: 2.4, h: 1.1, fontFace: B, fontSize: 14, color: FG, margin: 0, valign: "top", isTextBox: true });
  s.addText(w, { x: x + 0.25, y: 3.75, w: 2.4, h: 0.25, fontFace: B, fontSize: 11, color: MUTED, margin: 0, isTextBox: true });
});
s.addText("The advice is \"check your permissions\". That is minutes per extension, and most people have twenty.", { x: 0.5, y: 4.4, w: 9, h: 0.5, fontFace: B, fontSize: 16, italic: true, color: MUTED, margin: 0, isTextBox: true });

// 3. Solution
s = base(3, "One click. A count, a risk level per extension, plain-word reasons, and a Turn off button right there.");
title(s, "One click. Plain answers.");
const feats = [
  ["A count", "of extensions that can see your AI chats right now"],
  ["A risk level", "High risk, check this, or low, for each one"],
  ["Reasons in plain words", "reads every site, reads your cookies, injects code, watches traffic"],
  ["Turn off or Remove", "right in the popup, and turn back on if you change your mind"],
];
feats.forEach(([h, d], i) => {
  const y = 1.5 + i * 0.85;
  s.addShape(pres.shapes.OVAL, { x: 0.5, y: y + 0.05, w: 0.4, h: 0.4, fill: { color: RED } });
  s.addText(String(i + 1), { x: 0.5, y: y + 0.05, w: 0.4, h: 0.4, fontFace: B, fontSize: 14, bold: true, color: BG, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText(h, { x: 1.1, y, w: 3.4, h: 0.3, fontFace: B, fontSize: 16, bold: true, color: FG, margin: 0, isTextBox: true });
  s.addText(d, { x: 1.1, y: y + 0.3, w: 3.4, h: 0.45, fontFace: B, fontSize: 12, color: MUTED, margin: 0, valign: "top", isTextBox: true });
});
s.addImage({ path: ASSETS + "store/screenshot-1.png", x: 4.75, y: 1.4, w: 4.75, h: 2.97, sizing: { type: "cover", w: 4.75, h: 2.97 } });
s.addText("Covers ChatGPT, Claude, Gemini, Copilot, DeepSeek, Perplexity, Grok, Meta AI, Mistral and Poe.", { x: 4.75, y: 4.45, w: 4.75, h: 0.5, fontFace: B, fontSize: 11, color: MUTED, margin: 0, valign: "top", isTextBox: true });

// 4. How it works
s = base(4, "The scoring is about 160 lines in extension/analyze.js. Named AI domains score higher than all sites, because a sidebar asking for chatgpt.com by name is the stealer pattern.");
title(s, "How it decides");
const steps = [
  ["Collect access", "Reads host permissions from chrome.management, plus content-script access parsed from Chrome's own permission warnings, in any UI language."],
  ["Match AI sites", "Checks Chrome match patterns against each AI chat domain. Errs toward flagging."],
  ["Score", "Named AI domains outrank \"all sites\". Cookies, webRequest, scripting, debugger, clipboard and sideloading each add risk."],
];
steps.forEach(([h, d], i) => {
  const x = 0.5 + i * 3.05;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.55, w: 2.85, h: 2.8, fill: { color: CARD }, line: { color: "26272D", width: 1 }, rectRadius: 0.12 });
  s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: 1.8, w: 0.5, h: 0.5, fill: { color: RED } });
  s.addText(String(i + 1), { x: x + 0.25, y: 1.8, w: 0.5, h: 0.5, fontFace: H, fontSize: 18, bold: true, color: BG, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText(h, { x: x + 0.25, y: 2.5, w: 2.4, h: 0.4, fontFace: B, fontSize: 18, bold: true, color: FG, margin: 0, isTextBox: true });
  s.addText(d, { x: x + 0.25, y: 2.95, w: 2.4, h: 1.2, fontFace: B, fontSize: 12, color: MUTED, margin: 0, valign: "top", isTextBox: true });
});
[["High risk", RED], ["Check this", AMBER], ["Low", GREEN]].forEach(([t, c], i) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5 + i * 1.6, y: 4.45, w: 1.4, h: 0.38, fill: { color: c, transparency: 82 }, line: { color: c, width: 1 }, rectRadius: 0.19 });
  s.addText(t, { x: 0.5 + i * 1.6, y: 4.45, w: 1.4, h: 0.38, fontFace: B, fontSize: 12, bold: true, color: c, align: "center", valign: "middle", margin: 0, isTextBox: true });
});

// 5. Trust
s = base(5, "An extension that inspects your extensions should be the most boring one you install. Verified in a real Chromium with five decoy extensions.");
title(s, "The most boring extension");
const trust = [
  ["1", "permission", "Only management: lists extensions and can turn them off."],
  ["0", "site access", "It can't read any page, your chats included."],
  ["0", "network", "connect-src 'none'. It can't phone home."],
  ["<300", "lines of JS", "Plain JavaScript, no build step. Read it first."],
];
trust.forEach(([n, l, d], i) => {
  const x = 0.5 + (i % 2) * 4.6, y = 1.5 + Math.floor(i / 2) * 1.75;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.4, h: 1.55, fill: { color: CARD }, line: { color: "26272D", width: 1 }, rectRadius: 0.12 });
  s.addText(n, { x: x + 0.25, y: y + 0.2, w: 1.6, h: 0.8, fontFace: H, fontSize: 32, bold: true, color: RED, margin: 0, isTextBox: true });
  s.addText(l, { x: x + 0.25, y: y + 1.0, w: 1.6, h: 0.35, fontFace: B, fontSize: 13, bold: true, color: FG, margin: 0, isTextBox: true });
  s.addText(d, { x: x + 1.9, y: y + 0.25, w: 2.3, h: 1.05, fontFace: B, fontSize: 14, color: MUTED, margin: 0, valign: "middle", isTextBox: true });
});

// 6. Roadmap & close
s = base(6, "Ask: install it, star the repo, help with Firefox or the update alert.");
s.addText("Next", { x: 0.5, y: 0.4, w: 4, h: 0.9, fontFace: H, fontSize: 34, bold: true, color: FG, margin: 0, isTextBox: true });
const road = [["Chrome Web Store listing", "in progress"], ["Every Chrome UI language", "done, v0.2.0"], ["Firefox build", "planned"], ["Alert when an update adds AI-site access", "planned"], ["Shareable report for IT teams", "planned"]];
road.forEach(([t, st], i) => {
  const y = 1.4 + i * 0.68, done = st.startsWith("done");
  s.addShape(pres.shapes.OVAL, { x: 0.5, y: y + 0.05, w: 0.3, h: 0.3, fill: { color: done ? GREEN : CARD }, line: { color: done ? GREEN : "55565E", width: 1.5 } });
  s.addText(t, { x: 1.0, y, w: 3.9, h: 0.4, fontFace: B, fontSize: 15, color: FG, margin: 0, valign: "middle", isTextBox: true });
  s.addText(st, { x: 4.9, y, w: 1.4, h: 0.4, fontFace: B, fontSize: 12, color: done ? GREEN : MUTED, margin: 0, valign: "middle", isTextBox: true });
});
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.6, y: 1.4, w: 2.9, h: 3.3, fill: { color: CARD }, line: { color: RED, width: 1.5 }, rectRadius: 0.12 });
s.addText("Try it now", { x: 6.85, y: 1.6, w: 2.4, h: 0.4, fontFace: H, fontSize: 20, bold: true, color: FG, margin: 0, isTextBox: true });
s.addText("chatsnitch.vercel.app", { x: 6.85, y: 2.15, w: 2.5, h: 0.4, fontFace: B, fontSize: 12, bold: true, color: RED, margin: 0, isTextBox: true, hyperlink: { url: "https://chatsnitch.vercel.app/?ref=github" } });
s.addText("github.com/Swastikkkkk/chatsnitch", { x: 6.85, y: 2.65, w: 2.4, h: 0.6, fontFace: B, fontSize: 12, color: MUTED, margin: 0, valign: "top", isTextBox: true });
s.addText("You clicked Allow. Now see what it reads.", { x: 6.85, y: 3.5, w: 2.4, h: 0.9, fontFace: H, fontSize: 15, italic: true, color: FG, margin: 0, valign: "top", isTextBox: true });

pres.writeFile({ fileName: "ChatSnitch-Short-Pitch.pptx" }).then(() => console.log("ok"));
