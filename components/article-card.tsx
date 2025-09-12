import Link from "next/link"
import Image from "next/image"
import type { Article } from "@/lib/content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, ExternalLink, FileText, Star } from "lucide-react"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const publishedDate = article.month ? `${monthNames[article.month - 1]} ${article.year}` : `${article.year}`

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                <Link href={article.url}>{article.title}</Link>
              </CardTitle>
              {article.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            </div>

            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {article.authors.join(", ")}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {publishedDate}
              </span>
            </CardDescription>

            <p className="text-sm font-medium text-muted-foreground">{article.publication_venue}</p>
          </div>

          {article.thumbnail && (
            <div className="flex-shrink-0">
              <Image
                src={article.thumbnail || "/placeholder.svg"}
                alt={`Thumbnail for ${article.title}`}
                width={120}
                height={80}
                className="rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {article.abstract && <p className="text-sm text-muted-foreground line-clamp-3">{article.abstract}</p>}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={article.url}>
              <FileText className="h-4 w-4 mr-2" />
              Read More
            </Link>
          </Button>

          {article.pdf_url && (
            <Button variant="outline" size="sm" asChild>
              <Link href={article.pdf_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                PDF
              </Link>
            </Button>
          )}

          {article.code_url && (
            <Button variant="outline" size="sm" asChild>
              <Link href={article.code_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Code
              </Link>
            </Button>
          )}

          {article.doi && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                DOI
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
