export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateArticleSlug(title, year) {
  const titleSlug = slugify(title)
  return `${year}-${titleSlug}`
}

// CLI usage
if (process.argv.length > 2) {
  const text = process.argv.slice(2).join(' ')
  console.log(slugify(text))
}
