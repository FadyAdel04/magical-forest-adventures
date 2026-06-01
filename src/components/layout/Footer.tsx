import { Instagram, Phone } from "lucide-react";
import { EnNum } from "@/components/shared/EnNum";
import { formatNumber } from "@/lib/format";

const PHONE = "01055745507";
const INSTAGRAM_URL = "https://www.instagram.com/naseeg.stories";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-[oklch(0.96_0.03_88)] py-10 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
          <h2 className="font-display text-xl font-black text-forest-deep sm:text-2xl">
            تواصل معنا
          </h2>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <a
              href={`tel:+20${PHONE.replace(/^0/, "")}`}
              className="inline-flex items-center gap-2.5 rounded-full border border-forest/15 bg-cream px-5 py-2.5 font-bold text-forest-deep shadow-sm transition hover:border-forest/30 hover:bg-forest/5"
              dir="ltr"
            >
              <Phone className="h-4 w-4 shrink-0 text-forest" />
              <EnNum>{PHONE}</EnNum>
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-forest/15 bg-cream px-5 py-2.5 font-bold text-forest-deep shadow-sm transition hover:border-forest/30 hover:bg-forest/5"
            >
              <Instagram className="h-4 w-4 shrink-0 text-forest" />
              naseeg.stories
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            © <EnNum>{formatNumber(new Date().getFullYear())}</EnNum> نسيج — كل الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
