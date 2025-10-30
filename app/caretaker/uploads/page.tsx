"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, File, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import { uploadService, type Upload as UploadType } from "@/lib/upload-service"
import { useSearchParams } from "next/navigation"

export default function UploadsPage() {
  const [uploads, setUploads] = useState<UploadType[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadType, setUploadType] = useState<"video" | "audio">("video")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const searchParams = useSearchParams()
  const childId = searchParams?.get("childId") || ""

  if (!childId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-8">No child selected. Please open this page with a ?childId= parameter.</Card>
      </div>
    )
  }

  // load existing uploads
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const items = await uploadService.getUploads(childId)
        if (mounted) setUploads(items)
      } catch (err) {
        console.error("Get uploads error:", err)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [childId])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError("")

    try {
      const uploaded = await uploadService.uploadMedia(childId, selectedFile, uploadType)
      if (uploaded) {
        setUploads([uploaded, ...uploads])
        setSelectedFile(null)
      } else {
        setError("Upload failed")
      }
    } catch (err) {
      setError("Upload failed. Please try again.")
      console.error("[v0] Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const ok = await uploadService.deleteUpload(id)
      if (ok) setUploads(uploads.filter((u) => u.id !== id))
      else setError("Failed to delete upload")
    } catch (err) {
      setError("Failed to delete upload")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Media Upload</h1>
        <p className="text-slate-600">Upload videos and audio samples for assessment</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Upload Area */}
      <Card className="p-8 mb-8">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-slate-300"
          }`}
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Drag and drop your file here</h3>
          <p className="text-slate-600 mb-4">or</p>
          <label className="inline-block">
            <Button variant="outline" className="bg-transparent">
              Browse Files
            </Button>
            <input type="file" onChange={handleFileSelect} accept="video/*,audio/*" className="hidden" />
          </label>
          <p className="text-sm text-slate-600 mt-4">Supported formats: MP4, MOV, WAV, MP3 (Max 100MB)</p>
        </div>

        {selectedFile && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-slate-900">{selectedFile.name}</p>
                <p className="text-sm text-slate-600">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button onClick={() => setSelectedFile(null)} className="text-slate-600 hover:text-slate-900">
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-900 mb-2">Media Type</label>
              <div className="flex gap-4">
                {["video", "audio"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={uploadType === type}
                      onChange={(e) => setUploadType(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize text-slate-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={handleUpload} className="w-full" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        )}
      </Card>

      {/* Guidelines */}
      <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-slate-900 mb-3">Upload Guidelines</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Videos should be 30 seconds to 2 minutes long</li>
          <li>• Audio samples should be 15-30 seconds</li>
          <li>• Ensure good lighting and clear audio</li>
          <li>• Include natural behaviors and interactions</li>
          <li>• All files are securely encrypted and HIPAA compliant</li>
        </ul>
      </Card>

      {/* Uploads List */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Uploads</h2>
        <div className="space-y-3">
          {uploads.map((upload) => (
            <Card key={upload.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {upload.type === "video" ? (
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{upload.name}</p>
                    <p className="text-sm text-slate-600">
                      {upload.url} • {upload.created_at}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(upload.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
