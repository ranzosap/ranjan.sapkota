export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

export function generateArticleSlug(title: string, year: number): string {
  const titleSlug = slugify(title)
  return `${year}-${titleSlug}`
}

export function parseArticleSlug(slug: string): { year: number; titleSlug: string } | null {
  const match = slug.match(/^(\d{4})-(.+)$/)
  if (!match) return null

  return {
    year: Number.parseInt(match[1], 10),
    titleSlug: match[2],
  }
}
