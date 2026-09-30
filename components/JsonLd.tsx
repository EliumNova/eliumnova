import { site } from "@/lib/site";

// Datos estructurados para Google: negocio local + preguntas frecuentes.
export default function JsonLd() {
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    additionalType: "https://schema.org/ElectronicsStore",
    "@id": `${site.url}/#negocio`,
    name: site.name,
    alternateName: "Servicio técnico - EliumNova",
    description: site.description,
    slogan: site.slogan,
    url: `${site.url}/`,
    logo: `${site.url}/img/logo.png`,
    image: `${site.url}/img/og.jpg`,
    telephone: "+54 9 11 6001-8011",
    taxID: site.cuit,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: site.areaServed,
    openingHoursSpecification: site.hoursSchema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.google.rating,
      reviewCount: String(site.google.count),
      bestRating: "5",
    },
    sameAs: [...site.socials.map((s) => s.url), site.google.url],
    makesOffer: site.serviceNames.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([business, faq]) }}
    />
  );
}
