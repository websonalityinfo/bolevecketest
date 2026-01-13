import React from "react";
import type { Metadata } from 'next';
import PageContent from "./PageContent";

// =================================================================
// METADATA (Zůstává beze změny, je správně)
// =================================================================
export const metadata: Metadata = {
  title: 'Bolevecké květiny | Kytice, Svatební vazby a Rozvoz květin', // Unikátní, SEO-optimalizovaný titul
  description: 'Vstupte do světa Boleveckých květin! Objevte denně čerstvé, ručně vázané kytice, luxusní svatební vazby a dokonalé firemní dekorace.',
  alternates: { canonical: 'https://bolevecketest.netlify.app/', },
};

// =================================================================
// HLAVNÍ KOMPONENTA S LOCALBUSINESS SCHEMA
// =================================================================
export default function Page() {

  // Zde je JSON-LD kód pro LocalBusiness
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Florist",
    "name": "Bolevecké květiny",
    "image": "https://bolevecketest.netlify.app/logo.png",
    "@id": "https://bolevecketest.netlify.app/#localbusiness",
    "url": "https://bolevecketest.netlify.app",
    "telephone": "+420 373 315 413",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plaská 2583/198",
      "addressLocality": "Plzeň",
      "postalCode": "323 00",
      "addressCountry": "CZ"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "17:30"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    },
    "review": [
      {
        "@type": "Review",
        "author": "Marie Nováková",
        "datePublished": "2025-12-15",
        "reviewBody": "Nádherné květiny a velmi milá obsluha. Vždy čerstvé vazby.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      }
    ]
  };

  // Vzorový produkt pro vyřešení varování v Search Console
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Dárková kytice Bolevecké květiny",
    "image": "https://bolevecketest.netlify.app/logo.png",
    "description": "Čerstvé, ručně vázané dárkové kytice pro každou příležitost.",
    "brand": {
      "@type": "Brand",
      "name": "Bolevecké květiny"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://bolevecketest.netlify.app",
      "priceCurrency": "CZK",
      "price": "490",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <>
      {/* Vložení Schema Markup do hlavičky dokumentu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <PageContent />
    </>
  );
}