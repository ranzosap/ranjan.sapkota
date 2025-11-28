"use client"

import type { ReactNode } from "react"

interface MdxContentProps {
  children?: ReactNode
  content?: string
  code?: string
}

export function MdxContent({ children, content, code }: MdxContentProps) {
  const text = content || code

  const renderMarkdown = (src: string) => {
    let html = src
    // Escape basic HTML characters
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    html = html.replace(/!\[(.*?)\]\((\S+?)(?:\s+"(.*?)")?\)/g, (_m, alt: string, src: string, title: string | undefined) => {
      const isVideo = /\.(mp4|webm|ogg)$/i.test(src) || /video/i.test(alt)
      const isAudio = /\.(mp3|wav|ogg)$/i.test(src) || /audio/i.test(alt)
      let style = 'max-width:100%;height:auto;'
      if (title) {
        const widthMatch = title.match(/width\s*=\s*([0-9]+%|[0-9]+px)/i)
        const heightMatch = title.match(/height\s*=\s*([0-9]+%|[0-9]+px)/i)
        if (widthMatch) style += `width:${widthMatch[1]};`
        if (heightMatch) style += `height:${heightMatch[1]};`
      }
      if (isVideo) {
        return `<div style="position:relative;width:100%;max-width:100%;aspect-ratio:16/9;"><video src="${src}" controls preload="none" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;"></video></div>`
      }
      if (isAudio) {
        return `<audio src="${src}" controls style="width:100%"></audio>`
      }
      return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" style="${style}" />`
    })
    // Links [text](url) with previews
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_m, text: string, url: string) => {
      try {
        const u = new URL(url)
        const host = u.hostname.toLowerCase()
        const yt = host.includes('youtube.com') || host.includes('youtu.be')
        if (yt) {
          let id = ''
          if (host.includes('youtube.com')) {
            const v = u.searchParams.get('v')
            if (v) id = v
          } else if (host.includes('youtu.be')) {
            id = u.pathname.replace(/^\//, '')
          }
          if (id) {
            const src = `https://www.youtube.com/embed/${id}`
            return `<div style="position:relative;width:100%;max-width:100%;aspect-ratio:16/9;"><iframe src="${src}" loading="lazy" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>`
          }
        }
        const domain = host.replace(/^www\./, '')
        return `<div style="border:1px solid rgba(0,0,0,0.1);padding:12px;border-radius:8px;background:rgba(255,255,255,0.6);"><a href="${url}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;color:inherit;"><div style="font-weight:600;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${text || url}</div><div style="font-size:12px;color:#666;">${domain}</div></a></div>`
      } catch {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
      }
    })
    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic *text*
    html = html.replace(/(^|\s)\*(.*?)\*(?=\s|$)/g, '$1<em>$2</em>')
    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings #, ##, ###
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    // Unordered list items - item
    // Convert groups of dash lines into <ul><li>...</li></ul>
    html = html.replace(/(^|\n)(-\s+.*(?:\n-\s+.*)*)/g, (_m, p1, list) => {
      const items = list
        .split(/\n/)
        .map((l) => l.replace(/^-\s+/, ''))
        .map((li) => `<li>${li}</li>`) 
        .join('')
      return `${p1}<ul>${items}</ul>`
    })
    // Paragraphs: convert double newlines to paragraph breaks and single newline to <br>
    html = html
      .split(/\n\n+/)
      .map((para) => `<p>${para.replace(/\n/g, '<br />')}</p>`) 
      .join('')
    return html
  }

  if (text) {
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
      </div>
    )
  }

  return <div className="prose prose-gray dark:prose-invert max-w-none">{children}</div>
}
