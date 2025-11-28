"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ImageIcon, Video, File, Check } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadProgress: number
  status: "uploading" | "completed" | "error"
}

interface FileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void
  acceptedTypes?: string[]
  maxSize?: number
  multiple?: boolean
}

export function FileUpload({
  onFilesUploaded,
  acceptedTypes = ["image/*", "video/*"],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const f of acceptedFiles) {
        const tempId = Math.random().toString(36).substr(2, 9)
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: tempId,
            name: f.name,
            size: f.size,
            type: f.type,
            url: "",
            uploadProgress: 0,
            status: "uploading",
          },
        ])

        const formData = new FormData()
        formData.append("file", f)

        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData })
          const json = await res.json()
          const finalUrl = res.ok && json.url ? json.url : ""

          setUploadedFiles((prev) =>
            prev.map((file) =>
              file.id === tempId
                ? {
                    ...file,
                    url: finalUrl || file.url,
                    uploadProgress: 100,
                    status: finalUrl ? "completed" : "error",
                  }
                : file,
            ),
          )

          if (onFilesUploaded && finalUrl) {
            onFilesUploaded([
              {
                id: tempId,
                name: f.name,
                size: f.size,
                type: f.type,
                url: finalUrl,
                uploadProgress: 100,
                status: "completed",
              },
            ])
          }
        } catch (e) {
          setUploadedFiles((prev) =>
            prev.map((file) => (file.id === tempId ? { ...file, status: "error" } : file)),
          )
        }
      }
    },
    [onFilesUploaded],
  )

  const simulateUpload = (_fileId: string) => {}

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    return File
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isDragActive ? "Drop files here" : "Upload files"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Drag and drop files here, or click to select files</p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Supported formats: Images, Videos</p>
              <p>Maximum file size: {formatFileSize(maxSize)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-3">
              {uploadedFiles.map((file) => {
                const FileIcon = getFileIcon(file.type)
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/20"
                  >
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <FileIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>

                      {/* Progress Bar */}
                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={file.uploadProgress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{Math.round(file.uploadProgress)}% uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                      {file.status === "completed" && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-xs">Complete</span>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(file.id)}
                        className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
