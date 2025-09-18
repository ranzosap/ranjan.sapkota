"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getAllArticles, getRelatedArticles } from "@/lib/mock-data"
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"
import { MdxContent } from "@/components/mdx-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BibtexModal } from "@/components/bibtex-modal"
import { useAuth } from "@/lib/auth-context"
import { Calendar, Users, ExternalLink, FileText, Code, Database, ArrowLeft, Edit, Trash2, Github } from "lucide-react"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://github.com/ranzosap/ranjan.sapkota"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default function ArticlePageClient({ params }: ArticlePageProps) {
  const { isAuthenticated, isLoading } = useAuth()

  console.log("Looking for article with slug:", params.slug)

  if (typeof window !== "undefined") {
    const storedArticles = localStorage.getItem("userArticles")
    if (storedArticles) {
      try {
        const articles = JSON.parse(storedArticles)
        console.log(
          "Found stored articles:",
          articles.map((a: any) => ({ slug: a.slug, published: a.published })),
        )
        const updatedArticles = articles.map((article: any) => ({
          ...article,
          authors: article.authors.map((author: string) =>
            author === "Dr. Academic Researcher" ? "Ranjan Sapkota" : author,
          ),
        }))
        localStorage.setItem("userArticles", JSON.stringify(updatedArticles))
      } catch (error) {
        console.error("Error updating stored articles:", error)
      }
    }
  }

  const allArticles = getAllArticles()
  console.log(
    "All articles:",
    allArticles.map((a) => ({ slug: a.slug, published: a.published })),
  )

  const article = allArticles.find((article) => article.slug === params.slug)
  console.log("Found article:", article ? { slug: article.slug, published: article.published } : "not found")

  if (!article) {
    console.log("Article not found, calling notFound()")
    notFound()
  }

  const isMockArticle =
    article.slug.includes("towards-reducing-chemical") ||
    article.slug.includes("immature-green-apple") ||
    article.slug.includes("comparing-yolov8") ||
    article.slug.includes("synthetic-meets-authentic") ||
    article.slug.includes("vision-based-robotic")

  if (isMockArticle && !article.published) {
    console.log("Mock article not published, calling notFound()")
    notFound()
  }

  const relatedArticles = getRelatedArticles(article)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const publishedDate = article.month ? `${monthNames[article.month - 1]} ${article.year}` : `${article.year}`

  const repoOwner = "ranzosap"
  const repoName = "ranjan.sapkota"
  const githubEditUrl = `https://github.com/${repoOwner}/${repoName}/edit/main/content/articles/${article.slug}.mdx`
  const githubDeleteUrl = `https://github.com/${repoOwner}/${repoName}/compare/main...main?quick_pull=1&title=Delete%20article%3A%20${encodeURIComponent(article.title)}&body=Delete%20article%20file%3A%20content/articles/${article.slug}.mdx`

  // Generate structured data
  const articleSchema = generateArticleSchema(article, baseUrl)
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Publications", url: "/publications" },
      { name: article.title, url: article.url },
    ],
    baseUrl,
  )

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema} />

      <div className="container py-6 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/publications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Publications
            </Link>
          </Button>

          {/* Article header */}
          <div className="space-y-4 md:space-y-6">
            {article.thumbnail && (
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={article.thumbnail || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-2xl md:text-4xl font-bold leading-tight">{article.title}</h1>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">{article.authors.join(", ")}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  {publishedDate}
                </span>
                <span>{article.readingTime} min read</span>
              </div>

              <p className="text-base md:text-lg font-medium text-muted-foreground">{article.publication_venue}</p>

              {article.abstract && (
                <div className="bg-muted/50 rounded-lg p-4 md:p-6">
                  <h2 className="text-lg font-semibold mb-3">Abstract</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{article.abstract}</p>
                </div>
              )}

              {/* Tags and Status */}
              {(article.tags.length > 0 || !article.published) && (
                <div className="flex flex-wrap gap-2 items-center">
                  {!article.published && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    >
                      Draft
                    </Badge>
                  )}
                  {article.published && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Published
                    </Badge>
                  )}
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs md:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {article.pdf_url && (
                  <Button asChild size="sm" className="text-xs md:text-sm">
                    <Link href={article.pdf_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </Link>
                  </Button>
                )}

                {article.code_url && (
                  <Button variant="outline" asChild size="sm" className="text-xs md:text-sm bg-transparent">
                    <Link href={article.code_url} target="_blank" rel="noopener noreferrer">
                      <Code className="h-4 w-4 mr-2" />
                      Code
                    </Link>
                  </Button>
                )}

                {article.dataset_url && (
                  <Button variant="outline" asChild size="sm" className="text-xs md:text-sm bg-transparent">
                    <Link href={article.dataset_url} target="_blank" rel="noopener noreferrer">
                      <Database className="h-4 w-4 mr-2" />
                      Dataset
                    </Link>
                  </Button>
                )}

                {article.doi && (
                  <Button variant="outline" asChild size="sm" className="text-xs md:text-sm bg-transparent">
                    <Link href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      DOI
                    </Link>
                  </Button>
                )}

                {/* {article.github_link && (
                  <Button variant="outline" asChild size="sm" className="text-xs md:text-sm bg-transparent">
                    <Link href={article.github_link} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                )} */}

                <BibtexModal article={article} />

                {/* {!isLoading && isAuthenticated && (
                  <>
                    <Button variant="outline" size="sm" asChild className="text-xs md:text-sm bg-transparent">
                      <Link href={githubEditUrl} target="_blank" rel="noopener noreferrer">
                        <Edit className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Edit on GitHub</span>
                        <span className="sm:hidden">Edit</span>
                      </Link>
                    </Button>

                    <Button variant="outline" size="sm" asChild className="text-xs md:text-sm bg-transparent">
                      <Link href={githubDeleteUrl} target="_blank" rel="noopener noreferrer">
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Delete on GitHub</span>
                        <span className="sm:hidden">Delete</span>
                      </Link>
                    </Button>
                  </>
                )} */}
              </div>
            </div>
          </div>

          <Separator />

          {/* Article content */}
          <div className="prose prose-gray dark:prose-invert max-w-none prose-sm md:prose-base">
            {article.body?.code ? (
              <MdxContent code={article.body.code} />
            ) : (
              <div className="whitespace-pre-wrap">{article.content || "No content available."}</div>
            )}
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-bold">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Card key={relatedArticle.slug}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base md:text-lg">
                          <Link href={relatedArticle.url} className="hover:text-primary transition-colors">
                            {relatedArticle.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                          {relatedArticle.publication_venue} • {relatedArticle.year}
                        </CardDescription>
                      </CardHeader>
                      {relatedArticle.abstract && (
                        <CardContent className="pt-0">
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-3">
                            {relatedArticle.abstract}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
