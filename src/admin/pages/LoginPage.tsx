import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";
import { AdminLogo } from "@/admin/components/AdminLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/admin";

  useEffect(() => {
    if (isAuthenticated()) navigate(from, { replace: true });
  }, [from, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (login(password)) {
      toast.success("تم تسجيل الدخول");
      navigate(from, { replace: true });
    } else {
      toast.error("كلمة المرور غير صحيحة");
    }
    setLoading(false);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-forest p-4"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 hero-vignette" />
      <Card className="relative z-10 w-full max-w-md shadow-magic">
        <CardHeader className="flex flex-col items-center text-center">
          <AdminLogo size="lg" variant="light" className="mb-2 flex-col sm:flex-col" />
          <CardTitle className="font-display text-2xl">لوحة إدارة نسيج</CardTitle>
          <CardDescription>أدخل كلمة المرور للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-right">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 text-right"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-forest font-bold" disabled={loading}>
              {loading ? "جاري الدخول..." : "دخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
