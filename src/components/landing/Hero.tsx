import { motion } from "framer-motion";
import { Leaf, ShoppingBag, Flame, Headphones, BookOpen, Puzzle, MessageCircle, type LucideIcon } from "lucide-react";
import forestBg from "@/assets/hero-forest.jpg";
import monkey from "@/assets/monkey.png";
import explorer from "@/assets/explorer.png";
import { Fireflies } from "./Fireflies";

type Step = { icon: LucideIcon; title: string };
const steps: Step[] = [
  { icon: Flame, title: "أشعل السحر" },
  { icon: Headphones, title: "استمع للحكاية" },
  { icon: BookOpen, title: "اكتشف الأحداث" },
  { icon: Puzzle, title: "ركّب البازل" },
  { icon: MessageCircle, title: "احكِ القصة" },
];

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative h-screen min-h-[760px] w-full overflow-hidden">
      <img
        src={forestBg}
        alt="غابة سحرية"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.18_0.05_150/0.75)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.05_150/0.55)] via-transparent to-[oklch(0.15_0.05_150/0.85)]" />

      <Fireflies count={28} />

      {/* Monkey */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-16 right-2 sm:right-6 md:right-16 w-32 sm:w-44 md:w-60 lg:w-72 z-10"
      >
        <div className="origin-top animate-swing">
          <img
            src={monkey}
            alt="قرد المغامرة"
            width={1024}
            height={1024}
            className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
          />
        </div>
      </motion.div>

      {/* Explorer */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-44 sm:bottom-48 left-2 sm:left-6 md:left-16 w-28 sm:w-40 md:w-52 lg:w-60 z-10 animate-float-y"
      >
        <img
          src={explorer}
          alt="المستكشف"
          width={1024}
          height={1024}
          className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
        />
      </motion.div>

      {/* Center content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 pt-24 pb-44 sm:pb-48">
        <div className="max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl font-medium text-gold text-glow-gold mb-2"
          >
            حيث تتعلم
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] text-cream text-glow-gold"
          >
            المغامرة
            <span
              className="block mt-1 text-[var(--color-forest-light)]"
              style={{ textShadow: "0 4px 30px oklch(0.7 0.13 140 / 0.7)" }}
            >
              تصنع الذاكرة
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-5 mx-auto max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-[oklch(0.95_0.02_88)]"
          >
            في <span className="text-gold font-bold">مغامرات الحروف في الغابة السحرية</span> يعيش طفلك تجربة تعليمية تفاعلية مليئة بالقصص والأصوات والاستكشاف والخيال.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => scrollTo("contents")}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-forest px-7 py-3.5 text-base font-bold text-white shadow-magic transition-all hover:scale-105 hover:shadow-glow"
            >
              <Leaf className="h-5 w-5 transition-transform group-hover:rotate-12" />
              اكتشف المغامرة
            </button>
            <button
              onClick={() => scrollTo("order")}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-base font-semibold text-cream transition-all hover:bg-white/20"
            >
              <ShoppingBag className="h-5 w-5" />
              اطلب الآن
            </button>
          </motion.div>
        </div>
      </div>

      {/* 5 quick features pinned above the paper edge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="absolute bottom-16 sm:bottom-20 inset-x-0 z-20 px-3 sm:px-6"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-magic p-3 sm:p-4">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {steps.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => scrollTo("experience")}
                  className="group flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl p-2 sm:p-3 hover:bg-white/10 transition"
                >
                  <span className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-gold shadow-md group-hover:scale-110 transition-transform">
                    <s.icon className="h-4 w-4 sm:h-5 sm:w-5 text-forest-deep" strokeWidth={2.5} />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-forest text-cream text-[10px] sm:text-xs font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                  </span>
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-cream text-center leading-tight">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom paper edge */}
      <div className="absolute -bottom-1 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-10 sm:h-16">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,50 L1440,80 L0,80 Z" fill="oklch(0.96 0.03 88)" />
        </svg>
      </div>
    </section>
  );
}
