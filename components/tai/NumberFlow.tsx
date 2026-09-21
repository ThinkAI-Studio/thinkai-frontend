"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const THINKAI_EASE = {
  luxury: [0.16, 1, 0.3, 1] as const,
  snappy: [0.19, 1, 0.22, 1] as const,
  entrance: [0.25, 1, 0.5, 1] as const,
};

export interface NumberFlowProps {
  value: number;
  className?: string;
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
}

/**
 * A small numeric settle for values that genuinely change.
 *
 * Usage: <NumberFlow value={activeUsers} />
 *
 * - Uses a polite live region for value changes
 * - Keep the surrounding label visible
 * - Respects prefers-reduced-motion
 */
export function NumberFlow({
  value,
  className,
  duration = 0.8,
  formatOptions,
}: NumberFlowProps) {
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const [animatedValue, setAnimatedValue] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }

    const startValue = displayValue;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;
      
      setAnimatedValue(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, prefersReduced]);

  const formattedValue = new Intl.NumberFormat("vi-VN", formatOptions).format(
    prefersReduced ? displayValue : animatedValue
  );

  return (
    <motion.span
      ref={ref}
      className={cn("tabular-nums", className)}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {formattedValue}
    </motion.span>
  );
}
