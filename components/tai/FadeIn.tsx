"use client";

import React from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export const THINKAI_EASE = {
  luxury: [0.16, 1, 0.3, 1] as const,
  snappy: [0.19, 1, 0.22, 1] as const,
  entrance: [0.25, 1, 0.5, 1] as const,
};

export interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  offsetY?: number;
  once?: boolean;
}

/**
 * A restrained one-shot entrance for content entering the viewport.
 *
 * Usage: <FadeIn>Content with a small entrance.</FadeIn>
 *
 * - Opacity plus 8px maximum travel
 * - One-shot viewport trigger
 * - Respects prefers-reduced-motion
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  offsetY = 8,
  once = true,
}: FadeInProps) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  if (prefersReduced) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: offsetY }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: offsetY }}
      transition={{
        duration,
        delay,
        ease: THINKAI_EASE.entrance,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
