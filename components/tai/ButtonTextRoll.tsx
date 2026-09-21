"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonTextRollProps {
  text: string;
  className?: string;
}

export function ButtonTextRoll({
  text,
  className = "",
}: ButtonTextRollProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden h-[1.25em] leading-none select-none",
        className
      )}
    >
      {/* Primary text */}
      <span className="inline-flex items-center justify-center leading-none transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[135%]">
        {text}
      </span>
      {/* Duplicate text rolling in from bottom */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center leading-none translate-y-[135%] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      >
        {text}
      </span>
    </span>
  );
}
