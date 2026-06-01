import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ADMIN_NAV, type AdminNavItem } from "@/admin/config/nav";

type Variant = "sidebar" | "sheet" | "mobile" | "rail";

function linkClass(variant: Variant, isActive: boolean) {
  if (variant === "sidebar") {
    return cn(
      "flex flex-row-reverse items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
      isActive
        ? "bg-white/15 text-gold"
        : "text-cream/80 hover:bg-white/10 hover:text-cream",
    );
  }
  if (variant === "sheet" || variant === "mobile") {
    return cn(
      "flex w-full flex-row-reverse items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition",
      isActive
        ? "bg-gradient-forest text-cream shadow-sm"
        : "text-forest-deep hover:bg-forest/10",
    );
  }
  return cn(
    "relative z-10 flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-bold transition sm:text-xs",
    isActive ? "text-forest-deep" : "text-muted-foreground",
  );
}

export function AdminNavLinks({
  variant,
  onNavigate,
}: {
  variant: Variant;
  onNavigate?: () => void;
}) {
  return (
    <>
      {ADMIN_NAV.map((item) => (
        <AdminNavLink key={item.to} item={item} variant={variant} onNavigate={onNavigate} />
      ))}
    </>
  );
}

function AdminNavLink({
  item,
  variant,
  onNavigate,
}: {
  item: AdminNavItem;
  variant: Variant;
  onNavigate?: () => void;
}) {
  const { to, end, label, shortLabel, icon: Icon } = item;
  const display = variant === "rail" ? shortLabel : label;

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) => linkClass(variant, isActive)}
    >
      {variant === "rail" ? (
        <>
          <Icon className="h-5 w-5 shrink-0 sm:h-[22px] sm:w-[22px]" strokeWidth={2.25} />
          <span className="truncate">{display}</span>
        </>
      ) : (
        <>
          <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          {display}
        </>
      )}
    </NavLink>
  );
}
