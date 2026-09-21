"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const THINKAI_EASE = {
  luxury: [0.16, 1, 0.3, 1] as const,
  snappy: [0.19, 1, 0.22, 1] as const,
  entrance: [0.25, 1, 0.5, 1] as const,
};

export interface WipeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  wipeColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  pill?: boolean;
}

export const WipeButton = React.forwardRef<HTMLButtonElement, WipeButtonProps>(
  (
    {
      children,
      className,
      onClick,
      href,
      wipeColor = "#ffffff",
      textColor = "#ffffff",
      hoverTextColor = "hsl(201, 100%, 13%)",
      borderColor = "rgba(255, 255, 255, 0.15)",
      hoverBorderColor = "rgba(255, 255, 255, 0.4)",
      pill = true,
      ...props
    },
    ref
  ) => {
    const [wipeState, setWipeState] = useState<"idle" | "in" | "out">("idle");
    const prefersReduced = useReducedMotion();

    const handleMouseEnter = () => setWipeState("in");
    const handleMouseLeave = () => setWipeState("out");

    const innerContent = (
      <>
        {/* Sliding Forward Wipe Layer */}
        {!prefersReduced && (
          <motion.div
            initial={{ x: "-102%" }}
            animate={
              wipeState === "in"
                ? { x: "0%" }
                : wipeState === "out"
                ? { x: "102%" }
                : { x: "-102%" }
            }
            transition={
              wipeState === "idle"
                ? { duration: 0 }
                : { duration: 0.36, ease: THINKAI_EASE.luxury }
            }
            onAnimationComplete={() => {
              if (wipeState === "out") {
                setWipeState("idle");
              }
            }}
            className={cn(
              "absolute inset-0 pointer-events-none",
              pill ? "rounded-full" : "rounded-none"
            )}
            style={{ backgroundColor: wipeColor, zIndex: 0 }}
          />
        )}
        {/* Content */}
        <span
          className="relative z-10 inline-flex items-center justify-center gap-2.5 w-full h-full transition-colors duration-200 leading-none"
          style={{
            color: wipeState === "in" && !prefersReduced ? hoverTextColor : textColor,
          }}
        >
          {children}
        </span>
      </>
    );

    const baseClasses = cn(
      "group relative inline-flex items-center justify-center overflow-hidden font-medium text-sm transition-[border-color,transform,box-shadow] duration-250 cursor-pointer select-none outline-none active:scale-[0.98]",
      pill ? "rounded-full px-6 py-3" : "rounded-none px-5 py-2.5",
      className
    );

    const sharedStyles: React.CSSProperties = {
      borderColor: wipeState === "in" ? hoverBorderColor : borderColor,
      borderWidth: 1,
      borderStyle: "solid",
    };

    if (href) {
      return (
        <Link
          href={href}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={baseClasses}
          style={sharedStyles}
        >
          {innerContent}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        style={sharedStyles}
        ref={ref}
        {...props}
      >
        {innerContent}
      </button>
    );
  }
);

WipeButton.displayName = "WipeButton";
