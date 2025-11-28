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

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })
    const fullPath = path.join(uploadsDir, filename)
    await fs.writeFile(fullPath, buffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ success: true, url })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
