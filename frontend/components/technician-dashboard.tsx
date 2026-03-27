"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Upload, FileImage, CheckCircle2, AlertCircle, Loader2, Wrench, User, Calendar, Hash, Activity, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DicomPatient, DicomStudyForm, UploadStatus } from "@/lib/dicom-types"

interface TechnicianDashboardProps {
  onViewPatient: (patient: DicomPatient) => void
  onUploadComplete: () => void
}

const MODALITIES = ["CT", "MR", "CR", "US", "MG", "PT", "XA", "DX", "NM", "RF"]
const GENDERS = ["M", "F", "O"]

const isDicomFile = (file: File): boolean => {
  const name = file.name.toLowerCase()
  return (
    name.endsWith('.dcm') ||
    name.endsWith('.dicom') ||
    name.endsWith('.ima') ||
    name.endsWith('.img') ||
    file.type === 'application/dicom' ||
    file.type === 'application/octet-stream' ||
    !name.includes('.')
  )
}

export function TechnicianDashboard({ onViewPatient, onUploadComplete }: TechnicianDashboardProps) {
  const [formData, setFormData] = useState<DicomStudyForm>({
    patientName: "",
    patientId: "",
    patientAge: "",
    patientGender: "M",
    studyDate: new Date().toISOString().split('T')[0],
    modality: "CT",
    referringDoctor: "",
    studyDescription: "",
    accessionNumber: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>({ type: 'idle', message: '' })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 🔥 Real data from backend — replaces dummy/prop patients
  const [patients, setPatients] = useState<DicomPatient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPatients = () => {
    setIsLoading(true)
    fetch("http://localhost:8080/patients")
      .then(res => res.json())
      .then(data => {
        setPatients(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }

  // 🔥 Fetch on mount
  useEffect(() => {
    fetchPatients()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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
    if (file && isDicomFile(file)) {
      setSelectedFile(file)
      setStatus({ type: 'idle', message: '' })
    } else if (file) {
      setStatus({ type: 'error', message: 'Please select a valid DICOM file (.dcm, .dicom, .ima, or no extension)' })
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (file && isDicomFile(file)) {
      setSelectedFile(file)
      setStatus({ type: 'idle', message: '' })
    } else if (file) {
      setStatus({ type: 'error', message: 'Please select a valid DICOM file (.dcm, .dicom, .ima, or no extension)' })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Please select a DICOM file' })
      return
    }

    if (!formData.patientName || !formData.patientId) {
      setStatus({ type: 'error', message: 'Patient name and ID are required' })
      return
    }

    setStatus({ type: 'uploading', message: 'Uploading DICOM study...' })

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', selectedFile)
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      const response = await fetch('http://localhost:8080/patients/upload', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      setStatus({ type: 'success', message: 'Study uploaded successfully!' })
      setSelectedFile(null)
      setFormData({
        patientName: "",
        patientId: "",
        patientAge: "",
        patientGender: "M",
        studyDate: new Date().toISOString().split('T')[0],
        modality: "CT",
        referringDoctor: "",
        studyDescription: "",
        accessionNumber: "",
      })

      // 🔥 Refresh the table immediately after upload
      fetchPatients()
      onUploadComplete()

      setTimeout(() => {
        setStatus({ type: 'idle', message: '' })
      }, 3000)
    } catch {
      setStatus({ type: 'error', message: 'Failed to upload study. Please try again.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
          <Wrench className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Technician Dashboard</h2>
          <p className="text-sm text-muted-foreground">Upload and manage DICOM studies</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Form */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Upload className="h-5 w-5 text-primary" />
              New Study Upload
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Patient Info Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Patient Name</label>
                  <Input
                    name="patientName"
                    placeholder="John Smith"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="border-border/50 bg-secondary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Patient ID</label>
                  <Input
                    name="patientId"
                    placeholder="001"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="border-border/50 bg-secondary/50"
                    required
                  />
                </div>
              </div>

              {/* Age, Gender, Modality Row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Age</label>
                  <Input
                    name="patientAge"
                    type="number"
                    placeholder="45"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                    className="border-border/50 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Gender</label>
                  <select
                    name="patientGender"
                    value={formData.patientGender}
                    onChange={handleInputChange}
                    className="h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Modality</label>
                  <select
                    name="modality"
                    value={formData.modality}
                    onChange={handleInputChange}
                    className="h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    {MODALITIES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Study Date & Referring Doctor */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Study Date</label>
                  <Input
                    name="studyDate"
                    type="date"
                    value={formData.studyDate}
                    onChange={handleInputChange}
                    className="border-border/50 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Referring Doctor</label>
                  <Input
                    name="referringDoctor"
                    placeholder="Dr. Jane Wilson"
                    value={formData.referringDoctor}
                    onChange={handleInputChange}
                    className="border-border/50 bg-secondary/50"
                  />
                </div>
              </div>

              {/* Accession Number & Study Description */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Accession Number</label>
                  <Input
                    name="accessionNumber"
                    placeholder="ACC001"
                    value={formData.accessionNumber}
                    onChange={handleInputChange}
                    className="border-border/50 bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Study Description</label>
                  <Input
                    name="studyDescription"
                    placeholder="Chest CT Scan"
                    value={formData.studyDescription}
                    onChange={handleInputChange}
                    className="border-border/50 bg-secondary/50"
                  />
                </div>
              </div>

              {/* File Upload Zone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">DICOM File</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : selectedFile
                      ? 'border-green-500/50 bg-green-500/5'
                      : 'border-border/50 bg-secondary/30 hover:border-primary/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".dcm,.DCM,.dicom,.DICOM,.ima,.IMA,.img,.IMG,application/dicom,application/octet-stream"
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <FileImage
                    className={`mb-2 h-6 w-6 ${
                      isDragging
                        ? 'text-primary'
                        : selectedFile
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <p className="text-sm text-foreground">
                    {selectedFile ? selectedFile.name : 'Drop DICOM file here or click to browse'}
                  </p>
                  {selectedFile && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                  {!selectedFile && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supports .dcm, .dicom, .ima, .img
                    </p>
                  )}
                </div>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                      setStatus({ type: 'idle', message: '' })
                    }}
                    className="text-xs text-muted-foreground underline hover:text-destructive"
                  >
                    Remove file
                  </button>
                )}
              </div>

              {/* Status Message */}
              {status.message && (
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  status.type === 'success'
                    ? 'bg-green-500/10 text-green-500'
                    : status.type === 'error'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {status.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  {status.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
                  {status.type === 'uploading' && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                  {status.message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={status.type === 'uploading'}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25"
              >
                {status.type === 'uploading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Study
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Uploaded Records Table */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Uploaded Records</h3>
                <p className="text-sm text-muted-foreground">{patients.length} studies</p>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto rounded-xl border border-border/30">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border/30 bg-secondary/80 backdrop-blur">
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                      <User className="inline h-3 w-3" /> Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                      <Hash className="inline h-3 w-3" /> ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                      <Activity className="inline h-3 w-3" /> Mod
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                      <Calendar className="inline h-3 w-3" /> Date
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold uppercase text-muted-foreground">
                      Act
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-xs text-muted-foreground">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center">
                        <span className="text-sm text-muted-foreground">No records yet</span>
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient, index) => (
                      <tr
                        key={patient.id}
                        className={`group transition-colors hover:bg-primary/5 ${
                          index % 2 === 0 ? 'bg-transparent' : 'bg-secondary/20'
                        }`}
                      >
                        <td className="px-3 py-2 text-sm font-medium text-foreground">{patient.patientName}</td>
                        <td className="px-3 py-2">
                          <span className="rounded bg-secondary/50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                            {patient.patientId}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                            {patient.modality}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{patient.studyDate}</td>
                        <td className="px-3 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewPatient(patient)}
                            className="h-7 gap-1 px-2 text-xs text-primary opacity-0 hover:bg-primary/10 group-hover:opacity-100"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}