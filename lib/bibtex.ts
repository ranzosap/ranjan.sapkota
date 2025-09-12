import { slugify } from "./slugify"

export interface BibTeXEntry {
  type: "article" | "inproceedings" | "book" | "incollection" | "misc"
  key: string
  title: string
  authors: string[]
  journal?: string
  booktitle?: string
  publisher?: string
  year: number
  month?: number
  pages?: string
  volume?: string
  number?: string
  doi?: string
  url?: string
  abstract?: string
  keywords?: string[]
}

const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

export function generateBibTeX(entry: BibTeXEntry): string {
  const lines: string[] = []

  lines.push(`@${entry.type}{${entry.key},`)

  // Title
  lines.push(`  title = {${entry.title}},`)

  // Authors
  const authorString = entry.authors.join(" and ")
  lines.push(`  author = {${authorString}},`)

  // Publication venue
  if (entry.journal) {
    lines.push(`  journal = {${entry.journal}},`)
  }
  if (entry.booktitle) {
    lines.push(`  booktitle = {${entry.booktitle}},`)
  }
  if (entry.publisher) {
    lines.push(`  publisher = {${entry.publisher}},`)
  }

  // Year and month
  lines.push(`  year = {${entry.year}},`)
  if (entry.month && entry.month >= 1 && entry.month <= 12) {
    lines.push(`  month = ${monthNames[entry.month - 1]},`)
  }

  // Optional fields
  if (entry.volume) {
    lines.push(`  volume = {${entry.volume}},`)
  }
  if (entry.number) {
    lines.push(`  number = {${entry.number}},`)
  }
  if (entry.pages) {
    lines.push(`  pages = {${entry.pages}},`)
  }
  if (entry.doi) {
    lines.push(`  doi = {${entry.doi}},`)
  }
  if (entry.url) {
    lines.push(`  url = {${entry.url}},`)
  }
  if (entry.abstract) {
    lines.push(`  abstract = {${entry.abstract}},`)
  }
  if (entry.keywords && entry.keywords.length > 0) {
    lines.push(`  keywords = {${entry.keywords.join(", ")}},`)
  }

  lines.push("}")

  return lines.join("\n")
}

export function generateBibTeXFromArticle(article: any): string {
  return generateBibTeX({
    type: "article",
    key: slugify(article.title),
    title: article.title,
    authors: article.authors,
    journal: article.publication_venue,
    year: article.year,
    month: article.month,
    doi: article.doi,
    url: article.pdf_url,
    abstract: article.abstract,
    keywords: article.tags,
  })
}
