import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Star } from "lucide-react";
import { track } from "@/lib/launchpad";

const REPO = "Swastikkkkk/chatsnitch";

// Live star count from GitHub's public API, cached for the session.
export default function StarButton({ className = "", size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    try { const c = sessionStorage.getItem("cs_stars"); if (c) { setStars(Number(c)); return; } } catch { /* ignore */ }
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && typeof d.stargazers_count === "number") { setStars(d.stargazers_count); try { sessionStorage.setItem("cs_stars", String(d.stargazers_count)); } catch { /* ignore */ } } })
      .catch(() => {});
  }, []);
  const lg = size === "lg";
  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noreferrer"
      onClick={() => track(lg ? "cta_star_lg" : "cta_star")}
      className={`group inline-flex items-center overflow-hidden rounded-full border border-line bg-white/[0.04] text-paper transition hover:border-white/30 hover:bg-white/[0.08] ${lg ? "h-12 text-base" : "h-8 text-sm"} ${className}`}
    >
      <span className={`inline-flex items-center gap-2 ${lg ? "px-5" : "px-3"}`}>
        <FaGithub size={lg ? 18 : 15} /> Star
        <Star size={lg ? 16 : 13} className="text-fog transition group-hover:fill-paper group-hover:text-paper" />
      </span>
      {stars !== null && (
        <span className={`border-l border-line tabular-nums text-fog ${lg ? "px-4" : "px-2.5"}`}>{stars.toLocaleString()}</span>
      )}
    </a>
  );
}
