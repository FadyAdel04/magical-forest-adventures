import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, Save, Percent } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";
import { replaceCatalog } from "@/lib/store";
import { calcDiscountPercent, calcSavings } from "@/lib/pricing";
import type { ProductCatalog, ProductFeature, ProductSlide } from "@/lib/types";
import { resolveSlideImage } from "@/lib/imageAssets";
import { RtlSwitch } from "@/admin/components/RtlSwitch";
import { ImageUploadField } from "@/admin/components/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AdminPageShell } from "@/admin/components/AdminPageShell";

function uid() {
  return crypto.randomUUID();
}

export function ProductsPage() {
  const { catalog: saved } = useStore();
  const [draft, setDraft] = useState<ProductCatalog>(() => structuredClone(saved));

  useEffect(() => {
    setDraft(structuredClone(saved));
  }, [saved.updatedAt, saved.id]);

  const discount = useMemo(
    () => calcDiscountPercent(draft.priceBefore, draft.priceAfter),
    [draft.priceBefore, draft.priceAfter],
  );
  const savings = useMemo(
    () => calcSavings(draft.priceBefore, draft.priceAfter),
    [draft.priceBefore, draft.priceAfter],
  );

  const update = (patch: Partial<ProductCatalog>) => {
    setDraft((d) => ({ ...d, ...patch }));
  };

  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (draft.priceAfter <= 0) {
      toast.error("سعر البيع يجب أن يكون أكبر من صفر");
      return;
    }
    if (draft.offerEnabled && draft.priceAfter > draft.priceBefore) {
      toast.error("سعر البيع يجب أن يكون أقل من أو يساوي السعر قبل الخصم");
      return;
    }
    setSaving(true);
    try {
      await replaceCatalog(draft);
      toast.success("تم حفظ بيانات المنتج — ستظهر على الموقع فوراً");
    } catch {
      toast.error("تعذّر الحفظ. تحقق من الاتصال بقاعدة البيانات.");
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (id: string, text: string) => {
    setDraft((d) => ({
      ...d,
      features: d.features.map((f) => (f.id === id ? { ...f, text } : f)),
    }));
  };

  const addFeature = () => {
    setDraft((d) => ({
      ...d,
      features: [...d.features, { id: uid(), text: "ميزة جديدة" }],
    }));
  };

  const removeFeature = (id: string) => {
    setDraft((d) => ({ ...d, features: d.features.filter((f) => f.id !== id) }));
  };

  const updateSlide = (id: string, patch: Partial<ProductSlide>) => {
    setDraft((d) => ({
      ...d,
      slides: d.slides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const addSlide = () => {
    const first = draft.slides[0]?.imageUrl ?? "";
    setDraft((d) => ({
      ...d,
      slides: [
        ...d.slides,
        { id: uid(), imageUrl: first, title: "عنوان جديد", caption: "وصف قصير" },
      ],
    }));
  };

  const removeSlide = (id: string) => {
    if (draft.slides.length <= 1) {
      toast.error("يجب الإبقاء على صورة واحدة على الأقل");
      return;
    }
    setDraft((d) => ({ ...d, slides: d.slides.filter((s) => s.id !== id) }));
  };

  const saveBtn = (
    <Button
      onClick={() => void save()}
      disabled={saving}
      className="w-full gap-2 bg-gradient-forest font-bold sm:w-auto"
    >
      <Save className="h-4 w-4" />
      {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
    </Button>
  );

  return (
    <AdminPageShell
      title="إدارة المنتج"
      description="عدّل الصور والتفاصيل والأسعار — يظهر العرض على الموقع مباشرة"
      action={saveBtn}
      className="max-w-4xl"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-display text-lg">معلومات أساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RtlSwitch
            id="product-active"
            label="المنتج ظاهر على الموقع"
            description="عند الإيقاف يختفي قسم المنتج من الصفحة الرئيسية"
            checked={draft.active}
            onCheckedChange={(active) => update({ active })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-right block">الشارة</Label>
              <Input
                value={draft.badge}
                onChange={(e) => update({ badge: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">عنوان (جزء 1)</Label>
              <Input
                value={draft.title}
                onChange={(e) => update({ title: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">عنوان (مميز)</Label>
              <Input
                value={draft.titleHighlight}
                onChange={(e) => update({ titleHighlight: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-right block">الوصف</Label>
              <Textarea
                rows={3}
                value={draft.description}
                onChange={(e) => update({ description: e.target.value })}
                className="text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-right font-display text-lg">التسعير والعروض</CardTitle>
          <CardDescription className="text-right">
            السعر قبل وبعد الخصم مع حساب نسبة التوفير تلقائياً
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RtlSwitch
            id="offer-enabled"
            label="تفعيل عرض السعر"
            description="إظهار السعر القديم مشطوباً ونسبة الخصم على الموقع"
            checked={draft.offerEnabled}
            onCheckedChange={(offerEnabled) => update({ offerEnabled })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-right block">السعر قبل الخصم (جنيه)</Label>
              <Input
                type="number"
                min={0}
                dir="ltr"
                className="text-left"
                value={draft.priceBefore}
                onChange={(e) => update({ priceBefore: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">سعر البيع (جنيه)</Label>
              <Input
                type="number"
                min={0}
                dir="ltr"
                className="text-left"
                value={draft.priceAfter}
                onChange={(e) => update({ priceAfter: Number(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gold/30 bg-gold/10 p-4 text-right">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Percent className="h-4 w-4 text-forest" />
              <span className="text-sm font-bold text-forest-deep">ملخص العرض</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
              {draft.offerEnabled && discount > 0 && (
                <Badge className="bg-forest text-cream">خصم {discount}%</Badge>
              )}
              <p className="text-sm text-muted-foreground">
                توفير{" "}
                <span className="font-bold text-forest">{savings.toLocaleString("ar-EG")}</span>{" "}
                {draft.currency}
              </p>
              <p className="font-display text-lg font-black text-forest">
                سعر البيع: {draft.priceAfter.toLocaleString("ar-EG")} {draft.currency}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
          <div className="text-right">
            <CardTitle className="font-display text-lg">معرض الصور</CardTitle>
            <CardDescription>ارفع صورة وعدّل العنوان والوصف لكل شريحة</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={addSlide}>
            <Plus className="h-4 w-4" />
            إضافة
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {draft.slides.map((slide, index) => (
            <div key={slide.id} className="space-y-4 rounded-xl border p-4">
              <div className="flex flex-row-reverse items-center justify-between">
                <span className="text-sm font-bold text-forest">صورة {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeSlide(slide.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <ImageUploadField
                label="صورة المنتج"
                value={slide.imageUrl}
                onChange={(imageUrl) => updateSlide(slide.id, { imageUrl })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-right block">عنوان الشريحة</Label>
                  <Input
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-right block">الوصف القصير</Label>
                  <Input
                    value={slide.caption}
                    onChange={(e) => updateSlide(slide.id, { caption: e.target.value })}
                    className="text-right"
                  />
                </div>
              </div>
              {slide.imageUrl && (
                <img
                  src={resolveSlideImage(slide.imageUrl)}
                  alt={slide.title}
                  className="mx-auto max-h-40 rounded-lg object-contain"
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row-reverse items-center justify-between">
          <CardTitle className="font-display text-lg">المميزات</CardTitle>
          <Button variant="outline" size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {draft.features.map((f: ProductFeature) => (
            <div key={f.id} className="flex flex-row-reverse gap-2">
              <Input
                value={f.text}
                onChange={(e) => updateFeature(f.id, e.target.value)}
                className="text-right"
              />
              <Button variant="ghost" size="icon" onClick={() => removeFeature(f.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-stretch sm:justify-end">{saveBtn}</div>
    </AdminPageShell>
  );
}
