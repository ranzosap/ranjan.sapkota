"use client"

import { Suspense, useEffect, useState } from "react"
import {
  getPublishedArticlesWithSync,
  getAllTags,
  getAllYears,
  getPublishedArticles,
  type Article,
} from "@/lib/mock-data"
import { PublicationsClient } from "@/components/publications-client"
import { Skeleton } from "@/components/ui/skeleton"

function PublicationsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PublicationsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [allYears, setAllYears] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const publishedArticles = await getPublishedArticlesWithSync()
        const tags = getAllTags()
        const years = getAllYears()

        setArticles(publishedArticles)
        setAllTags(tags)
        setAllYears(years)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading articles:", error)
        // Fallback to regular function if sync fails
        const publishedArticles = getPublishedArticles()
        const tags = getAllTags()
        const years = getAllYears()

        setArticles(publishedArticles)
        setAllTags(tags)
        setAllYears(years)
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <div className="inline-block">
                <h1 className="text-5xl md:text-6xl font-black font-heading bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-fade-in">
                  Publications
                </h1>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 animate-slide-in"></div>
              </div>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-delay">
                Loading publications...
              </p>
            </div>
            <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-6 md:p-8">
              <PublicationsSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-8">
          {/* Enhanced header */}
          <div className="text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-5xl md:text-6xl font-black font-heading bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-fade-in">
                Publications
              </h1>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 animate-slide-in"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-delay">
              Explore my research contributions and academic publications.
              <span className="font-semibold text-blue-600 dark:text-blue-400"> {articles.length} publications</span>{" "}
              available.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-6 md:p-8">
            <Suspense fallback={<PublicationsSkeleton />}>
              <PublicationsClient articles={articles} allTags={allTags} allYears={allYears} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
