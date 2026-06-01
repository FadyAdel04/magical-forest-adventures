import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { monkeyCharacter } from "@/assets/characters";
import forestBg from "@/assets/website bg.png";
import { BlinkingExplorer } from "@/components/shared/BlinkingExplorer";
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
      <img
        src={forestBg}
        alt=""
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
      />
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,oklch(0.75_0.14_85/0.1)_0%,transparent_42%)]" />
      <Fireflies count={24} />

      {/* Monkey + wooden sign — on the RIGHT side */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="pointer-events-none absolute right-0 top-13 z-15 w-[min(30vw,100px)] sm:top-[2%] sm:w-[min(26vw,200px)] md:w-[min(30vw,240px)] lg:w-[260px]"
      >
        <div className="mx-auto flex flex-col items-center">
          <div className="h-4 w-0.5 rounded-full bg-linear-to-b from-[oklch(0.5_0.09_130)] to-[oklch(0.38_0.07_55)] opacity-90 sm:h-8" />
          <motion.div
            className="flex w-full origin-top flex-col items-center"
            animate={{ rotate: [-4, 4, -4] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ForestCharacter
              src={monkeyCharacter}
              alt="قرد المغامرة"
              className="w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.45)] sm:drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)]"
            />
            <div className="wooden-sign-wrap relative -mt-0.5 w-[88%] scale-[0.62] sm:-mt-1 sm:scale-[0.85]">
              <div className="wooden-sign-vines" aria-hidden />
              <div className="wooden-sign px-1.5 py-1 text-center sm:px-2.5 sm:py-1.5">
                <p className="font-display text-[7px] font-bold leading-snug text-[oklch(0.3_0.06_52)] sm:text-[9px] sm:leading-relaxed">
                  التعلم يصبح مغامرة تعيشها الحواس
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Explorer — on the LEFT side */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="pointer-events-none absolute bottom-0 left-0 z-35 w-[min(28vw,92px)] sm:w-[min(22vw,160px)] lg:w-[220px]"
      >
        <motion.div
          className="w-full"
          animate={{
            y: [0, -12, 0],
            rotate: [2, -2, 2],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <BlinkingExplorer className="w-full translate-y-[6%] drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] lg:translate-y-[4%]" />
        </motion.div>
      </motion.div>

      <div className="relative z-20 flex flex-col sm:h-full">
        <div className="flex flex-col items-center justify-center px-3 pb-2 pt-32 max-sm:mb-2 sm:flex-1 sm:px-4 sm:pb-2 sm:pt-19">
          <div className="max-w-136 px-[min(4rem,16vw)] text-center sm:px-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-0.5 text-sm font-medium tracking-wide text-cream/95 sm:mb-1 sm:text-base"
            >
              حيث تتعلم
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.65 }}
              className="font-display text-[clamp(1.65rem,5.5vw,3.25rem)] font-black leading-[1.1]"
            >
              <span className="hero-headline-glow text-cream">مغامرات الحروف في</span>
              <span className="hero-headline-lime"> الغابة السحرية </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:mt-4 sm:gap-2"
            >
              <button
                type="button"
                onClick={() => scrollTo("product")}
                className="group inline-flex items-center gap-1 rounded-full bg-[oklch(0.5_0.11_142)] px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_6px_20px_oklch(0.3_0.1_145/0.4)] transition hover:scale-[1.03] sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                <Leaf className="h-3.5 w-3.5 transition-transform group-hover:rotate-12 sm:h-4 sm:w-4" />
                اكتشف عالم الغابة
              </button>
              <button
                type="button"
                onClick={() => scrollTo("order")}
                className="inline-flex items-center gap-1 rounded-full border-2 border-white/45 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-cream backdrop-blur-sm transition hover:bg-white/20 sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                اطلب الآن
              </button>
            </motion.div>
          </div>
        </div>

        {/* Added margin top between hero content and SensoryFeatures */}
        <div className="relative z-30 shrink-0 pb-3 pt-4 max-sm:pb-4 sm:pb-3 sm:pt-6 md:pt-8">
          <SensoryFeatures compact />
        </div>
      </div>
    </section>
  );
}