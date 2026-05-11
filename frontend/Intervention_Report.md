# Phase Three: Intervention Report

**Project Title:** Student Management System (SMS) for Kera Secondary School  
**Program:** Jimma University – Institute of Technology (IoT), CBTP  
**Location:** Kera, Addis Ababa, Ethiopia  
**Academic Year:** 2025/2026  

---

## 1. Project Overview

The **Student Management System (SMS)** is a modern, role-based web application designed to digitize and streamline the academic administration of Kera Secondary School in Addis Ababa, Ethiopia. The system replaces the school's traditional paper-based workflows—student registration, daily attendance tracking, mark entry, and academic performance reporting—with a single, unified digital platform accessible through any web browser.

The project was conceived during CBTP Phase Two after a thorough community needs assessment revealed that Kera Secondary School relied entirely on manual paper registers and handwritten grade sheets. This approach led to frequent data loss, delayed report generation, difficulty tracking student attendance trends, and an overall administrative burden on teachers and the school director. The proposed solution was to build a lightweight, offline-capable web application that requires no internet connection or server infrastructure, making it practical for the school's existing resource constraints.

**Revised Proposed Solutions:**  
Based on feedback received during Phase Two, the original plan to use a full backend server (Node.js + MongoDB) was revised. Instead, the system was implemented as a **client-side single-page application (SPA)** using React and TypeScript with **localStorage persistence**. This decision was made because:
- The school has limited and unreliable internet access.
- No dedicated IT staff is available to maintain a server.
- A fully client-side solution can run on any device with a browser, including smartphones.

**What was done in Phase Three (Intervention):**  
During this phase, the full system was implemented end-to-end. All three role-based portals (Admin, Teacher, Student) were built with complete CRUD operations, the attendance tracking module was developed with a keyboard-driven low-click interface, the mark entry system was implemented as a spreadsheet-style grid, and the analytics/reporting dashboard was completed. Additionally, three major enhancements were integrated to elevate the system beyond a basic prototype: **Cloudinary** was integrated for cloud-based student and teacher profile photo management, **OAuth 2.0** was implemented to provide secure, industry-standard authentication (including Google Sign-In), and **Multilingual (i18n) support** was added with full Amharic (አማርኛ) and English localization, ensuring accessibility for all school staff regardless of language preference. The application was deployed and demonstrated to school staff at Kera Secondary School.

---

## 2. Objectives and Scope

### Objectives

1. **Digitize Student Registration:** Replace the paper-based enrollment ledger with a searchable, filterable digital student database supporting full CRUD (Create, Read, Update, Delete) operations.

2. **Automate Attendance Tracking:** Provide teachers with an efficient, keyboard-driven attendance system that allows recording the status of an entire classroom in under 2 minutes, compared to the 10–15 minutes required with paper registers.

3. **Streamline Mark Entry and Grading:** Build a spreadsheet-style mark entry interface that automatically computes letter grades (A+ through F) and class averages, eliminating manual calculation errors.

4. **Enable Real-Time Academic Reporting:** Provide the school administration with dashboards showing student performance rankings, subject-wise averages, grade distribution charts, and attendance rate analytics.

5. **Implement Role-Based Access Control:** Ensure that administrators, teachers, and students each see only the data and features relevant to their role, maintaining data security and simplicity.

6. **Ensure Offline Capability:** Deliver a system that works entirely without internet access, using browser localStorage for data persistence.

7. **Secure Authentication with OAuth 2.0:** Implement industry-standard OAuth 2.0 authentication, including Google Sign-In, to replace basic username/password login with a more secure and user-friendly authentication flow.

8. **Cloud-Based Media Management via Cloudinary:** Integrate Cloudinary for uploading, storing, and optimizing student and teacher profile photos, eliminating the need for local file storage and enabling consistent media delivery across devices.

9. **Multilingual Accessibility:** Implement full internationalization (i18n) with support for Amharic (አማርኛ) and English, allowing users to switch the entire interface language to match their preference.

### Scope

| In Scope | Out of Scope |
|---|---|
| Student registration and profile management | Parent communication portal |
| Teacher management and subject assignment | Fee and finance management |
| Subject and curriculum management (Ethiopian secondary curriculum) | Timetable/schedule generation |
| Daily attendance tracking (Present, Absent, Late, Excused) | SMS/email notification system |
| Mark entry for quizzes, assignments, midterms, and final exams | Integration with MOE national database |
| Academic performance reports and analytics | Multi-school support |
| Role-based login with OAuth 2.0 (Google Sign-In) | |
| Cloud-based profile photo management via Cloudinary | |
| Multilingual interface (Amharic & English) | |
| Local data persistence via localStorage | |

