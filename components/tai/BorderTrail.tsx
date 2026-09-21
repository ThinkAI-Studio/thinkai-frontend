import React from "react";
import { cn } from "@/lib/utils";

export function BorderTrail({
  children,
  className = "",
  active = true,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {active && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[1.5px] w-1/3 bg-gradient-to-r from-transparent via-white to-transparent animate-[trail_3.5s_cubic-bezier(0.16,1,0.3,1)_infinite] z-10"
        />
      )}
      {children}
    </div>
  );
}
