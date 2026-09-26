// The real ChatSnitch popup markup + CSS, rendered live (crisp at any size).
// Data is the actual scan result from the decoy-extension test.
import "@/video/popup-scoped.css";

export const SCAN = [
  { name: "Free VPN Pro - Unlimited", level: "high", sites: ["All websites"], reasons: ["can read every website you open, AI chats included", "can read your login cookies", "can inject code into pages", "can watch network requests"] },
  { name: "AI Sidebar: ChatGPT, Claude & Gemini", level: "medium", sites: ["ChatGPT", "Claude", "Gemini"], reasons: ["asked for access to ChatGPT, Claude, Gemini by name", "can inject code into pages"] },
  { name: "Grammar Helper", level: "medium", sites: ["All websites"], reasons: ["can read every website you open, AI chats included", "can read your clipboard", "can watch network requests"] },
] as const;
const BADGE = { high: "High risk", medium: "Check this", low: "Low" } as const;

export default function PopupPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`pop overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,.9)] ${className}`} aria-label="ChatSnitch popup showing 4 extensions that can read AI chats">
      <header><div className="brand"><img src="./icon.png" width={20} height={20} alt="" /> ChatSnitch</div><button className="ghost" tabIndex={-1}>Rescan</button></header>
      <section className="summary"><div className="big bad">4</div><div className="label">extensions can read your AI chats</div><div className="sub">1 high risk, out of 5 installed.</div></section>
      <main>
        {SCAN.map((c) => (
          <article key={c.name} className={`card lvl-${c.level}`}>
            <div className="row"><span className="name">{c.name}</span><span className={`badge ${c.level}`}>{BADGE[c.level]}</span></div>
            <div className="sites">{c.sites.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            <ul className="reasons">{c.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
            <div className="actions"><button className="disable" tabIndex={-1}>Turn off</button><button className="remove ghost" tabIndex={-1}>Remove</button></div>
          </article>
        ))}
      </main>
    </div>
  );
}
