// GitHub API service for storing articles in repository
export interface GitHubConfig {
  owner: string
  repo: string
  token?: string
}

export interface GitHubFile {
  path: string
  content: string
  message: string
  sha?: string
}

export interface Article {
  slug: string
  title: string
  authors: string[]
  year: number
  month?: number
  publication_venue: string
  abstract: string
  tags: string[]
  published: boolean
  featured: boolean
  doi: string
  pdf_url: string
  code_url: string
  dataset_url: string
  thumbnail: string
  readingTime: number
  url: string
  body: { code: string }
  github_link: string
}

class GitHubService {
  private config: GitHubConfig = {
    owner: "ranzosap",
    repo: "ranjan.sapkota",
  }

  async createOrUpdateFile(file: GitHubFile): Promise<boolean> {
    try {
      console.log("[v0] Syncing to GitHub via server API:", {
        path: file.path,
        messageLength: file.message.length,
        contentLength: file.content.length,
      })

      const response = await fetch("/api/github/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("[v0] GitHub sync failed:", result.error)
        console.log("[v0] Article updated in GitHub: Failed")
        return false
      }

      console.log("[v0] Successfully synced to GitHub via server API")
      console.log("[v0] Article updated in GitHub: Success")
      return true
    } catch (error) {
      console.error("[v0] GitHub sync error:", error)
      console.log("[v0] Article updated in GitHub: Failed")
      return false
    }
  }

  private getAuthHeaders() {
    // This method is no longer used for client-side calls
    return {
      "Content-Type": "application/json",
    }
  }

  async deleteFile(path: string, message: string, sha?: string): Promise<boolean> {
    try {
      const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}`

      // Get the file SHA if not provided
      if (!sha) {
        const getResponse = await fetch(url, {
          headers: this.getAuthHeaders(),
        })
        if (getResponse.ok) {
          const fileData = await getResponse.json()
          sha = fileData.sha
        } else {
          console.log("[v0] File not found in GitHub, skipping delete")
          return true
        }
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          message,
          sha,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] GitHub delete API error:", errorData)
        return false
      }

      console.log("[v0] Successfully deleted from GitHub:", path)
      return true
    } catch (error) {
      console.error("[v0] GitHub delete API error:", error)
      return true // Return true to continue with localStorage functionality
    }
  }

  async getArticlesFromGitHub(): Promise<Article[]> {
    try {
      const articles: Article[] = []

      const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/articles/published`

      console.log("[v0] Fetching articles from GitHub:", url)
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const files = await response.json()
        console.log("[v0] Found files in GitHub:", files.length)

        for (const file of files) {
          if (file.name.endsWith(".md")) {
            console.log("[v0] Processing article file:", file.name)
            const contentResponse = await fetch(file.download_url)
            if (contentResponse.ok) {
              const content = await contentResponse.text()
              const article = this.parseMarkdownArticle(content, true) // All articles in published folder are published
              if (article) {
                articles.push(article)
                console.log("[v0] Successfully parsed article:", article.title)
              }
            }
          }
        }
      } else {
        console.log("[v0] GitHub API response not ok:", response.status, response.statusText)
      }

      console.log("[v0] Total articles fetched from GitHub:", articles.length)
      return articles
    } catch (error) {
      console.error("[v0] Error fetching articles from GitHub:", error)
      return []
    }
  }

  private parseMarkdownArticle(content: string, published: boolean): Article | null {
    try {
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (!frontmatterMatch) return null

      const frontmatter = frontmatterMatch[1]
      const body = frontmatterMatch[2]

      // Parse frontmatter
      const metadata: any = {}
      frontmatter.split("\n").forEach((line) => {
        const match = line.match(/^(\w+):\s*(.*)$/)
        if (match) {
          const key = match[1]
          let value = match[2].trim()

          // Handle different data types
          if (value.startsWith("[") && value.endsWith("]")) {
            // Array
            value = value
              .slice(1, -1)
              .split(",")
              .map((item) => item.trim().replace(/"/g, ""))
          } else if (value === "true" || value === "false") {
            // Boolean
            value = value === "true"
          } else if (!isNaN(Number(value))) {
            // Number
            value = Number(value)
          } else {
            // String - remove quotes
            value = value.replace(/^"(.*)"$/, "$1")
          }

          metadata[key] = value
        }
      })

      const slug =
        metadata.title
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "untitled"

      return {
        slug,
        title: metadata.title || "Untitled",
        authors: metadata.authors || ["Ranjan Sapkota"],
        year: metadata.year || new Date().getFullYear(),
        month: metadata.month,
        publication_venue: metadata.publication_venue || "",
        abstract: metadata.abstract || "",
        tags: metadata.tags || [],
        published,
        featured: metadata.featured || false,
        doi: metadata.doi || "",
        pdf_url: metadata.pdf_url || "",
        code_url: metadata.code_url || "",
        dataset_url: metadata.dataset_url || "",
        thumbnail: metadata.thumbnail || "",
        readingTime: Math.ceil(body.split(" ").length / 200),
        url: `/publications/${slug}`,
        body: { code: body },
        github_link: metadata.github_link || this.generateArticleLink(metadata.title || "untitled"),
      }
    } catch (error) {
      console.error("[v0] Error parsing markdown article:", error)
      return null
    }
  }

  generateArticleLink(title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    return `https://github.com/${this.config.owner}/${this.config.repo}/articles/${slug}`
  }

  getArticlePath(slug: string, status: "draft" | "published"): string {
    return `articles/${status}/${slug}.md`
  }

  formatArticleContent(article: any): string {
    const frontmatter = `---
title: "${article.title}"
authors: [${article.authors.map((author: string) => `"${author}"`).join(", ")}]
year: ${article.year}
month: ${article.month || 1}
publication_venue: "${article.publication_venue}"
abstract: "${article.abstract || ""}"
tags: [${article.tags.map((tag: string) => `"${tag}"`).join(", ")}]
published: ${article.published}
featured: ${article.featured || false}
doi: "${article.doi || ""}"
pdf_url: "${article.pdf_url || ""}"
code_url: "${article.code_url || ""}"
dataset_url: "${article.dataset_url || ""}"
github_link: "${this.generateArticleLink(article.title)}"
---

${article.body.code}
`
    return frontmatter
  }
}

export const githubService = new GitHubService()
