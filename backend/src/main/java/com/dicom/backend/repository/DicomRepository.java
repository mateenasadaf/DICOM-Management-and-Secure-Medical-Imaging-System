package com.dicom.backend.repository;

import com.dicom.backend.model.DicomData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DicomRepository extends JpaRepository<DicomData, Long> {
}