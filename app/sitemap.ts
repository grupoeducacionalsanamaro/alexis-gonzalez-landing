import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/mentoria`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terminos`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
