"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SkeletonShimmerProps {
  className?: string;
}

/**
 * An optional slow shimmer for a known loading placeholder.
 *
 * Usage: <SkeletonShimmer className="h-4 w-40" />
 *
 * - Slow 1.8s loop; opt-in only
 * - The shimmer is aria-hidden and decorative
 * - Respects prefers-reduced-motion (disables loop, leaves static placeholder)
 */
export function SkeletonShimmer({ className }: SkeletonShimmerProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded bg-white/5",
        className
      )}
      aria-hidden="true"
    >
      {!prefersReduced && (
        <motion.div
          className="absolute inset-0 -translate-x-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
          animate={{ translateX: ["-100%", "200%"] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
}
