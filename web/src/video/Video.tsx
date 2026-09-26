import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Puzzle } from "lucide-react";
import { StarsBackground } from "@/components/ui/stars-background";

gsap.registerPlugin(SplitText);

// Real scan result from the decoy test, rendered with the extension's real popup CSS.
const CARDS = [
  { name: "Free VPN Pro - Unlimited", level: "high", sites: ["All websites"], reasons: ["can read every website you open, AI chats included", "can read your login cookies", "can inject code into pages", "can watch network requests"] },
  { name: "AI Sidebar: ChatGPT, Claude & Gemini", level: "medium", sites: ["ChatGPT", "Claude", "Gemini"], reasons: ["asked for access to ChatGPT, Claude, Gemini by name", "can inject code into pages"] },
  { name: "Grammar Helper", level: "medium", sites: ["All websites"], reasons: ["can read every website you open, AI chats included", "can read your clipboard", "can watch network requests"] },
  { name: "Dark Mode Everywhere", level: "low", sites: ["All websites"], reasons: ["can read every website you open, AI chats included"] },
];
const BADGE: Record<string, string> = { high: "High risk", medium: "Check this", low: "Low" };
const APPEAR = [9.0, 9.75, 10.5, 11.25];
const CLICK = 15.15;
export const DURATION = 21.5;
const SCALE = 2.2, WIN_H = 1130;

declare global { interface Window { renderAt: (t: number) => Promise<void>; videoReady: Promise<void>; } }

