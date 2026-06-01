import { Facebook, Instagram } from "lucide-react";
import { EnNum } from "@/components/shared/EnNum";
import { TikTokIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import {
  buildWhatsAppUrl,
  SOCIAL_LINKS,
  WHATSAPP_NUMBER_DISPLAY,
  toWhatsAppE164,
} from "@/lib/contact";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const socialItems = [
  {
    href: buildWhatsAppUrl("مرحباً نسيج! أود الاستفسار عن مغامرات الغابة السحرية."),
    label: "واتساب",
    sublabel: WHATSAPP_NUMBER_DISPLAY,
    external: true,
    icon: WhatsAppIcon,
    iconClass: "text-[oklch(0.55_0.16_145)]",
    ringClass: "hover:border-[oklch(0.55_0.16_145/0.4)] hover:bg-[oklch(0.55_0.16_145/0.08)]",
  },
  {
    href: SOCIAL_LINKS.facebook,
    label: "فيسبوك",
    sublabel: "Naseeg.Stories",
    external: true,
    icon: Facebook,
    iconClass: "text-[oklch(0.45_0.12_250)]",
    ringClass: "hover:border-[oklch(0.45_0.12_250/0.35)] hover:bg-[oklch(0.45_0.12_250/0.06)]",
  },
  {
    href: SOCIAL_LINKS.instagram,
    label: "إنستغرام",
    sublabel: "naseeg.stories",
    external: true,
    icon: Instagram,
    iconClass: "text-[oklch(0.5_0.18_350)]",
    ringClass: "hover:border-[oklch(0.5_0.18_350/0.35)] hover:bg-[oklch(0.5_0.18_350/0.06)]",
  },
  {
    href: SOCIAL_LINKS.tiktok,
    label: "تيك توك",
    sublabel: "@naseeg.stories",
    external: true,
    icon: TikTokIcon,
    iconClass: "text-forest-deep",
    ringClass: "hover:border-forest/30 hover:bg-forest/5",
  },
] as const;

export function Footer() {
  const telHref = `tel:+${toWhatsAppE164(WHATSAPP_NUMBER_DISPLAY)}`;

  return (
    <footer className="border-t border-border/80 bg-[oklch(0.96_0.03_88)] py-10 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="font-display text-xl font-black text-forest-deep sm:text-2xl">
            تواصل معنا
          </h2>

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {socialItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border border-forest/15 bg-cream px-3 py-4 shadow-sm transition",
                    item.ringClass,
                  )}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-forest/10">
                    <Icon className={cn("h-5 w-5", item.iconClass)} />
                  </span>
                  <span className="font-display text-sm font-bold text-forest-deep">
                    {item.label}
                  </span>
                  <span
                    className="text-[10px] font-medium text-muted-foreground sm:text-xs"
                    dir={item.label === "واتساب" ? "ltr" : undefined}
                  >
                    {item.label === "واتساب" ? (
                      <EnNum>{item.sublabel}</EnNum>
                    ) : (
                      item.sublabel
                    )}
                  </span>
                </a>
              );
            })}
          </div>


          <p className="text-xs text-muted-foreground">
            © <EnNum>{formatNumber(new Date().getFullYear())}</EnNum> نسيج — كل الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
