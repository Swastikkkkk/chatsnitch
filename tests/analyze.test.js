import { test } from "node:test";
import assert from "node:assert/strict";
import { patternMatchesHost, isAllSites, aiSitesFor, assess, scan } from "../extension/analyze.js";

test("all-urls patterns match every AI host", () => {
  for (const p of ["<all_urls>", "*://*/*", "https://*/*", "http://*/*"]) {
    assert.ok(patternMatchesHost(p, "claude.ai"), p);
  }
});

test("wildcard subdomains match base and subdomains", () => {
  assert.ok(patternMatchesHost("*://*.openai.com/*", "chat.openai.com"));
  assert.ok(patternMatchesHost("*://*.openai.com/*", "openai.com"));
  assert.ok(!patternMatchesHost("*://*.openai.com/*", "notopenai.com"));
});

test("exact host patterns only match that host", () => {
  assert.ok(patternMatchesHost("https://chatgpt.com/*", "chatgpt.com"));
  assert.ok(!patternMatchesHost("https://chatgpt.com/*", "claude.ai"));
});

test("file and ftp patterns never match AI sites", () => {
  assert.ok(!patternMatchesHost("file:///*", "claude.ai"));
  assert.ok(!patternMatchesHost("ftp://*/*", "claude.ai"));
});

test("isAllSites spots broad access", () => {
  assert.ok(isAllSites("<all_urls>"));
  assert.ok(isAllSites("https://*/*"));
  assert.ok(!isAllSites("https://*.google.com/*"));
});

test("aiSitesFor lists the right products", () => {
  assert.deepEqual(aiSitesFor(["https://claude.ai/*", "https://chatgpt.com/*"]), ["ChatGPT", "Claude"]);
  assert.equal(aiSitesFor(["<all_urls>"]).length, 10);
  assert.deepEqual(aiSitesFor(["https://github.com/*"]), []);
});

test("google-wide access catches Gemini", () => {
  assert.deepEqual(aiSitesFor(["*://*.google.com/*"]), ["Gemini"]);
});

test("extension with no AI access is ignored", () => {
  assert.equal(assess({ id: "a", name: "Tabs", permissions: ["tabs"], hostPermissions: [] }), null);
});

test("free VPN with everything is high risk", () => {
  const r = assess({
    id: "v", name: "Free VPN", hostPermissions: ["<all_urls>"],
    permissions: ["webRequest", "cookies", "scripting", "storage"],
  });
  assert.equal(r.level, "high");
  assert.ok(r.allSites);
  assert.ok(r.reasons.some((x) => x.includes("cookies")));
});

test("extension asking for AI sites by name is flagged even without extras", () => {
  const r = assess({ id: "s", name: "AI Sidebar", hostPermissions: ["https://chatgpt.com/*", "https://claude.ai/*"], permissions: [] });
  assert.equal(r.level, "medium");
  assert.ok(r.reasons[0].includes("by name"));
});

test("plain all-sites extension with no extras is low", () => {
  const r = assess({ id: "d", name: "Dark theme", hostPermissions: ["<all_urls>"], permissions: ["storage"] });
  assert.equal(r.level, "low");
});

test("sideloaded extensions get bumped up", () => {
  const r = assess({ id: "x", name: "Helper", hostPermissions: ["<all_urls>"], permissions: [], installType: "sideload" });
  assert.equal(r.level, "high");
  assert.ok(r.reasons.some((x) => x.includes("another program")));
});

test("scan skips itself and themes, sorts enabled high risk first", () => {
  const report = scan(
    [
      { id: "self", name: "ChatSnitch", hostPermissions: ["<all_urls>"] },
      { id: "t", name: "Theme", type: "theme", hostPermissions: ["<all_urls>"] },
      { id: "low", name: "Dark", hostPermissions: ["<all_urls>"], permissions: [] },
      { id: "hi", name: "VPN", hostPermissions: ["<all_urls>"], permissions: ["webRequest", "cookies", "scripting"] },
      { id: "off", name: "Old", enabled: false, hostPermissions: ["<all_urls>"], permissions: ["cookies", "webRequest", "scripting"] },
      { id: "safe", name: "Tabs", permissions: ["tabs"], hostPermissions: [] },
    ],
    "self"
  );
  assert.equal(report.total, 4);
  assert.equal(report.canRead, 2);
  assert.equal(report.high, 1);
  assert.deepEqual(report.results.map((r) => r.id), ["hi", "low", "off"]);
});

