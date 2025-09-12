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

  private getVisitorId(): string {
    let visitorId = localStorage.getItem(this.visitorKey)
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem(this.visitorKey, visitorId)
    }
    return visitorId
  }

  private getAnalyticsData(): AnalyticsData {
    const stored = localStorage.getItem(this.storageKey)
    if (stored) {
      const data = JSON.parse(stored)
      // Convert visitors array back to Set
      data.visitors = new Set(data.visitors || [])
      return data
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
    // Convert Set to array for storage
    const toStore = {
      ...data,
      visitors: Array.from(data.visitors),
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(this.storageKey, JSON.stringify(toStore))
  }

  trackPageView(path: string): void {
    const visitorId = this.getVisitorId()
    const data = this.getAnalyticsData()

    // Increment total views
    data.totalViews++

    // Add visitor to set (automatically handles uniqueness)
    data.visitors.add(visitorId)

    // Track article-specific views
    if (path.startsWith("/publications/") && path !== "/publications") {
      const slug = path.replace("/publications/", "")
      data.articleViews[slug] = (data.articleViews[slug] || 0) + 1
    }

    this.saveAnalyticsData(data)

    // Log page view for debugging
    console.log("[v0] Page view tracked:", { path, visitorId, totalViews: data.totalViews })
  }

  trackCitation(): void {
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

  // Method to get views for a specific article
  getArticleViews(slug: string): number {
    const data = this.getAnalyticsData()
    console.log("[v0] Getting article views for slug:", slug)
    console.log("[v0] Available article views:", data.articleViews)
    console.log("[v0] Views for this slug:", data.articleViews[slug] || 0)
    return data.articleViews[slug] || 0
  }

  // Reset analytics (for testing purposes)
  resetAnalytics(): void {
    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(this.visitorKey)
  }
}

export const analytics = new AnalyticsService()
