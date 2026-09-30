import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/servicio-tecnico`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/tienda`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/como-comprar`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/sobre-nosotros`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
    { url: `${site.url}/arrepentimiento`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
