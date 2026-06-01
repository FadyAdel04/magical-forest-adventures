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

function ParchmentTopWave() {
  return (
    <svg
      className="absolute left-0 top-0 h-3 w-full -translate-y-[calc(100%-1px)] text-[oklch(0.98_0.02_88)] sm:h-4 md:h-5"
      viewBox="0 0 1440 56"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,56 L0,18 C120,42 240,8 360,28 C480,48 600,12 720,32 C840,52 960,16 1080,30 C1200,44 1320,10 1440,26 L1440,56 Z"
      />
    </svg>
  );
}

export function SensoryFeatures({ compact = false }: { compact?: boolean }) {
  // Split features for mobile: first 2, second 2, last 1
  const firstRowFeatures = features.slice(0, 2);
  const secondRowFeatures = features.slice(2, 4);
  const thirdRowFeatures = features.slice(4, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className={`w-full ${compact ? "mt-10 px-1.5 max-sm:mt-14 sm:mt-4 sm:px-2" : "px-3 pb-6 sm:px-6 sm:pb-8"}`}
    >
      <div className={`mx-auto ${compact ? "max-w-6xl" : "container max-w-6xl"}`}>
        <div className="relative">
          {!compact && <ParchmentTopWave />}

          <div className="relative parchment-panel overflow-hidden shadow-magic">
            <Leaf className="pointer-events-none absolute bottom-2 right-3 h-3 w-3 rotate-12 text-forest/30 sm:right-6 sm:h-4 sm:w-4" />
            <Leaf className="pointer-events-none absolute bottom-2 left-3 h-2.5 w-2.5 -rotate-30 text-forest/25 sm:left-8 sm:h-3.5 sm:w-3.5" />

            <div
              className={
                compact
                  ? "relative px-1.5 pb-1.5 pt-2 sm:px-6 sm:pb-4 sm:pt-6"
                  : "relative px-5 pb-9 pt-11 sm:px-10 sm:pb-11 sm:pt-14"
              }
            >
              <h2
                className={`flex items-center justify-center gap-1 text-center font-display font-black text-forest-deep ${
                  compact
                    ? "mb-2 text-xs sm:mb-4 sm:text-base md:text-lg"
                    : "mb-8 text-xl sm:mb-10 sm:text-2xl md:text-[2.1rem]"
                }`}
              >
                <span className="text-forest/60 text-[10px] sm:text-xs" aria-hidden>
                  ✦
                </span>
                تعلم بكل حواسك
                <span className="text-forest/60 text-[10px] sm:text-xs" aria-hidden>
                  ✦
                </span>
              </h2>

              {/* Mobile Layout: 2, 2, 1 with extra padding from hero */}
              <div className="block lg:hidden">
                {/* First row - 2 features */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {firstRowFeatures.map((f, i) => (
                    <div key={f.title} className="flex justify-center">
                      <FeatureCard feature={f} index={i} compact={compact} isMobileGrid />
                    </div>
                  ))}
                </div>
                {/* Second row - 2 features */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {secondRowFeatures.map((f, i) => (
                    <div key={f.title} className="flex justify-center">
                      <FeatureCard feature={f} index={i + 2} compact={compact} isMobileGrid />
                    </div>
                  ))}
                </div>
                {/* Third row - 1 feature centered */}
                <div className="flex justify-center mt-2">
                  <div className="w-1/2 min-w-[130px]">
                    {thirdRowFeatures.map((f, i) => (
                      <div key={f.title} className="flex justify-center">
                        <FeatureCard feature={f} index={i + 4} compact={compact} isMobileGrid />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Layout: Centered grid */}
              <div className="hidden lg:flex lg:justify-center lg:items-center">
                <div className="grid grid-cols-5 gap-4 max-w-5xl mx-auto">
                  {features.map((f, i) => (
                    <div key={f.title} className="flex justify-center">
                      <FeatureCard feature={f} index={i} compact={compact} isDesktop />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({
  feature,
  index,
  compact,
  isMobileGrid = false,
  isDesktop = false,
}: {
  feature: Feature;
  index: number;
  compact?: boolean;
  isMobileGrid?: boolean;
  isDesktop?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.95 + index * 0.05 }}
      className="flex flex-col items-center px-0.5 text-center"
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-linear-to-br from-[oklch(0.97_0.02_90)] to-[oklch(0.92_0.04_95)] shadow-card-magic ring-2 ${feature.ring} ${
          compact
            ? isMobileGrid
              ? "mb-2 h-16 w-16 sm:h-20 sm:w-20"
              : isDesktop
              ? "mb-2 h-20 w-20 sm:h-24 sm:w-24"
              : "mb-1 h-14 w-14 sm:mb-1.5 sm:h-20 sm:w-20 md:h-24 md:w-24"
            : "mb-4 h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32"
        }`}
        style={{ borderRadius: feature.blob }}
      >
        <img
          src={feature.image}
          alt=""
          className={`object-contain drop-shadow-md ${
            compact
              ? isMobileGrid
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
        className={`font-display font-bold leading-snug text-forest-deep ${
          compact
            ? isMobileGrid
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
        className={`leading-relaxed text-bark/85 ${
          compact
            ? isMobileGrid
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