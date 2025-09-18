"use client"

import { useMemo, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { Article } from "@/lib/mock-data"
import { ArticleCard } from "@/components/article-card"
import { SearchBox } from "@/components/search-box"
import { PublicationFilters } from "@/components/publication-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PublicationsClientProps {
  articles: Article[]
  allTags: string[]
  allYears: number[]
}

export function PublicationsClient({ articles, allTags, allYears }: PublicationsClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 5

  // ✅ Filters come from URL
  const searchQuery = searchParams.get("search") || ""
  const selectedTags = searchParams.get("tags")?.split(",").filter(Boolean) || []
  const selectedYears = searchParams.get("years")?.split(",").map(Number).filter(Boolean) || []

  const updateURL = (search: string, tags: string[], years: number[]) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (tags.length > 0) params.set("tags", tags.join(","))
    if (years.length > 0) params.set("years", years.join(","))

    const queryString = params.toString()
    const newURL = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(newURL, { scroll: false })
  }

  const handleSearchChange = (query: string) => {
    updateURL(query, selectedTags, selectedYears)
    setCurrentPage(1) // ✅ reset page when search changes
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    updateURL(searchQuery, newTags, selectedYears)
    setCurrentPage(1) // ✅ reset page when tags change
  }

  const handleYearToggle = (year: number) => {
    const newYears = selectedYears.includes(year) ? selectedYears.filter((y) => y !== year) : [...selectedYears, year]
    updateURL(searchQuery, selectedTags, newYears)
    setCurrentPage(1) // ✅ reset page when years change
  }

  const clearFilters = () => {
    router.replace(pathname, { scroll: false })
    setCurrentPage(1)
  }

  // ✅ Filter + sort articles
  const filteredArticles = useMemo(() => {
    const filtered = articles.filter((article) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = article.title.toLowerCase().includes(query)
        const matchesAbstract = article.abstract?.toLowerCase().includes(query)
        const matchesAuthors = article.authors.some((author) => author.toLowerCase().includes(query))
        const matchesVenue = article.publication_venue.toLowerCase().includes(query)
        const matchesTags = article.tags.some((tag) => tag.toLowerCase().includes(query))

        if (!matchesTitle && !matchesAbstract && !matchesAuthors && !matchesVenue && !matchesTags) {
          return false
        }
      }

      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) => article.tags.includes(tag))
        if (!hasSelectedTag) return false
      }

      if (selectedYears.length > 0) {
        if (!selectedYears.includes(article.year)) return false
      }

      return true
    })

    return filtered.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      const aMonth = a.month || 12
      const bMonth = b.month || 12
      return bMonth - aMonth
    })
  }, [articles, searchQuery, selectedTags, selectedYears])

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedYears.length > 0

  return (
    <div className="space-y-8">
      {/* Search & Filters... unchanged */}

      {/* Results */}
      {filteredArticles.length === 0 ? (
        <div>No publications found.</div>
      ) : (
        <>
          {paginatedArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}

              <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
