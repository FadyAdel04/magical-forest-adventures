import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/admin/config/nav";

/** Horizontal pill toggle — tablet only (between mobile bottom nav and desktop sidebar) */
export function AdminTopNav() {
  return (
    <nav
      className="hidden border-b border-border bg-cream/80 px-3 py-2 backdrop-blur-sm md:block lg:hidden"
      aria-label="أقسام لوحة الإدارة"
    >
      <div className="flex gap-1.5 overflow-x-auto px-1 pb-2 pt-0.5 scrollbar-none">
        {ADMIN_NAV.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "relative flex shrink-0 flex-row-reverse items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition",
                isActive ? "text-forest-deep" : "text-muted-foreground hover:bg-muted/80",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-top-nav-pill"
                    className="absolute inset-0 rounded-full bg-forest/12 ring-1 ring-forest/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10 whitespace-nowrap">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
