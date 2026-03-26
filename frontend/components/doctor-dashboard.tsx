"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Eye, User, Calendar, Activity, Hash, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DicomPatient } from "@/lib/dicom-types"

interface DoctorDashboardProps {
  patients: DicomPatient[]
  onViewPatient: (patient: DicomPatient) => void
  isLoading: boolean
}

export function DoctorDashboard({ }: DoctorDashboardProps) {

  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // 🔥🔥 ADDED: modal state
  const [showViewer, setShowViewer] = useState(false)
  const [selectedFile, setSelectedFile] = useState("")

  // 🔥 FETCH DATA (same as before)
  useEffect(() => {
    fetch("http://localhost:8080/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  // 🔥🔥 CHANGED: instead of opening new tab → open modal
  const viewFile = (filePath: string) => {
    const fileName = filePath.split("/").pop()
    setSelectedFile(fileName || "")
    setShowViewer(true)
  }

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients
    const query = searchQuery.toLowerCase()
    return patients.filter(
      (p) =>
        p.patientName?.toLowerCase().includes(query) ||
        p.patientId?.toLowerCase().includes(query)
    )
  }, [patients, searchQuery])

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Stethoscope className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Doctor Dashboard</h2>
          <p className="text-sm text-muted-foreground">Search and view patient studies</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by patient name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-border/50 bg-secondary/50 pl-10 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>

      {/* Patient Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Patient Studies</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredPatients.length} {filteredPatients.length === 1 ? 'record' : 'records'}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/30">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30 bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      Patient Name
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5" />
                      Patient ID
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5" />
                      Modality
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Study Date
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/20">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      No Data
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient, index) => (
                    <tr key={patient.id || index} className="group transition-colors hover:bg-primary/5">
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{patient.patientName}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-md bg-secondary/50 px-2 py-1 font-mono text-sm text-muted-foreground">
                          {patient.patientId}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {patient.patientAge}
                      </td>

                      <td className="px-4 py-3">
                        {patient.patientGender}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                          {patient.modality}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {patient.studyDate}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewFile(patient.filePath)} // 🔥 CHANGED
                          className="gap-2 text-primary opacity-0 transition-all hover:bg-primary/10 group-hover:opacity-100"
                        >
                          <Eye className="h-4 w-4" />
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

      {/* 🔥🔥 ADDED: MODAL VIEWER */}
      {showViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="relative w-[800px] h-[600px] bg-black rounded-xl shadow-lg overflow-hidden">

            {/* ❌ CLOSE BUTTON (VISIBLE ALWAYS) */}
            <button
              onClick={() => setShowViewer(false)}
              className="absolute top-3 right-3 z-50 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-200"
            >
              ✕
            </button>

            {/* DICOM VIEWER */}
            <iframe
              src={`http://localhost:8080/Viewer.html?file=${selectedFile}`}
              className="w-full h-full border-none"
            ></iframe>

          </div>
        </div>
      )}
    </div>
  )
}