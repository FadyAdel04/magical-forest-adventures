import { motion } from "framer-motion";
import { Leaf, ShoppingBag } from "lucide-react";
import forestBg from "@/assets/hero-forest.jpg";
import monkey from "@/assets/monkey.png";
import explorer from "@/assets/explorer.png";
import { Fireflies } from "./Fireflies";

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <img
        src={forestBg}
        alt="غابة سحرية"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.18_0.05_150/0.7)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.05_150/0.4)] via-transparent to-[oklch(0.15_0.05_150/0.7)]" />

      <Fireflies count={30} />

      {/* Tree branch + Monkey - left on LTR, right on RTL */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute -top-4 right-2 sm:right-8 md:right-20 w-40 sm:w-56 md:w-72 lg:w-80 z-10"
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

      {/* Explorer - right on LTR, left on RTL */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-4 left-2 sm:left-8 md:left-20 w-36 sm:w-52 md:w-64 lg:w-72 z-10 animate-float-y"
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
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4 pt-24 pb-32">
        <div className="max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl font-medium text-gold text-glow-gold mb-3"
          >
            حيث تتعلم
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] text-cream text-glow-gold"
          >
            المغامرة
            <span className="block mt-2 text-[var(--color-forest-light)]" style={{ textShadow: "0 4px 30px oklch(0.7 0.13 140 / 0.7)" }}>
              تصنع الذاكرة
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 mx-auto max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-[oklch(0.95_0.02_88)]"
          >
            في <span className="text-gold font-bold">مغامرات الحروف في الغابة السحرية</span> يعيش طفلك تجربة تعليمية تفاعلية مليئة بالقصص والأصوات والاستكشاف والخيال.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollTo("experience")}
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-forest px-8 py-4 text-base sm:text-lg font-bold text-white shadow-magic transition-all hover:scale-105 hover:shadow-glow"
            >
              <Leaf className="h-5 w-5 transition-transform group-hover:rotate-12" />
              اكتشف المغامرة
            </button>
            <button
              onClick={() => scrollTo("order")}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-7 py-4 text-base sm:text-lg font-semibold text-cream transition-all hover:bg-white/20"
            >
              <ShoppingBag className="h-5 w-5" />
              اطلب الآن
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom paper edge mask */}
      <div className="absolute -bottom-1 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 sm:h-20">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,50 L1440,80 L0,80 Z" fill="oklch(0.96 0.03 88)" />
        </svg>
      </div>
    </section>
  );
}
