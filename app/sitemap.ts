export const dynamic = "force-static"; // TENTO ŘÁDEK PŘIDEJTE!

import { MetadataRoute } from 'next'

const URL = 'https://bolevecketest.netlify.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // Hlavní stránka (Homepage)
      url: "https://bolevecketest.netlify.app/",
      lastModified: new Date(), // Datum poslední úpravy (pro Google)
      changeFrequency: 'weekly', // Jak často se obsah mění
      priority: 1.0, // Nejdůležitější stránka
    },
  ]
}