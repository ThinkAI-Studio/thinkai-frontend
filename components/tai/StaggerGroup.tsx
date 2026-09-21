"use client";

import React, { ElementType } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export const THINKAI_EASE = {
  luxury: [0.16, 1, 0.3, 1] as const,
  snappy: [0.19, 1, 0.22, 1] as const,
  entrance: [0.25, 1, 0.5, 1] as const,
};

export interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  as?: ElementType;
}

/**
 * A small sequential entrance for a coherent list of related items.
 *
 * Usage:
 * <StaggerGroup>
 *   <StaggerItem>One item</StaggerItem>
 *   <StaggerItem>Another item</StaggerItem>
 * </StaggerGroup>
 *
 * - Items appear sequentially with configurable delay
 * - Respects prefers-reduced-motion
 */
export function StaggerGroup({
  children,
  className,
  staggerDelay = 0.08,
  once = true,
  as: Component = "div",
}: StaggerGroupProps) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  if (prefersReduced) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <motion.div
      ref={ref as any}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: index * staggerDelay,
                ease: THINKAI_EASE.entrance,
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}

export function StaggerItem({ children, className, as: Component = "div" }: StaggerItemProps) {
  return <Component className={className}>{children}</Component>;
}
