// ChatSnitch core logic. Pure functions, no chrome.* calls, so it runs in Node tests too.

export const AI_SITES = [
  { name: "ChatGPT", hosts: ["chatgpt.com", "chat.openai.com"] },
  { name: "Claude", hosts: ["claude.ai"] },
  { name: "Gemini", hosts: ["gemini.google.com"] },
  { name: "Copilot", hosts: ["copilot.microsoft.com"] },
  { name: "DeepSeek", hosts: ["chat.deepseek.com"] },
  { name: "Perplexity", hosts: ["www.perplexity.ai", "perplexity.ai"] },
  { name: "Grok", hosts: ["grok.com"] },
  { name: "Meta AI", hosts: ["www.meta.ai", "meta.ai"] },
  { name: "Mistral", hosts: ["chat.mistral.ai"] },
  { name: "Poe", hosts: ["poe.com"] },
];

// Permissions that make site access more dangerous: they let an extension
// watch traffic, pull cookies, inject code at will, or talk to local programs.
export const DANGEROUS_PERMISSIONS = {
  webRequest: "can watch network requests",
  webRequestBlocking: "can intercept network requests",
  declarativeNetRequestWithHostAccess: "can rewrite requests",
  cookies: "can read your login cookies",
  scripting: "can inject code into pages",
  debugger: "can attach a debugger to tabs",
  nativeMessaging: "can talk to programs on your computer",
  clipboardRead: "can read your clipboard",
  history: "can read your browsing history",
};

const ALL_URL_PATTERNS = new Set(["<all_urls>", "*://*/*", "http://*/*", "https://*/*"]);

// Chrome match pattern: <scheme>://<host><path>. See developer.chrome.com/docs/extensions/develop/concepts/match-patterns
export function patternMatchesHost(pattern, host) {
  if (ALL_URL_PATTERNS.has(pattern)) return true;
  const m = /^(\*|https?|wss?|file|ftp):\/\/([^/]*)(\/.*)?$/.exec(pattern);
  if (!m) return false;
  const [, scheme, patHost] = m;
  if (scheme === "file" || scheme === "ftp") return false;
  if (patHost === "*") return true;
  if (patHost.startsWith("*.")) {
    const base = patHost.slice(2);
    return host === base || host.endsWith("." + base);
  }
  return patHost === host;
}

export function isAllSites(pattern) {
  if (ALL_URL_PATTERNS.has(pattern)) return true;
  const m = /^(\*|https?):\/\/\*\//.exec(pattern);
  return Boolean(m);
}

// chrome.management.hostPermissions leaves out content-script access, which is exactly
// how the AI-chat stealers worked. Chrome's permission warnings do include it, so we
// turn those strings back into match patterns. Domain names are locale independent;
// The "all websites" / "a number of websites" phrases are language dependent, so the
// popup asks Chrome for the exact localized wording at runtime (see popup.js) and
// passes it in as `phrases`. The English patterns stay as a fallback.
const DOMAIN = /\b((?:[a-z0-9-]+\.)+[a-z]{2,})\b/gi;

export function hostsFromWarnings(warnings = [], phrases = {}) {
  const all = new Set(phrases.all || []);
  const many = new Set(phrases.many || []);
  const patterns = new Set();
  let unnamed = false;
  for (const w of warnings) {
    if (all.has(w) || /\bon all websites\b/i.test(w)) {
      patterns.add("<all_urls>");
      continue;
    }
    if (many.has(w) || /a number of websites/i.test(w)) { unnamed = true; continue; }
    // No keyword filter here: warning text is localized, domain names are not.
    for (const m of w.matchAll(DOMAIN)) {
      // Treat each named domain as covering its subdomains too. This errs on the side
      // of flagging (google.com -> Gemini), which is the right way to be wrong here.
      patterns.add(`*://*.${m[1].toLowerCase()}/*`);
    }
  }
  return { patterns: [...patterns], unnamed };
}

// Which AI sites can one extension read?
export function aiSitesFor(hostPermissions = []) {
  const hits = [];
  for (const site of AI_SITES) {
    if (site.hosts.some((h) => hostPermissions.some((p) => patternMatchesHost(p, h)))) {
      hits.push(site.name);
    }
  }
  return hits;
}

// Score one extension. Returns null when it cannot touch any AI chat site.
export function assess(ext, phrases = {}) {
  const fromWarnings = hostsFromWarnings(ext.warnings || [], phrases);
  const hostPermissions = [...(ext.hostPermissions || []), ...fromWarnings.patterns];
  const permissions = ext.permissions || [];
  const sites = aiSitesFor(hostPermissions);

  if (sites.length === 0 && fromWarnings.unnamed) {
    // Chrome only says "a number of websites". Could include AI chats, can't tell which.
    return {
      id: ext.id, name: ext.name, enabled: ext.enabled !== false,
      mayDisable: ext.mayDisable !== false, installType: ext.installType || "normal",
      sites: ["Several sites"], allSites: false, level: "medium", score: 3,
      reasons: ["can read a list of sites Chrome won't name here, open its Details page to check"],
    };
  }
  if (sites.length === 0) return null;

  const allSites = hostPermissions.some(isAllSites);
  const targeted = !allSites; // asked for AI chat domains by name
  const dangers = permissions
    .filter((p) => p in DANGEROUS_PERMISSIONS)
    .map((p) => DANGEROUS_PERMISSIONS[p]);

  const reasons = [];
  if (allSites) reasons.push("can read every website you open, AI chats included");
  if (targeted) reasons.push(`asked for access to ${sites.join(", ")} by name`);
  reasons.push(...dangers);
  if (ext.installType === "sideload") reasons.push("was installed by another program, not by you");

  // Scoring is deliberately simple so the user can see why.
  let score = allSites ? 2 : 3; // targeting AI sites by name is more suspicious than a generic all-sites tool
  score += Math.min(dangers.length, 3);
  if (ext.installType === "sideload") score += 3; // installed silently by other software: classic adware

  const level = score >= 5 ? "high" : score >= 3 ? "medium" : "low";

  return {
    id: ext.id,
    name: ext.name,
    enabled: ext.enabled !== false,
    mayDisable: ext.mayDisable !== false,
    installType: ext.installType || "normal",
    sites,
    allSites,
    level,
    score,
    reasons,
  };
}

// Run over the whole list from chrome.management.getAll().
export function scan(extensions, selfId = null, phrases = {}) {
  const results = [];
  for (const ext of extensions) {
    if (ext.id === selfId) continue;
    if (ext.type && ext.type !== "extension") continue; // themes, apps
    const r = assess(ext, phrases);
    if (r) results.push(r);
  }
  const order = { high: 0, medium: 1, low: 2 };
  results.sort(
    (a, b) =>
      Number(b.enabled) - Number(a.enabled) ||
      order[a.level] - order[b.level] ||
      b.score - a.score ||
      a.name.localeCompare(b.name)
  );
  const active = results.filter((r) => r.enabled);
  return {
    total: extensions.filter((e) => e.id !== selfId && (!e.type || e.type === "extension")).length,
    canRead: active.length,
    high: active.filter((r) => r.level === "high").length,
    results,
  };
}
