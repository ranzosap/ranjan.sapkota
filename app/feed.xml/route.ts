import { generateRSSFeed } from "@/lib/rss"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://github.com/ranzosap/ranjan.sapkota"

export async function GET() {
  const rssContent = generateRSSFeed(baseUrl)

  return new Response(rssContent, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
