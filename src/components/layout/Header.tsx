import { useState, useEffect, useCallback } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import logo from "@/assets/logo.jpg";

const links = [
  { href: "#home", label: "الرئيسية" },
  { href: "#product", label: "المنتج" },
  { href: "#order", label: "الطلب" },
] as const;

type ActiveHref = (typeof links)[number]["href"];
type HeaderTheme = "forest" | "paper" | "order";

function resolveHeaderTheme(active: ActiveHref, paperFromScroll: boolean): HeaderTheme {
  if (active === "#order") return "order";
  if (active === "#product" || paperFromScroll) return "paper";
  return "forest";
}

function navLinkClass(isActive: boolean, theme: HeaderTheme, variant: "bar" | "menu") {
  if (!isActive) {
    if (theme === "paper") return "text-bark/80 hover:bg-forest/10 hover:text-forest";
    return "text-cream/85 hover:bg-white/10 hover:text-gold";
  }

  if (variant === "menu") {
    if (theme === "paper") {
      return "nav-link-active nav-link-active--menu-light bg-forest/15 font-black text-forest ring-2 ring-forest/30";
    }
    return "nav-link-active nav-link-active--menu-dark bg-white/20 font-black text-gold ring-2 ring-gold/50";
  }

  if (theme === "paper") {
    return "nav-link-active nav-link-active--light font-black text-forest-deep";
  }
  return "nav-link-active nav-link-active--dark font-black text-gold";
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ActiveHref>("#home");
  const [paperFromScroll, setPaperFromScroll] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const updateActiveSection = useCallback(() => {
    const home = document.getElementById("home");
    const product = document.getElementById("product");
    const order = document.getElementById("order");
    if (!home || !product || !order) return;

    const headerOffset = 88;
    const marker = window.scrollY + headerOffset;

    const homeMid = home.offsetTop + home.offsetHeight / 2;
    const productTop = product.offsetTop;
    const orderTop = order.offsetTop;

    if (marker >= orderTop) {
      setActive("#order");
      setPaperFromScroll(false);
    } else if (marker >= productTop) {
      setActive("#product");
      setPaperFromScroll(true);
    } else if (marker >= homeMid) {
      setActive("#home");
      setPaperFromScroll(true);
    } else {
      setActive("#home");
      setPaperFromScroll(false);
    }
    
    // Track scroll state
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [updateActiveSection]);

  const go = (href: string) => {
    setOpen(false);
    if (links.some((l) => l.href === href)) {
      setActive(href as ActiveHref);
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const theme = resolveHeaderTheme(active, paperFromScroll);

  const headerShellClass = isScrolled
    ? "bg-[#1c290d] shadow-lg border-b border-white/10"
    : "bg-[#1c290d]";

  const orderBtnClass =
    theme === "paper"
      ? "bg-gradient-forest text-cream shadow-sm hover:shadow-glow"
      : "border-2 border-gold/70 bg-gold/15 text-cream backdrop-blur-sm hover:bg-gold/25";

  const menuToggleClass =
    theme === "paper"
      ? "border-forest/25 bg-forest/10 text-forest-deep"
      : "border-white/30 bg-white/15 text-cream";

  const mobileMenuClass =
    theme === "paper"
      ? "border-border bg-cream/98"
      : "border-white/10 bg-[oklch(0.2_0.05_150/0.96)]";

  return (
    <header
      className={` top-0 inset-x-0 z-100 py-2.5 transition-all duration-300 sm:py-3 text-cream shadow-md ${headerShellClass}`}
    >
      <div className="container relative mx-auto flex min-h-18 items-center justify-center px-4 md:grid md:min-h-0 md:grid-cols-[1fr_auto_1fr] md:gap-2">
        <button
          type="button"
          aria-label="القائمة"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border md:hidden ${menuToggleClass}`}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={() => go("#home")}
          className="flex shrink-0 items-center md:justify-self-start"
        >
          <img src={logo} alt="نسيج" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
        </button>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => go(l.href)}
              className={`relative rounded-full px-3 py-2 text-sm transition xl:px-4 xl:text-base ${navLinkClass(
                active === l.href,
                theme,
                "bar",
              )}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-2 md:static md:translate-y-0 md:justify-self-end">
          <button
            type="button"
            onClick={() => go("#order")}
            className={`hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition sm:inline-flex sm:px-4 sm:text-sm ${orderBtnClass}`}
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            اطلب الآن
          </button>
        </div>
      </div>

      {open && (
        <div
          className={`mx-4 mt-2 rounded-2xl border p-3 shadow-magic backdrop-blur-xl md:hidden ${mobileMenuClass}`}
          style={{ zIndex: 101 }}
        >
          <button
            type="button"
            onClick={() => go("#order")}
            className={`mb-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold ${
              theme === "paper" ? "bg-gradient-forest text-cream" : "bg-gold/25 text-gold"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            اطلب الآن
          </button>
          {links.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => go(l.href)}
              className={`mb-1 block w-full rounded-xl px-4 py-3 text-right transition ${navLinkClass(
                active === l.href,
                theme,
                "menu",
              )}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}