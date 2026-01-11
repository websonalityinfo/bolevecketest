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
    "@type": "Florist, Flowershop, Květinářství",
    "name": "Bolevecké květiny",
    "image": "https://bolevecketest.netlify.app/logo.png",
    "url": "https://bolevecketest.netlify.app",
    "telephone": "+420 373 315 413",
    "priceRange": "$$", // Použijte $, $$, $$$ pro cenovou hladinu
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plaská 2583/198",
      "addressLocality": "Plzeň, Pilsen",
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
    ]
  };

  return (
    <>
      {/* Vložení Schema Markup do hlavičky dokumentu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <PageContent />
    </>
  );
}