import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { sensoryFeatureImages } from "@/assets/sensory-features";

type Feature = {
  image: string;
  title: string;
  desc: string;
  blob: string;
  ring: string;
};

const features: Feature[] = [
  {
    image: sensoryFeatureImages[0],
    title: "أشعل سحر الغابة",
    desc: "شغّل الشمعة العطرية وابدأ الدخول إلى عالم القصة.",
    blob: "58% 42% 48% 52% / 52% 48% 55% 45%",
    ring: "ring-amber-200/80",
  },
  {
    image: sensoryFeatureImages[1],
    title: "استمع للحكاية",
    desc: "امسح الـ QR ودع الشخصيات تقودك في المغامرة.",
    blob: "45% 55% 52% 48% / 48% 52% 45% 55%",
    ring: "ring-emerald-200/80",
  },
  {
    image: sensoryFeatureImages[2],
    title: "اكتشف الأحداث",
    desc: "ادخل عالم الغابة وشاهد المغامرة تنبض بالحياة.",
    blob: "52% 48% 55% 45% / 45% 55% 48% 52%",
    ring: "ring-sky-200/80",
  },
  {
    image: sensoryFeatureImages[3],
    title: "أعد بناء المشاهد",
    desc: "ركّب البازل واجمع أجزاء المغامرة بنفسك.",
    blob: "48% 52% 45% 55% / 55% 45% 52% 48%",
    ring: "ring-violet-200/80",
  },
  {
    image: sensoryFeatureImages[4],
    title: "احكِ القصة بطريقتك",
    desc: "طفلك بطل الحكاية ويرويها من ذاكرته وخياله.",
    blob: "55% 45% 48% 52% / 52% 48% 55% 45%",
    ring: "ring-orange-200/80",
  },
];

