import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/providers/StoreProvider";
import { LandingPage } from "@/pages/LandingPage";

// ── Admin routes — lazy-loaded so they are NEVER shipped to landing page visitors ──
const AdminLayout = lazy(() =>
  import("@/admin/layout/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const ProtectedRoute = lazy(() =>
  import("@/admin/components/ProtectedRoute").then((m) => ({
    default: m.ProtectedRoute,
  })),
);
const LoginPage = lazy(() =>
  import("@/admin/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import("@/admin/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const ProductsPage = lazy(() =>
  import("@/admin/pages/ProductsPage").then((m) => ({
    default: m.ProductsPage,
  })),
);
const OrdersPage = lazy(() =>
  import("@/admin/pages/OrdersPage").then((m) => ({ default: m.OrdersPage })),
);
const SettingsPage = lazy(() =>
  import("@/admin/pages/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  })),
);

/** Minimal spinner shown while admin chunks load */
function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground text-sm">
      جاري التحميل…
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </Suspense>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<AdminFallback />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="products"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <ProductsPage />
                </Suspense>
              }
            />
            <Route
              path="orders"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <OrdersPage />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <SettingsPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" richColors dir="rtl" />
      </BrowserRouter>
    </StoreProvider>
  );
}
