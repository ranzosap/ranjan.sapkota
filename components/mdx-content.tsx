"use client"

import type { ReactNode } from "react"

interface MdxContentProps {
  children?: ReactNode
  content?: string
}

export function MdxContent({ children, content }: MdxContentProps) {
  if (content) {
    // Simple content renderer for preview environment
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
      </div>
    )
  }

  return <div className="prose prose-gray dark:prose-invert max-w-none">{children}</div>
}
