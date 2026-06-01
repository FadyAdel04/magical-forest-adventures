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
    <section id="home" className="relative h-svh min-h-[580px] max-h-[900px] w-full overflow-hidden">
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
        className="pointer-events-none absolute top-2 z-15 hidden w-[min(26vw,200px)] sm:right-0 sm:top-[2%] sm:block md:w-[min(30vw,240px)] lg:w-[260px]"
      >
        <div className="mx-auto flex flex-col items-center">
          <div className="h-6 w-0.5 rounded-full bg-linear-to-b from-[oklch(0.5_0.09_130)] to-[oklch(0.38_0.07_55)] opacity-90 sm:h-8" />
          <motion.div
            className="flex w-full origin-top flex-col items-center"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ForestCharacter
              src={monkeyCharacter}
              alt="قرد المغامرة"
              className="w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)]"
            />
            <div className="wooden-sign-wrap relative -mt-1 w-[88%] scale-[0.78] sm:scale-[0.85]">
              <div className="wooden-sign-vines" aria-hidden />
              <div className="wooden-sign px-2 py-1.5 text-center sm:px-2.5">
                <p className="font-display text-[8px] font-bold leading-relaxed text-[oklch(0.3_0.06_52)] sm:text-[9px]">
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
        className="pointer-events-none absolute left-0 bottom-[32%] z-15 hidden w-[min(24vw,140px)] sm:block md:bottom-[38%] lg:w-[220px]"
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
          <BlinkingExplorer className="w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)]" />
        </motion.div>
      </motion.div>

      <div className="relative z-20 flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-3 pb-2 pt-17 sm:px-4 sm:pt-19">
          <div className="max-w-136 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-1 text-sm font-medium tracking-wide text-cream/95 sm:text-base"
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
              className="mt-4 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => scrollTo("product")}
                className="group inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.5_0.11_142)] px-4 py-2 text-xs font-bold text-white shadow-[0_6px_20px_oklch(0.3_0.1_145/0.4)] transition hover:scale-[1.03] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                <Leaf className="h-3.5 w-3.5 transition-transform group-hover:rotate-12 sm:h-4 sm:w-4" />
                اكتشف عالم الغابة
              </button>
              <button
                type="button"
                onClick={() => scrollTo("order")}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/45 bg-white/10 px-4 py-2 text-xs font-semibold text-cream backdrop-blur-sm transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                اطلب الآن
              </button>
            </motion.div>
          </div>
        </div>

        <div className="relative z-30 shrink-0 pb-2 sm:pb-3">
          <SensoryFeatures compact />
        </div>
      </div>
    </section>
  );
}