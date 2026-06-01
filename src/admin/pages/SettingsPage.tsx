import { useState } from "react";
import { Save, Truck } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";
import { replaceShipping } from "@/lib/store";
import type { ShippingSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPageShell } from "@/admin/components/AdminPageShell";

export function SettingsPage() {
  const { shipping: saved } = useStore();
  const [draft, setDraft] = useState<ShippingSettings>(() => structuredClone(saved));

  const updateFee = (governorate: string, fee: number) => {
    setDraft((d) => ({
      ...d,
      governorateFees: d.governorateFees.map((g) =>
        g.governorate === governorate ? { ...g, fee } : g,
      ),
    }));
  };

  const applyDefaultToAll = () => {
    setDraft((d) => ({
      ...d,
      governorateFees: d.governorateFees.map((g) => ({ ...g, fee: d.defaultFee })),
    }));
    toast.info("تم تطبيق الرسوم الافتراضية على كل المحافظات");
  };

  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await replaceShipping(draft);
      toast.success("تم حفظ إعدادات الشحن");
    } catch {
      toast.error("تعذّر الحفظ. تحقق من الاتصال بقاعدة البيانات.");
    } finally {
      setSaving(false);
    }
  };

  const saveBtn = (
    <Button
      onClick={() => void save()}
      disabled={saving}
      className="w-full gap-2 bg-gradient-forest font-bold sm:w-auto"
    >
      <Save className="h-4 w-4" />
      {saving ? "جاري الحفظ..." : "حفظ"}
    </Button>
  );

  return (
    <AdminPageShell
      title="إعدادات الشحن"
      description="رسوم التوصيل لكل محافظة تُضاف لإجمالي الطلب"
      action={saveBtn}
      className="max-w-3xl"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Truck className="h-5 w-5 text-forest" />
            الرسوم الافتراضية
          </CardTitle>
          <CardDescription className="text-right">
            تُستخدم عند عدم تحديد رسوم خاصة لمحافظة
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-end gap-4 sm:flex-row-reverse sm:items-center">
          <div className="w-full max-w-xs space-y-2 text-right sm:w-auto">
            <Label>رسوم الشحن الافتراضية (جنيه)</Label>
            <Input
              type="number"
              min={0}
              dir="ltr"
              className="text-left"
              value={draft.defaultFee}
              onChange={(e) =>
                setDraft((d) => ({ ...d, defaultFee: Number(e.target.value) || 0 }))
              }
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={applyDefaultToAll}>
            تطبيق على الكل
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">رسوم كل محافظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {draft.governorateFees.map(({ governorate, fee }) => (
              <div
                key={governorate}
                className="flex flex-row-reverse items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <Label className="shrink-0 text-sm font-medium">{governorate}</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    dir="ltr"
                    className="h-9 w-24 text-left"
                    value={fee}
                    onChange={(e) => updateFee(governorate, Number(e.target.value) || 0)}
                  />
                  <span className="text-xs text-muted-foreground">ج</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-stretch sm:justify-end">
        <Button
          onClick={() => void save()}
          disabled={saving}
          className="w-full gap-2 bg-gradient-forest font-bold sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </AdminPageShell>
  );
}
