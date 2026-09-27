#!/usr/bin/env node
// Scan a Chromium profile's installed extensions from disk with ChatSnitch's own scoring.
// Read-only. Usage: node tools/scan-profile.mjs [path-to-profile-dir ...]
// With no arguments it looks in the usual Chrome, Edge and Brave locations.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { scan } from "../extension/analyze.js";

const home = os.homedir();
const local = process.env.LOCALAPPDATA || path.join(home, "AppData", "Local");
const roots = {
  Chrome: [path.join(local, "Google/Chrome/User Data"), path.join(home, "Library/Application Support/Google/Chrome"), path.join(home, ".config/google-chrome")],
  Edge: [path.join(local, "Microsoft/Edge/User Data"), path.join(home, "Library/Application Support/Microsoft Edge"), path.join(home, ".config/microsoft-edge")],
  Brave: [path.join(local, "BraveSoftware/Brave-Browser/User Data"), path.join(home, "Library/Application Support/BraveSoftware/Brave-Browser"), path.join(home, ".config/BraveSoftware/Brave-Browser")],
};

const readJSON = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, "")); } catch { return null; } };
const isPattern = (p) => p === "<all_urls>" || /^[a-z*]+:\/\//.test(p);

function resolveName(dir, m) {
  const msg = /^__MSG_(.+)__$/.exec(m.name || "");
  if (!msg) return m.name || "(unnamed)";
  const key = msg[1].toLowerCase();
  for (const loc of [m.default_locale, "en", "en_US"].filter(Boolean)) {
    const msgs = readJSON(path.join(dir, "_locales", loc, "messages.json"));
    if (msgs) for (const [k, v] of Object.entries(msgs)) if (k.toLowerCase() === key) return v.message;
  }
  return m.short_name || m.name;
}

function profileExtensions(profileDir) {
  const extRoot = path.join(profileDir, "Extensions");
  if (!fs.existsSync(extRoot)) return [];
  const prefs = readJSON(path.join(profileDir, "Secure Preferences"))?.extensions?.settings || {};
  const prefs2 = readJSON(path.join(profileDir, "Preferences"))?.extensions?.settings || {};
  const out = [];
  for (const id of fs.readdirSync(extRoot)) {
    const idDir = path.join(extRoot, id);
    if (!fs.statSync(idDir).isDirectory()) continue;
    const versions = fs.readdirSync(idDir).filter((v) => fs.existsSync(path.join(idDir, v, "manifest.json"))).sort();
    if (!versions.length) continue;
    const dir = path.join(idDir, versions.at(-1));
    const m = readJSON(path.join(dir, "manifest.json"));
    if (!m || m.theme) continue;
    const perms = [...(m.permissions || []), ...(m.optional_permissions || [])];
    const hostPermissions = [
      ...(m.host_permissions || []),
      ...perms.filter(isPattern),
      ...(m.content_scripts || []).flatMap((c) => c.matches || []),
    ];
    const st = prefs[id] || prefs2[id] || {};
    const disabled = st.state === 0 || (Array.isArray(st.disable_reasons) ? st.disable_reasons.length > 0 : !!st.disable_reasons);
    out.push({
      id, name: resolveName(dir, m), type: "extension",
      enabled: !disabled,
      installType: st.location === 3 || st.from_webstore === false && st.location === 1 ? "sideload" : "normal",
      permissions: perms.filter((p) => !isPattern(p)),
      hostPermissions,
    });
  }
  return out;
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2).map((p) => ["Custom", p])
  : Object.entries(roots).flatMap(([b, dirs]) => dirs.filter(fs.existsSync).flatMap((d) =>
      fs.readdirSync(d).filter((n) => n === "Default" || /^Profile \d+$/.test(n)).map((n) => [`${b} / ${n}`, path.join(d, n)])));

if (!targets.length) { console.log("No Chrome, Edge or Brave profiles found."); process.exit(0); }
for (const [label, dir] of targets) {
  const exts = profileExtensions(dir);
  const r = scan(exts);
  console.log(`\n${label}: ${r.canRead} of ${r.total} extensions can read AI chats (${r.high} high risk)`);
  for (const x of r.results) {
    console.log(`  ${x.enabled ? " " : "off"} ${x.level.toUpperCase().padEnd(6)} ${x.name}`);
    console.log(`         ${x.allSites ? "all websites" : x.sites.join(", ")} · ${x.reasons.join("; ")}`);
  }
}
