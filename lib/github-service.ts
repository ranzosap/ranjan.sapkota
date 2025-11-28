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
      console.log("Syncing to GitHub via server API:", {
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
        console.error("GitHub sync failed:", result.error)
        console.log("Article updated in GitHub: Failed")
        return false
      }

      console.log("Successfully synced to GitHub via server API")
      console.log("Article updated in GitHub: Success")
      return true
    } catch (error) {
      console.error("GitHub sync error:", error)
      console.log("Article updated in GitHub: Failed")
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
      const response = await fetch("/api/github/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, message }),
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        console.error("GitHub delete via server failed:", result)
        return false
      }

      console.log("Successfully deleted from GitHub via server:", path)
      return true
    } catch (error) {
      console.error("GitHub delete API error:", error)
      return true
    }
  }

  async getArticlesFromGitHub(): Promise<Article[]> {
    try {
      const articles: Article[] = []

      const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/articles/published`

      console.log("Fetching articles from GitHub:", url)
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const files = await response.json()
        console.log("Found files in GitHub:", files.length)

        for (const file of files) {
          if (file.name.endsWith(".md")) {
            console.log("Processing article file:", file.name)
            const contentResponse = await fetch(file.download_url)
            if (contentResponse.ok) {
              const content = await contentResponse.text()
              let article = this.parseMarkdownArticle(content, true)

              if (!article) {
                const title = (content.match(/^\s*#\s+(.*)$/m)?.[1]?.trim()) || file.name.replace(/\.md$/, "")
                const slug = title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")

                article = {
                  slug,
                  title,
                  authors: ["Ranjan Sapkota"],
                  year: new Date().getFullYear(),
                  publication_venue: "",
                  abstract: "",
                  tags: [],
                  published: true,
                  featured: false,
                  doi: "",
                  pdf_url: "",
                  code_url: "",
                  dataset_url: "",
                  thumbnail: "",
                  readingTime: Math.ceil(content.split(/\s+/).length / 200),
                  url: `/publications/${slug}`,
                  body: { code: content },
                  github_link: `https://github.com/${this.config.owner}/${this.config.repo}/blob/main/${this.getArticlePath(slug, "published")}`,
                }

                console.log("Parsed without frontmatter:", title)
              }

              articles.push(article)
              console.log("Successfully parsed article:", article.title)
            }
          }
        }
      } else {
        console.log("GitHub API response not ok:", response.status, response.statusText)
      }

      console.log("Total articles fetched from GitHub:", articles.length)
      return articles
    } catch (error) {
      console.error("Error fetching articles from GitHub:", error)
      return []
    }
  }

  private parseMarkdownArticle(content: string, published: boolean): Article | null {
    try {
      const fm = content.match(/^\s*\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
      if (!fm) return null

      const frontmatter = fm[1]
      const body = fm[2] || ""

      const metadata: any = {}
      const lines = frontmatter.split(/\r?\n/)
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const match = line.match(/^(\w+):\s*(.*)$/)
        if (!match) continue
        const key = match[1].toLowerCase()
        let value = match[2].trim()

        if (value === "|" || value === ">") {
          const captured: string[] = []
          let j = i + 1
          while (j < lines.length && (lines[j].startsWith(" ") || lines[j].startsWith("\t"))) {
            captured.push(lines[j].replace(/^\s+/, ""))
            j++
          }
          metadata[key] = value === "|" ? captured.join("\n") : captured.join(" ")
          i = j - 1
          continue
        }

        if (value === "") {
          const arr: string[] = []
          let j = i + 1
          while (j < lines.length && lines[j].trim().startsWith("- ")) {
            arr.push(lines[j].trim().slice(2).replace(/^"(.*)"$/, "$1"))
            j++
          }
          if (arr.length > 0) {
            metadata[key] = arr
            i = j - 1
            continue
          }
        }

        if (value.startsWith("[") && value.endsWith("]")) {
          value = value
            .slice(1, -1)
            .split(",")
            .map((item) => item.trim().replace(/"/g, ""))
        } else if (value === "true" || value === "false") {
          value = value === "true"
        } else if (!isNaN(Number(value))) {
          value = Number(value)
        } else {
          value = value.replace(/^"(.*)"$/, "$1")
        }

        metadata[key] = value
      }

      if (!metadata.title) {
        const h1 = body.match(/^\s*#\s+(.*)$/m)
        if (h1) metadata.title = h1[1].trim()
      }

      const slug =
        metadata.title
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "untitled"

      if (metadata.authors && typeof metadata.authors === "string") metadata.authors = [metadata.authors]
      if (metadata.tags && typeof metadata.tags === "string") metadata.tags = [metadata.tags]

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
        readingTime: Math.ceil(body.split(/\s+/).length / 200),
        url: `/publications/${slug}`,
        body: { code: body },
        github_link:
          metadata.github_link || `https://github.com/${this.config.owner}/${this.config.repo}/blob/main/${this.getArticlePath(slug, "published")}`,
      }
    } catch (error) {
      console.error("Error parsing markdown article:", error)
      return null
    }
  }

  generateArticleLink(title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    return `https://github.com/${this.config.owner}/${this.config.repo}/blob/main/${this.getArticlePath(slug, "published")}`
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
