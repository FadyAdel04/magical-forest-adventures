import { lazy, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";

// Below-fold sections — lazy loaded to reduce initial bundle
const Product = lazy(() =>
  import("@/components/sections/Product").then((m) => ({ default: m.Product })),
);
const Order = lazy(() =>
  import("@/components/sections/Order").then((m) => ({ default: m.Order })),
);

function SectionFallback() {
  return <div className="py-16" aria-hidden />;
}

export function LandingPage() {
  return (
    <main className="relative bg-background text-foreground" dir="rtl">
      <Header />
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <Product />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Order />
      </Suspense>
      <Footer />
    </main>
  );
}
