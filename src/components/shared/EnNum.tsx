import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Wraps numbers so Western digits render clearly in RTL Arabic UI. */
export function EnNum({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span lang="en" dir="ltr" className={cn("numeric-en inline-block tabular-nums", className)}>
      {children}
    </span>
  );
}
