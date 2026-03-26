package com.dicom.backend.service;

import com.dicom.backend.model.RisPatient;
import com.dicom.backend.repository.RisRepository;
import org.dcm4che3.data.*;
import org.dcm4che3.io.DicomInputStream;
import org.dcm4che3.io.DicomOutputStream;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class RisDicomService {

    private final RisRepository risRepository;
    private final ScuService scuService;
    private final DicomService dicomService;   // 🔥 NEW

    public RisDicomService(RisRepository risRepository,
                           ScuService scuService,
                           DicomService dicomService) {   // 🔥 UPDATED
        this.risRepository = risRepository;
        this.scuService = scuService;
        this.dicomService = dicomService;
    }

    public String processAndSend(String filePath, String patientId) {

        try {
            System.out.println("Fetching patient: " + patientId);

            RisPatient p = risRepository.findByPatientId(patientId);

            if (p == null) {
                return "❌ Patient not found in RIS";
            }

            // 🔥 Read DICOM
            DicomInputStream dis = new DicomInputStream(new File(filePath));
            Attributes attr = dis.readDataset(-1, -1);
            dis.close();

            // 🔥 Inject RIS metadata
            attr.setString(Tag.PatientName, VR.PN, p.getPatientName());
            attr.setString(Tag.PatientID, VR.LO, p.getPatientId());
            attr.setString(Tag.PatientSex, VR.CS, p.getPatientGender());
            attr.setString(Tag.PatientAge, VR.AS, p.getPatientAge());

            attr.setString(Tag.StudyDate, VR.DA, p.getStudyDate());
            attr.setString(Tag.Modality, VR.CS, p.getModality());
            attr.setString(Tag.StudyDescription, VR.LO, p.getStudyDescription());
            attr.setString(Tag.ReferringPhysicianName, VR.PN, p.getReferringDoctor());
            attr.setString(Tag.AccessionNumber, VR.SH, p.getAccessionNumber());

            // 🔥 Save new DICOM file
            String newFilePath = "storage/" + attr.getString(Tag.SOPInstanceUID) + ".dcm";

            File dir = new File("storage");
            if (!dir.exists()) dir.mkdirs();

            DicomOutputStream dos = new DicomOutputStream(new File(newFilePath));
            dos.writeDataset(attr.createFileMetaInformation(UID.ExplicitVRLittleEndian), attr);
            dos.close();

            System.out.println("✅ DICOM created: " + newFilePath);

            // 🔥 Send via SCU
            boolean success = scuService.sendDicom(newFilePath);

            if (success) {

                // 🔥 NEW: STORE IN PACS DATABASE
                dicomService.processDicomFile(newFilePath);

                return "✅ SCP Response: 0x0000 (SUCCESS) + Stored in PACS DB";
            } else {
                return "❌ SCP Response: FAILED";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ ERROR: " + e.getMessage();
        }
    }
}