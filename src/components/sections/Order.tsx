import { useState, useMemo, type FormEvent, type ReactNode, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Minus,
  Plus,
  Sparkles,
  MessageCircle,
  ShoppingBag,
  ChevronDown,
  X,
  Truck,
} from "lucide-react";
import { explorerCharacter } from "@/assets/characters";
import productBox from "@/assets/product5.jpg";
import { BlinkingExplorer } from "@/components/shared/BlinkingExplorer";
import { ForestCharacter } from "@/components/shared/ForestCharacter";
import { Fireflies } from "./Fireflies";
import { useStore } from "@/hooks/useStore";
import { createOrder } from "@/lib/store";
import { GOVERNORATES } from "@/lib/governorates";
import { orderLineTotal, calcDiscountPercent } from "@/lib/pricing";
import { formatNumber, formatPrice } from "@/lib/format";
import { formatShippingFee, resolveShippingFee } from "@/lib/shipping";
import { EnNum } from "@/components/shared/EnNum";
import { resolveSlideImage } from "@/lib/imageAssets";
import { toast } from "sonner";

const governorates = [...GOVERNORATES];

// Searchable Select Component
function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    onChange("");
    setSearchTerm("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const displayValue = value || "";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : displayValue}
            onChange={(e) => {
              if (isOpen) {
                setSearchTerm(e.target.value);
                setHighlightedIndex(-1);
              } else {
                setIsOpen(true);
                setSearchTerm(e.target.value);
              }
            }}
            onFocus={() => {
              setIsOpen(true);
              setSearchTerm("");
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required && !value}
            className="w-full rounded-lg border border-forest/20 bg-white px-3 py-2 pr-8 text-sm text-forest-deep outline-none transition placeholder:text-forest-deep/40 focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
          {displayValue && !isOpen ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <ChevronDown
              className={`absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-forest/20 bg-white shadow-lg ring-1 ring-forest/10">
          {filteredOptions.length > 0 ? (
            <div ref={listRef}>
              {filteredOptions.map((option, idx) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full px-3 py-2 text-right text-sm transition-colors ${
                    highlightedIndex === idx
                      ? "bg-forest/10 text-forest-deep"
                      : value === option
                      ? "bg-forest/5 text-forest-deep font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option}
                  {value === option && (
                    <Check className="inline mr-2 h-3.5 w-3.5 text-forest" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-center text-sm text-gray-500">
              لا توجد نتائج
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Order() {
  const { catalog, shipping, isLoading, isReady } = useStore();
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gov: "",
    address: "",
    notes: "",
  });

  const unitPrice = catalog.priceAfter;
  const shippingFee = useMemo(
    () => (form.gov ? resolveShippingFee(form.gov, shipping) : 0),
    [form.gov, shipping],
  );
  const { subtotal, total } = orderLineTotal(unitPrice, qty, shippingFee);
  const showOffer =
    catalog.offerEnabled && catalog.priceBefore > catalog.priceAfter;
  const discount = showOffer
    ? calcDiscountPercent(catalog.priceBefore, catalog.priceAfter)
    : 0;
  const productImage =
    catalog.slides[0]?.imageUrl != null
      ? resolveSlideImage(catalog.slides[0].imageUrl)
      : productBox;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isReady || submitting) return;
    setSubmitting(true);
    try {
      const order = await createOrder({
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        governorate: form.gov,
        address: form.address.trim(),
        notes: form.notes.trim(),
        quantity: qty,
      });
      setOrderNumber(order.orderNumber);
      setSubmitted(true);
      toast.success("تم استلام طلبك بنجاح");
    } catch {
      toast.error("تعذّر إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `مرحباً! أود طلب مغامرات نسيج في الغابة السحرية\nرقم الطلب: ${orderNumber}\nالكمية: ${qty}\nالمجموع: ${subtotal} ج\nالشحن: ${shippingFee} ج\nالإجمالي: ${total} ج\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالمحافظة: ${form.gov}\nالعنوان: ${form.address}\nملاحظات: ${form.notes}`,
  );

  return (
    <section
      id="order"
      className="order-forest-section relative isolate scroll-mt-20 overflow-hidden py-8 pb-24 sm:py-10 sm:pb-10"
    >
      <div className="absolute inset-0 bg-gradient-forest" />
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,oklch(0.75_0.14_85/0.14)_0%,transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,oklch(0.55_0.12_145/0.22)_0%,transparent_48%)]" />
      <Fireflies count={20} />

      {/* Desktop explorer — anchored to bottom of section */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute bottom-0 left-0 z-10 hidden w-[min(22vw,180px)] md:block lg:w-[200px]"
      >
        <ForestCharacter
          src={explorerCharacter}
          alt="مستكشف الغابة"
          className="w-full translate-y-[8%] drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      {/* Mobile explorer — bottom corner only, not inside the form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-[min(32vw,120px)] md:hidden"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <BlinkingExplorer className="w-full translate-y-[10%] drop-shadow-[0_16px_28px_rgba(0,0,0,0.45)]" />
        </motion.div>
      </motion.div>

      <div className="container relative z-20 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-5 max-w-2xl text-center sm:mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-2.5 py-0.5 text-xs font-bold text-forest-deep shadow-lg">
            <Sparkles className="h-3 w-3" />
            الكمية محدودة
          </span>
          <h2 className="text-glow-gold mt-2 font-display text-2xl font-black text-cream sm:text-3xl md:text-4xl">
            ابدأ مغامرتك اليوم
          </h2>
          <p className="mt-1 text-sm text-[oklch(0.95_0.02_88)] sm:text-base">
            مغامرات نسيج في الغابة السحرية
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl items-start gap-5 lg:grid-cols-3 lg:gap-6">
          {/* Product Card - takes 1/3 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-white/35 bg-[oklch(0.2_0.05_150/0.72)] p-4 shadow-magic backdrop-blur-xl sm:p-5 lg:col-span-1"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-t from-gold/40 to-transparent blur-3xl" />
              <img
                src={productImage}
                alt="صندوق الغابة السحرية"
                loading="lazy"
                className="relative mx-auto w-full max-w-[160px] animate-float-y animate-shimmer sm:max-w-[180px]"
              />
            </div>

            <ul className="mt-3 space-y-1.5 sm:mt-4">
              {catalog.features.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-[oklch(0.98_0.02_92)]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold shadow-sm">
                    <Check className="h-3 w-3 text-forest-deep" strokeWidth={3} />
                  </span>
                  <span className="text-xs font-medium leading-snug sm:text-sm">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 border-t border-white/30 pt-3 sm:mt-4 sm:pt-3">
              <div>
                {showOffer && (
                  <p className="mb-1 text-xs text-cream/75 line-through">
                    <EnNum>{formatPrice(catalog.priceBefore)}</EnNum>
                    {discount > 0 && (
                      <>
                        {" · خصم "}
                        <EnNum>{formatNumber(discount)}%</EnNum>
                      </>
                    )}
                  </p>
                )}
                <p className="text-glow-gold font-display text-2xl font-black text-[oklch(0.9_0.16_85)] sm:text-3xl">
                  <EnNum>{formatPrice(unitPrice)}</EnNum>{" "}
                  <span className="text-base font-bold text-cream/90 sm:text-lg">/ للصندوق</span>
                </p>
              </div>
              {form.gov && (
                <p className="mt-2 text-[11px] text-cream/80">
                  شحن إلى {form.gov}:{" "}
                  <span className="font-bold text-[oklch(0.9_0.16_85)]">
                    <EnNum>{formatShippingFee(shippingFee)}</EnNum>
                  </span>
                </p>
              )}
            </div>
          </motion.div>

          {/* Form Card - takes 2/3 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-[oklch(0.9_0.03_90)] bg-[oklch(0.99_0.015_92)] p-4 shadow-magic sm:p-5 lg:col-span-2"
          >
            <div className="relative z-10">
            {submitted ? (
              <div className="py-5 text-center sm:py-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-forest shadow-glow">
                  <Check className="h-7 w-7 text-cream" strokeWidth={3} />
                </div>
                <h3 className="mt-3 font-display text-lg font-black text-forest-deep sm:text-xl">
                  تم استلام طلبك بنجاح! 🌿
                </h3>
                {orderNumber && (
                  <p className="mt-2 text-sm font-bold text-forest">
                    رقم الطلب: <EnNum className="font-mono">{orderNumber}</EnNum>
                  </p>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                  سنتواصل معك خلال ساعات قليلة لتأكيد الطلب وتفاصيل التوصيل.
                </p>
                <a
                  href={`https://wa.me/?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[oklch(0.65_0.18_145)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[oklch(0.6_0.2_145)] sm:text-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  متابعة عبر واتساب
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-2.5">
                <h3 className="mb-0.5 font-display text-lg font-black text-forest-deep sm:text-xl">
                  معلومات الطلب
                </h3>

                {/* Two-column grid for form fields */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <Field label="الاسم بالكامل">
                    <input
                      required
                      maxLength={80}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="رقم الهاتف">
                    <input
                      required
                      type="tel"
                      maxLength={20}
                      pattern="[0-9+\s]+"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="المحافظة">
                    <SearchableSelect
                      required
                      value={form.gov}
                      onChange={(val) => setForm({ ...form, gov: val })}
                      options={governorates}
                      placeholder="ابحث أو اختر المحافظة"
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <AnimatePresence mode="wait">
                      {form.gov ? (
                        <motion.div
                          key={form.gov}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className={`flex flex-row-reverse items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                            shippingFee === 0
                              ? "border-emerald-400/50 bg-emerald-50"
                              : "border-forest/35 bg-[oklch(0.96_0.03_145)]"
                          }`}
                        >
                          <div className="flex flex-row-reverse items-center gap-2 text-forest-deep">
                            <Truck className="h-5 w-5 shrink-0 text-forest" />
                            <div className="text-right">
                              <p className="text-sm font-bold">رسوم الشحن إلى {form.gov}</p>
                              <p className="text-xs text-muted-foreground">
                                حسب أسعار التوصيل المحددة في إعدادات المتجر
                              </p>
                            </div>
                          </div>
                          <p
                            className={`shrink-0 font-display text-xl font-black ${
                              shippingFee === 0 ? "text-emerald-800" : "text-forest-deep"
                            }`}
                          >
                            <EnNum>{formatShippingFee(shippingFee)}</EnNum>
                          </p>
                        </motion.div>
                      ) : (
                        <motion.p
                          key="hint"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground"
                        >
                          اختر المحافظة لعرض رسوم الشحن قبل إتمام الطلب
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <Field label="العنوان">
                    <input
                      required
                      maxLength={200}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="ملاحظات إضافية">
                  <textarea
                    maxLength={500}
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className={inputCls}
                  />
                </Field>

                <div className="flex items-center justify-between rounded-xl border border-forest/15 bg-white p-2.5">
                  <span className="text-sm font-bold text-forest-deep">الكمية</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/25 bg-white text-forest-deep shadow-sm transition hover:bg-forest hover:text-cream"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <EnNum className="min-w-6 text-center text-lg font-black text-forest-deep">
                      {formatNumber(qty)}
                    </EnNum>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(10, qty + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/25 bg-white text-forest-deep shadow-sm transition hover:bg-forest hover:text-cream"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 rounded-xl border border-forest/15 bg-white px-3 py-2.5 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-forest-deep/70">
                      المجموع (<EnNum>{formatNumber(qty)}</EnNum>×)
                    </span>
                    <EnNum className="font-semibold text-forest-deep">{formatPrice(subtotal)}</EnNum>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-forest-deep/70">
                      الشحن{form.gov ? ` — ${form.gov}` : ""}
                    </span>
                    <span
                      className={`font-semibold ${form.gov ? "text-forest-deep" : "text-forest-deep/50"}`}
                    >
                      {form.gov ? (
                        <EnNum>{formatShippingFee(shippingFee)}</EnNum>
                      ) : (
                        "يُحسب بعد اختيار المحافظة"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-forest/15 pt-1.5 font-bold text-forest-deep">
                    <span>الإجمالي</span>
                    <EnNum className="font-display text-lg text-forest">{formatPrice(total)}</EnNum>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isReady || submitting || isLoading}
                  className="mt-1.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-forest py-2.5 text-sm font-bold text-cream shadow-magic transition-all hover:scale-[1.02] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {submitting ? "جاري إرسال الطلب..." : "اطلب الآن"}
                </button>

              </form>
            )}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-lg border border-forest/20 bg-white px-3 py-2 text-sm text-forest-deep outline-none transition placeholder:text-forest-deep/40 focus:border-forest focus:ring-2 focus:ring-forest/20";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-xs font-bold text-forest-deep">{label}</span>
      {children}
    </label>
  );
}