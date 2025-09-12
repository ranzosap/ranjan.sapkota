import { getPublishedArticles } from "./content"

export interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: string
  guid: string
  author: string
  categories: string[]
}

export function generateRSSFeed(baseUrl: string): string {
  const articles = getPublishedArticles()
  const buildDate = new Date().toUTCString()

  const rssItems = articles.map((article): RSSItem => {
    const pubDate = article.month
      ? new Date(article.year, article.month - 1, 1).toUTCString()
      : new Date(article.year, 0, 1).toUTCString()

    return {
      title: article.title,
      description: article.abstract || `Research article: ${article.title}`,
      link: `${baseUrl}${article.url}`,
      pubDate,
      guid: `${baseUrl}${article.url}`,
      author: article.authors.join(", "),
      categories: article.tags,
    }
  })

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dr. Academic Portfolio - Publications</title>
    <description>Latest research publications and academic work</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    
    ${rssItems
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <author><![CDATA[${item.author}]]></author>
      ${item.categories.map((category) => `<category><![CDATA[${category}]]></category>`).join("")}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`

  return rssContent
}
