"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { ArticleEditor } from "@/components/article-editor"

export default function NewArticlePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8 max-w-[1600px]">
          <ArticleEditor />
        </div>
      </div>
    </ProtectedRoute>
  )
}
