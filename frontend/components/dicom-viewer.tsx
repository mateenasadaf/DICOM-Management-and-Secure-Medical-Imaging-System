"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DicomPatient } from "@/lib/dicom-types"

interface DicomViewerProps {
  patient: DicomPatient
  onClose: () => void
}

declare global {
  interface Window {
    cornerstone: {
      enable: (element: HTMLElement) => void
      disable: (element: HTMLElement) => void
      displayImage: (element: HTMLElement, image: unknown) => void
      loadImage: (imageId: string) => Promise<unknown>
      getViewport: (element: HTMLElement) => { scale: number; rotation: number }
      setViewport: (element: HTMLElement, viewport: { scale?: number; rotation?: number }) => void
      reset: (element: HTMLElement) => void
      resize: (element: HTMLElement, fit?: boolean) => void
    }
    cornerstoneWADOImageLoader: {
      wadouri: {
        dataSetCacheManager: {
          purge: () => void
        }
      }
      external: {
        cornerstone: unknown
        dicomParser: unknown
      }
    }
    dicomParser: unknown
  }
}

export function DicomViewer({ patient, onClose }: DicomViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false)

  // Load Cornerstone.js libraries
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        // Check if already loaded
        if (window.cornerstone && window.cornerstoneWADOImageLoader) {
          setIsLibraryLoaded(true)
          return
        }

        // Load dicomParser
        await loadScript(
          "https://unpkg.com/dicom-parser@1.8.21/dist/dicomParser.min.js"
        )

        // Load cornerstone core
        await loadScript(
          "https://unpkg.com/cornerstone-core@2.6.1/dist/cornerstone.min.js"
        )

        // Load cornerstone WADO image loader
        await loadScript(
          "https://unpkg.com/cornerstone-wado-image-loader@4.13.2/dist/cornerstoneWADOImageLoader.bundle.min.js"
        )

        // Configure WADO image loader
        if (window.cornerstoneWADOImageLoader && window.cornerstone && window.dicomParser) {
          window.cornerstoneWADOImageLoader.external.cornerstone = window.cornerstone
          window.cornerstoneWADOImageLoader.external.dicomParser = window.dicomParser
        }

        setIsLibraryLoaded(true)
      } catch (err) {
        console.error("Failed to load Cornerstone libraries:", err)
        setError("Failed to load DICOM viewer libraries")
      }
    }

    loadLibraries()
  }, [])

  // Load and display DICOM image
  useEffect(() => {
    if (!isLibraryLoaded || !viewerRef.current) return

    const element = viewerRef.current
    let mounted = true
    const cornerstone = window.cornerstone

    const loadImage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Enable the viewer element first
        cornerstone.enable(element)

        // Load the DICOM image using the imageId format
        const imageId = `wadouri:http://localhost:8080/patients/view?file=${patient.filePath}`
        
        // Use cornerstone's loadImage function
        const image = await cornerstone.loadImage(imageId)

        if (mounted) {
          cornerstone.displayImage(element, image)
          cornerstone.resize(element, true)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load DICOM image:", err)
        if (mounted) {
          setError("Failed to load DICOM image. The file may be corrupted or unavailable.")
          setIsLoading(false)
        }
      }
    }

    loadImage()

    return () => {
      mounted = false
      try {
        cornerstone.disable(element)
      } catch {
        // Element may already be disabled
      }
    }
  }, [isLibraryLoaded, patient.filename])

  const handleZoomIn = useCallback(() => {
    if (!viewerRef.current || !window.cornerstone) return
    const viewport = window.cornerstone.getViewport(viewerRef.current)
    viewport.scale *= 1.2
    window.cornerstone.setViewport(viewerRef.current, viewport)
  }, [])

  const handleZoomOut = useCallback(() => {
    if (!viewerRef.current || !window.cornerstone) return
    const viewport = window.cornerstone.getViewport(viewerRef.current)
    viewport.scale /= 1.2
    window.cornerstone.setViewport(viewerRef.current, viewport)
  }, [])

  const handleRotate = useCallback(() => {
    if (!viewerRef.current || !window.cornerstone) return
    const viewport = window.cornerstone.getViewport(viewerRef.current)
    viewport.rotation += 90
    window.cornerstone.setViewport(viewerRef.current, viewport)
  }, [])

  const handleReset = useCallback(() => {
    if (!viewerRef.current || !window.cornerstone) return
    window.cornerstone.reset(viewerRef.current)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative mx-4 flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 bg-secondary/30 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{patient.patientName}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.modality} • {patient.studyDate} • ID: {patient.patientId}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-border/30 bg-secondary/20 px-6 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="gap-2"
            disabled={isLoading || !!error}
          >
            <ZoomIn className="h-4 w-4" />
            Zoom In
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="gap-2"
            disabled={isLoading || !!error}
          >
            <ZoomOut className="h-4 w-4" />
            Zoom Out
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="gap-2"
            disabled={isLoading || !!error}
          >
            <RotateCw className="h-4 w-4" />
            Rotate
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2"
            disabled={isLoading || !!error}
          >
            <Maximize2 className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Viewer */}
        <div className="relative flex-1 bg-black">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading DICOM image...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
              <div className="rounded-full bg-destructive/20 p-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <p className="mt-4 max-w-md text-center text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                onClick={onClose}
                className="mt-4"
              >
                Close Viewer
              </Button>
            </div>
          )}

          <div
            ref={viewerRef}
            className="h-full w-full"
            style={{ minHeight: "400px" }}
          />
        </div>

        {/* Patient Info Footer */}
        <div className="grid grid-cols-2 gap-4 border-t border-border/30 bg-secondary/20 px-6 py-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Patient ID</p>
            <p className="font-mono text-sm text-foreground">{patient.patientId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Age / Gender</p>
            <p className="text-sm text-foreground">{patient.age} / {patient.gender}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Modality</p>
            <p className="text-sm text-foreground">{patient.modality}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Study Date</p>
            <p className="text-sm text-foreground">{patient.studyDate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to load scripts
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}
