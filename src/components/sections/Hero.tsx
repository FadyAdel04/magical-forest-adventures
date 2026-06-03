import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { explorerCharacter, monkeyCharacter } from "@/assets/characters";
import forestBg from "@/assets/website bg.png";
import forestBgMobile from "@/assets/web (2).png";
import { ForestCharacter } from "@/components/shared/ForestCharacter";
import { Fireflies } from "./Fireflies";
import { SensoryFeatures } from "./SensoryFeatures";

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden max-sm:min-h-0 sm:h-svh sm:min-h-[580px] sm:max-h-[900px]"
    >
      {/* Background Image — portrait asset on mobile, landscape on sm+
           fetchpriority="high" makes these the top-priority network requests (LCP fix) */}
      <img
        src={forestBgMobile}
        alt=""
        width={1080}
        height={1920}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center sm:hidden"
      />
      <img
        src={forestBg}
        alt=""
        width={1920}
        height={1280}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 hidden h-full w-full object-cover object-[center_38%] sm:block"
      />
      {/* Overlay Gradients */}
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,oklch(0.75_0.14_85/0.1)_0%,transparent_42%)]" />

      {/* Fireflies Animation */}
      <Fireflies count={24} />

      {/* ==================== MONKEY + WOODEN SIGN (RIGHT SIDE) - ENLARGED ==================== */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="pointer-events-none absolute right-0 top-13 z-15 w-[min(45vw,180px)] sm:top-[2%] sm:w-[min(26vw,200px)] md:w-[min(30vw,240px)] lg:w-[260px] monkey-container"
      >
        <div className="mx-auto flex flex-col items-center">
          {/* Wooden stick */}
          <div className="h-4 w-0.5 rounded-full bg-linear-to-b from-[oklch(0.5_0.09_130)] to-[oklch(0.38_0.07_55)] opacity-90 sm:h-8" />

          {/* Swinging monkey + sign */}
          <div className="flex w-full origin-top animate-swing flex-col items-center">
            <ForestCharacter
              src={monkeyCharacter}
              alt="قرد المغامرة"
              className="w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.45)] sm:drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] monkey-img"
            />
            <div className="wooden-sign-wrap relative -mt-0.5 w-[88%] scale-[0.62] sm:-mt-1 sm:scale-[0.85]">
              <div className="wooden-sign-vines" aria-hidden />
              <div className="wooden-sign px-1.5 py-1 text-center sm:px-2.5 sm:py-1.5">
                <p className="font-display text-[7px] font-bold leading-snug text-[oklch(0.3_0.06_52)] sm:text-[9px] sm:leading-relaxed">
                  التعلم يصبح مغامرة تعيشها الحواس
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ==================== EXPLORER CHARACTER (LEFT SIDE) - ENLARGED ==================== */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="pointer-events-none absolute bottom-0 left-0 z-35 w-[min(45vw,150px)] sm:w-[min(22vw,160px)] lg:w-[220px] explorer-container"
      >
        <div className="w-full animate-float-y">
          <ForestCharacter
            src={explorerCharacter}
            alt="مستكشف الغابة"
            className="w-full translate-y-[6%] drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] lg:translate-y-[4%] explorer-img"
          />
        </div>
      </motion.div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative z-20 pb- flex flex-col sm:h-full ">
        {/* Hero Text & Buttons */}
        <div className="flex flex-col items-center justify-center px-3 pb-2 pt-32 max-sm:mb-2 pr-6 sm:flex-1 sm:px-4 sm:pb-2 sm:pt-19">
          <div className="max-w-136 px-[min(4rem,16vw)] text-center sm:px-0 pl-20 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.65 }}
              className="font-display text-[clamp(1.65rem,5.5vw,3.25rem)] font-black leading-[1.1]"
            >
              <span className="hero-headline-glow text-cream">مغامرات الحروف في</span>
              <span className="hero-headline-lime">   الغابة السحرية  </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-4 sm:gap-4"
            >
              <button
                type="button"
                onClick={() => scrollTo("product")}
                className="group relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[oklch(0.55_0.12_142)] to-[oklch(0.42_0.11_142)] px-4 py-2 text-xs font-bold text-white shadow-[0_5px_0_oklch(0.35_0.1_142)] transition-all duration-150 active:translate-y-[2px] active:shadow-[0_2px_0_oklch(0.35_0.1_142)] hover:brightness-105 sm:gap-2 sm:px-6 sm:py-2.5 sm:text-sm"
              >
                <Leaf className="h-3.5 w-3.5 transition-transform group-hover:rotate-12 sm:h-4 sm:w-4" />
                اكتشف عالم الغابة
              </button>

              <button
                type="button"
                onClick={() => scrollTo("order")}
                className="relative inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-gradient-to-b from-white/20 to-white/5 px-4 py-2 text-xs font-semibold text-cream shadow-[0_5px_0_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-150 active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:bg-white/20 sm:gap-2 sm:px-6 sm:py-2.5 sm:text-sm"
              >
                اطلب الآن
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Sensory Features with Glass Effect & 2-2-1 Layout */}
        <div className="relative z-30 shrink-0 pb-3 pt-4 max-sm:pb-4 sm:pb-3 sm:pt-6 md:pt-8">
          <SensoryFeatures compact />
        </div>
      </div>

      {/* Global styles for enhanced mobile characters and glass features */}
      <style>{`
        /* Mobile: Much Bigger Monkey & Explorer */
        @media (max-width: 640px) {
          .monkey-container {
            transform: scale(1.45);
            transform-origin: top right;
            margin-right: -35px;
            top: -10px;
          }
          .explorer-container {
            transform: scale(1.6);
            transform-origin: bottom left;
            margin-left: -20px;
            width: 280px;
          }
        }
        
        /* Tablet adjustments */
        @media (min-width: 641px) and (max-width: 768px) {
          .monkey-container {
            transform: scale(1.15);
            transform-origin: top right;
          }
          .explorer-container {
            transform: scale(1.2);
            transform-origin: bottom left;
          }
        }
        
        /* Wooden sign decorations */
        .wooden-sign {
          background: #e7dbb8;
          background-image: repeating-linear-gradient(45deg, #c9ae6e22 0px, #c9ae6e22 2px, #e2cfa022 2px, #e2cfa022 8px);
          border-radius: 12px 12px 8px 8px;
          box-shadow: 0 6px 0 #8b5a2b, inset 0 1px 3px rgba(255,245,200,0.8);
          border: 1px solid #b97f3a;
        }
        
        .wooden-sign-wrap {
          position: relative;
        }
        
        .wooden-sign-vines {
          position: absolute;
          top: -8px;
          left: -6px;
          width: calc(100% + 12px);
          height: calc(100% + 12px);
          background: radial-gradient(circle at 20% 0%, #2f6b2f 1px, transparent 1px);
          background-size: 12px 12px;
          opacity: 0.6;
          pointer-events: none;
          border-radius: 20px;
        }
        
        .hero-vignette {
          background: radial-gradient(ellipse at center 30%, transparent 30%, rgba(0,0,0,0.25) 80%);
          pointer-events: none;
        }
        
        .hero-headline-glow {
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
          display: inline-block;
        }
        
        .hero-headline-lime {
          background: linear-gradient(135deg, #e9ff9e, #b3ff6a);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 0 0 8px rgba(180, 255, 80, 0.4);
        }
      `}</style>
    </section>
  );
}