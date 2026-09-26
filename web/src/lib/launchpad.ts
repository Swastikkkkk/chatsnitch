// Shared client for the Launchpad Supabase project. Every launch site uses this file
// unchanged and only sets its own PRODUCT slug. The public key can only call the two
// RPCs below; it cannot read any table.
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
export const PRODUCT = (import.meta.env.VITE_PRODUCT_SLUG as string | undefined) ?? "chatsnitch";

const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

// Channel attribution: ?ref=x-thread, ?ref=r-privacy, or utm_source. Kept for the tab's session.
export function getRef(): string | null {
  try {
    const q = new URLSearchParams(location.search);
    const fromUrl = (q.get("ref") || q.get("utm_source") || "").toLowerCase().replace(/[^a-z0-9_.:-]/g, "").slice(0, 40);
    if (fromUrl) sessionStorage.setItem("cs_ref", fromUrl);
    return fromUrl || sessionStorage.getItem("cs_ref");
  } catch { return null; }
}

export async function joinWaitlist(email: string, source?: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: "Signups aren't set up on this copy of the site." };
  const ref = getRef();
  const src = [source, ref].filter(Boolean).join("|") || null;
  const { error } = await supabase.rpc("join_waitlist", { p_slug: PRODUCT, p_email: email, p_source: src });
  if (error) return { ok: false, error: error.message === "invalid email" ? "That email doesn't look right." : "Couldn't save that. Try again in a minute." };
  return { ok: true };
}

// Cookieless: no IDs, no IP, just the event name, path and referring host.
export function track(name: string) {
  if (!supabase) return;
  let ref: string | null = null;
  try { ref = document.referrer ? new URL(document.referrer).host : null; } catch { /* ignore */ }
  // rpc() is lazy: it only sends once .then() is attached.
  const src = getRef();
  const path = src ? `${location.pathname}?ref=${src}` : location.pathname;
  supabase.rpc("track", { p_slug: PRODUCT, p_name: name, p_path: path, p_referrer_host: ref }).then(() => {}, () => {});
}
