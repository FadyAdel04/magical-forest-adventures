import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Plus, Sparkles, MessageCircle, ShoppingBag } from "lucide-react";
import clearing from "@/assets/clearing.jpg";
import box from "@/assets/product-box.png.asset.json";
import { Fireflies } from "./Fireflies";

const checklist = [
  "17 قصة تفاعلية",
  "17 تجربة استماع QR",
  "2 شمعة غابة عطرية",
  "4 مجموعات بازل",
  "تجربة تعليمية متكاملة",
];

const governorates = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "القليوبية",
  "كفر الشيخ", "الغربية", "المنوفية", "البحيرة", "الإسماعيلية", "بورسعيد",
  "السويس", "المنيا", "بني سويف", "الفيوم", "أسيوط", "سوهاج", "قنا",
  "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح", "شمال سيناء",
  "جنوب سيناء", "دمياط",
];

export function Order() {
  const [qty, setQty] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", gov: "", address: "", notes: "",
  });

  const price = 699;
  const total = price * qty;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMsg = encodeURIComponent(
    `مرحباً! أود طلب مغامرات الحروف في الغابة السحرية\nالكمية: ${qty}\nالإجمالي: ${total} جنيه`
  );

  return (
    <section id="order" className="relative py-24 sm:py-32 overflow-hidden">
      <img src={clearing} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.2_0.05_150/0.85)] via-[oklch(0.22_0.06_148/0.75)] to-[oklch(0.18_0.05_150/0.9)]" />
      <Fireflies count={25} />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-1.5 text-sm font-bold text-forest-deep shadow-lg">
            <Sparkles className="h-4 w-4" /> الكمية محدودة
          </span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-black text-cream text-glow-gold">
            ابدأ مغامرتك اليوم
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-[oklch(0.95_0.02_88)]">
            مغامرات الحروف في الغابة السحرية
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
          {/* Left: product + checklist */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-magic"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-gold)]/40 to-transparent blur-3xl" />
              <img
                src={box.url}
                alt="صندوق الغابة السحرية"
                loading="lazy"
                className="relative w-full max-w-sm mx-auto animate-float-y animate-shimmer"
              />
            </div>

            <ul className="mt-8 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-cream">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center">
                    <Check className="h-4 w-4 text-forest-deep" strokeWidth={3} />
                  </span>
                  <span className="text-base sm:text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-end justify-between border-t border-white/20 pt-6">
              <div>
                <p className="text-cream/70 text-sm">السعر</p>
                <p className="font-display text-5xl sm:text-6xl font-black text-gold text-glow-gold">
                  {price} <span className="text-2xl sm:text-3xl">جنيه</span>
                </p>
              </div>
              <p className="text-cream/80 text-sm">شامل التوصيل لجميع المحافظات</p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-cream p-7 sm:p-9 shadow-magic"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-forest mx-auto flex items-center justify-center shadow-glow">
                  <Check className="h-10 w-10 text-cream" strokeWidth={3} />
                </div>
                <h3 className="mt-6 font-display text-3xl font-black text-forest-deep">تم استلام طلبك بنجاح! 🌿</h3>
                <p className="mt-3 text-muted-foreground">سنتواصل معك خلال ساعات قليلة لتأكيد الطلب وتفاصيل التوصيل.</p>
                <a
                  href={`https://wa.me/?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[oklch(0.65_0.18_145)] hover:bg-[oklch(0.6_0.2_145)] text-white px-6 py-3 font-bold transition"
                >
                  <MessageCircle className="h-5 w-5" /> متابعة عبر واتساب
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <h3 className="font-display text-2xl sm:text-3xl font-black text-forest-deep mb-2">معلومات الطلب</h3>

                <Field label="الاسم بالكامل">
                  <input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                </Field>
                <Field label="رقم الهاتف">
                  <input required type="tel" maxLength={20} pattern="[0-9+\s]+" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                </Field>
                <Field label="المحافظة">
                  <select required value={form.gov} onChange={(e) => setForm({ ...form, gov: e.target.value })} className={inputCls}>
                    <option value="">اختر المحافظة</option>
                    {governorates.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="العنوان">
                  <input required maxLength={200} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
                </Field>
                <Field label="ملاحظات إضافية">
                  <textarea maxLength={500} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} />
                </Field>

                <div className="flex items-center justify-between rounded-2xl bg-secondary p-4">
                  <span className="font-bold text-forest-deep">الكمية</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-forest hover:text-white transition"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center font-black text-xl text-forest-deep">{qty}</span>
                    <button type="button" onClick={() => setQty(Math.min(10, qty + 1))} className="w-9 h-9 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-forest hover:text-white transition"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-muted-foreground">الإجمالي</span>
                  <span className="font-display text-3xl font-black text-forest">{total} جنيه</span>
                </div>

                <button type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-forest text-cream font-bold text-lg py-4 shadow-magic hover:shadow-glow hover:scale-[1.02] transition-all">
                  <ShoppingBag className="h-5 w-5" /> اطلب الآن
                </button>

                <a
                  href={`https://wa.me/?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[oklch(0.65_0.18_145)] text-[oklch(0.45_0.2_145)] font-bold py-3 hover:bg-[oklch(0.65_0.18_145)] hover:text-white transition"
                >
                  <MessageCircle className="h-5 w-5" /> اطلب عبر واتساب
                </a>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-forest-deep outline-none transition focus:border-[var(--color-forest)] focus:ring-4 focus:ring-[var(--color-forest)]/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-forest-deep mb-1.5">{label}</span>
      {children}
    </label>
  );
}
