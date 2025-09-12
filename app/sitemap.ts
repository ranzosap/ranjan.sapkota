import type { MetadataRoute } from "next"
import { generateSitemap } from "@/lib/sitemap"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://github.com/ranzosap/ranjan.sapkota"

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapXml = generateSitemap(baseUrl)

  // Parse the XML and return the structured format Next.js expects
  // For now, we'll generate the structure directly
  const { getPublishedArticles, getPublishedProjects } = require("@/lib/content")

  const articles = getPublishedArticles()
  const projects = getPublishedProjects()
  const currentDate = new Date().toISOString().split("T")[0]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/publications`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...articles.map((article: any) => ({
      url: `${baseUrl}${article.url}`,
      lastModified: new Date(article.year, (article.month || 1) - 1, 1),
      changeFrequency: "yearly" as const,
      priority: article.featured ? 0.9 : 0.8,
    })),
    ...projects.map((project: any) => ({
      url: `${baseUrl}${project.url}`,
      lastModified: new Date(project.year, 0, 1),
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.8 : 0.7,
    })),
  ]
}
