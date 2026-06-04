import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Headphones,
  Flame,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { ForestCharacter } from "@/components/shared/ForestCharacter";
import { Fireflies } from "./Fireflies";
import { useStore } from "@/hooks/useStore";
import { resolveSlideImage } from "@/lib/imageAssets";
import { calcDiscountPercent } from "@/lib/pricing";
import { formatNumber } from "@/lib/format";
import { EnNum } from "@/components/shared/EnNum";

const FEATURE_ICONS: LucideIcon[] = [Book, Headphones, Flame, Puzzle];

export function Product() {
  const { catalog, isLoading, isReady } = useStore();
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides = useMemo(
    () =>
      catalog.slides.map((s) => ({
        ...s,
        src: resolveSlideImage(s.imageUrl),
      })),
    [catalog.slides],
  );

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, 3000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length, isHovering]);

  if (isLoading && !isReady) {
    return (
      <section id="product" className="product-paper-bg relative scroll-mt-20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center text-muted-foreground">
          جاري تحميل المنتج...
        </div>
      </section>
    );
  }

  if (!catalog.active) return null;

  const safeIndex = slides.length ? index % slides.length : 0;
  const showOffer = catalog.offerEnabled && catalog.priceBefore > catalog.priceAfter;
  const discount = showOffer ? calcDiscountPercent(catalog.priceBefore, catalog.priceAfter) : 0;

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="product" className="relative scroll-mt-20 overflow-x-hidden py-6 sm:py-10">
      <div className="product-paper-bg absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,oklch(0.75_0.14_85/0.14)_0%,transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_85%,oklch(0.5_0.1_145/0.07)_0%,transparent_45%)]" />
      <Fireflies count={14} />



      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-5 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-1"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {slides.length > 0 && (
              <>
                <div className="relative">
                  {/* Left Arrow - only arrow, no circle */}
                  {slides.length > 1 && (
                    <button
                      type="button"
                      aria-label="السابق"
                      onClick={prev}
                      className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-forest transition hover:scale-110 hover:text-forest-deep"
                    >
                      <ChevronLeft className="h-6 w-6" strokeWidth={2} />
                    </button>
                  )}

                  {/* Right Arrow - only arrow, no circle */}
                  {slides.length > 1 && (
                    <button
                      type="button"
                      aria-label="التالي"
                      onClick={next}
                      className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-forest transition hover:scale-110 hover:text-forest-deep"
                    >
                      <ChevronRight className="h-6 w-6" strokeWidth={2} />
                    </button>
                  )}

                  {/* Product Display */}
                  <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[520px]">
                    {/* Background Circle */}
                    <div className="absolute h-[85%] w-[85%] rounded-full bg-[#E8E5D6]" />

                    {/* Decorative Blur */}
                    <div className="absolute left-8 top-10 h-16 w-16 rounded-full bg-[#D8D2BF]/40 blur-xl" />
                    <div className="absolute bottom-10 right-8 h-20 w-20 rounded-full bg-[#D8D2BF]/30 blur-xl" />

                    <AnimatePresence mode="wait">
                      <motion.img
                        key={slides[safeIndex].id}
                        src={slides[safeIndex].src}
                        alt={slides[safeIndex].title}
                        width={600}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 h-[280px] w-full object-contain sm:h-[500px]"
                      />
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2 text-right"
          >
            <span className="inline-block rounded-full bg-gold/20 px-3 py-0.5 text-xs font-bold text-[oklch(0.45_0.1_65)]">
              {catalog.badge}
            </span>
            <h2 className="mt-2 font-display text-2xl font-black leading-tight text-forest-deep text-center sm:text-3xl md:text-4xl">
              {catalog.title}
              <span className="mt-2 block text-forest text-lg">{catalog.titleHighlight}</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {catalog.description}
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {catalog.features.map((item, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <li key={item.id} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-forest text-cream shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-right text-xs font-medium leading-snug text-forest-deep sm:text-sm">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-5">
              <div>
                <p className="text-xs text-muted-foreground">سعر المنتج (الشحن يُحسب عند الطلب)</p>
                {showOffer && (
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gold/25 px-2 py-0.5 text-xs font-bold text-[oklch(0.45_0.1_65)]">
                      خصم <EnNum>{formatNumber(discount)}%</EnNum>
                    </span>
                    <span className="relative text-lg font-bold text-muted-foreground">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-px w-full bg-muted-foreground/50 rotate-0" />
                      </span>
                      <EnNum>
                        {formatNumber(catalog.priceBefore)} {catalog.currency}
                      </EnNum>
                    </span>
                  </div>
                )}
                <p className="font-display text-3xl font-black text-forest sm:text-4xl">
                  <EnNum>
                    {formatNumber(catalog.priceAfter)} {catalog.currency}
                  </EnNum>
                </p>
              </div>
              <button
                type="button"
                onClick={scrollToOrder}
                className="inline-flex items-center justify-center rounded-full bg-gradient-forest px-6 py-2.5 text-sm font-bold text-cream shadow-magic transition hover:scale-[1.02] hover:shadow-glow"
              >
                اطلب الآن
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}