export function SensoryFeatures({ compact = false }: { compact?: boolean }) {
  // Split features: first 2, second 2, last 1
  const firstRowFeatures = features.slice(0, 2);
  const secondRowFeatures = features.slice(2, 4);
  const lastFeature = features[4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className={`w-full ${compact ? "mt-10 px-1.5 max-sm:mt-14 sm:mt-4 sm:px-2" : "px-3 pb-6 sm:px-6 sm:pb-8"}`}
    >
      <div className={`mx-auto ${compact ? "max-w-6xl" : "container max-w-6xl"}`}>
        {/* Glassmorphism Panel with Forest Green Theme */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Glass background with forest green tint and blur */}
          <div className="absolute inset-0 bg-[rgba(20,55,28,0.55)] backdrop-blur-lg border border-[rgba(150,210,110,0.35)] rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.2)]" />
          
          {/* Inner content */}
          <div className="relative z-10">
            {/* Decorative Leaves */}
            <Leaf className="pointer-events-none absolute bottom-2 right-3 h-3 w-3 rotate-12 text-[#c5f267]/40 sm:right-6 sm:h-4 sm:w-4" />
            <Leaf className="pointer-events-none absolute bottom-2 left-3 h-2.5 w-2.5 -rotate-30 text-[#c5f267]/30 sm:left-8 sm:h-3.5 sm:w-3.5" />
            <Leaf className="pointer-events-none absolute top-2 right-4 h-3 w-3 rotate-45 text-[#c5f267]/30 sm:top-3 sm:h-3.5 sm:w-3.5" />

            <div
              className={
                compact
                  ? "relative px-1.5 pb-1.5 pt-2 sm:px-6 sm:pb-4 sm:pt-6"
                  : "relative px-5 pb-9 pt-11 sm:px-10 sm:pb-11 sm:pt-14"
              }
            >
              {/* Section Title */}
              <h2
                className={`flex items-center justify-center gap-1 text-center font-display font-black text-white drop-shadow-md ${
                  compact
                    ? "mb-2 text-xs sm:mb-4 sm:text-base md:text-lg"
                    : "mb-8 text-xl sm:mb-10 sm:text-2xl md:text-[2.1rem]"
                }`}
              >
                <span className="text-[#c5f267]/70 text-[10px] sm:text-xs" aria-hidden>
                  ✦
                </span>
                اتبع خطوات المغامرة
                <span className="text-[#c5f267]/70 text-[10px] sm:text-xs" aria-hidden>
                  ✦
                </span>
              </h2>

              {/* ===== MOBILE LAYOUT: 2, 2, then LAST FEATURE ON THE LEFT ===== */}
              <div className="block lg:hidden">
                {/* First row - 2 features */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {firstRowFeatures.map((f, i) => (
                    <div key={f.title} className="flex justify-center">
                      <FeatureCard feature={f} index={i} compact={compact} isMobileGrid featureNumber={i + 1} />
                    </div>
                  ))}
                </div>
                
                {/* Second row - 2 features */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {secondRowFeatures.map((f, i) => (
                    <div key={f.title} className="flex justify-center">
                      <FeatureCard feature={f} index={i + 2} compact={compact} isMobileGrid featureNumber={i + 3} />
                    </div>
                  ))}
                </div>
                
                {/* Third row - Last feature positioned to the LEFT */}
                <div className="flex justify-start mt-2 pr-3 sm:pr-4">
                  <div className="w-[55%] min-w-[130px] max-w-[170px]">
                    <FeatureCard 
                      feature={lastFeature} 
                      index={4} 
                      compact={compact} 
                      isMobileGrid 
                      featureNumber={5}
                    />
                  </div>
                </div>
              </div>

              {/* ===== TABLET LAYOUT (md): 3 + 2 ===== */}
              <div className="hidden md:block lg:hidden">
                <div className="flex flex-col items-center">
                  {/* First row - 3 features */}
                  <div className="grid grid-cols-3 gap-3 mb-4 w-full max-w-2xl mx-auto">
                    {features.slice(0, 3).map((f, i) => (
                      <div key={f.title} className="flex justify-center">
                        <FeatureCard feature={f} index={i} compact={compact} isTabletGrid featureNumber={i + 1} />
                      </div>
                    ))}
                  </div>
                  {/* Second row - 2 features with last on right */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xl mx-auto">
                    {features.slice(3, 4).map((f, i) => (
                      <div key={f.title} className="flex justify-center">
                        <FeatureCard feature={f} index={i + 3} compact={compact} isTabletGrid featureNumber={i + 4} />
                      </div>
                    ))}
                    <div className="flex justify-center">
                      <FeatureCard feature={lastFeature} index={4} compact={compact} isTabletGrid featureNumber={5} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== DESKTOP LAYOUT: 5 features in a row ===== */}
              <div className="hidden lg:flex lg:justify-center lg:items-center">
                <div className="grid grid-cols-5 gap-4 max-w-5xl mx-auto">
                  {features.map((f, i) => (
                    <div key={f.title} className="flex justify-center">
                      <FeatureCard feature={f} index={i} compact={compact} isDesktop featureNumber={i + 1} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for glassmorphism enhancements */}
      <style>{`
        @media (max-width: 640px) {
          .feature-card-glass {
            background: rgba(30, 65, 35, 0.65) !important;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(180, 220, 120, 0.4);
          }
        }
      `}</style>
    </motion.div>
  );
}

function FeatureCard({
  feature,
  index,
  compact,
  isMobileGrid = false,
  isDesktop = false,
  isTabletGrid = false,
  featureNumber,
}: {
  feature: Feature;
  index: number;
  compact?: boolean;
  isMobileGrid?: boolean;
  isDesktop?: boolean;
  isTabletGrid?: boolean;
  featureNumber: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.95 + index * 0.05 }}
      className="flex flex-col items-center px-0.5 py-3 text-center w-full relative"
    >
      {/* Number Badge */}
      <div className="absolute -top-1.5 -right z-20">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold to-amber-500 shadow-lg ring-2 ring-white/30">
          <span className="text-xs font-black text-forest-deep">
            {featureNumber}
          </span>
        </div>
      </div>

      {/* Glassmorphism Card with forest theme */}
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-[rgba(35,75,40,0.55)] backdrop-blur-md shadow-[0_6px_16px_rgba(0,0,0,0.15)] ring-2 ${feature.ring} transition-all duration-300 hover:scale-105 hover:bg-[rgba(45,90,50,0.7)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] ${
          compact
            ? isMobileGrid || isTabletGrid
              ? "mb-2 h-16 w-16 sm:h-20 sm:w-20"
              : isDesktop
              ? "mb-2 h-20 w-20 sm:h-24 sm:w-24"
              : "mb-1 h-14 w-14 sm:mb-1.5 sm:h-20 sm:w-20 md:h-24 md:w-24"
            : "mb-4 h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32"
        }`}
        style={{ borderRadius: feature.blob }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <img
          src={feature.image}
          alt=""
          className={`object-contain drop-shadow-md ${
            compact
              ? isMobileGrid || isTabletGrid
                ? "h-12 w-12 sm:h-16 sm:w-16"
                : isDesktop
                ? "h-14 w-14 sm:h-18 sm:w-18"
                : "h-10 w-10 sm:h-16 sm:w-16 md:h-17 md:w-17"
              : "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28"
          }`}
          loading="lazy"
          decoding="async"
        />
      </div>
      
      <h3
        className={`font-display font-bold leading-snug text-white drop-shadow-sm ${
          compact
            ? isMobileGrid || isTabletGrid
              ? "mb-1 text-xs sm:text-sm"
              : isDesktop
              ? "mb-1 text-sm sm:text-base"
              : "mb-0.5 text-[11px] sm:text-xs md:text-sm"
            : "mb-1.5 text-sm sm:text-base md:text-lg"
        }`}
      >
        {feature.title}
      </h3>
      
      <p
        className={`leading-relaxed text-[#e0f0d0]/90 ${
          compact
            ? isMobileGrid || isTabletGrid
              ? "max-w-[110px] text-[9px] leading-snug sm:max-w-[140px] sm:text-[10px] md:max-w-[160px] md:text-xs"
              : isDesktop
              ? "max-w-[120px] text-[10px] leading-snug sm:max-w-[150px] sm:text-[11px]"
              : "max-w-[110px] text-[8px] leading-snug sm:max-w-[140px] sm:text-[10px] md:max-w-[160px] md:text-xs"
            : "max-w-[180px] text-[0.75rem] sm:max-w-[200px] sm:text-[0.82rem] md:text-sm"
        }`}
      >
        {feature.desc}
      </p>
    </motion.article>
  );
}