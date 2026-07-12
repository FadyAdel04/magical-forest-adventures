import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import puzzleImg from "@/assets/websitepuzle square.jpg.jpeg";
import prewImg from "@/assets/websitepre-w square.jpg.jpeg";
import bookImg from "@/assets/book l-size.jpg.jpeg";

// Symmetrical Leaf Branch SVG for Header Decoration
function LeafBranch({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      width="42"
      height="28"
      viewBox="0 0 42 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${flip ? "scale-x-[-1]" : ""} ${className}`}
    >
      {/* Stem */}
      <path
        d="M3 23C13.5 19.5 29 11.5 38 4"
        stroke="#2d5a27"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Leaf pairs */}
      {/* Leaf 1 */}
      <path
        d="M11 20.5C9.5 17 12.5 14 15.5 15.5C17.5 18 14.5 21 11 20.5Z"
        fill="#3e7238"
      />
      {/* Leaf 2 */}
      <path
        d="M17 12.5C14.5 11 14.5 7.5 17.5 8.5C20.5 10 20.5 13.5 17 12.5Z"
        fill="#5c9e54"
      />
      {/* Leaf 3 */}
      <path
        d="M23 15C22 11.5 25 9.5 28 11C29.5 14 26.5 16.5 23 15Z"
        fill="#3e7238"
      />
      {/* Leaf 4 */}
      <path
        d="M27 8.5C25 6 25.5 2.5 28.5 3.5C31.5 4.5 31.5 8 27 8.5Z"
        fill="#5c9e54"
      />
      {/* Leaf 5 */}
      <path
        d="M34 9C34.5 5.5 37 4 39.5 6C40.5 8.5 37.5 10.5 34 9Z"
        fill="#3e7238"
      />
    </svg>
  );
}

interface UpcomingProduct {
  id: string;
  title: string;
  description: string;
  image: string;
}

const UPCOMING_PRODUCTS: UpcomingProduct[] = [
  {
    id: "alphabet-palace",
    title: "كتاب Alphabet Palace",
    description: "قصص لتعلم حروف اللغة الإنجليزية يشبه كتاب الغابة السحرية.",
    image: bookImg,
  },
  {
    id: "pre-writing",
    title: "كتاب Pre-Writing للتهيئة",
    description: "كتاب Prewritten للتهيئة للكتابة من خلال أنشطة ممتعة وتدريجية.",
    image: prewImg,
  },
  {
    id: "wooden-puzzle",
    title: "28 بازل خشب للحروف",
    description: "28 بازل خشب 3 مم للحروف كلها بمشاهد من القصة",
    image: puzzleImg,
  },
];

export function UpcomingProducts() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % UPCOMING_PRODUCTS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + UPCOMING_PRODUCTS.length) % UPCOMING_PRODUCTS.length);
  };

  const handleDotClick = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <section id="upcoming-products" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-paper">
      {/* Background radial gradients for ambient look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.75_0.14_85/0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,oklch(0.5_0.1_145/0.05)_0%,transparent_55%)]" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3">
            {/* Left Leaf branch SVG (flipped) */}
            <LeafBranch className="text-forest shrink-0 rotate-[-10deg]" flip={true} />

            <h2 className="font-display text-2xl sm:text-3xl md:text-[2.1rem] font-black text-forest">
              مغامرات قادمة من نسيج
            </h2>

            {/* Right Leaf branch SVG */}
            <LeafBranch className="text-forest shrink-0 rotate-[10deg]" />
          </div>

          {/* Heart Separator */}
          <div className="flex items-center justify-center gap-2 mt-3.5 opacity-80">
            <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-forest/35" />
            <div className="h-1.5 w-1.5 rounded-full bg-forest/40" />
            <span className="text-forest/60 text-xs select-none">❤</span>
            <div className="h-1.5 w-1.5 rounded-full bg-forest/40" />
            <div className="h-[1.5px] w-12 bg-gradient-to-l from-transparent to-forest/35" />
          </div>
        </div>

        {/* Desktop Layout: 3-column Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 max-w-5xl mx-auto">
          {UPCOMING_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile/Tablet Layout: Swipeable Carousel */}
        <div className="lg:hidden relative max-w-md mx-auto px-10">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="السابق"
            className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(40,60,40,0.1)] border border-[#ECE5D8] text-forest hover:bg-forest/5 hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="التالي"
            className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(40,60,40,0.1)] border border-[#ECE5D8] text-forest hover:bg-forest/5 hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {/* Card slide transition container */}
          <div className="relative overflow-visible min-h-[380px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_e, info) => {
                  const swipe = info.offset.x;
                  if (swipe < -60) {
                    handleNext();
                  } else if (swipe > 60) {
                    handlePrev();
                  }
                }}
                className="w-full cursor-grab active:cursor-grabbing"
              >
                <ProductCard product={UPCOMING_PRODUCTS[activeIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Dot Indicators */}
          <div className="flex justify-center items-center gap-2.5 mt-8">
            {UPCOMING_PRODUCTS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`الشريحة ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === idx
                    ? "bg-[#183917] w-6"
                    : "bg-[#183917]/20 hover:bg-[#183917]/40 w-2.5"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Single Product Card Component matching the user's design exactly
function ProductCard({ product }: { product: UpcomingProduct }) {
  return (
    <div className="group relative flex flex-col rounded-[2.2rem] overflow-hidden bg-transparent shadow-[0_12px_36px_rgba(62,89,60,0.06)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(62,89,60,0.1)] hover:-translate-y-1">
      {/* Image Frame */}
      <div className="relative overflow-hidden aspect-square w-full rounded-t-[2.2rem] bg-white border border-[#EBE4D5] border-b-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Soft dark warm overlay */}
        <div className="absolute inset-0 bg-black/15 transition-opacity duration-300 group-hover:opacity-20" />

        {/* Translucent Green Lock "SOON" Badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500/25 to-green-700/40 backdrop-blur-[6px] border border-green-300/40 flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(34,197,94,0.25)] group-hover:scale-105 transition-transform duration-300 select-none">
            {/* Tiny green sparkles */}
            <span className="absolute top-2.5 right-3.5 text-green-200 text-[10px] animate-pulse select-none">✦</span>
            <span className="absolute bottom-3 left-4 text-green-200 text-[9px] animate-pulse select-none" style={{ animationDelay: "0.5s" }}>✦</span>

            {/* Lock Icon */}
            <Lock className="h-6 w-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" strokeWidth={2.5} />
            <span className="text-white text-[10px] font-black tracking-widest mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">SOON</span>
          </div>
        </div>
      </div>

      {/* Product Details Panel (White rounded overlapping box) */}
      <div className="relative -mt-6 bg-[#FDFBF7] rounded-b-[2.2rem] rounded-t-[1.75rem] px-5 py-8 text-center border border-[#ECE5D8]/45 border-t-0 shadow-[0_-8px_24px_rgba(40,60,40,0.03)] z-10 flex-1 flex flex-col justify-center">
        <h3 className="font-display font-black text-forest text-base sm:text-lg mb-2 flex items-center justify-center gap-1">
          {product.title}
          <span className="text-emerald-700 text-sm select-none" aria-hidden="true">🍃</span>
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-[240px] mx-auto">
          {product.description}
        </p>
      </div>
    </div>
  );
}