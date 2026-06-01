import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { AdminLogo } from "@/admin/components/AdminLogo";
import { AdminNavLinks } from "@/admin/components/AdminNavLinks";
import { AdminBottomNav } from "@/admin/components/AdminBottomNav";
import { AdminHeaderMenu } from "@/admin/components/AdminHeaderMenu";
import { adminPageTitle } from "@/admin/config/nav";
import { AdminStoreGate } from "@/admin/components/AdminStoreGate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = adminPageTitle(pathname);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-dvh bg-[oklch(0.97_0.02_90)]" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-l border-border bg-[oklch(0.22_0.06_150)] text-cream lg:flex">
        <div className="border-b border-white/10 px-4 py-5">
          <AdminLogo size="sm" variant="dark" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <AdminNavLinks variant="sidebar" />
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Button
            variant="ghost"
            className="w-full flex-row-reverse justify-end gap-2 text-cream/80 hover:bg-white/10 hover:text-cream"
            asChild
          >
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              عرض الموقع
            </a>
          </Button>
          <Button
            variant="ghost"
            className="w-full flex-row-reverse justify-end gap-2 text-cream/80 hover:bg-white/10 hover:text-red-200"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-cream/95 backdrop-blur-md">
          {/* Mobile + tablet header */}
          <div className="flex min-h-14 flex-row-reverse items-center gap-3 px-4 py-3 sm:px-6 lg:hidden">
            <AdminLogo size="sm" showText={false} variant="light" className="shrink-0" />
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate font-display text-base font-black text-forest-deep sm:text-lg">
                {title}
              </p>
              <p className="text-[11px] text-muted-foreground sm:text-xs">إدارة نسيج</p>
            </div>
            <AdminHeaderMenu />
          </div>

          {/* Desktop header */}
          <div className="hidden flex-row-reverse items-center justify-between gap-3 px-6 py-4 lg:flex">
            <div className="min-w-0 text-right">
              <p className="truncate font-display text-xl font-black text-forest-deep">{title}</p>
              <p className="text-xs text-muted-foreground">إدارة نسيج</p>
            </div>
            <AdminLogo size="sm" showText={false} variant="light" className="shrink-0" />
          </div>
        </header>

        <main
          className={cn(
            "flex-1 overflow-x-hidden p-4 sm:p-6",
            "pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-6",
          )}
        >
          <AdminStoreGate>
            <Outlet />
          </AdminStoreGate>
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}