// Real strings captured from Chromium 141's getPermissionWarningsById.
import { hostsFromWarnings } from "../extension/analyze.js";

test("warnings: all websites", () => {
  assert.deepEqual(hostsFromWarnings(["Read and change all your data on all websites"]).patterns, ["<all_urls>"]);
});

test("warnings: named domains become patterns (content-script stealer case)", () => {
  const { patterns } = hostsFromWarnings(["Read and change your data on chatgpt.com, claude.ai, and gemini.google.com"]);
  assert.deepEqual(aiSitesFor(patterns), ["ChatGPT", "Claude", "Gemini"]);
});

test("warnings: all google.com sites catches Gemini", () => {
  const { patterns } = hostsFromWarnings(["Read and change your data on all google.com sites"]);
  assert.deepEqual(aiSitesFor(patterns), ["Gemini"]);
});

test("warnings: unrelated warnings add nothing", () => {
  const r = hostsFromWarnings(["Read your browsing history", "Read data you copy and paste", "Manage your downloads"]);
  assert.deepEqual(r, { patterns: [], unnamed: false });
});

test("content-script-only sidebar is caught via warnings", () => {
  const r = assess({
    id: "s", name: "AI Sidebar", hostPermissions: [], permissions: ["scripting", "storage"],
    warnings: ["Read and change your data on chatgpt.com, claude.ai, and gemini.google.com"],
  });
  assert.ok(r);
  assert.deepEqual(r.sites, ["ChatGPT", "Claude", "Gemini"]);
  assert.equal(r.allSites, false);
});

test("'a number of websites' with no named AI host is flagged as unknown", () => {
  const r = assess({ id: "m", name: "Many", hostPermissions: [], permissions: [], warnings: ["Read and change your data on a number of websites"] });
  assert.equal(r.level, "medium");
  assert.deepEqual(r.sites, ["Several sites"]);
});

// Localized phrases, as returned by getPermissionWarningsByManifest (captured from Chromium in de / hi).
test("localized all-websites phrase (German) is caught when passed in", () => {
  const de = "Alle deine Daten auf allen Websites lesen und ändern";
  const phrases = { all: [de], many: [] };
  assert.deepEqual(hostsFromWarnings([de], phrases).patterns, ["<all_urls>"]);
  const r = assess({ id: "d", name: "Dunkelmodus", hostPermissions: [], permissions: [], warnings: [de] }, phrases);
  assert.ok(r && r.allSites);
});

test("localized 'a number of websites' phrase is caught when passed in", () => {
  const hi = "कई वेबसाइटों पर अपना डेटा पढ़ें और बदलें";
  const r = assess({ id: "m", name: "Many", hostPermissions: [], permissions: [], warnings: [hi] }, { all: [], many: [hi] });
  assert.deepEqual(r.sites, ["Several sites"]);
});

test("without phrases, a non-English all-sites warning is not guessed", () => {
  const de = "Alle deine Daten auf allen Websites lesen und ändern";
  assert.equal(assess({ id: "d", name: "x", hostPermissions: [], permissions: [], warnings: [de] }), null);
});

// Real strings captured from Chromium running in German, Hindi and French.
test("named AI domains are caught in any UI language", () => {
  for (const w of [
    "Eigene Daten auf chatgpt.com, claude.ai und gemini.google.com lesen und ändern",
    "Accéder aux données de chatgpt.com, claude.ai et gemini.google.com, et les modifier",
  ]) {
    assert.deepEqual(aiSitesFor(hostsFromWarnings([w]).patterns), ["ChatGPT", "Claude", "Gemini"], w);
  }
});