export default function Video() {
  const stage = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLDivElement>(null);
  const sub = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let resolveReady!: () => void;
    window.videoReady = new Promise((r) => (resolveReady = r));
    const q = gsap.utils.selector(stage);

    document.fonts.ready.then(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      // measure before any from() state is applied
      const stageBox = stage.current!.getBoundingClientRect();
      const center = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left - stageBox.left + r.width / 2, y: r.top - stageBox.top + r.height / 2 }; };
      const addBtn = center(q("#addbtn")[0]);
      const offBtn = center(q("#c0 .disable")[0]);
      const winNative = WIN_H / SCALE;
      const scrollFor = (i: number) => { if (i < 0) return 0; const c = q(`#c${i}`)[0] as HTMLElement; return Math.max(0, c.offsetTop + c.offsetHeight + 16 - winNative); };

      gsap.set(q(".scene"), { autoAlpha: 0 });

      gsap.set(q("#cur"), { autoAlpha: 0, x: 900, y: 1500 });

      // S1 hook: the real Chrome install warning
      tl.set(q("#s1"), { autoAlpha: 1 }, 0)
        .from(q("#dlg"), { y: 140, scale: 0.94, autoAlpha: 0, duration: 0.6 }, 0)
        .set(q("#cur"), { autoAlpha: 1 }, 0.6)
        .to(q("#cur"), { x: addBtn.x - 8, y: addBtn.y - 6, duration: 1.0, ease: "power2.inOut" }, 0.7)
        .to(q("#cur"), { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1, ease: "none" }, 1.75)
        .to(q("#addbtn"), { filter: "brightness(1.3)", duration: 0.08, yoyo: true, repeat: 1 }, 1.75);
      const cap1 = SplitText.create(q("#cap1")[0], { type: "words" });
      tl.from(cap1.words, { y: 60, autoAlpha: 0, rotateX: -60, stagger: 0.07, duration: 0.5 }, 1.95)
        .to(q("#cur"), { autoAlpha: 0, duration: 0.2 }, 2.9)
        .to(q("#s1"), { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 3.0);

      // S2 stakes
      const s2h = SplitText.create(q("#s2h")[0], { type: "words,chars" });
      tl.set(q("#s2"), { autoAlpha: 1 }, 3.3)
        .from(s2h.chars, { yPercent: 110, autoAlpha: 0, stagger: 0.018, duration: 0.5 }, 3.35)
        .from(q(".vchip"), { y: 30, autoAlpha: 0, scale: 0.8, stagger: 0.07, duration: 0.45, ease: "back.out(2)" }, 3.95)
        .from(q("#statlbl"), { autoAlpha: 0, y: 20, duration: 0.4 }, 4.6)
        .from(q(".stat"), { autoAlpha: 0, x: -60, stagger: 0.28, duration: 0.55 }, 4.8)
        .to(q("#s2"), { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 7.35);

      // S3 reveal + S4 action
      const brand = SplitText.create(q("#brandname")[0], { type: "chars" });
      tl.set(q("#s3"), { autoAlpha: 1 }, 7.7)
        .from(q("#brandicon"), { scale: 0, rotate: -30, duration: 0.6, ease: "back.out(2.2)" }, 7.72)
        .from(brand.chars, { y: 50, autoAlpha: 0, stagger: 0.03, duration: 0.45 }, 7.8)
        .from(q("#brandsub"), { autoAlpha: 0, y: 16, duration: 0.4 }, 8.15)
        .from(q("#win"), { y: 220, autoAlpha: 0, duration: 0.7 }, 8.25);
      APPEAR.forEach((a, i) => {
        tl.from(q(`#c${i}`), { y: 30, autoAlpha: 0, duration: 0.45 }, a)
          .to(q("#scaler"), { y: -scrollFor(i) * SCALE, duration: 0.55, ease: "power2.inOut" }, a);
      });
      tl.to(q("#scaler"), { y: 0, duration: 0.6, ease: "power2.inOut" }, 13.8)
        .set(q("#cur"), { x: 980, y: 1700, scale: 1 }, 14.1)
        .to(q("#cur"), { autoAlpha: 1, duration: 0.15 }, 14.2)
        .to(q("#cur"), { x: offBtn.x - 8, y: offBtn.y - 6, duration: 0.9, ease: "power2.inOut" }, 14.2)
        .to(q("#cur"), { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1, ease: "none" }, CLICK - 0.05)
        .set(q("#c0 .disable"), { display: "none" }, CLICK)
        .set(q("#c0 .enable"), { display: "inline-block" }, CLICK)
        .to(q("#c0"), { opacity: 0.6, duration: 0.3 }, CLICK)
        .to(q("#cur"), { x: "+=150", y: "+=110", duration: 0.6, ease: "power2.inOut" }, CLICK + 0.25)
        .to(q("#cur"), { autoAlpha: 0, duration: 0.25 }, 16.4);
      const cap4 = SplitText.create(q("#cap4")[0], { type: "words" });
      tl.from(cap4.words, { y: 50, autoAlpha: 0, stagger: 0.09, duration: 0.45, ease: "back.out(1.8)" }, CLICK + 0.2)
        .to(q("#s3"), { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 17.35);

      // S5 outro
      const nm = SplitText.create(q("#outname")[0], { type: "chars" });
      tl.set(q("#s5"), { autoAlpha: 1 }, 17.7)
        .from(q("#outicon"), { scale: 0.4, autoAlpha: 0, duration: 0.7, ease: "back.out(1.8)" }, 17.72)
        .from(nm.chars, { yPercent: 120, autoAlpha: 0, stagger: 0.035, duration: 0.5 }, 17.85)
        .from(q(".outl"), { y: 30, autoAlpha: 0, stagger: 0.5, duration: 0.5 }, 18.35)
        .to({}, { duration: DURATION - 18.35 }, 18.35);

      window.renderAt = async (t: number) => {
        tl.seek(t, false);
        // count follows the cards, then drops when Free VPN is turned off
        let n = APPEAR.filter((a) => t >= a).length;
        if (t >= CLICK) n = 3;
        if (count.current) count.current.textContent = String(n);
        if (sub.current) sub.current.textContent = t >= CLICK ? "0 high risk, out of 5 installed." : "1 high risk, out of 5 installed.";
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      };
      resolveReady();
    });
  }, []);

  return (
    <div ref={stage} className="relative overflow-hidden text-paper" style={{ width: 1080, height: 1920, background: "#000" }}>
      {/* Aceternity starfield, static so every frame is deterministic */}
      <StarsBackground starDensity={0.00022} allStarsTwinkle={false} twinkleProbability={0} />

      {/* S1 */}
      <div id="s1" className="scene absolute inset-0">
        <div id="cap1" className="display font-semibold absolute inset-x-0 text-center" style={{ top: 330, fontSize: 104, lineHeight: 1, perspective: 600 }}>You clicked <span className="text-fog">Allow.</span></div>
        <div id="dlg" className="absolute rounded-[22px] shadow-[0_40px_120px_rgba(0,0,0,.6)]" style={{ left: 110, top: 640, width: 860, background: "#292A2D", padding: "48px 52px 40px", fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif" }}>
          <div className="flex items-center gap-6" style={{ fontSize: 38, fontWeight: 600, color: "#E8EAED" }}>
            <div className="grid place-items-center rounded-2xl" style={{ width: 76, height: 76, background: "#3C4043" }}><Puzzle size={40} color="#9AA0A6" /></div>
            Add "Free VPN Pro - Unlimited"?
          </div>
          <div style={{ margin: "36px 0 10px", fontSize: 30, color: "#9AA0A6" }}>It can:</div>
          <div className="flex gap-4" style={{ fontSize: 34, color: "#E8EAED", lineHeight: 1.35 }}><span className="mt-[18px] h-3 w-3 shrink-0 rounded-full bg-[#E8EAED]" />Read and change all your data on all websites</div>
          <div className="flex justify-end gap-5" style={{ marginTop: 48 }}>
            <div style={{ fontSize: 30, fontWeight: 600, padding: "18px 32px", borderRadius: 40, border: "2px solid #5F6368", color: "#8AB4F8" }}>Cancel</div>
            <div id="addbtn" style={{ fontSize: 30, fontWeight: 600, padding: "18px 32px", borderRadius: 40, background: "#8AB4F8", color: "#202124" }}>Add extension</div>
          </div>
        </div>
      </div>

      {/* S2 */}
      <div id="s2" className="scene absolute inset-0">
        <div id="s2h" className="display font-semibold absolute" style={{ left: 90, right: 90, top: 300, fontSize: 112, lineHeight: 0.98 }}>That includes your <span className="text-fog">AI chats.</span></div>
        <div className="absolute flex flex-wrap gap-[18px]" style={{ left: 90, right: 90, top: 620 }}>
          {["ChatGPT", "Claude", "Gemini", "DeepSeek", "Grok", "Copilot"].map((s) => (
            <span key={s} className="vchip font-mono font-semibold rounded-[14px] border-2 border-line bg-panel" style={{ fontSize: 40, padding: "14px 26px" }}>{s}</span>
          ))}
        </div>
        <div id="statlbl" className="absolute text-fog" style={{ left: 90, top: 900, fontSize: 38 }}>Extensions caught reading AI chats:</div>
        {[["900K", "users", "Dec 2025 · OX Security"], ["8M+", "installs", "Dec 2025 · Koi Security"], ["470K+", "users", "Jun 2026 · G DATA"]].map(([n, u, s], i) => (
          <div key={n} className="stat absolute flex items-baseline gap-8 border-t-2 border-line pt-6" style={{ left: 90, right: 90, top: 970 + i * 260 }}>
            <div className="display font-semibold text-paper" style={{ fontSize: 140, lineHeight: 1, minWidth: 470 }}>{n}</div>
            <div style={{ fontSize: 36, lineHeight: 1.3 }}>{u}<span className="block text-fog" style={{ fontSize: 30 }}>{s}</span></div>
          </div>
        ))}
      </div>

      {/* S3 + S4 */}
      <div id="s3" className="scene absolute inset-0">
        <div className="absolute inset-x-0 flex flex-col items-center gap-4" style={{ top: 170 }}>
          <div className="flex items-center gap-6">
            <img id="brandicon" src="./icon.png" alt="" style={{ width: 104, height: 104 }} />
            <div id="brandname" className="display font-semibold" style={{ fontSize: 92 }}>ChatSnitch</div>
          </div>
          <div id="brandsub" className="text-fog" style={{ fontSize: 40 }}>See who can read your AI chats</div>
        </div>
        <div id="win" className="absolute overflow-hidden rounded-[30px] border-2 border-[#262a33] shadow-[0_40px_140px_rgba(0,0,0,.55)]" style={{ left: 122, top: 520, width: 836, height: WIN_H }}>
          <div id="scaler" style={{ transformOrigin: "0 0", scale: String(SCALE) }}>
            <div className="pop">
              <header><div className="brand"><img src="./icon32.png" width={20} height={20} alt="" /> ChatSnitch</div><button className="ghost">Rescan</button></header>
              <section className="summary"><div className="big bad" ref={count}>0</div><div className="label">extensions can read your AI chats</div><div className="sub" ref={sub}>1 high risk, out of 5 installed.</div></section>
              <main>
                {CARDS.map((c, i) => (
                  <article key={c.name} id={`c${i}`} className={`card lvl-${c.level}`}>
                    <div className="row"><span className="name">{c.name}</span><span className={`badge ${c.level}`}>{BADGE[c.level]}</span></div>
                    <div className="sites">{c.sites.map((s) => <span key={s} className="chip">{s}</span>)}</div>
                    <ul className="reasons">{c.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                    <div className="actions"><button className="disable">Turn off</button><button className="remove ghost">Remove</button><button className="enable ghost" style={{ display: "none" }}>Turn back on</button></div>
                  </article>
                ))}
              </main>
              <footer>ChatSnitch has no network access. Nothing leaves your browser.</footer>
            </div>
          </div>
        </div>
        <div id="cap4" className="display font-semibold absolute inset-x-0 text-center" style={{ bottom: 70, fontSize: 76 }}>Turn it off. <span className="text-fog">Done.</span></div>
      </div>

      {/* S5 */}
      <div id="s5" className="scene absolute inset-0 flex flex-col items-center justify-center gap-8 text-center">
        <img id="outicon" src="./icon.png" alt="" style={{ width: 200, height: 200 }} />
        <div id="outname" className="display font-semibold" style={{ fontSize: 150, lineHeight: 1 }}>ChatSnitch</div>
        <div className="outl" style={{ fontSize: 52 }}>One permission. No network.</div>
        <div className="outl" style={{ fontSize: 52 }}>Free and open source.</div>
        <div className="outl font-mono font-medium text-fog mt-6" style={{ fontSize: 42 }}>github.com/Swastikkkkk/chatsnitch</div>
      </div>

      <svg id="cur" className="absolute left-0 top-0 z-10" width="60" height="60" viewBox="0 0 24 24" style={{ transformOrigin: "8px 6px" }}>
        <path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
