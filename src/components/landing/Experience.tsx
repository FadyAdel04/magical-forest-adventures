import { motion } from "framer-motion";
import { Flame, Headphones, BookOpen, Puzzle, MessageCircle, type LucideIcon } from "lucide-react";

type Step = { icon: LucideIcon; title: string; desc: string };

const steps: Step[] = [
  { icon: Flame, title: "أشعل سحر الغابة", desc: "شغّل الشمعة العطرية وابدأ الدخول إلى عالم القصة." },
  { icon: Headphones, title: "استمع للحكاية", desc: "امسح رمز QR ودع شخصيات الغابة تقودك في المغامرة." },
  { icon: BookOpen, title: "اكتشف الأحداث", desc: "افتح الكتاب وشاهد عالم الغابة ينبض بالحياة بين الصفحات." },
  { icon: Puzzle, title: "أعد بناء المشاهد", desc: "ركّب البازل واجمع أجزاء المغامرة بنفسك." },
  { icon: MessageCircle, title: "احكِ القصة بطريقتك", desc: "الآن أصبح طفلك بطل الحكاية وقادرًا على روايتها من ذاكرته وخياله." },
];

export function Experience() {
  return (
    <section id="experience" className="relative bg-gradient-paper py-24 sm:py-32 overflow-hidden">
      {/* Decorative leaves */}
      <div className="pointer-events-none absolute top-8 right-8 text-6xl opacity-20 animate-float-y">🌿</div>
      <div className="pointer-events-none absolute bottom-12 left-8 text-6xl opacity-20 animate-float-y" style={{ animationDelay: "1.5s" }}>🍃</div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-gold text-sm font-bold tracking-widest uppercase mb-3">المغامرة بـ ٥ خطوات</span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-forest-deep leading-tight">
            رحلة طفلك داخل <span className="text-forest">الغابة السحرية</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            كل خطوة تقرّب طفلك من عالم الحروف والمغامرات.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl bg-card p-7 shadow-card-magic border border-border/60 hover:shadow-magic transition-all"
            >
              <div className="absolute -top-5 right-6 w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-forest-deep font-black text-lg shadow-lg">
                {i + 1}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-forest flex items-center justify-center mb-5 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <s.icon className="h-8 w-8 text-cream" />
              </div>
              <h3 className="font-display text-xl font-bold text-forest-deep mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