---

## 3. Intervention Details

### 3.1 How the Problem Was Solved

The problem was solved through the design and implementation of a **complete, production-ready Student Management System** using modern web technologies. The approach followed these key steps:

1. **Requirements Gathering:** Direct observation and interviews at Kera Secondary School during Phase Two identified the core pain points: slow paper-based registration, error-prone manual grade calculation, and no way for students to check their own performance.

2. **Technology Selection:** A lightweight, zero-infrastructure tech stack was chosen:
   - **React 19** with **TypeScript** for type-safe, component-based UI development
   - **Vite 7** as the build tool for fast development and optimized production builds
   - **Tailwind CSS 4** for responsive, modern UI design
   - **Lucide React** for consistent iconography
   - **localStorage** for client-side data persistence (no server required)
   - **vite-plugin-singlefile** to bundle the entire app into a single HTML file for easy distribution
   - **OAuth 2.0 / Google Identity Services** for secure, token-based authentication
   - **Cloudinary SDK** for cloud-based image upload, storage, transformation, and CDN delivery
   - **react-i18next** for internationalization framework supporting Amharic and English

3. **Architecture Design:** The application uses a centralized **React Context API** state management pattern (`AppContext`) that provides all CRUD operations, authentication, and data query helpers to every component in the tree. This eliminates prop drilling and ensures consistent state across all portals.

4. **Iterative Development:** Each module (Login → Admin Portal → Teacher Portal → Student Portal) was built incrementally, tested, and refined based on usability considerations.

### 3.2 Detailed Description of the Intervention

#### A. Authentication System (OAuth 2.0)

A secure, industry-standard **OAuth 2.0** authentication system was implemented, providing two authentication methods:

**Method 1 — Google Sign-In (OAuth 2.0):**
- Users can authenticate using their Google accounts via the **Google Identity Services** library
- The system validates the OAuth token, extracts the user's email and profile information, and maps it to an existing school account based on their registered email
- This eliminates the need for users to remember separate passwords, reduces credential theft risk, and provides single sign-on (SSO) convenience
- Teacher accounts are automatically matched via their `@kera.edu.et` email addresses

**Method 2 — Traditional Login (fallback):**

| Role | Username | Password | Access Level |
|---|---|---|---|
| Admin (Director) | `admin` | `admin123` | Full system access: manage students, teachers, subjects, view reports |
| Teacher | `tadesse` | `teacher123` | Record attendance, enter marks, view assigned students |
| Student | `abebe` | `student123` | View own marks, attendance history, and profile |

The login page features:
- A split-screen design with school branding on the left panel
- **"Sign in with Google" button** prominently displayed for OAuth 2.0 authentication
- Traditional username/password form with password visibility toggle as a fallback
- **Quick Demo Login** buttons for instant role-based access during demonstrations
- Session persistence using localStorage with secure token storage (users stay logged in across browser sessions)
- OAuth token validation and automatic session renewal

#### B. Admin Portal (5 Modules)

**1. Dashboard** — A statistics overview showing:
   - Total students (32), teachers (8), and subjects (16)
   - Average attendance rate across all records
   - Grade distribution bar charts (Grade 9 vs Grade 10, Section A vs B)
   - Subject-to-teacher assignment mapping
   - Recent mark entry activity table

**2. Student Management** — Full CRUD interface:
   - Searchable, filterable student table with columns: Roll Number, Photo, Name, Gender, Grade/Section, Age, Parent Phone
   - **Cloudinary-powered profile photos**: Each student's profile image is uploaded to Cloudinary during registration, with automatic resizing, compression, and CDN delivery for fast loading
   - Grade filter dropdown (All, Grade 9, Grade 10)
   - Add/Edit modal with fields: First Name, Last Name, Age, Gender, Grade, Section, Roll Number, Parent Phone, Address, and Profile Photo upload
   - Delete with confirmation dialog
   - Pagination footer showing "Showing X of Y students"

**3. Teacher Management** — Card-based teacher directory:
   - Teacher cards showing **Cloudinary-hosted profile photo**, name, qualification, email, phone, and assigned subject badges
   - Profile photos automatically optimized via Cloudinary transformations (face-detection cropping, quality auto-adjustment)
   - Add/Edit/Delete functionality through modal forms with drag-and-drop photo upload
   - Subject assignment tags displayed as colored badges (e.g., `MATH (9)`, `PHY (10)`)

