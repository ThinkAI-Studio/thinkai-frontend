import React from "react";
import { cn } from "@/lib/utils";

export function TaiBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest rounded-full transition-all duration-200 select-none",
        tone === "accent" && "border-white/30 text-white bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.15)]",
        tone === "success" && "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 shadow-[0_0_12px_rgba(74,222,128,0.25)]",
        tone === "warning" && "border-amber-500/40 text-amber-400 bg-amber-500/10 shadow-[0_0_12px_rgba(251,191,36,0.25)]",
        tone === "neutral" && "border-white/10 text-white/70 bg-white/5",
        className
      )}
    >
      {children}
    </span>
  );
}
