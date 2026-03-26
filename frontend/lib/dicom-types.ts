export type UserRole = 'doctor' | 'technician' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface DicomPatient {
  id: string
  filename: string
  patientName: string
  patientId: string
  age: string
  gender: string
  modality: string
  studyDate: string
  referringDoctor?: string
  studyDescription?: string
  accessionNumber?: string
  uploadedBy?: string
}

export interface UploadStatus {
  type: 'idle' | 'uploading' | 'success' | 'error'
  message: string
}

export interface DicomStudyForm {
  patientName: string
  patientId: string
  patientAge: string
  patientGender: string
  studyDate: string
  modality: string
  referringDoctor: string
  studyDescription: string
  accessionNumber: string
}
