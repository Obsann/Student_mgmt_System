<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: auto; text-align: justify;">

<!-- Note: Markdown rendering might not perfectly reflect exact font sizes and margins (like 26pt or 1.5" margins) natively without a PDF generator. When exporting this to Microsoft Word, please ensure you set the Margins (Top: 1.5", Bottom: 1.0", Left: 2.0", Right: 1.0") and Paragraph Spacing (6 pts) as per the guidelines. -->

<div style="text-align: center;">
    <span style="font-size: 26pt; font-weight: bold;">INTERVENTION REPORT</span><br>
    <span style="font-size: 16pt; font-weight: bold;">Student Management System (SMS)</span>
</div>

<br><br>

<h1 style="font-size: 16pt; font-weight: bold; text-transform: uppercase;">1. PROJECT OVERVIEW</h1>

The Student Management System (SMS) is a comprehensive web-based platform designed to streamline administrative, academic, and communication processes for Kera High School. Initially, the project aimed to digitize student records and facilitate basic teacher assignments. However, as the system scaled towards production, it faced significant challenges with media storage volatility, cross-origin deployment API failures, security vulnerabilities regarding resource ownership, and database performance bottlenecks.

In this Intervention Phase (Phase Three), we focused on revising our initial proposed solutions by porting proven, robust architectural patterns from the related RMS platform. We shifted our approach from a rapid-prototype architecture to a resilient, production-ready environment. 

During this phase, we addressed critical production blockers. This included migrating from ephemeral local storage to a resilient Cloudinary-based media pipeline, resolving API cross-origin 404 errors through centralized API wrappers and Vercel proxying, and hardening backend security with strict role-based access control (RBAC) and resource ownership validation. Furthermore, we refined the database architecture to support soft-deletion and server-side pagination, significantly improving system stability and data integrity.

<h1 style="font-size: 16pt; font-weight: bold; text-transform: uppercase;">2. OBJECTIVES AND SCOPE</h1>

The primary objective of this phase was to transition the SMS from a functional development prototype to a secure, scalable, and stable production-ready platform, ensuring data integrity and reliable accessibility for all school stakeholders.

The scope of this intervention included:
<ul>
    <li><b>Storage Infrastructure:</b> Migrating image and media uploads from local disk to Cloudinary to prevent data loss on ephemeral hosting environments (Render).</li>
    <li><b>Deployment Stabilization:</b> Fixing production cross-origin resource sharing (CORS) and 404 errors by implementing backend proxying via <code>vercel.json</code>.</li>
    <li><b>Security Hardening:</b> Enforcing strict grading boundaries and validating teacher resource ownership to prevent unauthorized data manipulation (IDOR).</li>
    <li><b>Workflow Optimization:</b> Refining the teacher portal to provide an intuitive, role-based interface for attendance tracking and mark submission limited strictly to assigned sections.</li>
    <li><b>Database Architecture:</b> Implementing soft-delete policies, compound indexing, and server-side pagination to resolve performance bottlenecks.</li>
</ul>

<h1 style="font-size: 16pt; font-weight: bold; text-transform: uppercase;">3. INTERVENTION DETAILS</h1>

To solve the identified architectural and security problems, several targeted interventions were executed across the full stack:

<h2 style="font-size: 14pt; font-weight: bold;">A. Cloudinary Media Migration</h2>
Previously, profile covers and student images were stored on the local disk, leading to broken images after server restarts on Render. We integrated the Cloudinary SDK, refactored all upload-handling controllers, and updated environment variables to ensure all media is safely transmitted to Cloudinary. The database schemas were updated to store robust Cloudinary URLs, and the frontend was modified to retrieve these assets seamlessly, resolving all 404 image errors.

<h2 style="font-size: 14pt; font-weight: bold;">B. Deployment & API Standardization</h2>
To address cross-origin fetch failures between the Vercel frontend and Render backend, we refactored all hardcoded relative fetch calls into a centralized API wrapper with a user-friendly error classification system. We implemented a reverse proxy in <code>vercel.json</code> to route <code>/api/*</code> requests directly to the Render backend. This entirely bypassed CORS issues and ensured reliable frontend-to-backend communication.

<h2 style="font-size: 14pt; font-weight: bold;">C. Role-Based Workflow & Security</h2>
We audited system user credentials, targeting and cleaning up orphaned authentication records. We implemented middleware to strictly validate resource ownership, ensuring teachers can only submit marks and attendance for students in their explicitly assigned sections. This mitigated Insecure Direct Object Reference (IDOR) vulnerabilities where users could potentially manipulate data outside their purview. We also deployed zero-boilerplate mutation auditing via middleware to track critical changes.

<h2 style="font-size: 14pt; font-weight: bold;">D. Database & Performance Enhancements</h2>
To handle the stress of full school operations, the database architecture was hardened. We introduced soft-deletion policies to preserve historical records without cluttering active queries. We added compound indexes on frequently queried fields (e.g., student ID + section) and implemented server-side pagination for large datasets to reduce frontend memory consumption and improve load times.

<h3 style="font-size: 13pt; font-weight: bold; font-style: italic;">Project Deliverables</h3>
<ul>
    <li>Fully integrated and tested Cloudinary media pipeline.</li>
    <li>Secure, role-based Teacher Portal for attendance and grading.</li>
    <li>Centralized API fetch engine integrated with Vercel deployment proxy.</li>
    <li>Updated database schema featuring soft-delete and optimized indexing.</li>
    <li>Hardened backend equipped with mutation auditing and count-on-failure rate limiting.</li>
</ul>

<h1 style="font-size: 16pt; font-weight: bold; text-transform: uppercase;">4. SIGNIFICANCE AND IMPACT</h1>

The intervention significantly elevated the quality, security, and reliability of the SMS platform, moving it from a fragile state to robust production readiness.

<b>Contribution and Significance:</b>
The project now provides a highly stable foundation for the school's administrative and academic operations, eliminating the risk of data loss and unauthorized access. Teachers benefit from a streamlined, error-free workflow that reduces administrative overhead, while administrators maintain granular control over section assignments and system auditing.

<b>Achievements and Positive Changes:</b>
<ul>
    <li><b>Zero Data Loss on Media:</b> Images and attachments are now persistently available regardless of ephemeral server lifecycles.</li>
    <li><b>Enhanced Security:</b> IDOR vulnerabilities have been completely patched, ensuring strict data boundaries for staff.</li>
    <li><b>Improved Performance:</b> Server-side pagination and database indexing have reduced API response times significantly, even under load.</li>
    <li><b>Stable Deployments:</b> The Vercel-to-Render API proxying has eliminated all 404 deployment fetch errors.</li>
</ul>

<i>(Note for Final Document Assembly: Please insert Before and After comparisons supported by pictures here, such as screenshots of the Teacher Portal, Network Tab showing successful API calls, and the Cloudinary dashboard.)</i>

<h1 style="font-size: 16pt; font-weight: bold; text-transform: uppercase;">5. RECOMMENDATIONS</h1>

<b>Recommendations:</b>
<ul>
    <li><b>Mobile Responsiveness:</b> Prioritize mobile-first design adjustments for the Teacher Portal, as many teachers prefer using tablets or smartphones for attendance taking in the classroom.</li>
    <li><b>Analytics Dashboard:</b> Implement a comprehensive reporting dashboard for administrators to track school-wide attendance trends and academic performance metrics over time.</li>
</ul>

<b>Future Work:</b>
<ul>
    <li><b>Notification Gateway:</b> Integration with an SMS or Email gateway to send automated attendance alerts and academic reports directly to parents.</li>
    <li><b>Offline Capabilities:</b> Developing a dedicated offline-capable Progressive Web App (PWA) to accommodate environments or classrooms with unstable internet connections.</li>
</ul>

<b>Sustaining the Solutions:</b>
<ul>
    <li>Enforce strict code review policies using the newly established centralized API wrapper and Cloudinary patterns for any future feature additions.</li>
    <li>Regularly monitor the newly deployed mutation auditing logs to detect, analyze, and prevent anomalous behavior or unauthorized access attempts.</li>
    <li>Maintain up-to-date environment variable configurations and rate-limiter tunings across staging and production environments to ensure continued stability.</li>
</ul>

</div>
