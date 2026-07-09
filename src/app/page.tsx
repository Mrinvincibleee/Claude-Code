import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { Reviews } from "@/components/Reviews";
import { StorySection } from "@/components/StorySection";
import { VisitSection } from "@/components/VisitSection";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <MenuSection />
        <StorySection />
        <Gallery />
        <Reviews />
        <VisitSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
