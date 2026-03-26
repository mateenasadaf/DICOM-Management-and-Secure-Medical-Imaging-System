import { NextResponse } from "next/server"
import type { DicomPatient } from "@/lib/dicom-types"

// In-memory storage for demo purposes
// In production, this would be replaced with a database
const dicomFiles: DicomPatient[] = [
  {
    id: "1",
    filename: "chest_ct_001.dcm",
    patientName: "John Smith",
    patientId: "PT001",
    age: "45",
    gender: "M",
    modality: "CT",
    studyDate: "2024-03-15",
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
  },
]

// GET /dicom - List all DICOM files
export async function GET() {
  return NextResponse.json(dicomFiles)
}
