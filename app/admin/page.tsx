"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DeleteArticleDialog } from "@/components/delete-article-dialog"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  FileText,
  Eye,
  Edit,
  Search,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllArticlesWithSync, deleteArticle, updateArticle } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { analytics } from "@/lib/analytics"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [allArticles, setAllArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    citations: 0,
    articleViews: {} as Record<string, number>,
  })
  const articlesPerPage = 5

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true)
        const articles = await getAllArticlesWithSync()
        setAllArticles(articles)
      } catch (error) {
        console.error("Error loading articles in admin:", error)
        // Fallback to regular function if sync fails
        const { getAllArticles } = await import("@/lib/mock-data")
        const articles = getAllArticles()
        setAllArticles(articles)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [refreshKey])

  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey((prev) => prev + 1)
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  useEffect(() => {
    const loadMetrics = () => {
      const realMetrics = analytics.getMetrics()
      setMetrics(realMetrics)
    }

    loadMetrics()

    const interval = setInterval(loadMetrics, 30000)

    return () => clearInterval(interval)
  }, [refreshKey])

  const filteredArticles = allArticles
    .filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      // Sort by year first (descending)
      if (a.year !== b.year) {
        return b.year - a.year
      }
      // Then by month if available (descending)
      const aMonth = a.month || 12
      const bMonth = b.month || 12
      if (aMonth !== bMonth) {
        return bMonth - aMonth
      }
      // Finally by creation date if available (descending)
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleDeleteArticle = (articleTitle: string) => {
    const articleToDelete = allArticles.find((article) => article.title === articleTitle)

    if (articleToDelete) {
      const success = deleteArticle(articleToDelete.slug)

      if (success) {
        console.log("Deleting article:", articleTitle)
        toast({
          title: "Article Deleted",
          description: `Article "${articleTitle}" has been deleted successfully.`,
          variant: "success",
        })
        setRefreshKey((prev) => prev + 1)
      } else {
        toast({
          title: "Delete Failed",
          description: `Failed to delete article "${articleTitle}".`,
          variant: "destructive",
        })
      }
    }
  }

  const handleStatusToggle = (articleSlug: string, currentStatus: boolean) => {
    const updatedArticle = updateArticle(articleSlug, { published: !currentStatus })

    if (updatedArticle) {
      toast({
        title: "Status Updated",
        description: `Article status changed to ${!currentStatus ? "Published" : "Draft"}.`,
        variant: "success",
      })
      setRefreshKey((prev) => prev + 1)
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update article status.",
        variant: "destructive",
      })
    }
  }

  const stats = [
    {
      title: "Total Articles",
      value: allArticles.length,
      icon: FileText,
      trend: `${allArticles.length > 5 ? "+" : ""}${allArticles.length - 5} from initial`,
      color: "text-blue-600",
    },
    {
      title: "Total Views",
      value: metrics.totalViews.toLocaleString(),
      icon: Eye,
      trend: `${metrics.totalViews > 0 ? "Live tracking active" : "No views yet"}`,
      color: "text-green-600",
    },
    {
      title: "Citations",
      value: metrics.citations.toLocaleString(),
      icon: BarChart3,
      trend: `${metrics.citations > 0 ? "Real citations tracked" : "No citations yet"}`,
      color: "text-purple-600",
    },
    {
      title: "Visitors",
      value: metrics.uniqueVisitors.toLocaleString(),
      icon: Users,
      trend: `${metrics.uniqueVisitors > 0 ? "Unique visitors" : "No visitors yet"}`,
      color: "text-orange-600",
    },
  ]

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-[1600px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Loading articles from GitHub...</p>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
                ))}
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-[1600px]">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Welcome back, {user?.username}! Manage your academic portfolio.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/admin/articles/new")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
                </Button>
                {/* Updated Upload Media button to navigate to media management page */}
                {/* <Button
                  variant="outline"
                  onClick={() => router.push("/admin/media")}
                  className="bg-white/50 backdrop-blur-sm border-white/20"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button> */}
              </div>
            </div>
          </div>

          {/* GitHub Integration Setup section */}
          {/* <div className="mb-8">
            <GitHubTokenSetup />
          </div> */}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className={`text-xs ${stat.color} flex items-center mt-1`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Articles Management */}
          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Articles Management</CardTitle>
                  <CardDescription>Manage your published articles and drafts</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 bg-white/50 border-white/20 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentArticles.map((article) => (
                  <div
                    key={article.slug}
                    className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/60 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{article.title}</h3>
                        <Badge
                          variant={article.published ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors ${
                            article.published
                              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                          onClick={() => handleStatusToggle(article.slug, article.published)}
                        >
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.publishedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {(() => {
                            console.log("Admin dashboard - article slug:", article.slug)
                            const views = analytics.getArticleViews(article.slug)
                            console.log("Admin dashboard - views for slug:", views)
                            return views
                          })()} views
                        </span>
                        <div className="flex gap-1">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        onClick={() => router.push(`/publications/${article.slug}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                        onClick={() => router.push(`/admin/articles/edit/${article.slug}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DeleteArticleDialog
                        articleTitle={article.title}
                        onDelete={() => handleDeleteArticle(article.title)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {filteredArticles.length > articlesPerPage && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredArticles.length)} of{" "}
                    {filteredArticles.length} articles
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="bg-white/50 border-white/20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-white/50 border-white/20 hover:bg-white/70"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="bg-white/50 border-white/20"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {searchQuery ? "Try adjusting your search terms." : "Get started by creating your first article."}
                  </p>
                  <Button
                    onClick={() => router.push("/admin/articles/new")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Article
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
