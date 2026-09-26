import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Globe, EyeOff, ShieldAlert, ArrowRight, Check, Puzzle, WifiOff, Gauge, Lock, RotateCw } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";

import CountUp from "@/components/CountUp";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Timeline } from "@/components/ui/timeline";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { joinWaitlist, track } from "@/lib/launchpad";

gsap.registerPlugin(ScrollTrigger);
const REPO = "https://github.com/Swastikkkkk/chatsnitch";

function Stat({ n, suffix, unit, label, src, href, body }: { n: number; suffix: string; unit: string; label: string; src: string; href: string; body: string }) {
  return (
    <div className="pb-2">
      <p className="text-sm text-fog mb-2">{label}</p>
      <div className="display font-semibold leading-none text-6xl md:text-7xl tabular-nums text-paper">
        <CountUp to={n} duration={1.4} />{suffix}
        <span className="ml-3 align-middle text-lg font-normal tracking-normal text-fog">{unit}</span>
      </div>
      <p className="mt-5 max-w-prose text-lg text-paper/85 leading-relaxed">{body}</p>
      <a className="mt-3 inline-block text-sm text-fog underline underline-offset-4 hover:text-paper" href={href} target="_blank" rel="noreferrer">{src}</a>
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
      gsap.from(el, { y: 32, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
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
        <header id="top" className="mx-auto max-w-5xl px-4 md:px-8 pt-20 md:pt-28 text-center">
          <div className="hero-in mx-auto inline-flex items-center gap-3 rounded-2xl border border-line bg-panel/70 px-4 py-3 text-left backdrop-blur">
            <Puzzle className="shrink-0 text-fog" size={18} />
            <p className="text-sm leading-snug"><span className="font-semibold">Add "Free VPN Pro"?</span> <span className="text-fog">It can: Read and change all your data on all websites</span></p>
          </div>

          <h1 className="hero-in display mt-10 font-semibold leading-[1.02] text-5xl sm:text-6xl md:text-[5.25rem]">
            You clicked Allow.<br />
            <span className="text-fog">Now it can read your</span><br />
            <FlipWords words={["ChatGPT", "Claude", "Gemini", "DeepSeek", "Copilot"]} duration={2200} className="!px-0 !pr-3 text-paper" /><span className="text-paper">chats.</span>
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

        {/* Product, in Aceternity's scroll tablet */}
        <div className="-mt-10 md:-mt-24">
          <ContainerScroll titleComponent={<span className="sr-only">ChatSnitch popup</span>}>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3 border-b border-line bg-[#1A1A1C] px-4 py-2.5">
                <div className="flex gap-1.5"><span className="h-3 w-3 rounded-full bg-white/15" /><span className="h-3 w-3 rounded-full bg-white/15" /><span className="h-3 w-3 rounded-full bg-white/15" /></div>
                <RotateCw size={14} className="text-fog" />
                <div className="flex flex-1 items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-fog"><Lock size={12} /> chatgpt.com</div>
                <Puzzle size={16} className="text-fog" />
                <img src="./icon.png" alt="" className="h-5 w-5 rounded" />
              </div>
              <div className="relative flex-1 overflow-hidden">
                <div className="absolute left-6 right-[46%] top-8 hidden space-y-5 md:block" aria-hidden>
                  {[80, 64, 92, 70, 55, 85].map((w, i) => <div key={i} className="h-3 rounded-full bg-white/[0.06]" style={{ width: `${w}%` }} />)}
                </div>
                <img src="./popup.jpg" alt="ChatSnitch popup: 4 extensions can read your AI chats, Free VPN Pro marked high risk" className="absolute right-2 md:right-6 top-2 w-[92%] max-w-[360px] rounded-xl border border-line shadow-2xl" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111113] to-transparent" />
              </div>
            </div>
          </ContainerScroll>
          <p className="-mt-16 md:-mt-40 text-center text-xs text-fog">Real scan of a test browser with five sample extensions.</p>
        </div>

        {/* WHY */}
        <section id="why" className="mt-24">
          <Timeline
            heading={<span className="display font-semibold text-3xl md:text-5xl text-paper">This keeps happening.</span>}
            intro={<span className="text-base md:text-lg text-fog">Researchers keep catching extensions that copy AI conversations to someone else's server. Every report ends with "review your extension permissions". Nobody does, because it takes three minutes per extension and you have twenty.</span>}
            data={[
              { title: "Dec 2025", content: <Stat n={900} suffix="K" unit="users" label="Fake AI extensions" src="OX Security" href="https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/" body="Two fake AI extensions sent ChatGPT and DeepSeek chats to attacker servers every 30 minutes. One carried Google's Featured badge." /> },
              { title: "Dec 2025", content: <Stat n={8} suffix="M+" unit="installs" label="A free VPN" src="Koi Security, via Malwarebytes" href="https://www.malwarebytes.com/blog/news/2025/12/chrome-extension-slurps-up-ai-chats-after-users-installed-it-for-privacy" body="Urban VPN Proxy and 7 sister extensions silently auto-updated to capture chats on ChatGPT, Claude, Gemini, Copilot, Grok and more." /> },
              { title: "Jun 2026", content: <Stat n={470} suffix="K+" unit="users" label="AI sidebars, again" src="G DATA" href="https://blog.gdatasoftware.com/2026/06/38428-browser-addons-spy-on-ai-chats" body="Smart Sidebar, Chat AI and Urban VPN caught spying on eight AI chat sites." /> },
            ]}
          />
        </section>

        {/* HOW: Aceternity bento + glowing effect */}
        <section id="how" className="mx-auto max-w-6xl px-4 md:px-8 py-24">
          <h2 className="reveal display font-semibold text-4xl md:text-6xl">What it checks.</h2>
          <p className="reveal mt-4 max-w-2xl text-lg text-fog">The same permission list Chrome shows on the install dialog, translated into what each extension can actually do on AI chat sites.</p>
          <BentoGrid className="reveal mt-12 !max-w-none md:auto-rows-[15rem] md:grid-cols-3 gap-4">
            {[
              { Icon: Globe, t: "Site access", d: "Every site, or chatgpt.com and claude.ai by name? Asking by name is the sidebar-stealer pattern, so it scores higher.", span: "md:col-span-2" },
              { Icon: EyeOff, t: "Hidden access", d: "Chrome's API skips content scripts, the way most chat stealers read pages. ChatSnitch reads Chrome's warnings too.", span: "" },
              { Icon: ShieldAlert, t: "Extra powers", d: "Cookies, network traffic, code injection, clipboard, or installed by another program. Each raises the risk.", span: "" },
              { Icon: Gauge, t: "Three plain levels", d: "High risk, check this, or low. With the reasons listed, so you decide, not a score you have to trust.", span: "md:col-span-2" },
            ].map(({ Icon, t, d, span }) => (
              <BentoGridItem key={t} className={`${span} !border-0 !bg-transparent !p-0 !shadow-none`}
                header={<Glow><Icon size={22} className="text-paper" /><h3 className="mt-6 text-xl font-semibold tracking-tight">{t}</h3><p className="mt-2 text-fog leading-relaxed">{d}</p></Glow>} />
            ))}
          </BentoGrid>
        </section>

        {/* PROOF */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:px-8 py-24 md:grid-cols-2">
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
