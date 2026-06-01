import { Facebook, Instagram } from "lucide-react";
import { TikTokIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { buildWhatsAppUrl, SOCIAL_LINKS } from "@/lib/contact";
import { cn } from "@/lib/utils";

const socialItems = [
  {
    href: buildWhatsAppUrl("مرحباً نسيج! أود الاستفسار عن مغامرات الغابة السحرية."),
    label: "واتساب",
    external: true,
    icon: WhatsAppIcon,
    iconClass: "text-[oklch(0.55_0.16_145)]",
    bgClass: "hover:bg-[oklch(0.55_0.16_145/0.1)]",
  },
  {
    href: SOCIAL_LINKS.facebook,
    label: "فيسبوك",
    external: true,
    icon: Facebook,
    iconClass: "text-[oklch(0.45_0.12_250)]",
    bgClass: "hover:bg-[oklch(0.45_0.12_250/0.08)]",
  },
  {
    href: SOCIAL_LINKS.instagram,
    label: "إنستغرام",
    external: true,
    icon: Instagram,
    iconClass: "text-[oklch(0.5_0.18_350)]",
    bgClass: "hover:bg-[oklch(0.5_0.18_350/0.08)]",
  },
  {
    href: SOCIAL_LINKS.tiktok,
    label: "تيك توك",
    external: true,
    icon: TikTokIcon,
    iconClass: "text-forest-deep",
    bgClass: "hover:bg-forest/5",
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-[oklch(0.96_0.03_88)] py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="font-display text-lg font-black text-forest-deep sm:text-xl">
            تواصل معنا
          </h2>

          {/* Social Icons Row - Icons only */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {socialItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-forest/15 transition-all duration-200 hover:scale-110 hover:shadow-lg",
                    item.bgClass,
                  )}
                  aria-label={item.label}
                >
                  <Icon className={cn("h-5 w-5", item.iconClass)} />
                </a>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 نسيج — كل الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}