import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageShell({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl space-y-4 sm:space-y-6", className)} dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-start sm:justify-between">
        <div className="min-w-0 text-right">
          <h2 className="font-display text-xl font-black text-forest-deep sm:text-2xl">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="flex shrink-0 justify-stretch sm:justify-end">{action}</div>}
      </div>
      {children}
    </div>
  );
}
