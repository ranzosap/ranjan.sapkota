import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { generateBibTeX } from "./bibtex"
import { slugify } from "./slugify"

export interface Article {
  slug: string
  title: string
  abstract?: string
  authors: string[]
  affiliations?: string[]
  publication_venue: string
  year: number
  month?: number
  doi?: string
  arxiv?: string
  pdf_url?: string
  code_url?: string
  dataset_url?: string
  tags: string[]
  thumbnail?: string
  featured: boolean
  published: boolean
  content: string
  url: string
  bibtex: string
  readingTime: number
}

export interface Project {
  slug: string
  title: string
  summary: string
  role: string
  links: { name: string; url: string }[]
  year: number
  tags: string[]
  images: string[]
  featured: boolean
  published: boolean
  content: string
  url: string
}

function getContentFiles(dir: string): string[] {
  const contentDir = path.join(process.cwd(), "content", dir)
  if (!fs.existsSync(contentDir)) {
    return []
  }
  return fs.readdirSync(contentDir).filter((file) => file.endsWith(".mdx"))
}

function parseArticle(filename: string): Article | null {
  try {
    const filePath = path.join(process.cwd(), "content", "articles", filename)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContent)

    const slug = filename.replace(/\.mdx$/, "")
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)

    return {
      slug,
      title: data.title || "",
      abstract: data.abstract,
      authors: data.authors || [],
      affiliations: data.affiliations,
      publication_venue: data.publication_venue || "",
      year: data.year || new Date().getFullYear(),
      month: data.month,
      doi: data.doi,
      arxiv: data.arxiv,
      pdf_url: data.pdf_url,
      code_url: data.code_url,
      dataset_url: data.dataset_url,
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      featured: data.featured || false,
      published: data.published !== false,
      content,
      url: `/publications/${slug}`,
      bibtex: generateBibTeX({
        type: "article",
        key: slugify(data.title || ""),
        title: data.title || "",
        authors: data.authors || [],
        journal: data.publication_venue || "",
        year: data.year || new Date().getFullYear(),
        month: data.month,
        doi: data.doi,
        url: data.pdf_url,
        abstract: data.abstract,
      }),
      readingTime,
    }
  } catch (error) {
    console.error(`Error parsing article ${filename}:`, error)
    return null
  }
}

function parseProject(filename: string): Project | null {
  try {
    const filePath = path.join(process.cwd(), "content", "projects", filename)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContent)

    const slug = filename.replace(/\.mdx$/, "")

    return {
      slug,
      title: data.title || "",
      summary: data.summary || "",
      role: data.role || "",
      links: data.links || [],
      year: data.year || new Date().getFullYear(),
      tags: data.tags || [],
      images: data.images || [],
      featured: data.featured || false,
      published: data.published !== false,
      content,
      url: `/projects/${slug}`,
    }
  } catch (error) {
    console.error(`Error parsing project ${filename}:`, error)
    return null
  }
}

export function getPublishedArticles(): Article[] {
  const articleFiles = getContentFiles("articles")
  const articles = articleFiles
    .map(parseArticle)
    .filter((article): article is Article => article !== null && article.published)
    .sort((a, b) => {
      // Sort by year descending, then by month descending
      if (a.year !== b.year) {
        return b.year - a.year
      }
      const aMonth = a.month || 12
      const bMonth = b.month || 12
      return bMonth - aMonth
    })

  return articles
}

export function getFeaturedArticles(): Article[] {
  return getPublishedArticles().filter((article) => article.featured)
}

export function getArticlesByTag(tag: string): Article[] {
  return getPublishedArticles().filter((article) => article.tags.includes(tag))
}

export function getArticlesByYear(year: number): Article[] {
  return getPublishedArticles().filter((article) => article.year === year)
}

export function getRelatedArticles(currentArticle: Article, limit = 3): Article[] {
  const currentTags = new Set(currentArticle.tags)

  return getPublishedArticles()
    .filter((article) => article.slug !== currentArticle.slug)
    .map((article) => ({
      article,
      score: article.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => article)
}

export function getPublishedProjects(): Project[] {
  const projectFiles = getContentFiles("projects")
  return projectFiles
    .map(parseProject)
    .filter((project): project is Project => project !== null && project.published)
    .sort((a, b) => b.year - a.year)
}

export function getFeaturedProjects(): Project[] {
  return getPublishedProjects().filter((project) => project.featured)
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()

  getPublishedArticles().forEach((article) => {
    article.tags.forEach((tag) => tagSet.add(tag))
  })

  getPublishedProjects().forEach((project) => {
    project.tags.forEach((tag) => tagSet.add(tag))
  })

  return Array.from(tagSet).sort()
}

export function getAllYears(): number[] {
  const yearSet = new Set<number>()

  getPublishedArticles().forEach((article) => {
    yearSet.add(article.year)
  })

  getPublishedProjects().forEach((project) => {
    yearSet.add(project.year)
  })

  return Array.from(yearSet).sort((a, b) => b - a)
}
