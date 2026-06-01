import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { Experience } from "@/components/landing/Experience";
import { Contents } from "@/components/landing/Contents";
import { Gallery } from "@/components/landing/Gallery";
import { Order } from "@/components/landing/Order";
import { FloatingLeaves } from "@/components/landing/Fireflies";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مغامرات الحروف في الغابة السحرية | تجربة تعليمية تفاعلية للأطفال" },
      { name: "description", content: "صندوق تعليمي تفاعلي للأطفال: 17 قصة، رموز QR صوتية، شموع غابة عطرية، وبازل ممتع. اطلب الآن بـ 699 جنيه." },
      { property: "og:title", content: "مغامرات الحروف في الغابة السحرية" },
      { property: "og:description", content: "تجربة تعليمية تفاعلية بطابع غابة سحرية: قصص، أصوات، بازل، وشموع عطرية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    htmlAttrs: { lang: "ar", dir: "rtl" },
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-background text-foreground" dir="rtl">
      <FloatingLeaves count={6} />
      <Hero />
      <Experience />
      <Contents />
      <Gallery />
      <Order />
      <footer className="bg-forest-deep text-cream/70 py-8 text-center text-sm">
        © {new Date().getFullYear()} مغامرات الحروف في الغابة السحرية — كل الحقوق محفوظة.
      </footer>
    </main>
  );
}
