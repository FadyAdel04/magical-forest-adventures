import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

export type AdminNavItem = {
  to: string;
  end: boolean;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    to: "/admin",
    end: true,
    label: "لوحة التحكم",
    shortLabel: "الرئيسية",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/products",
    end: false,
    label: "المنتج",
    shortLabel: "المنتج",
    icon: Package,
  },
  {
    to: "/admin/orders",
    end: false,
    label: "الطلبات",
    shortLabel: "الطلبات",
    icon: ShoppingCart,
  },
  {
    to: "/admin/settings",
    end: false,
    label: "الشحن",
    shortLabel: "الشحن",
    icon: Settings,
  },
];

export function adminPageTitle(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") return "لوحة التحكم";
  const item = ADMIN_NAV.find((n) => !n.end && pathname.startsWith(n.to));
  if (item) return item.label;
  return "إدارة نسيج";
}
