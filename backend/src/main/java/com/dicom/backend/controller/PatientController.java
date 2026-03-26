package com.dicom.backend.controller;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import com.dicom.backend.model.Patient;
import com.dicom.backend.repository.PatientRepository;
import java.io.FileInputStream; // 🔥 CHANGED (added)
import jakarta.servlet.http.HttpServletResponse; // 🔥 CHANGED (added)
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@CrossOrigin
public class PatientController {

    @Autowired
    private PatientRepository repo;

    // ✅ Upload (Technician)
    @PostMapping("/upload")
    public Patient upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientName") String patientName,
            @RequestParam("patientId") String patientId,
            @RequestParam("patientAge") String patientAge,
            @RequestParam("patientGender") String patientGender,
            @RequestParam("studyDate") String studyDate,
            @RequestParam("modality") String modality,
            @RequestParam("referringDoctor") String referringDoctor,
            @RequestParam("studyDescription") String studyDescription,
            @RequestParam("accessionNumber") String accessionNumber
    ) {

        try {
            // 🔥 Save file locally
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = file.getOriginalFilename(); // 🔥 CHANGED
            String filePath = uploadDir + fileName;
            file.transferTo(new File(filePath));

            // 🔥 Save to DB
            Patient patient = new Patient();
            patient.setPatientName(patientName);
            patient.setPatientId(patientId);
            patient.setPatientAge(patientAge);
            patient.setPatientGender(patientGender);
            patient.setStudyDate(studyDate);
            patient.setModality(modality);
            patient.setReferringDoctor(referringDoctor);
            patient.setStudyDescription(studyDescription);
            patient.setAccessionNumber(accessionNumber);
            patient.setFilePath(fileName);

            return repo.save(patient);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // ✅ View all (Doctor/Admin)
    @GetMapping
    public List<Patient> getAll() {
        return repo.findAll();
    }

    // ✅ Get one patient
    @GetMapping("/{id}")
    public Patient getById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    // 🔥🔥 NEW API ADDED (VERY IMPORTANT)
    // This sends DICOM file to browser/viewer
    @GetMapping("/view")
    public void viewDicom(@RequestParam String file, HttpServletResponse response) {
        try {
            String filePath = System.getProperty("user.dir") + "/uploads/" + file; // 🔥 CHANGED
            File dicomFile = new File(filePath);

            response.setContentType("application/dicom"); // 🔥 CHANGED
            response.setHeader("Content-Disposition", "inline; filename=" + dicomFile.getName());

            FileInputStream inputStream = new FileInputStream(dicomFile);
            inputStream.transferTo(response.getOutputStream()); // 🔥 CHANGED (no IOUtils needed)
            response.flushBuffer();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}