package com.dicom.backend.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class ScuService {

    public boolean sendDicom(String filePath) {
        try {

            ProcessBuilder pb = new ProcessBuilder(
                    "C:\\Users\\dteja\\Downloads\\dcm4che-5.34.2-bin\\dcm4che-5.34.2\\bin\\storescu.bat",
                    "-c", "STORESCP@localhost:11112",
                    filePath
            );

            pb.redirectErrorStream(true);

            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println("SCU LOG: " + line);
            }

            // 🔥 THIS IS THE REAL SUCCESS CHECK
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                System.out.println("✅ SCP Response: 0x0000 (SUCCESS)");
                return true;
            } else {
                System.out.println("❌ SCP Response: FAILED");
                return false;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}