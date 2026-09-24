import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <Header />
      <main id="inicio">
        <Hero />
        <Services />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
