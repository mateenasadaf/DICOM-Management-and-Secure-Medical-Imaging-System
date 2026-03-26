"use client"

import { useCallback, useState } from "react"
import { Upload, FileImage, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UploadStatus } from "@/lib/dicom-types"

interface FileUploadProps {
  onUploadComplete: () => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [status, setStatus] = useState<UploadStatus>({ type: 'idle', message: '' })
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.dcm')) {
      setSelectedFile(file)
      setStatus({ type: 'idle', message: '' })
    } else {
      setStatus({ type: 'error', message: 'Please select a valid .dcm file' })
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.dcm')) {
      setSelectedFile(file)
      setStatus({ type: 'idle', message: '' })
    } else if (file) {
      setStatus({ type: 'error', message: 'Please select a valid .dcm file' })
    }
  }, [])

  const handleUpload = async () => {
    if (!selectedFile) return

    setStatus({ type: 'uploading', message: 'Uploading DICOM file...' })

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/dicom/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      setStatus({ type: 'success', message: 'File uploaded successfully!' })
      setSelectedFile(null)
      onUploadComplete()
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus({ type: 'idle', message: '' })
      }, 3000)
    } catch {
      setStatus({ type: 'error', message: 'Failed to upload file. Please try again.' })
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-xl">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Upload className="h-4 w-4 text-primary" />
          </div>
          Upload DICOM File
        </h2>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
              : 'border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50'
          }`}
        >
          <input
            type="file"
            accept=".dcm"
            onChange={handleFileSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          
          <div className={`mb-3 rounded-full p-3 transition-all duration-300 ${
            isDragging ? 'bg-primary/20' : 'bg-secondary'
          }`}>
            <FileImage className={`h-8 w-8 transition-colors ${
              isDragging ? 'text-primary' : 'text-muted-foreground'
            }`} />
          </div>
          
          <p className="text-sm font-medium text-foreground">
            {selectedFile ? selectedFile.name : 'Drop your DICOM file here'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse (.dcm files only)
          </p>
        </div>

        {/* Upload button */}
        <div className="mt-4 flex items-center gap-4">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || status.type === 'uploading'}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
          >
            {status.type === 'uploading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>

          {/* Status message */}
          {status.message && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              status.type === 'success' 
                ? 'bg-green-500/10 text-green-500' 
                : status.type === 'error'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-primary/10 text-primary'
            }`}>
              {status.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {status.type === 'error' && <AlertCircle className="h-4 w-4" />}
              {status.type === 'uploading' && <Loader2 className="h-4 w-4 animate-spin" />}
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
