import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";

const links = [
  { href: "#home", label: "الرئيسية" },
  { href: "#contents", label: "المنتج" },
  { href: "#order", label: "اطلب الآن" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.18_0.05_150/0.85)] backdrop-blur-xl border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button onClick={() => go("#home")} className="flex items-center gap-2 text-cream">
          <span className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center shadow-md">
            <Leaf className="h-5 w-5 text-forest-deep" />
          </span>
          <span className="font-display font-black text-lg">الغابة السحرية</span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="px-4 py-2 rounded-full text-cream/90 hover:text-gold hover:bg-white/10 font-semibold transition"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => go("#order")}
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-bold text-forest-deep shadow-lg hover:scale-105 transition"
        >
          اطلب الآن
        </button>

        <button
          aria-label="القائمة"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cream flex items-center justify-center"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mx-4 mt-3 rounded-2xl bg-[oklch(0.2_0.05_150/0.95)] backdrop-blur-xl border border-white/10 p-3 shadow-magic">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="block w-full text-right px-4 py-3 rounded-xl text-cream hover:bg-white/10 font-semibold"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("#order")}
            className="block w-full mt-2 rounded-xl bg-gradient-gold py-3 font-bold text-forest-deep"
          >
            اطلب الآن
          </button>
        </div>
      )}
    </header>
  );
}
