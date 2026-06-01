import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Product } from "@/components/sections/Product";
import { Order } from "@/components/sections/Order";

export function LandingPage() {
  return (
    <main className="relative bg-background text-foreground" dir="rtl">
      <Header />
      <Hero />
      <Product />
      <Order />
      <Footer />
    </main>
  );
}
