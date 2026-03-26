"use client"

import { useState, useMemo } from "react"
import { Search, Eye, User, Calendar, Activity, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DicomPatient } from "@/lib/dicom-types"

interface PatientTableProps {
  patients: DicomPatient[]
  onViewPatient: (patient: DicomPatient) => void
  isLoading: boolean
}

export function PatientTable({ patients, onViewPatient, isLoading }: PatientTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients
    const query = searchQuery.toLowerCase()
    return patients.filter(
      (p) =>
        p.patientName.toLowerCase().includes(query) ||
        p.patientId.toLowerCase().includes(query) ||
        p.modality.toLowerCase().includes(query)
    )
  }, [patients, searchQuery])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Patient Studies</h2>
              <p className="text-sm text-muted-foreground">
                {filteredPatients.length} {filteredPatients.length === 1 ? 'record' : 'records'} found
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border/50 bg-secondary/50 pl-10 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Table */}
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
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm text-muted-foreground">Loading patient data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-full bg-muted/50 p-3">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {searchQuery ? 'No patients match your search' : 'No patient studies available'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => (
                  <tr
                    key={patient.id}
                    className={`group transition-colors hover:bg-primary/5 ${
                      index % 2 === 0 ? 'bg-transparent' : 'bg-secondary/20'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{patient.patientName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-secondary/50 px-2 py-1 font-mono text-sm text-muted-foreground">
                        {patient.patientId}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{patient.age}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        patient.gender === 'M' 
                          ? 'bg-blue-500/10 text-blue-400' 
                          : patient.gender === 'F'
                          ? 'bg-pink-500/10 text-pink-400'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : patient.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                        {patient.modality}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{patient.studyDate}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewPatient(patient)}
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
  )
}
