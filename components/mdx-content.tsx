"use client"

import type { ReactNode } from "react"

interface MdxContentProps {
  children?: ReactNode
  content?: string
  code?: string
}

export function MdxContent({ children, content, code }: MdxContentProps) {
  const text = content || code

  if (text) {
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br />") }} />
      </div>
    )
  }

  return <div className="prose prose-gray dark:prose-invert max-w-none">{children}</div>
}
