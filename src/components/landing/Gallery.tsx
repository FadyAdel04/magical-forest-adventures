import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import box from "@/assets/product-box.png.asset.json";
import stickers from "@/assets/stickers.png.asset.json";
import candles from "@/assets/candles.png.asset.json";
import waxLeaves from "@/assets/wax-leaves.png.asset.json";

const slides = [
  { src: box.url, title: "صندوق الغابة السحرية", subtitle: "كل المغامرة في صندوق واحد" },
  { src: stickers.url, title: "ملصقات اليقطين", subtitle: "زخارف ومرح لطفلك" },
  { src: candles.url, title: "شموع الغابة", subtitle: "عطر يفتح أبواب الخيال" },
  { src: waxLeaves.url, title: "أوراق الشمع العطرية", subtitle: "تفاصيل صغيرة بسحر كبير" },
];

export function Gallery() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % slides.length);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);

  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[oklch(0.95_0.03_88)] to-[oklch(0.92_0.05_140/0.3)] overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-gold text-sm font-bold tracking-widest uppercase mb-3">معرض المنتج</span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-forest-deep">
            استكشف <span className="text-forest">عالم الغابة</span>
          </h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-[2rem] overflow-hidden shadow-magic bg-gradient-forest">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img src={slides[i].src} alt={slides[i].title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="font-display text-2xl sm:text-4xl font-black text-cream">{slides[i].title}</h3>
                  <p className="text-cream/80 text-sm sm:text-base mt-1">{slides[i].subtitle}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Glass controls */}
            <button
              onClick={prev}
              aria-label="السابق"
              className="absolute top-1/2 right-4 -translate-y-1/2 backdrop-blur-md bg-white/20 hover:bg-white/35 border border-white/40 rounded-full p-3 text-white transition"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="التالي"
              className="absolute top-1/2 left-4 -translate-y-1/2 backdrop-blur-md bg-white/20 hover:bg-white/35 border border-white/40 rounded-full p-3 text-white transition"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden transition-all ${
                  i === idx ? "ring-4 ring-[var(--color-gold)] scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <img src={s.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
