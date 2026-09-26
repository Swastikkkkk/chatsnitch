import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Globe, EyeOff, ShieldAlert, ArrowRight, Check, Puzzle, WifiOff, Gauge } from "lucide-react";
import PopupPreview from "@/components/PopupPreview";
import { FaGithub as Github } from "react-icons/fa";

import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { joinWaitlist, track } from "@/lib/launchpad";

gsap.registerPlugin(ScrollTrigger);
const REPO = "https://github.com/Swastikkkkk/chatsnitch";

const STATS = [
  { n: "900K", unit: "users", when: "December 2025", src: "OX Security", href: "https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/", body: "Two fake AI extensions sent ChatGPT and DeepSeek chats to attacker servers every 30 minutes. One had Google's Featured badge." },
  { n: "8M+", unit: "installs", when: "December 2025", src: "Koi Security", href: "https://www.malwarebytes.com/blog/news/2025/12/chrome-extension-slurps-up-ai-chats-after-users-installed-it-for-privacy", body: "Urban VPN Proxy and 7 sister extensions silently auto-updated to capture chats on ChatGPT, Claude, Gemini and more." },
  { n: "470K+", unit: "users", when: "June 2026", src: "G DATA", href: "https://blog.gdatasoftware.com/2026/06/38428-browser-addons-spy-on-ai-chats", body: "Smart Sidebar, Chat AI and Urban VPN caught spying on eight AI chat sites." },
];

function Callout({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-paper">{k}</p>
      <p className="mt-1 text-sm leading-relaxed text-fog">{v}</p>
    </div>
  );
}

