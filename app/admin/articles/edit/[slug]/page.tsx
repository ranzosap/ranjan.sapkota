"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { ArticleEditor } from "@/components/article-editor"
import { getAllArticles } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

interface EditArticlePageProps {
  params: {
    slug: string
  }
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const allArticles = getAllArticles()
    const foundArticle = allArticles.find((a) => a.slug === params.slug)
    setArticle(foundArticle)
    setIsLoading(false)
  }, [params.slug])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
          <div className="container mx-auto px-4 py-8 max-w-[1600px]">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading article...</div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8 max-w-[1600px]">
          <ArticleEditor article={article} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
