package com.dicom.backend.service;

import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class DicomReaderService {

    public void readDicomFile() {
        try {
            // Step 1: Load file
            File file = new File("dicom-files/sample.dcm");

            // Step 2: Read DICOM
            DicomInputStream dis = new DicomInputStream(file);
            Attributes attr = dis.readDataset(-1, -1);
            dis.close();

            // Step 3: Extract data
            String patientName = attr.getString(Tag.PatientName);
            String patientID = attr.getString(Tag.PatientID);

            // Step 4: Print output
            System.out.println("===== DICOM DATA =====");
            System.out.println("Patient Name: " + patientName);
            System.out.println("Patient ID: " + patientID);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}