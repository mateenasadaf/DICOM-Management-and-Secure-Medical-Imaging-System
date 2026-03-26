package com.dicom.backend.service;

import com.dicom.backend.model.DicomData;
import com.dicom.backend.repository.DicomRepository;
import org.dcm4che3.data.*;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class DicomService {

    @Autowired
    private DicomRepository repository;

    // 🔥 Process all files in storage
    public void processFiles() throws Exception {

        File folder = new File("C:\\Users\\mateena sadaf\\Desktop\\DicomBackend\\backend\\storage");

        if (!folder.exists() || folder.listFiles() == null) {
            System.out.println("❌ Storage folder not found");
            return;
        }

        for (File file : folder.listFiles()) {

            // ✅ IMPORTANT FIX: skip non-dcm files
            if (!file.getName().toLowerCase().endsWith(".dcm")) {
                System.out.println("Skipping non-DICOM file: " + file.getName());
                continue;
            }

            DicomInputStream dis = new DicomInputStream(file);
            Attributes attr = dis.readDataset(-1, -1);
            dis.close();

            DicomData data = new DicomData();
            data.setPatientName(attr.getString(Tag.PatientName));
            data.setPatientId(attr.getString(Tag.PatientID));
            data.setPatientAge(attr.getString(Tag.PatientAge));
            data.setPatientGender(attr.getString(Tag.PatientSex));

            data.setStudyDate(attr.getString(Tag.StudyDate));
            data.setModality(attr.getString(Tag.Modality));

            data.setReferringDoctor(attr.getString(Tag.ReferringPhysicianName));
            data.setStudyDescription(attr.getString(Tag.StudyDescription));
            data.setAccessionNumber(attr.getString(Tag.AccessionNumber));

            data.setFilePath(file.getAbsolutePath());

            repository.save(data);

            System.out.println("Saved to DB: " + file.getName());
        }
    }

    // 🔥 Process single file (USED IN YOUR FLOW)
    public void processDicomFile(String filePath) {

        try {
            File file = new File(filePath);

            if (!file.exists()) {
                System.out.println("❌ File not found: " + filePath);
                return;
            }

            // ✅ IMPORTANT FIX: ensure it's DICOM
            if (!file.getName().toLowerCase().endsWith(".dcm")) {
                System.out.println("❌ Not a DICOM file: " + file.getName());
                return;
            }

            DicomInputStream dis = new DicomInputStream(file);
            Attributes attr = dis.readDataset(-1, -1);
            dis.close();

            DicomData data = new DicomData();

            data.setPatientName(attr.getString(Tag.PatientName));
            data.setPatientId(attr.getString(Tag.PatientID));
            data.setPatientAge(attr.getString(Tag.PatientAge));
            data.setPatientGender(attr.getString(Tag.PatientSex));

            data.setStudyDate(attr.getString(Tag.StudyDate));
            data.setModality(attr.getString(Tag.Modality));
            data.setStudyDescription(attr.getString(Tag.StudyDescription));
            data.setReferringDoctor(attr.getString(Tag.ReferringPhysicianName));
            data.setAccessionNumber(attr.getString(Tag.AccessionNumber));

            data.setFilePath(filePath);

            repository.save(data);

            System.out.println("✅ Stored in PACS DB");
            System.out.println("🔥 processDicomFile CALLED with: " + filePath);

        } catch (Exception e) {
            e.printStackTrace();
        }

        // ✅ SAFETY FIX: check folder before loop
        File folder = new File("C:\\Users\\mateena sadaf\\Desktop\\DicomBackend\\backend\\storage");

        if (folder.exists() && folder.listFiles() != null) {
            for (File file : folder.listFiles()) {
                if (!file.getName().endsWith(".dcm")) {
                    System.out.println("Deleting unwanted file: " + file.getName());
                    file.delete();
                }
            }
        }
    }
}