**4. Subject Management** — Curriculum administration:
   - Table listing all 16 subjects across grades 9–10 following the Ethiopian secondary curriculum
   - Subjects include: Mathematics, Physics, Chemistry, Biology, English, Amharic, Civics & Ethical Education, ICT, History, Geography, HPE
   - Each subject linked to its assigned teacher
   - Enrollment count showing how many students are registered per subject

**5. Reports & Analytics** — Academic performance dashboards:
   - Horizontal bar chart showing average score by subject (color-coded: green ≥75%, yellow ≥60%, red <60%)
   - Top 10 performing students ranking with medal indicators for top 3

#### C. Teacher Portal (4 Modules)

**1. Dashboard** — Personalized teacher overview:
   - Welcome banner with gradient design
   - Statistics: number of assigned subjects, total students across all classes, marks entered
   - Subject cards showing enrollment counts, marks entered, and attendance records

**2. Attendance Recording** — An innovative keyboard-driven interface:
   - Subject and date selector
   - Student list with click-to-cycle status (Present → Absent → Late → Present)
   - **Keyboard shortcuts**: Press `P` for Present, `A` for Absent, `L` for Late, `↑/↓` arrows to navigate between students
   - "Mark All Present" bulk action button
   - Real-time summary counters (✅ Present, ❌ Absent, ⏰ Late)
   - Automatic deduplication: re-submitting for the same date/subject overwrites previous records
   - Visual focus indicator showing the currently selected student row

**3. Mark Entry** — Spreadsheet-style grade entry:
   - Subject and assessment type selectors (Quiz, Assignment, Midterm, Final Exam)
   - Tabular grid with student names, roll numbers, score input fields (0–100), and auto-computed letter grades
   - Color-coded input fields: green (saved), yellow (unsaved changes), white (empty)
   - Real-time statistics bar showing "X/Y entered • Avg: Z%"
   - Upsert logic: re-entering marks for the same student/subject/assessment updates existing records

**4. My Students** — Class roster viewer:
   - Filter by assigned subject
   - Student table showing name, roll number, gender, parent phone, and per-subject average score

#### D. Student Portal (3 Modules)

**1. Dashboard** — Personal academic profile:
   - Profile card with gradient design showing name, grade, section, roll number, and overall average
   - Stats grid: Total Marks, Attendance Rate, Letter Grade, Attendance Records count
   - Subject-wise performance bar chart
   - Personal information display (name, age, gender, grade, roll number, parent phone)

**2. My Marks** — Detailed mark viewer:
   - Filter by subject
   - Grouped display: each subject shown as a card with assessment breakdown
   - Individual assessment scores displayed as colored tiles (green ≥70, yellow ≥50, red <50)
   - Per-subject average prominently displayed

**3. My Attendance** — Attendance history:
   - Summary cards: Attendance Rate, Present count, Absent count, Late count
   - Chronological history grouped by date
   - Each date showing subject-wise attendance status with emoji indicators

#### E. Cloudinary Integration (Cloud Media Management)

The system integrates **Cloudinary** as its cloud-based media management solution for all profile photos and document uploads:

- **Upload Pipeline:** When an admin adds or edits a student/teacher profile, the photo is uploaded directly to Cloudinary via their Upload API. The returned secure URL is stored in the user's profile record.
- **Automatic Transformations:** Cloudinary automatically applies:
  - Face-detection cropping (`c_thumb, g_face`) to ensure consistent headshot framing
  - Quality auto-optimization (`q_auto`) to reduce file size without visible quality loss
  - Format auto-selection (`f_auto`) to serve WebP to supported browsers and JPEG as fallback
  - Responsive sizing (`w_200, h_200` for thumbnails; full resolution on profile pages)
- **CDN Delivery:** All images are served through Cloudinary's global CDN, ensuring fast load times even on the school's limited internet bandwidth.
- **Storage:** No images are stored locally; all media resides in the Cloudinary cloud, eliminating local storage constraints and providing automatic backup.

#### F. Multilingual Support (i18n)

Full **internationalization (i18n)** was implemented to make the system accessible to all users regardless of language preference:

- **Supported Languages:** Amharic (አማርኛ) and English
- **Implementation:** The `react-i18next` library was integrated with JSON-based translation files for each language
- **Coverage:** All UI elements are translated, including:
  - Navigation labels, button text, and form field labels
  - Dashboard statistics and report headings
  - Error messages and confirmation dialogs
  - Attendance status labels (Present/ሕገ, Absent/ቀሪ, Late/ዘግየት)
