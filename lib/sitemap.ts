import { getPublishedArticles, getPublishedProjects } from "./content"

export interface SitemapURL {
  url: string
  lastmod: string
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: number
}

export function generateSitemap(baseUrl: string): string {
  const articles = getPublishedArticles()
  const projects = getPublishedProjects()
  const currentDate = new Date().toISOString().split("T")[0]

  const urls: SitemapURL[] = [
    // Static pages
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/publications/`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects/`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.7,
    },
    // {
    //   url: `${baseUrl}/teaching/`,
    //   lastmod: currentDate,
    //   changefreq: "monthly",
    //   priority: 0.6,
    // },
    {
      url: `${baseUrl}/talks/`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact/`,
      lastmod: currentDate,
      changefreq: "yearly",
      priority: 0.5,
    },

    // Articles
    ...articles.map((article): SitemapURL => {
      const lastmod = article.month
        ? `${article.year}-${String(article.month).padStart(2, "0")}-01`
        : `${article.year}-01-01`

      return {
        url: `${baseUrl}${article.url}`,
        lastmod,
        changefreq: "yearly",
        priority: article.featured ? 0.9 : 0.8,
      }
    }),

    // Projects
    ...projects.map(
      (project): SitemapURL => ({
        url: `${baseUrl}${project.url}`,
        lastmod: `${project.year}-01-01`,
        changefreq: "yearly",
        priority: project.featured ? 0.8 : 0.7,
      }),
    ),
  ]

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
    )
    .join("")}
</urlset>`

  return sitemapContent
}
