package com.dicom.backend.controller;

import com.dicom.backend.model.DicomData;
import com.dicom.backend.repository.DicomRepository;
import com.dicom.backend.service.RisDicomService;
import com.dicom.backend.service.ScuService;
import com.dicom.backend.service.DicomService; // ✅ ADDED

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/dicom")
public class DicomController {

    private final ScuService scuService;

    @Autowired
    private RisDicomService risDicomService;

    @Autowired
    private DicomRepository dicomRepository;

    @Autowired
    private DicomService dicomService; // ✅ ADDED

    public DicomController(ScuService scuService) {
        this.scuService = scuService;
    }

    // ✅ 1. GET ALL DATA FROM DATABASE
    @GetMapping
    public List<DicomData> getAllData() {
        return dicomRepository.findAll();
    }

    // ✅ 2. ADD DATA MANUALLY
    @PostMapping
    public DicomData addData(@RequestBody DicomData data) {
        return dicomRepository.save(data);
    }

    // ✅ 3. SEND DICOM FILE
    @PostMapping("/send-dicom")
    public String sendDicom(@RequestBody Map<String, String> body) {

        String filePath = body.get("path");

        if (filePath == null || filePath.isEmpty()) {
            return "❌ File path is required";
        }

        scuService.sendDicom(filePath);

        return "✅ DICOM file sent successfully!";
    }

    // ✅ 4. GET DICOM FILE FROM STORAGE
    @GetMapping("/file/{filename}")
    public ResponseEntity<Resource> getDicomFile(@PathVariable String filename) {
        try {
            Path path = Paths.get("C:\\Users\\mateena sadaf\\Desktop\\DicomBackend\\backend\\storage")
                    .resolve(filename);

            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ 5. SEND FROM RIS (DB + DICOM)
    @PostMapping("/send-from-ris")
    public String sendFromRis(@RequestBody Map<String, String> body) {

        String filePath = body.get("filePath");
        String patientId = body.get("patientId");

        return risDicomService.processAndSend(filePath, patientId);
    }

    // ✅ 6. UPLOAD DICOM FILE (FIXED)
    @PostMapping("/upload")
    public String uploadDicom(@RequestParam("file") MultipartFile file) {
        try {

            // 📁 Storage folder
            String folderPath = System.getProperty("user.home") + "\\Documents\\backend\\storage\\";
            File dir = new File(folderPath);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 📄 Save file
            String filePath = folderPath + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            // ✅ FIXED: use DICOM processing (NOT RIS)
            dicomService.processDicomFile(filePath);

            return "✅ File uploaded & processed successfully";

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Upload failed";
        }
    }
}