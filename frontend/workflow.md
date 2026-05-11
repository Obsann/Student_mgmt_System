The workflow for the Kera Secondary School Student Management System is designed as a secure, role-based journey that begins with a centralized entry point and branches into specialized environments based on the user's identity.

### **1\. The Entry Point: Welcome and Authentication**

The journey starts at the **Welcome/Login Page**, which serves as the gateway to the entire system.

* **Authentication Selection:** Users choose between **Google Sign-In (OAuth 2.0)** for single sign-on convenience or a **Traditional Login** fallback using school-issued credentials.  
* **Role Identification:** Upon successful token validation or credential check, the system's AppContext identifies the user's role (Admin, Teacher, or Student) and redirects them to their specific portal.

### ---

**2\. Portal-Specific Workflows**

Once authenticated, the user navigates through a series of modules specific to their administrative or academic needs.

#### **A. The Administrator Workflow (Operational Oversight)**

The Admin portal is the "command center" for managing the school's structural data.

1. **Dashboard:** The landing page providing high-level analytics, such as total enrollments and grade distribution charts.  
2. **Student Management:** A searchable database where admins register students and upload profile photos to **Cloudinary**.  
3. **Teacher Management:** A directory for managing staff profiles and assigning them to specific subjects.  
4. **Subject Management:** A module to define the curriculum (e.g., Grade 9 Math, Grade 10 Physics) according to national standards.  
5. **Reports & Analytics:** The final destination for viewing school-wide performance rankings and subject averages.

#### **B. The Teacher Workflow (Daily Academic Tasks)**

The Teacher portal focuses on the high-frequency tasks of recording attendance and grades.

1. **Teacher Dashboard:** A personalized summary showing the teacher's assigned classes and pending mark entry tasks.  
2. **Attendance Recording:** A keyboard-driven interface where teachers cycle through "Present," "Absent," or "Late" for their class roster.  
3. **Mark Entry:** A spreadsheet-style grid for inputting assessment scores (Quizzes, Finals) which automatically computes letter grades.  
4. **My Students:** A read-only view of the students in their assigned sections, including parent contact info.

#### **C. The Student Workflow (Self-Service & Progress)**

The Student portal is a read-only environment centered on personal transparency.

1. **Student Dashboard:** A summary of the student's overall GPA, attendance rate, and a personal profile card.  
2. **My Marks:** A detailed breakdown of scores across all enrolled subjects, group by assessment type.  
3. **My Attendance:** A chronological history of their attendance record with visual status indicators.

### ---

**3\. Summary of Page Interconnectivity**

The following table illustrates how data moves through the pages to complete the school's operational cycle:

| Phase | Origin Page | Destination Page | Action / Data Flow |
| :---- | :---- | :---- | :---- |
| **Setup** | Admin: Subjects | Admin: Teachers | Map subjects to staff for portal access. |
| **Enrollment** | Admin: Students | Teacher: My Students | Registered students appear in the teacher's roster. |
| **Daily Use** | Teacher: Attendance | Student: My Attendance | Daily records update the student's personal history. |
| **Assessment** | Teacher: Mark Entry | Student: My Marks | Entered scores become visible to students instantly. |
| **Analysis** | Teacher: Mark Entry | Admin: Reports | Aggregated marks form the school's performance charts. |

Throughout this entire workflow, the **Multilingual Toggle** remains persistent in the navigation bar, allowing any page to be viewed in **Amharic** or English at any time.