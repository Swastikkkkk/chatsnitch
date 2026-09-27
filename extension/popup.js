import { scan } from "./analyze.js";

const $ = (s) => document.querySelector(s);

async function getAll() {
  const all = await new Promise((resolve) => chrome.management.getAll(resolve));
  // Warnings reveal content-script access that hostPermissions leaves out.
  await Promise.all(
    all.map(
      (ext) =>
        new Promise((resolve) =>
          chrome.management.getPermissionWarningsById(ext.id, (w) => {
            ext.warnings = chrome.runtime.lastError ? [] : w || [];
            resolve();
          })
        )
    )
  );
  return all;
}

function renderCard(r, onChange) {
  const node = $("#card").content.firstElementChild.cloneNode(true);
  node.querySelector(".name").textContent = r.name;
  const badge = node.querySelector(".badge");
  badge.textContent = r.level === "high" ? "High risk" : r.level === "medium" ? "Check this" : "Low";
  badge.classList.add(r.level);
  node.classList.add("lvl-" + r.level);

  const sites = node.querySelector(".sites");
  const shown = r.allSites ? ["All websites"] : r.sites;
  for (const s of shown) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = s;
    sites.append(chip);
  }

  const reasons = node.querySelector(".reasons");
  for (const reason of r.reasons) {
    const li = document.createElement("li");
    li.textContent = reason;
    reasons.append(li);
  }

  const disable = node.querySelector(".disable");
  const remove = node.querySelector(".remove");
  const enable = node.querySelector(".enable");

  if (!r.enabled) {
    node.classList.add("off");
    disable.hidden = true;
    enable.hidden = false;
  }
  if (!r.mayDisable) {
    disable.hidden = true;
    remove.hidden = true;
    enable.hidden = true;
    const li = document.createElement("li");
    li.textContent = "managed by your organisation, can't be turned off here";
    reasons.append(li);
  }

  disable.addEventListener("click", () => chrome.management.setEnabled(r.id, false, onChange));
  enable.addEventListener("click", () => chrome.management.setEnabled(r.id, true, onChange));
  remove.addEventListener("click", () =>
    chrome.management.uninstall(r.id, { showConfirmDialog: true }, onChange)
  );
  return node;
}

// Ask Chrome how it words "all websites" and "a number of websites" in this
// browser's language, using made-up manifests. Works in every UI language.
let phrasesPromise;
function localizedPhrases() {
  const warn = (manifest) =>
    new Promise((resolve) => {
      try {
        chrome.management.getPermissionWarningsByManifest(JSON.stringify(manifest), (w) =>
          resolve(chrome.runtime.lastError ? [] : w || [])
        );
      } catch {
        resolve([]);
      }
    });
  const base = { manifest_version: 3, name: "probe", version: "1" };
  phrasesPromise ||= Promise.all([
    warn({ ...base, host_permissions: ["<all_urls>"] }),
    warn({ ...base, host_permissions: Array.from({ length: 12 }, (_, i) => `https://probe${i}.example.com/*`) }),
  ]).then(([all, many]) => ({ all, many }));
  return phrasesPromise;
}

async function render() {
  const [all, phrases] = await Promise.all([getAll(), localizedPhrases()]);
  const report = scan(all, chrome.runtime.id, phrases);

  const count = $("#count");
  count.textContent = String(report.canRead);
  count.className = "big " + (report.canRead ? "bad" : "good");

  $("#headline").textContent =
    report.canRead === 1
      ? "extension can read your AI chats"
      : report.canRead
      ? "extensions can read your AI chats"
      : "extensions can read your AI chats. Nice.";

  $("#subline").textContent = report.canRead
    ? `${report.high} high risk, out of ${report.total} installed.`
    : `Checked ${report.total} installed extension${report.total === 1 ? "" : "s"}.`;

  const list = $("#list");
  const off = $("#offlist");
  list.replaceChildren();
  off.replaceChildren();

  for (const r of report.results) {
    (r.enabled ? list : off).append(renderCard(r, render));
  }
  $("#off").hidden = off.children.length === 0;
}

$("#ver").textContent = "v" + chrome.runtime.getManifest().version;
$("#rescan").addEventListener("click", render);
render();
