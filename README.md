# DICOM Management System

A full-stack **DICOM (Digital Imaging and Communications in Medicine) Management System** designed to manage medical imaging records and provide role-based access for **Technicians, Doctors, and Administrators**.

The system allows technicians to upload DICOM files along with patient information, stores the metadata in MySQL, and allows authorized doctors to view the uploaded DICOM images through an integrated DICOM viewer.

---

## 🚀 Features

### 👨‍🔧 Technician

* Upload DICOM (`.dcm`) files
* Enter patient information
* Store DICOM metadata in the database
* View previously uploaded patient records
* Validate DICOM file selection

### 👨‍⚕️ Doctor

* View patient records uploaded by technicians
* Search patient records
* View patient details
* Open DICOM files directly from the dashboard
* View DICOM images inside the application using a DICOM viewer
* Close the viewer and return to the dashboard

### 👨‍💼 Administrator

* View patient and study information
* View system statistics
* Search patient records
* Monitor uploaded records
* **No DICOM file viewing access** to maintain confidentiality

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │      Next.js         │
                    │       React          │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │     Spring Boot      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
       ┌──────────────────┐       ┌──────────────────┐
       │      MySQL       │       │  DICOM Storage   │
       │   dicom_db       │       │   uploads/       │
       └──────────────────┘       └──────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Lucide React**
* HTML/CSS

### Backend

* **Java**
* **Spring Boot**
* **Spring Data JPA**
* **Hibernate**
* **Maven**
* **Apache Tomcat**

### Database

* **MySQL**
* **MySQL Workbench**

### DICOM Viewer

* **Cornerstone.js**
* **DICOM Parser**
* **Cornerstone WADO Image Loader**

---

## 📁 Project Structure

```text
DicomBackend/
│
├── backend/
│   │
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── dicom/
│   │       │           └── backend/
│   │       │               │
│   │       │               ├── controller/
│   │       │               │   ├── PatientController.java
│   │       │               │   └── AuthController.java
│   │       │               │
│   │       │               ├── model/
│   │       │               │   ├── Patient.java
│   │       │               │   └── User.java
│   │       │               │
│   │       │               ├── repository/
│   │       │               │   ├── PatientRepository.java
│   │       │               │   └── UserRepository.java
│   │       │               │
│   │       │               └── BackendApplication.java
│   │       │
│   │       └── resources/
│   │           ├── static/
│   │           │   └── upload.html
│   │           │
│   │           └── application.properties
│   │
│   ├── Viewer.html
│   ├── uploads/
│   └── pom.xml
│
└── frontend/
    │
    ├── app/
    │
    ├── components/
    │
    ├── lib/
    │   └── dicom-types.ts
    │
    ├── public/
    │
    ├── package.json
    └── ...
```

---

# 🔄 Application Workflow

## 1. Technician Upload

The technician enters:

```text
Patient Name
Patient ID
Patient Age
Patient Gender
Study Date
Modality
Referring Doctor
Study Description
Accession Number
DICOM File
```

The frontend creates a `FormData` request and sends it to:

```text
POST http://localhost:8080/patients/upload
```

---

## 2. Backend Processing

Spring Boot receives:

```text
MultipartFile
+
Patient Information
```

The backend:

1. Creates the storage directory if required.
2. Saves the DICOM file.
3. Creates a `Patient` entity.
4. Stores the patient metadata in MySQL.
5. Returns the saved patient record.

---

## 3. Database Storage

Patient information is stored in:

```text
dicom_db
    └── dicom_data
```

Example fields:

```text
id
patient_name
patient_id
patient_age
patient_gender
study_date
modality
referring_doctor
study_description
accession_number
file_path
```

---

# 👨‍⚕️ Doctor Workflow

The doctor dashboard retrieves records using:

```text
GET http://localhost:8080/patients
```

The backend retrieves records from MySQL through:

```text
PatientRepository
        ↓
Spring Data JPA
        ↓
MySQL
```

The records are then displayed in the doctor's table.

When the doctor clicks **View**, the selected DICOM file is opened inside an application modal rather than navigating to a separate webpage.

---

# 🖼️ DICOM Viewer

The project uses:

```text
Cornerstone.js
DICOM Parser
Cornerstone WADO Image Loader
```

The viewer receives the selected filename and requests the DICOM file from the backend.

The viewer displays the DICOM image against a dark background.

The doctor can close the viewer using the **X** button and return to the doctor dashboard.

---

# 👨‍💼 Administrator Access

The administrator dashboard retrieves patient metadata from:

```text
GET http://localhost:8080/patients
```

The administrator can see information such as:

```text
Patient Name
Patient ID
Age
Gender
Modality
Study Date
Referring Doctor
```

The **Action/View column has been removed** from the administrator dashboard.

Therefore:

```text
Doctor      → Patient metadata + DICOM viewing
Technician  → Upload + Patient records
Admin       → Patient metadata only
```

---

# 🔐 Authentication

The backend contains:

```text
AuthController
UserRepository
User
```

Authentication endpoints:

```text
POST /auth/signup
POST /auth/login
```

The intended workflow is:

```text
Signup
   ↓
User stored in MySQL
   ↓
Login
   ↓
Email checked against database
   ↓
Password verified
   ↓
Role returned
   ↓
User redirected to appropriate dashboard
```

User information is intended to be stored in:

```text
dicom_db
    └── users
```

with fields such as:

```text
id
email
password
role
```

> **Current development status:** Authentication has been implemented, but the database persistence of users still needs to be verified. The backend should produce an SQL `INSERT INTO users ...` statement when a new signup is performed.

---

# 🌐 API Endpoints

## Patient APIs

### Upload DICOM

```http
POST /patients/upload
```

Used by the technician.

---

### Get all patients

```http
GET /patients
```

Used by:

* Doctor dashboard
* Admin dashboard
* Technician records

---

### Get patient by ID

```http
GET /patients/{id}
```

---

### DICOM file viewing

The project also uses a backend endpoint for retrieving the selected DICOM file for the viewer.

---

## Authentication APIs

### Signup

```http
POST /auth/signup
```

### Login

```http
POST /auth/login
```

---

# ⚙️ Configuration

Backend database configuration is located at:

```text
backend/src/main/resources/application.properties
```

The database is:

```text
dicom_db
```

The backend runs on:

```text
http://localhost:8080
```

The frontend runs on:

```text
http://localhost:3000
```

---

# ▶️ Running the Project

## 1. Start MySQL

Make sure MySQL Server is running.

Open MySQL Workbench and verify:

```sql
USE dicom_db;
SELECT * FROM dicom_data;
```

---

## 2. Start Backend

Open a terminal in the backend directory:

```bash
cd backend
```

Run:

```bash
.\mvnw spring-boot:run
```

The backend should start on:

```text
http://localhost:8080
```

---

## 3. Start Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies if required:

```bash
npm install
```

Then run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# 🗄️ Database

Create the database:

```sql
CREATE DATABASE dicom_db;
```

Select it:

```sql
USE dicom_db;
```

Patient table:

```sql
CREATE TABLE dicom_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100),
    patient_id VARCHAR(50),
    patient_age VARCHAR(10),
    patient_gender VARCHAR(10),
    study_date VARCHAR(20),
    modality VARCHAR(20),
    referring_doctor VARCHAR(100),
    study_description VARCHAR(255),
    accession_number VARCHAR(50),
    file_path TEXT
);
```

To check uploaded records:

```sql
SELECT * FROM dicom_data;
```

---

# 🔒 Data Privacy

The system uses role-based functionality:

| Role       | Patient Data | DICOM File |
| ---------- | ------------ | ---------- |
| Technician | ✅            | Upload     |
| Doctor     | ✅            | ✅ View     |
| Admin      | ✅            | ❌ No View  |

The administrator intentionally does not receive a DICOM viewing option.

---

# 🚧 Current Development Status

### Completed

* [x] Spring Boot backend
* [x] MySQL integration
* [x] Patient entity
* [x] Patient repository
* [x] Patient upload API
* [x] DICOM file storage
* [x] Patient data storage
* [x] Technician dashboard
* [x] Doctor dashboard
* [x] Admin dashboard
* [x] Role-based dashboard routing
* [x] DICOM viewer
* [x] DICOM viewer inside doctor dashboard
* [x] Viewer close button
* [x] Admin DICOM access removed
* [x] Patient data synchronized across dashboards
* [x] Project pushed to GitHub

### Still To Improve

* [ ] Fully verify signup → MySQL `users` persistence
* [ ] Password hashing using BCrypt
* [ ] Proper JWT authentication
* [ ] Backend-enforced role-based authorization
* [ ] Duplicate DICOM/study prevention
* [ ] Better DICOM viewer controls such as zoom, pan and window/level
* [ ] Production deployment
* [ ] Stronger file-access security

---

# 🔮 Future Improvements

Possible future features include:

* JWT-based authentication
* BCrypt password encryption
* Role-based authorization at backend level
* Advanced DICOM viewing tools
* Patient search and filtering
* Study management
* DICOM metadata extraction
* Audit logs
* Secure cloud storage
* PACS integration
* AI-assisted medical image analysis

---

# 📌 Project Summary

The **DICOM Management System** is a full-stack application that combines **Next.js, React, Spring Boot, MySQL, and Cornerstone.js** to manage medical imaging records.

The system provides separate workflows for technicians, doctors, and administrators. Technicians upload DICOM studies and patient information, doctors can retrieve patient records and view DICOM images, while administrators can manage and monitor patient metadata without direct access to confidential DICOM images.

The application demonstrates full-stack integration between a modern web frontend, RESTful Spring Boot APIs, relational database storage, local DICOM file storage, and an interactive medical image viewer.

---

## 👩‍💻 Authors

**BMSCE — DICOM Management System**

Built using:

```text
Next.js + React + TypeScript
          ↓
      Spring Boot
          ↓
      MySQL + JPA
          ↓
     DICOM Storage
          ↓
      Cornerstone.js
```

**Pregnancy tip:** Keep hydrated and take regular short breaks if you're working at the computer for long periods.