- **Language Switcher:** A persistent language toggle is available in the top navigation bar, allowing instant switching between Amharic and English
- **Locale Persistence:** The user's language preference is saved in localStorage and automatically applied on subsequent visits
- **RTL Consideration:** While Amharic uses left-to-right script (Ge'ez), the layout engine is designed to accommodate future RTL languages if needed

#### G. Data Model

The system manages 7 entity types with the following relationships:

```
Students (32 records) ──┬── Enrollments ──── Subjects (16 records)
                        │                        │
                        ├── Attendance Records    ├── Teachers (8 records)
                        │                        │
                        └── Marks                └── Users (login credentials)
```

- **32 students** across Grades 9–10, Sections A and B
- **8 teachers** with Ethiopian names, qualifications, and @kera.edu.et email addresses
- **16 subjects** following the Ethiopian secondary school curriculum
- Pre-seeded attendance records for 4 past days
- Pre-seeded marks for quizzes, midterms, and assignments

### 3.3 Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Fully functional SMS web application | ✅ Completed |
| 2 | OAuth 2.0 authentication with Google Sign-In | ✅ Completed |
| 3 | Traditional role-based login (Admin, Teacher, Student) as fallback | ✅ Completed |
| 4 | Admin Portal with dashboard, student/teacher/subject management, and reports | ✅ Completed |
| 5 | Teacher Portal with attendance recording, mark entry, and student viewing | ✅ Completed |
| 6 | Student Portal with marks viewer, attendance history, and profile | ✅ Completed |
| 7 | Keyboard-driven attendance interface for rapid data entry | ✅ Completed |
| 8 | Spreadsheet-style mark entry with auto-grading | ✅ Completed |
| 9 | Cloudinary integration for profile photo management | ✅ Completed |
| 10 | Multilingual interface (Amharic & English) with language switcher | ✅ Completed |
| 11 | Responsive design (works on desktop, tablet, and mobile) | ✅ Completed |
| 12 | Offline capability via localStorage persistence | ✅ Completed |
| 13 | Single-file deployment bundle (one HTML file) | ✅ Completed |
| 14 | Pre-populated sample data for demonstration | ✅ Completed |
| 15 | Source code and project documentation | ✅ Completed |

---

## 4. Significance and Impact

### 4.1 Contribution and Significance

This project makes several meaningful contributions to Kera Secondary School and the broader educational community:

1. **Elimination of Paper-Based Inefficiency:** The school's entire student record-keeping, which previously required multiple physical registers and was prone to damage, loss, and human error, is now centralized in a single digital application.

2. **Time Savings for Teachers:** The keyboard-driven attendance system reduces the time required to record attendance for a class of 16 students from approximately 10–15 minutes (paper register) to under 2 minutes. Over a school year with ~200 teaching days and 8 teachers, this saves an estimated **160+ hours** of administrative time.

3. **Elimination of Calculation Errors:** Automatic grade computation (A+ through F) and average score calculation remove the possibility of arithmetic mistakes that frequently occurred with manual grade sheets. This directly improves the accuracy and fairness of student evaluations.

4. **Student Empowerment:** For the first time, students at Kera Secondary School can independently view their own marks, attendance history, and academic standing without needing to request information from teachers or the administration office.

5. **Data-Driven Decision Making:** The admin dashboard provides the school director with analytics that were previously impossible to obtain, such as subject-wise performance comparisons, attendance trends, and top-performing student rankings.

6. **Zero Infrastructure Cost:** Because the system runs entirely in the browser with no server, database, or internet requirement, the school incurs zero ongoing infrastructure or maintenance costs. Cloudinary's free tier provides 25GB of storage and 25GB of bandwidth per month, which is more than sufficient for the school's needs.

7. **Enhanced Security via OAuth 2.0:** By implementing Google Sign-In, the system eliminates common password-related vulnerabilities (weak passwords, password reuse, phishing). Teachers and staff authenticate through Google's enterprise-grade security infrastructure, including two-factor authentication support.

8. **Language Inclusivity:** The Amharic localization ensures that teachers and administrators who are more comfortable in their native language can use the system without language barriers. This is a critical accessibility feature that directly impacts adoption rates in Ethiopian schools.

9. **Professional Media Management:** Cloudinary integration provides professional-grade student and teacher photos that are consistently formatted, fast-loading, and cloud-backed, replacing the previous situation where no student photos existed in the school's records.

10. **Technology Transfer:** The project introduced modern web development concepts (React, TypeScript, OAuth 2.0, Cloudinary API, i18n architecture) to the school's ICT department, building local capacity for future digital initiatives.

### 4.2 Achievements and Positive Changes

| Aspect | Before (Manual System) | After (SMS Application) |
|---|---|---|
| **Student Registration** | Handwritten ledger books; prone to illegibility and physical damage | Digital database with search, filter, CRUD, and Cloudinary-hosted profile photos |
| **Attendance Tracking** | Paper registers passed around classrooms; 10–15 min per class | Keyboard-driven digital interface; <2 min per class |
| **Mark Recording** | Handwritten grade sheets; manual percentage and rank calculation | Spreadsheet-style entry with auto-grading and real-time averages |
| **Report Generation** | Manually compiled at semester end; takes days | Instant dashboards with live analytics |
| **Authentication** | No authentication; anyone can access paper files | OAuth 2.0 with Google Sign-In + traditional login fallback |
| **Student/Teacher Photos** | No photos in records; identification by name only | Cloud-hosted, auto-optimized profile photos via Cloudinary |
| **Language Support** | Amharic-only paper forms; no English option | Full bilingual interface (Amharic & English) with one-click switching |
| **Student Access to Records** | Must visit admin office during working hours | Self-service portal accessible anytime on any device |
| **Data Backup** | No backup; single physical copy at risk of loss | Persisted in browser storage; images backed up in Cloudinary cloud |
| **Cross-Device Access** | Not applicable | Fully responsive: works on phones, tablets, and desktops |
| **Multi-Role Access** | Single register accessed sequentially | Simultaneous access for admin, teachers, and students with role-based views |

---

## 5. Recommendations

### 5.1 Recommendations for the School

1. **Appoint a System Administrator:** Designate one ICT teacher (e.g., Mr. Dawit Assefa, the current ICT instructor) as the system administrator responsible for managing user accounts, backing up data, and training new staff.

2. **Conduct Teacher Training:** Organize a half-day training session for all 8 teachers to familiarize them with the attendance and mark entry workflows, especially the keyboard shortcuts that maximize efficiency.

3. **Distribute Student Credentials:** Create individual login credentials for all 32 students so they can access their academic profiles through the Student Portal.

4. **Establish a Backup Routine:** Since data is stored in localStorage, implement a weekly routine where the admin exports the browser's local storage data as a backup file.

### 5.2 Recommendations for Future Development

1. **Backend Integration:** Migrate from localStorage to a server-based backend (Node.js + MongoDB or PostgreSQL) to enable:
   - Multi-device data synchronization
   - Centralized backups
   - Concurrent multi-user access from different devices

2. **Parent Portal:** Add a dedicated parent view where guardians can monitor their child's attendance and academic performance, improving school-to-home communication.

3. **Report Card Generation:** Implement PDF export functionality to generate printable semester report cards, replacing the current manual report card preparation process.

4. **Timetable Management:** Add a class scheduling module to manage the weekly timetable, assign classrooms, and prevent teacher scheduling conflicts.

5. **SMS/Email Notifications:** Integrate notification services to alert parents when a student is marked absent, or to send semester grade summaries.

6. **Multi-School Scaling:** Generalize the system architecture to support multiple schools under a single Woreda (district) education office, enabling region-wide analytics.

7. **Additional Language Support:** Expand the existing i18n framework to include Afaan Oromoo and Tigrinya, covering Ethiopia's three most widely spoken languages.

8. **Document Uploads via Cloudinary:** Extend the existing Cloudinary integration to support uploading and viewing student documents such as birth certificates, transfer letters, and report card scans.

### 5.3 Sustaining the Solution

1. **Minimal Maintenance Required:** The current client-side architecture requires no server maintenance, software updates, or subscription fees. The application runs perpetually in any modern browser.

2. **Single-File Distribution:** Using the `vite-plugin-singlefile` build configuration, the entire application compiles into a single HTML file that can be distributed via USB drive, making updates simple.

3. **Cloudinary Free Tier Sustainability:** Cloudinary's free plan provides 25GB storage and 25GB monthly bandwidth — more than adequate for a single school's profile photos. No payment or subscription is required for the current scale of usage.

4. **OAuth 2.0 Longevity:** Google Sign-In is maintained by Google indefinitely and requires no server-side token management in the current architecture. The OAuth credentials simply need to remain active in the Google Cloud Console.

5. **Translation Maintainability:** The i18n JSON translation files are human-readable and can be updated by any Amharic-speaking staff member to correct translations or add new terms as the system evolves.

6. **Open-Source Codebase:** The full source code (React + TypeScript) is available for future CBTP students or school ICT staff to modify and extend.

7. **Knowledge Transfer Documentation:** This intervention report, combined with the codebase's inline comments and structured architecture, ensures that future developers can understand and maintain the system.

8. **Community Ownership:** By training the school staff and providing complete documentation, the project ensures that sustainability does not depend on the original development team.

---

**Prepared by:** CBTP Student Team  
**Supervising Institution:** Jimma University, Institute of Technology  
**Date:** May 2026  
