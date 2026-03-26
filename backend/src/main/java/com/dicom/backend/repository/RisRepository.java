package com.dicom.backend.repository;

import com.dicom.backend.model.RisPatient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RisRepository extends JpaRepository<RisPatient, String> {

    RisPatient findByPatientId(String patientId);
}