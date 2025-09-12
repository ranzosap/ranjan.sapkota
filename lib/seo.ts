import type { Article } from "@/lib/content"

export interface PersonSchema {
  "@context": "https://schema.org"
  "@type": "Person"
  name: string
  jobTitle: string
  affiliation: {
    "@type": "Organization"
    name: string
  }
  url: string
  sameAs: string[]
  knowsAbout: string[]
}

export interface ArticleSchema {
  "@context": "https://schema.org"
  "@type": "ScholarlyArticle"
  headline: string
  abstract?: string
  author: Array<{
    "@type": "Person"
    name: string
  }>
  datePublished: string
  publisher: {
    "@type": "Organization"
    name: string
  }
  url: string
  keywords: string[]
  citation?: string
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org"
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item: string
  }>
}

export function generatePersonSchema(baseUrl: string): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ranjan Sapkota",
    jobTitle: "PhD Researcher in Agricultural Robotics and AI Automation",
    affiliation: {
      "@type": "Organization",
      name: "Cornell University",
    },
    url: baseUrl,
    sameAs: [
      "https://scholar.google.com/citations?user=XXXXXXX",
      "https://orcid.org/0000-0000-0000-0000",
      "https://github.com/ranzosap",
    ],
    knowsAbout: [
      "Agricultural Engineering",
      "Artificial Intelligence",
      "Multimodal Large Language Models",
      "Agricultural Robotics",
      "Agricultural Automation",
      "Computer Vision",
      "Machine Learning",
    ],
  }
}

export function generateArticleSchema(article: Article, baseUrl: string): ArticleSchema {
  const publishedDate = article.month
    ? `${article.year}-${String(article.month).padStart(2, "0")}-01`
    : `${article.year}-01-01`

  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: article.title,
    abstract: article.abstract,
    author: article.authors.map((author) => ({
      "@type": "Person",
      name: author,
    })),
    datePublished: publishedDate,
    publisher: {
      "@type": "Organization",
      name: article.publication_venue,
    },
    url: `${baseUrl}${article.url}`,
    keywords: article.tags,
    citation: article.bibtex,
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  baseUrl: string,
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}
