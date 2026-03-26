"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DoctorDashboard } from "@/components/doctor-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { DicomViewer } from "@/components/dicom-viewer"
import { LoginPage } from "@/components/login-page"
import { SignupPage } from "@/components/signup-page"
import { useAuth } from "@/lib/auth-context"
import type { DicomPatient } from "@/lib/dicom-types"

// Demo data with simple names and age format
const DEMO_PATIENTS: DicomPatient[] = [
  {
    id: "1",
    filename: "chest_ct_001.dcm",
    patientName: "John Smith",
    patientId: "PT001",
    age: "45",
    gender: "M",
    modality: "CT",
    studyDate: "2024-03-15",
    referringDoctor: "Dr. Jane Wilson",
    studyDescription: "Chest CT Scan",
    accessionNumber: "ACC001",
  },
  {
    id: "2",
    filename: "brain_mri_002.dcm",
    patientName: "Sarah Johnson",
    patientId: "PT002",
    age: "62",
    gender: "F",
    modality: "MR",
    studyDate: "2024-03-14",
    referringDoctor: "Dr. Mike Chen",
    studyDescription: "Brain MRI",
    accessionNumber: "ACC002",
  },
  {
    id: "3",
    filename: "xray_003.dcm",
    patientName: "Michael Williams",
    patientId: "PT003",
    age: "38",
    gender: "M",
    modality: "CR",
    studyDate: "2024-03-14",
    referringDoctor: "Dr. Emily Brown",
    studyDescription: "Chest X-Ray",
    accessionNumber: "ACC003",
  },
  {
    id: "4",
    filename: "ultrasound_004.dcm",
    patientName: "Emily Brown",
    patientId: "PT004",
    age: "29",
    gender: "F",
    modality: "US",
    studyDate: "2024-03-13",
    referringDoctor: "Dr. Robert Davis",
    studyDescription: "Abdominal Ultrasound",
    accessionNumber: "ACC004",
  },
  {
    id: "5",
    filename: "mammogram_005.dcm",
    patientName: "Jennifer Davis",
    patientId: "PT005",
    age: "55",
    gender: "F",
    modality: "MG",
    studyDate: "2024-03-12",
    referringDoctor: "Dr. Lisa Anderson",
    studyDescription: "Mammogram Screening",
    accessionNumber: "ACC005",
  },
  {
    id: "6",
    filename: "pet_scan_006.dcm",
    patientName: "Robert Miller",
    patientId: "PT006",
    age: "68",
    gender: "M",
    modality: "PT",
    studyDate: "2024-03-11",
    referringDoctor: "Dr. James Taylor",
    studyDescription: "PET Scan",
    accessionNumber: "ACC006",
  },
]

export default function DicomDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')
  const [patients, setPatients] = useState<DicomPatient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<DicomPatient | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchPatients = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/dicom")
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      } else {
        setPatients(DEMO_PATIENTS)
      }
    } catch {
      setPatients(DEMO_PATIENTS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchPatients()
    }
  }, [user, fetchPatients])

  const handleViewPatient = (patient: DicomPatient) => {
    setSelectedPatient(patient)
  }

  const handleCloseViewer = () => {
    setSelectedPatient(null)
  }

  const handleUploadComplete = () => {
    fetchPatients()
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth pages if not logged in
  if (!user) {
    if (authView === 'signup') {
      return <SignupPage onSwitchToLogin={() => setAuthView('login')} />
    }
    return <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
  }

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (user.role) {
      case 'doctor':
        return (
          <DoctorDashboard
            patients={patients}
            onViewPatient={handleViewPatient}
            isLoading={isLoading}
          />
        )
      case 'technician':
        return (
          <TechnicianDashboard
            patients={patients}
            onViewPatient={handleViewPatient}
            onUploadComplete={handleUploadComplete}
            isLoading={isLoading}
          />
        )
      case 'admin':
        return (
          <AdminDashboard
            patients={patients}
            onViewPatient={handleViewPatient}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background gradient overlay */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Subtle grid pattern */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <DashboardHeader />

        <main className="mx-auto max-w-7xl px-6 py-8">
          {renderDashboard()}
        </main>
      </div>

      {/* DICOM Viewer Modal */}
      {selectedPatient && (
        <DicomViewer patient={selectedPatient} onClose={handleCloseViewer} />
      )}
    </div>
  )
}
