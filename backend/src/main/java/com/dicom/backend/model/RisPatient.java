package com.dicom.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ris_patient")   // ✅ must match DB table
public class RisPatient {

    @Id
    @Column(name = "patient_id")
    private String patientId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "patient_age")
    private String patientAge;

    @Column(name = "patient_gender")
    private String patientGender;

    @Column(name = "study_date")
    private String studyDate;

    @Column(name = "modality")
    private String modality;

    @Column(name = "referring_doctor")
    private String referringDoctor;

    @Column(name = "study_description")
    private String studyDescription;

    @Column(name = "accession_number")
    private String accessionNumber;

    // getters & setters
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientAge() { return patientAge; }
    public void setPatientAge(String patientAge) { this.patientAge = patientAge; }

    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

    public String getStudyDate() { return studyDate; }
    public void setStudyDate(String studyDate) { this.studyDate = studyDate; }

    public String getModality() { return modality; }
    public void setModality(String modality) { this.modality = modality; }

    public String getReferringDoctor() { return referringDoctor; }
    public void setReferringDoctor(String referringDoctor) { this.referringDoctor = referringDoctor; }

    public String getStudyDescription() { return studyDescription; }
    public void setStudyDescription(String studyDescription) { this.studyDescription = studyDescription; }

    public String getAccessionNumber() { return accessionNumber; }
    public void setAccessionNumber(String accessionNumber) { this.accessionNumber = accessionNumber; }
}