import { useState, useMemo, type FormEvent, type ReactNode, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Minus,
  Plus,
  Sparkles,
  ShoppingBag,
  ChevronDown,
  X,
  Truck,
} from "lucide-react";
import { ForestCharacter } from "@/components/shared/ForestCharacter";
import { Fireflies } from "./Fireflies";
import { useStore } from "@/hooks/useStore";
import { createOrder } from "@/lib/store";
import { GOVERNORATES } from "@/lib/governorates";
import { orderLineTotal, calcDiscountPercent } from "@/lib/pricing";
import { formatNumber, formatPrice } from "@/lib/format";
import { formatShippingFee, resolveShippingFee } from "@/lib/shipping";
import { EnNum } from "@/components/shared/EnNum";
import { buildOrderWhatsAppMessage, buildWhatsAppUrl, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import {
  validateOrderForm,
  type OrderFormErrors,
  type OrderFormField,
} from "@/lib/order-form-validation";
import { formatPhoneInput } from "@/lib/phone-validation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import char from "@/assets/Layer 7.png";

const governorates = [...GOVERNORATES];

// Searchable Select Component with glass design
function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  required,
  hasError,
  describedBy,
  onBlur,
}: {
  id: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  hasError?: boolean;
  describedBy?: string;
  onBlur?: () => void;
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
            id={id}
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
            onBlur={() => {
              window.setTimeout(() => {
                if (!dropdownRef.current?.contains(document.activeElement)) {
                  onBlur?.();
                }
              }, 150);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required && !value}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            autoComplete="address-level1"
            className={cn(inputCls, hasError && inputErrorCls)}
          />
          {displayValue && !isOpen ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <ChevronDown
              className={`absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                }`}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white/95 backdrop-blur-lg shadow-lg ring-1 ring-white/30">
          {filteredOptions.length > 0 ? (
            <div ref={listRef}>
              {filteredOptions.map((option, idx) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full px-3 py-2 text-right text-sm transition-colors ${highlightedIndex === idx
                    ? "bg-forest/20 text-forest-deep"
                    : value === option
                      ? "bg-forest/10 text-forest-deep font-medium"
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
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gov: "",
    address: "",
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<OrderFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<OrderFormField, boolean>>>({});

  const clearFieldError = (field: OrderFormField) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const touchField = (field: OrderFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors } = validateOrderForm(form);
    if (errors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
    } else {
      clearFieldError(field);
    }
  };

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
  const savingsPerBox = showOffer ? catalog.priceBefore - catalog.priceAfter : 0;
  const totalSavings = savingsPerBox * qty;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isReady || submitting) return;

    const { errors, normalizedPhone } = validateOrderForm(form);
    if (Object.keys(errors).length > 0 || !normalizedPhone) {
      setFieldErrors(errors);
      setTouched({
        name: true,
        phone: true,
        gov: true,
        address: true,
        notes: true,
      });
      toast.error("يرجى تصحيح البيانات قبل إرسال الطلب");
      const firstKey = (Object.keys(errors)[0] ?? "phone") as OrderFormField;
      document.getElementById(`order-${firstKey}`)?.focus();
      return;
    }

    if (!form.gov) {
      toast.error("اختر المحافظة لحساب الشحن");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        customerName: form.name.trim(),
        phone: normalizedPhone,
        governorate: form.gov,
        address: form.address.trim(),
        notes: form.notes.trim(),
        quantity: qty,
      });
      setOrderNumber(order.orderNumber);
      setSubmittedPhone(normalizedPhone);
      setSubmitted(true);
      setFieldErrors({});
      toast.success("تم استلام طلبك بنجاح");
    } catch {
      toast.error("تعذّر إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = useMemo(() => {
    if (!submitted || !orderNumber) return null;
    const message = buildOrderWhatsAppMessage({
      orderNumber,
      quantity: qty,
      subtotal,
      shippingFee,
      total,
      name: form.name.trim(),
      phone: submittedPhone || form.phone.trim(),
      governorate: form.gov,
      address: form.address.trim(),
      notes: form.notes.trim(),
      currency: catalog.currency,
    });
    return buildWhatsAppUrl(message);
  }, [
    submitted,
    orderNumber,
    qty,
    subtotal,
    shippingFee,
    total,
    form.name,
    submittedPhone,
    form.phone,
    form.gov,
    form.address,
    form.notes,
    catalog.currency,
  ]);

  return (
    <section
      id="order"
      className="order-forest-section relative isolate scroll-mt-20 overflow-hidden py-8 pb-24 sm:py-10 sm:pb-10"
    >
      <div className="absolute inset-0 bg-[#1c290d]" />
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
        className="pointer-events-none absolute bottom-0 left-0 z-10 hidden md:block"
        style={{ width: 'min(28vw, 260px)' }}
      >
        <ForestCharacter
          src={char}
          alt="مستكشف الغابة"
          className="w-full translate-y-[8%] drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
          style={{
            filter: 'brightness(1.05) contrast(1.02)'
          }}
        />
      </motion.div>

      {/* Mobile explorer — bottom corner only */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute bottom-0 right-50 z-10 md:hidden"
        style={{ width: 'min(55vw, 260px)', bottom: '-2%' }}
        aria-hidden
      >
        <div className="relative">
          {/* Shadow under character */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-3 rounded-full bg-black/30 blur-md"></div>

          <div className="animate-float-y" style={{ marginBottom: '-8%' }}>
            <ForestCharacter
              src={char}
              alt="مستكشف الغابة"
              className="w-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)]"
              style={{
                filter: 'brightness(1.05) contrast(1.02)'
              }}
            />
          </div>

          {/* Adventure sparkle effect */}
          <div className="absolute -top-4 -right-2 w-10 h-10 rounded-full bg-gold/20 blur-md animate-pulse"></div>
          <div className="absolute bottom-10 -left-3 w-6 h-6 rounded-full bg-forest/20 blur-lg"></div>
        </div>
      </motion.div>

      <div className="container relative z-20 mx-auto max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-5 text-center sm:mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-2.5 py-0.5 text-xs font-bold text-forest-deep shadow-lg">
            <Sparkles className="h-3 w-3" />
            الكمية محدودة
          </span>
          <h2 className="text-glow-gold mt-2 font-display text-2xl font-black text-cream sm:text-3xl md:text-4xl">
            ابدأ مغامرتك اليوم
          </h2>
          <p className="mt-1 text-sm text-cream/90 sm:text-base">
            مغامرات نسيج في الغابة السحرية
          </p>
        </motion.div>

        {/* Glass Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl p-4 sm:p-6"
        >
          {/* Price Summary Card - Glass */}
          <div className="mb-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                {showOffer && (
                  <div className="mb-1.5">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-full bg-gold/25 px-2 py-0.5 text-xs font-bold text-[oklch(0.45_0.1_65)]">
                        خصم <EnNum>{formatNumber(discount)}%</EnNum>
                      </span>
                      <div className="relative inline-flex">
                        <span className="absolute inset-0 flex items-center">
                          <span className="h-px w-full bg-cream/50"></span>
                        </span>
                        <span className="relative text-sm font-bold text-cream/70">
                          <EnNum>{formatPrice(catalog.priceBefore)}</EnNum>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-cream/80">
                      <Sparkles className="h-3 w-3 text-gold" />
                      <span className="text-xs font-medium">
                        أنت توفر <EnNum>{savingsPerBox} </EnNum> جنيه لكل صندوق!
                      </span>
                    </div>
                  </div>
                )}
                <p className="font-display text-2xl font-black text-cream sm:text-3xl">
                  <EnNum>{formatPrice(unitPrice)}</EnNum>{" "}
                  <span className="text-sm font-bold text-cream/70">/ للصندوق</span>
                </p>
              </div>
              {form.gov && (
                <p className="text-xs text-cream/80">
                  شحن إلى {form.gov}:{" "}
                  <span className="font-bold text-cream">
                    <EnNum>{formatShippingFee(shippingFee)}</EnNum>
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="relative z-10">
            {submitted ? (
              <div className="py-5 text-center sm:py-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-forest shadow-glow">
                  <Check className="h-7 w-7 text-cream" strokeWidth={3} />
                </div>
                <h3 className="mt-3 font-display text-lg font-black text-cream sm:text-xl">
                  تم استلام طلبك بنجاح! 🌿
                </h3>
                {orderNumber && (
                  <p className="mt-2 text-sm font-bold text-cream/90">
                    رقم الطلب: <EnNum className="font-mono">{orderNumber}</EnNum>
                  </p>
                )}
                <p className="mt-1.5 text-xs text-cream/70 sm:text-sm">
                  أرسل تفاصيل طلبك على واتساب{" "}
                  <span dir="ltr" className="inline font-semibold text-cream">
                    <EnNum>{WHATSAPP_NUMBER_DISPLAY}</EnNum>
                  </span>{" "}
                  لتأكيد الطلب، أو انتظر اتصالنا خلال ساعات قليلة.
                </p>
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full max-w-sm items-center justify-center gap-2.5 rounded-full bg-gradient-forest px-5 py-3 text-sm font-bold text-cream shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:scale-[1.02] sm:w-auto sm:px-6"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0" />
                    إرسال الطلب على واتساب
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-3">
                <h3 className="mb-0.5 font-display text-lg font-black text-cream sm:text-xl">
                  معلومات الطلب
                </h3>
                <p className="text-xs text-cream/70">
                  الحقول بعلامة <span className="text-red-300">*</span> مطلوبة
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="الاسم بالكامل"
                    htmlFor="order-name"
                    required
                    error={touched.name ? fieldErrors.name : undefined}
                  >
                    <input
                      id="order-name"
                      name="name"
                      required
                      autoComplete="name"
                      maxLength={80}
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        clearFieldError("name");
                      }}
                      onBlur={() => touchField("name")}
                      aria-invalid={!!fieldErrors.name}
                      className={cn(inputCls, touched.name && fieldErrors.name && inputErrorCls)}
                    />
                  </Field>
                  <Field
                    label="رقم الهاتف (واتساب)"
                    htmlFor="order-phone"
                    required
                    error={touched.phone ? fieldErrors.phone : undefined}
                  >
                    <input
                      id="order-phone"
                      name="phone"
                      required
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      dir="ltr"
                      maxLength={11}
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: formatPhoneInput(e.target.value) });
                        clearFieldError("phone");
                      }}
                      onBlur={() => touchField("phone")}
                      aria-invalid={!!fieldErrors.phone}
                      className={cn(
                        inputCls,
                        "text-left",
                        touched.phone && fieldErrors.phone && inputErrorCls,
                      )}
                    />
                  </Field>
                  <Field
                    label="المحافظة"
                    htmlFor="order-gov"
                    required
                    error={touched.gov ? fieldErrors.gov : undefined}
                  >
                    <SearchableSelect
                      id="order-gov"
                      required
                      value={form.gov}
                      onChange={(val) => {
                        setForm({ ...form, gov: val });
                        clearFieldError("gov");
                      }}
                      onBlur={() => touchField("gov")}
                      options={governorates}
                      placeholder="ابحث أو اختر المحافظة"
                      hasError={!!(touched.gov && fieldErrors.gov)}
                      describedBy={
                        touched.gov && fieldErrors.gov ? "order-gov-error" : undefined
                      }
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
                          className="flex flex-row-reverse items-center justify-between gap-3 rounded-xl border border-white/30 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md px-4 py-3 shadow-lg"
                        >
                          <div className="flex flex-row-reverse items-center gap-3 text-cream">
                            <div className="rounded-full bg-white/20 p-2">
                              <Truck className="h-5 w-5 shrink-0 text-cream" />
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-cream">
                                رسوم الشحن إلى <span className="text-gold">{form.gov}</span>
                              </p>
                              <p className="text-xs text-cream/70">
                                حسب أسعار التوصيل المحددة في إعدادات المتجر
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 rounded-lg bg-white/20 px-3 py-1.5">
                            <p className="font-display text-xl font-black text-gold">
                              <EnNum>{formatShippingFee(shippingFee)}</EnNum>
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.p
                          key="hint"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-center text-sm text-cream/70 shadow-sm"
                        >
                          🚚 اختر المحافظة لعرض رسوم الشحن قبل إتمام الطلب
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <Field
                    label="العنوان بالتفصيل"
                    htmlFor="order-address"
                    required
                    className="sm:col-span-2"
                    error={touched.address ? fieldErrors.address : undefined}
                  >
                    <input
                      id="order-address"
                      name="address"
                      required
                      autoComplete="street-address"
                      maxLength={200}
                      placeholder="الشارع، المبنى، الدور، علامة مميزة..."
                      value={form.address}
                      onChange={(e) => {
                        setForm({ ...form, address: e.target.value });
                        clearFieldError("address");
                      }}
                      onBlur={() => touchField("address")}
                      aria-invalid={!!fieldErrors.address}
                      className={cn(
                        inputCls,
                        touched.address && fieldErrors.address && inputErrorCls,
                      )}
                    />
                  </Field>
                </div>

                <Field
                  label="ملاحظات إضافية (اختياري)"
                  htmlFor="order-notes"
                  error={touched.notes ? fieldErrors.notes : undefined}
                >
                  <textarea
                    id="order-notes"
                    name="notes"
                    maxLength={500}
                    rows={2}
                    placeholder="أي تعليمات للتوصيل..."
                    value={form.notes}
                    onChange={(e) => {
                      setForm({ ...form, notes: e.target.value });
                      clearFieldError("notes");
                    }}
                    onBlur={() => touchField("notes")}
                    aria-invalid={!!fieldErrors.notes}
                    className={cn(inputCls, touched.notes && fieldErrors.notes && inputErrorCls)}
                  />
                </Field>

                <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-2.5">
                  <span className="text-sm font-bold text-cream">الكمية</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 text-cream shadow-sm transition hover:bg-white/30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <EnNum className="min-w-6 text-center text-lg font-black text-cream">
                      {formatNumber(qty)}
                    </EnNum>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(10, qty + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 text-cream shadow-sm transition hover:bg-white/30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2.5 text-sm">
                  {showOffer && (
                    <div className="flex justify-between gap-2 border-b border-white/20 pb-1.5 mb-1">
                      <span className="text-xs text-gold font-bold">الخصم</span>
                      <span className="text-xs font-bold text-gold">
                        -<EnNum>{formatPrice(totalSavings)}</EnNum>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <span className="text-cream/80">
                      المجموع (<EnNum>{formatNumber(qty)}</EnNum>×)
                    </span>
                    <EnNum className="font-semibold text-cream">{formatPrice(subtotal)}</EnNum>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-cream/80">
                      الشحن{form.gov ? ` — ${form.gov}` : ""}
                    </span>
                    <span className={cn("font-semibold", form.gov ? "text-cream" : "text-cream/50")}>
                      {form.gov ? (
                        <EnNum>{formatShippingFee(shippingFee)}</EnNum>
                      ) : (
                        "يُحسب بعد اختيار المحافظة"
                      )}
                    </span>
                  </div>
                  {showOffer && (
                    <div className="flex justify-between gap-2 pt-1 text-cream/70 text-xs">
                      <span>السعر الأصلي للكمية</span>
                      <EnNum className="line-through">{formatPrice(catalog.priceBefore * qty)}</EnNum>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 border-t border-white/20 pt-1.5 font-bold text-cream">
                    <span>الإجمالي</span>
                    <EnNum className="font-display text-lg">{formatPrice(total)}</EnNum>
                  </div>
                  {showOffer && (
                    <div className="mt-2 pt-1 text-center text-xs text-gold font-bold bg-gold/10 rounded-lg px-2 py-1.5">
                      🎉 أنت توفر إجمالي <EnNum>{formatPrice(totalSavings)}</EnNum> مع هذا العرض!
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isReady || submitting || isLoading}
                  className="mt-1.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c290d] py-2.5 text-sm font-bold text-cream shadow-lg transition-all hover:scale-[1.02] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {submitting ? "جاري إرسال الطلب..." : "اطلب الآن"}
                </button>

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Glass input styles
const inputCls =
  "w-full rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm px-3 py-2 text-sm text-cream outline-none transition placeholder:text-cream/40 focus:border-white/60 focus:ring-2 focus:ring-white/30";

const inputErrorCls = "border-red-400/60 focus:border-red-400 focus:ring-red-400/30";

function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-bold text-cream">
        {label}
        {required && <span className="ms-0.5 text-red-300">*</span>}
      </label>
      {hint && !error && (
        <p className="mb-1 text-[11px] text-cream/60">{hint}</p>
      )}
      {children}
      {error && (
        <p id={errorId} className="mt-1 text-xs font-medium text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}