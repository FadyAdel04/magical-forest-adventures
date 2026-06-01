import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/admin/config/nav";

/** Primary navigation — fixed at bottom on phones and tablets */
export function AdminBottomNav() {
  const { pathname } = useLocation();

  const activeIndex = ADMIN_NAV.findIndex((item) =>
    item.end ? pathname === item.to || pathname === `${item.to}/` : pathname.startsWith(item.to),
  );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-cream/98 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] backdrop-blur-lg lg:hidden"
      aria-label="تنقل لوحة الإدارة"
    >
      <div className="relative mx-auto flex max-w-lg items-stretch px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {activeIndex >= 0 && (
          <motion.div
            layoutId="admin-bottom-nav-pill"
            className="pointer-events-none absolute top-1 bottom-[max(0.5rem,env(safe-area-inset-bottom))] rounded-2xl bg-forest/14"
            style={{
              width: `calc((100% - 0.5rem) / ${ADMIN_NAV.length})`,
              right: `calc(${activeIndex} * ((100% - 0.5rem) / ${ADMIN_NAV.length}) + 0.25rem)`,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        {ADMIN_NAV.map(({ to, end, shortLabel, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2.5 transition",
                isActive ? "text-forest-deep" : "text-muted-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn("h-6 w-6 shrink-0", isActive && "text-forest")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="truncate text-[10px] font-bold sm:text-[11px]">{shortLabel}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
