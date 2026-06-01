import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/providers/StoreProvider";
import { LandingPage } from "@/pages/LandingPage";
import { AdminLayout } from "@/admin/layout/AdminLayout";
import { ProtectedRoute } from "@/admin/components/ProtectedRoute";
import { LoginPage } from "@/admin/pages/LoginPage";
import { DashboardPage } from "@/admin/pages/DashboardPage";
import { ProductsPage } from "@/admin/pages/ProductsPage";
import { OrdersPage } from "@/admin/pages/OrdersPage";
import { SettingsPage } from "@/admin/pages/SettingsPage";

export default function App() {
  return (
    <StoreProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" richColors dir="rtl" />
    </BrowserRouter>
    </StoreProvider>
  );
}
