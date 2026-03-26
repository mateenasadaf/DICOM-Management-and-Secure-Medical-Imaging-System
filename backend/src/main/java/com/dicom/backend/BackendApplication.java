package com.dicom.backend;

import com.dicom.backend.service.DicomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {

	@Autowired
	private DicomService dicomService;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@PostConstruct
	public void run() {
		try {
			dicomService.processFiles();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}