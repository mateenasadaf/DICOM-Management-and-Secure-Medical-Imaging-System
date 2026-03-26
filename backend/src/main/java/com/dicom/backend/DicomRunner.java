package com.dicom.backend;

import com.dicom.backend.service.ScuService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
public class DicomRunner implements CommandLineRunner {

    private final ScuService scuService;

    public DicomRunner(ScuService scuService) {
        this.scuService = scuService;
    }

    @Override
    public void run(String... args) {

        Scanner sc = new Scanner(System.in);

        while (true) {
            System.out.println("Enter DICOM file path (or exit):");

            String path = sc.nextLine();

            if (path.equalsIgnoreCase("exit")) break;

            scuService.sendDicom(path);
        }
    }
}