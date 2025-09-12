import { getAllArticles } from "@/lib/mock-data"
import ArticlePageClient from "./ArticlePageClient"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const allArticles = getAllArticles()
  return allArticles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const allArticles = getAllArticles()
  const article = allArticles.find((article) => article.slug === params.slug)

  if (!article) {
    return {
      title: "Portfolio",
    }
  }

  const publishedDate = article.month
    ? `${article.year}-${String(article.month).padStart(2, "0")}-01`
    : `${article.year}-01-01`

  return {
    title: article.title,
    description: article.abstract || `Research article: ${article.title}`,
    keywords: article.tags,
    authors: article.authors.map((author) => ({ name: author })),
    openGraph: {
      title: article.title,
      description: article.abstract,
      type: "article",
      publishedTime: publishedDate,
      authors: article.authors,
      tags: article.tags,
      images: article.thumbnail ? [{ url: article.thumbnail, alt: article.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.abstract,
      images: article.thumbnail ? [article.thumbnail] : undefined,
    },
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return <ArticlePageClient params={params} />
}