function Glow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative h-full rounded-3xl border border-line p-1.5 ${className}`}>
      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={1.5} variant="white" />
      <div className="relative h-full overflow-hidden rounded-[20px] bg-panel p-7">{children}</div>
    </div>
  );
}

function Waitlist() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "ok" | "err"; msg?: string }>({ kind: "idle" });
  return (
    <div className="reveal mt-14 rounded-3xl border border-line bg-panel/80 p-8 md:p-10 backdrop-blur text-center">
      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Want it from the Chrome Web Store?</h3>
      <p className="mx-auto mt-2 max-w-md text-fog">One email when the listing goes live. Nothing else, ever.</p>
      <div className="mt-7">
        <PlaceholdersAndVanishInput
          placeholders={["you@example.com", "Email me when it's on the Web Store", "One email. That's it."]}
          onChange={(e) => { setEmail(e.target.value); if (state.kind !== "idle") setState({ kind: "idle" }); }}
          onSubmit={async (e) => {
            e.preventDefault();
            const r = await joinWaitlist(email, "site-install");
            setState(r.ok ? { kind: "ok", msg: "You're on the list. One email when it's live." } : { kind: "err", msg: r.error });
          }}
        />
      </div>
      <p role="status" aria-live="polite" className={`mt-4 min-h-6 text-sm ${state.kind === "err" ? "text-amber-300" : "text-fog"}`}>{state.msg}</p>
    </div>
  );
}

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { track("pageview"); }, []);
  useGSAP(() => {
    gsap.from(".hero-in", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, delay: 0.1 });
    gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
      gsap.from(el, { y: 32, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    });
    gsap.utils.toArray<HTMLElement>(".stat").forEach((el, i) => {
      gsap.from(el, { y: 30, opacity: 0, duration: 0.7, delay: i * 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    gsap.from(".step", { y: 16, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: ".steps", start: "top 85%" } });
  }, { scope: root });

  return (
    <div ref={root} className="min-h-screen bg-ink text-paper overflow-x-hidden">
      {/* Fixed Aceternity starfield behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarsBackground starDensity={0.00018} />
        <ShootingStars starColor="#FFFFFF" trailColor="#86868B" minDelay={2400} maxDelay={6000} />
      </div>

      <div className="relative z-10">
        <nav className="sticky top-[env(safe-area-inset-top,0px)] z-50 border-b border-line bg-black/60 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-8 h-14">
            <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
              <img src="./icon.png" alt="" className="h-6 w-6 rounded-md" /> ChatSnitch
            </a>
            <div className="flex items-center gap-6 text-sm text-fog">
              <a className="hidden md:inline hover:text-paper" href="#why">Why</a>
              <a className="hidden md:inline hover:text-paper" href="#how">How it works</a>
              <a className="hidden md:inline hover:text-paper" href="#install">Install</a>
              <a className="inline-flex items-center gap-1.5 hover:text-paper" href={REPO} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <header id="top" className="mx-auto max-w-6xl px-4 md:px-8 pt-20 md:pt-28 text-center">
          <div className="hero-in mx-auto inline-flex items-center gap-3 rounded-2xl border border-line bg-panel/70 px-4 py-3 text-left backdrop-blur">
            <Puzzle className="shrink-0 text-fog" size={18} />
            <p className="text-sm leading-snug"><span className="font-semibold">Add "Free VPN Pro"?</span> <span className="text-fog">It can: Read and change all your data on all websites</span></p>
          </div>

          <h1 className="hero-in display mt-10 font-semibold leading-[1.03] text-5xl sm:text-6xl md:text-[5rem] lg:text-[5.4rem]">
            You clicked Allow.<br />
            <span className="text-[#6E6E73]">Now it reads your AI chats.</span>
          </h1>

          <p className="hero-in mx-auto mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-fog">
            ChatSnitch shows which of your Chrome extensions can see your AI conversations, and lets you switch off the ones you don't trust. One click. Nothing leaves your browser.
          </p>

          <div className="hero-in mt-10 flex flex-wrap items-center justify-center gap-4">
            <MovingBorderButton as="a" href="#install" onClick={() => track("cta_get")} borderRadius="999px" duration={3500} containerClassName="h-12 w-48" borderClassName="bg-[radial-gradient(#fff_40%,transparent_60%)]" className="border-line bg-black text-paper font-medium gap-2">
              Get ChatSnitch <ArrowRight size={16} />
            </MovingBorderButton>
            <a href={REPO} onClick={() => track("cta_code")} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-paper/80 hover:text-paper">
              <Github size={18} /> Read the code
            </a>
          </div>
        </header>

        {/* Product: the real popup, rendered live, with callouts */}
        <section className="mx-auto max-w-6xl px-4 md:px-8 pt-24 md:pt-32">
          <div className="reveal relative mx-auto grid items-center gap-10 grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px_minmax(0,1fr)]">
            <div className="hidden md:flex flex-col gap-24 text-right">
              <Callout k="Count" v="How many extensions can see your chats right now." />
              <Callout k="Risk level" v="High risk, check this, or low. Reasons listed, no black-box score." />
            </div>
            <PopupPreview className="mx-auto !w-full max-w-[380px]" />
            <div className="hidden md:flex flex-col gap-24">
              <Callout k="Why" v="Reads every site, reads cookies, watches traffic. In plain words." />
              <Callout k="Turn off" v="One click. Turn it back on any time." />
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-fog">The real popup, showing a scan of a test browser with five sample extensions.</p>
        </section>

        {/* WHY */}
        <section id="why" className="mx-auto max-w-6xl px-4 md:px-8 pt-32">
          <h2 className="reveal display font-semibold text-4xl md:text-6xl">This keeps happening.</h2>
          <p className="reveal mt-5 max-w-2xl text-lg md:text-xl text-fog leading-relaxed">Researchers keep catching extensions that copy AI conversations to someone else's server. Every report ends with "review your extension permissions". Nobody does, because it takes three minutes per extension and you have twenty.</p>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {STATS.map((x) => (
              <a key={x.n} href={x.href} target="_blank" rel="noreferrer" className="stat group rounded-3xl border border-line bg-panel/80 p-8 backdrop-blur transition hover:border-white/25">
                <p className="text-sm text-fog">{x.when}</p>
                <p className="display mt-6 font-semibold text-6xl tabular-nums">{x.n}</p>
                <p className="mt-1 text-fog">{x.unit}</p>
                <p className="mt-6 leading-relaxed text-paper/90">{x.body}</p>
                <p className="mt-6 text-sm text-fog group-hover:text-paper">{x.src} ↗</p>
              </a>
            ))}
          </div>
        </section>

        {/* HOW: Aceternity bento + glowing effect */}
        <section id="how" className="mx-auto max-w-6xl px-4 md:px-8 pt-32 pb-8">
          <h2 className="reveal display font-semibold text-4xl md:text-6xl">What it checks.</h2>
          <p className="reveal mt-4 max-w-2xl text-lg text-fog">The same permission list Chrome shows on the install dialog, translated into what each extension can actually do on AI chat sites.</p>
          <BentoGrid className="reveal mt-14 !max-w-none md:auto-rows-auto md:grid-cols-2 gap-4">
            {[
              { Icon: Globe, t: "Site access", d: "Every site, or chatgpt.com and claude.ai by name? Asking by name is the sidebar-stealer pattern, so it scores higher.", span: "" },
              { Icon: EyeOff, t: "Hidden access", d: "Chrome's API skips content scripts, the way most chat stealers read pages. ChatSnitch reads Chrome's warnings too.", span: "" },
              { Icon: ShieldAlert, t: "Extra powers", d: "Cookies, network traffic, code injection, clipboard, or installed by another program. Each raises the risk.", span: "" },
              { Icon: Gauge, t: "Three plain levels", d: "High risk, check this, or low. With the reasons listed, so you decide, not a score you have to trust.", span: "" },
            ].map(({ Icon, t, d, span }) => (
              <BentoGridItem key={t} className={`${span} !border-0 !bg-transparent !p-0 !shadow-none`}
                header={<Glow><div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10"><Icon size={20} className="text-paper" /></div><h3 className="mt-8 text-2xl font-semibold tracking-tight">{t}</h3><p className="mt-3 text-lg text-fog leading-relaxed">{d}</p></Glow>} />
            ))}
          </BentoGrid>
        </section>

        {/* PROOF */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 md:px-8 py-24 md:grid-cols-2 [&>*]:min-w-0">
          <div className="reveal">
            <h2 className="display font-semibold text-4xl md:text-5xl">Boring on purpose.</h2>
            <TextGenerateEffect words="An extension that checks your extensions should be the most boring one you install." className="mt-4 !font-normal [&_*]:!text-lg [&_*]:!text-fog [&_*]:!leading-relaxed" />
            <ul className="mt-8 space-y-4 text-lg">
              {[
                ["One permission: management.", "It lists extensions and can turn them off."],
                ["No site access.", "It can't read any website, your chats included."],
                ["No network.", "Blocked in its own security policy. It couldn't phone home if it tried."],
                ["Under 300 lines of JavaScript.", "Read all of it in five minutes."],
              ].map(([a, b]) => (
                <li key={a} className="flex gap-3"><Check className="mt-1.5 shrink-0 text-paper" size={18} /><span><span className="font-semibold">{a}</span> <span className="text-fog">{b}</span></span></li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <Glow>
              <div className="-m-7">
                <div className="flex items-center gap-2 border-b border-line px-5 py-3 font-mono text-xs text-fog"><WifiOff size={13} /> manifest.json</div>
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-paper/85">{`{
  "manifest_version": 3,
  "name": "ChatSnitch",
  "permissions": [`}<span className="rounded bg-white/10 px-1 text-paper">"management"</span>{`],
  "content_security_policy": {
    "extension_pages":
      "script-src 'self'; `}<span className="rounded bg-white/10 px-1 text-paper">connect-src 'none'</span>{`"
  }
}`}</pre>
              </div>
            </Glow>
          </div>
        </section>

        {/* INSTALL */}
        <section id="install" className="mx-auto max-w-6xl px-4 md:px-8 py-24">
          <h2 className="reveal display font-semibold text-4xl md:text-6xl">Install.</h2>
          <p className="reveal mt-4 max-w-2xl text-lg text-fog">The Chrome Web Store listing is on the way. Until then, loading it yourself takes about a minute.</p>
          <ol className="steps mt-12 grid gap-4 md:grid-cols-4">
            {[
              <>Download the code from <a className="underline underline-offset-4" onClick={() => track("cta_download")} href={REPO} target="_blank" rel="noreferrer">GitHub</a> and unzip it.</>,
              <>Open <code className="font-mono text-sm">chrome://extensions</code> and turn on Developer mode.</>,
              <>Click Load unpacked and pick the <code className="font-mono text-sm">extension</code> folder.</>,
              <>Pin ChatSnitch, click it, and see who's reading.</>,
            ].map((x, i) => (
              <li key={i} className="step rounded-2xl border border-line bg-panel/80 p-6 backdrop-blur">
                <span className="text-sm text-fog">Step {i + 1}</span>
                <p className="mt-3 text-paper/90 leading-relaxed">{x}</p>
              </li>
            ))}
          </ol>
          <Waitlist />
        </section>

        {/* LIMITS */}
        <section className="mx-auto max-w-6xl px-4 md:px-8 py-24">
          <h2 className="reveal display font-semibold text-4xl md:text-5xl">What it can't tell you.</h2>
          <div className="mt-10 grid gap-x-12 gap-y-6 md:grid-cols-2 text-fog leading-relaxed">
            <p className="reveal"><span className="font-semibold text-paper">Whether an extension is actually stealing.</span> It shows what an extension is allowed to do. A dark-mode extension needs all-sites access to work, which is why those score low.</p>
            <p className="reveal"><span className="font-semibold text-paper">Access you restricted yourself.</span> If you set an extension to "On click", Chrome doesn't tell other extensions, so it still shows up here.</p>
            <p className="reveal"><span className="font-semibold text-paper">Every language, fully.</span> Hidden all-sites access is spotted from Chrome's English wording. Named sites like claude.ai are caught in any language.</p>
            <p className="reveal"><span className="font-semibold text-paper">Firefox.</span> Built for Chromium browsers: Chrome, Edge, Brave. Firefox isn't supported yet.</p>
          </div>
        </section>

        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4 md:px-8 py-8 text-sm text-fog">
            <span>Built by <a className="underline underline-offset-4 hover:text-paper" href="https://github.com/Swastikkkkk" target="_blank" rel="noreferrer">Swastik</a>. MIT licensed.</span>
            <span>ChatSnitch never sees your chats. That's the point.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
