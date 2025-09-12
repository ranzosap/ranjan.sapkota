"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { Article } from "@/lib/mock-data"
import { ArticleCard } from "@/components/article-card"
import { SearchBox } from "@/components/search-box"
import { PublicationFilters } from "@/components/publication-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PublicationsClientProps {
  articles: Article[]
  allTags: string[]
  allYears: number[]
}

export function PublicationsClient({ articles, allTags, allYears }: PublicationsClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get initial values from URL
  const initialSearch = searchParams.get("search") || ""
  const initialTags = searchParams.get("tags")?.split(",").filter(Boolean) || []
  const initialYears = searchParams.get("years")?.split(",").map(Number).filter(Boolean) || []

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [selectedYears, setSelectedYears] = useState<number[]>(initialYears)

  // Update URL when filters change
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
    setSearchQuery(query)
    updateURL(query, selectedTags, selectedYears)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    updateURL(searchQuery, newTags, selectedYears)
  }

  const handleYearToggle = (year: number) => {
    const newYears = selectedYears.includes(year) ? selectedYears.filter((y) => y !== year) : [...selectedYears, year]
    setSelectedYears(newYears)
    updateURL(searchQuery, selectedTags, newYears)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSelectedYears([])
    router.replace(pathname, { scroll: false })
  }

  // Filter and sort articles based on search and filters
  const filteredArticles = useMemo(() => {
    const filtered = articles.filter((article) => {
      // Search filter
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

      // Tag filter
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) => article.tags.includes(tag))
        if (!hasSelectedTag) return false
      }

      // Year filter
      if (selectedYears.length > 0) {
        if (!selectedYears.includes(article.year)) return false
      }

      return true
    })

    return filtered.sort((a, b) => {
      // Sort by year first (descending)
      if (a.year !== b.year) {
        return b.year - a.year
      }
      // Then by month if available (descending)
      const aMonth = a.month || 12
      const bMonth = b.month || 12
      return bMonth - aMonth
    })
  }, [articles, searchQuery, selectedTags, selectedYears])

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedYears.length > 0

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="space-y-6">
        <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 rounded-2xl border border-white/20 dark:border-gray-700/30 p-4">
          <SearchBox value={searchQuery} onChange={handleSearchChange} placeholder="Search publications..." />
        </div>

        <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 rounded-2xl border border-white/20 dark:border-gray-700/30 p-4">
          <PublicationFilters
            allTags={allTags}
            allYears={allYears}
            selectedTags={selectedTags}
            selectedYears={selectedYears}
            onTagToggle={handleTagToggle}
            onYearToggle={handleYearToggle}
          />
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 p-4 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 rounded-2xl border border-white/20 dark:border-gray-700/30">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Search: {searchQuery}
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              >
                Tag: {tag}
              </Badge>
            ))}
            {selectedYears.map((year) => (
              <Badge
                key={year}
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              >
                Year: {year}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="hover:bg-white/20">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Showing <span className="font-bold text-blue-600 dark:text-blue-400">{filteredArticles.length}</span> of{" "}
            <span className="font-bold">{articles.length}</span> publications
          </p>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 rounded-2xl border border-white/20 dark:border-gray-700/30">
            <div className="space-y-4">
              <div className="text-6xl">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No publications found</h3>
              <p className="text-gray-600 dark:text-gray-400">No publications match your current search criteria.</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4 bg-white/50 backdrop-blur-sm border-white/20"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredArticles.map((article, index) => (
              <div key={article.slug} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
