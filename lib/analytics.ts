interface AnalyticsData {
  totalViews: number
  articleViews: Record<string, number>
  visitors: Set<string>
  citations: number
  lastUpdated: string
}

interface PageView {
  path: string
  timestamp: string
  visitorId: string
  articleSlug?: string
}

class AnalyticsService {
  private storageKey = "portfolio-analytics"
  private visitorKey = "portfolio-visitor-id"

  private isClient(): boolean {
    return typeof window !== "undefined"
  }

  private getVisitorId(): string {
    if (!this.isClient()) return "server-visitor"

    let visitorId = localStorage.getItem(this.visitorKey)
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      localStorage.setItem(this.visitorKey, visitorId)
    }
    return visitorId
  }

  private getAnalyticsData(): AnalyticsData {
    if (!this.isClient()) {
      return {
        totalViews: 0,
        articleViews: {},
        visitors: new Set(),
        citations: 0,
        lastUpdated: new Date().toISOString(),
      }
    }

    const stored = localStorage.getItem(this.storageKey)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        data.visitors = new Set(data.visitors || [])
        return data
      } catch (err) {
        console.warn("[Analytics] Failed to parse analytics data:", err)
        // Reset corrupted data
        return {
          totalViews: 0,
          articleViews: {},
          visitors: new Set(),
          citations: 0,
          lastUpdated: new Date().toISOString(),
        }
      }
    }

    return {
      totalViews: 0,
      articleViews: {},
      visitors: new Set(),
      citations: 0,
      lastUpdated: new Date().toISOString(),
    }
  }

  private saveAnalyticsData(data: AnalyticsData): void {
    if (!this.isClient()) return

    const toStore = {
      ...data,
      visitors: Array.from(data.visitors),
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(this.storageKey, JSON.stringify(toStore))
  }

  trackPageView(path: string): void {
    if (!this.isClient()) return

    const visitorId = this.getVisitorId()
    const data = this.getAnalyticsData()

    data.totalViews++
    data.visitors.add(visitorId)

    // Normalize slug (remove /publications/ prefix and trailing slash)
    if (path.startsWith("/publications/") && path !== "/publications") {
      const slug = path.replace(/^\/publications\/|\/$/g, "")
      data.articleViews[slug] = (data.articleViews[slug] || 0) + 1
    }

    this.saveAnalyticsData(data)

    console.log("[Analytics] Page view tracked:", { path, visitorId, totalViews: data.totalViews })
  }

  trackCitation(): void {
    if (!this.isClient()) return

    const data = this.getAnalyticsData()
    data.citations++
    this.saveAnalyticsData(data)
  }

  getMetrics() {
    const data = this.getAnalyticsData()
    return {
      totalViews: data.totalViews,
      uniqueVisitors: data.visitors.size,
      citations: data.citations,
      articleViews: data.articleViews,
      lastUpdated: data.lastUpdated,
    }
  }

  getArticleViews(slug: string): number {
    const data = this.getAnalyticsData()
    const views = data.articleViews[slug] || 0
    console.log("[Analytics] Views for slug:", slug, views)
    return views
  }

  resetAnalytics(): void {
    if (!this.isClient()) return

    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(this.visitorKey)
  }
}

export const analytics = new AnalyticsService()
