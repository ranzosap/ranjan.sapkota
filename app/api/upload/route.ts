import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ success: false, error: "No file" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = path.extname(file.name) || ""
    const base = path.basename(file.name, ext)
    const id = crypto.randomUUID()
    const safeName = `${base}`.replace(/[^a-zA-Z0-9_-]/g, "-")
    const filename = `${id}-${safeName}${ext}`

    const token = process.env.GITHUB_TOKEN
    if (token) {
      const owner = "ranzosap"
      const repo = "ranjan.sapkota"
      const branch = "main"
      const pathInRepo = `uploads/${filename}`
      const contentBase64 = Buffer.from(buffer).toString("base64")
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}`

      const putRes = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: `Upload media ${filename}`,
          content: contentBase64,
          branch,
        }),
      })

      if (!putRes.ok) {
        const err = await putRes.text()
        return NextResponse.json({ success: false, error: err }, { status: putRes.status })
      }

      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${pathInRepo}`
      return NextResponse.json({ success: true, url: rawUrl })
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })
    const fullPath = path.join(uploadsDir, filename)
    await fs.writeFile(fullPath, buffer)

    const localUrl = `/uploads/${filename}`
    return NextResponse.json({ success: true, url: localUrl })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
