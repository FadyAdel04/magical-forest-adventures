import { motion } from "framer-motion";
import { Book, Headphones, Flame, Puzzle, type LucideIcon } from "lucide-react";
import productBox from "@/assets/product-box.png.asset.json";

type Item = { icon: LucideIcon; title: string; desc: string; span: string; tone: "forest" | "gold" };
const items: Item[] = [
  { icon: Book, title: "17 قصة تفاعلية", desc: "قصص تعليمية ممتعة تنمي الخيال وحب التعلم.", span: "md:col-span-2 md:row-span-2", tone: "forest" },
  { icon: Headphones, title: "17 رمز QR صوتي", desc: "استمع إلى القصص بصوت وشخصيات تأخذ الطفل إلى عالم الغابة.", span: "md:col-span-2", tone: "gold" },
  { icon: Flame, title: "2 Forest Candles", desc: "شموع عطرية تضيف أجواء الغابة السحرية أثناء القراءة.", span: "", tone: "forest" },
  { icon: Puzzle, title: "4 Puzzle Sets", desc: "بازل تفاعلي يعيد بناء أحداث المغامرة بطريقة ممتعة.", span: "", tone: "gold" },
];

export function Contents() {
  return (
    <section className="relative py-24 sm:py-32 bg-[oklch(0.95_0.03_88)] overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,oklch(0.7_0.13_140/0.3),transparent_50%),radial-gradient(circle_at_80%_80%,oklch(0.82_0.16_82/0.3),transparent_50%)]" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold text-sm font-bold tracking-widest uppercase mb-3">محتويات الصندوق</span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-forest-deep">
            ماذا يوجد داخل <span className="text-forest">الصندوق؟</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative overflow-hidden rounded-3xl p-7 sm:p-8 shadow-card-magic transition-all hover:shadow-magic ${it.span} ${
                it.tone === "forest"
                  ? "bg-gradient-forest text-cream"
                  : "bg-gradient-gold text-forest-deep"
              }`}
            >
              {i === 0 && (
                <img
                  src={productBox.url}
                  alt="صندوق الغابة السحرية"
                  loading="lazy"
                  className="absolute -bottom-8 -left-8 w-48 sm:w-64 opacity-90 drop-shadow-2xl"
                />
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                it.tone === "forest" ? "bg-white/15 backdrop-blur" : "bg-forest-deep/15"
              }`}>
                <it.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black mb-2 relative">{it.title}</h3>
              <p className="text-sm sm:text-base leading-relaxed opacity-90 max-w-xs relative">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
