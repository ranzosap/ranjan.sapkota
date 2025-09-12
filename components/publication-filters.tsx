"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Filter } from "lucide-react"
import { useState } from "react"

interface PublicationFiltersProps {
  allTags: string[]
  allYears: number[]
  selectedTags: string[]
  selectedYears: number[]
  onTagToggle: (tag: string) => void
  onYearToggle: (year: number) => void
}

export function PublicationFilters({
  allTags,
  allYears,
  selectedTags,
  selectedYears,
  onTagToggle,
  onYearToggle,
}: PublicationFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-transparent">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {(selectedTags.length > 0 || selectedYears.length > 0) && (
              <Badge variant="secondary" className="ml-2">
                {selectedTags.length + selectedYears.length}
              </Badge>
            )}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-6 pt-6">
        {/* Tags Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Years Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Years</h3>
          <div className="flex flex-wrap gap-2">
            {allYears.map((year) => (
              <Button
                key={year}
                variant={selectedYears.includes(year) ? "default" : "outline"}
                size="sm"
                onClick={() => onYearToggle(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
