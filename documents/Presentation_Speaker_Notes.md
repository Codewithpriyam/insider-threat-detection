# Presentation Speaker Notes & Viva Guide

**Project:** Insider Threat Detection Using User Activity Logs  
**PowerPoint File:** `documents/Insider_Threat_Detection_Presentation.pptx`  
**Sample Dataset:** `documents/sample_threat_logs.csv`  

---

## Slide 1: Title & Project Overview
- **Talking Point:** "Good morning/afternoon everyone. Today, I am presenting our cybersecurity project titled *'Insider Threat Detection Using User Activity Logs'*. This project focuses on identifying malicious behavior originating from inside an organization by analyzing user activity logs in real-time."
- **Key Details to Mention:**
  - Tech Stack: Java Spring Boot 3 (backend), React 19 (frontend), and MySQL / H2 (relational storage).
  - Design Philosophy: VoiceBox Brutalist Editorial UI — high-contrast black-and-white layout with tactical red alert highlights.

---

## Slide 2: The Problem Statement & Motivation
- **Talking Point:** "Why is insider threat detection so critical? Most organizations invest heavily in external firewalls, intrusion detection systems, and antivirus software. However, traditional security defenses only defend the *perimeter*. If a legitimate employee, contractor, or an account with compromised credentials behaves maliciously, firewalls cannot stop them because the user is already authenticated."
- **Key Details to Mention:**
  - Insider threats look 'legitimate' at the network boundary.
  - The solution is **User Behavior Analytics (UBA)**: analyzing behavioral patterns such as login timing, volume of downloads, and privilege changes.

---

## Slide 3: Three Core Attack Vectors Detected
- **Talking Point:** "Our detection engine targets three primary insider attack patterns:"
  1. **Unusual Access Patterns (Off-Hours & Brute-Force):** Logins between 11:00 PM and 5:00 AM, or more than 3 consecutive failed logins followed by access.
  2. **Mass Data Exfiltration (Excessive Downloads):** High-volume data theft spikes where a user downloads more than 10 files or transfers over 150 MB of confidential data in a rolling 10-minute window.
  3. **Unauthorized Privilege Escalation:** Critical tampering where a standard user account self-assigns `ROLE_ADMIN` or alters IAM security groups without supervisor authorization.

---

## Slide 4: System Architecture & Data Flow
- **Talking Point:** "The architecture is modular and decoupled across 4 tiers:"
  1. **Ingestion Tier:** Ingests events via a REST API, synthetic attack simulations, or batch CSV uploads (up to 200 MB).
  2. **Heuristics Processing Tier:** Spring Boot service runs sliding-window database queries to evaluate behavioral thresholds.
  3. **Storage Tier:** MySQL relational database holding `users`, `activity_logs`, and `threat_alerts`.
  4. **Presentation Tier:** A React dashboard displaying live metric counters, active threat cards, and a Space Mono audit log table.

---

## Slide 5: VoiceBox Design System
- **Talking Point:** "For the frontend, we adhered strictly to the VoiceBox editorial magazine design system:"
  - Strict **0px border-radius** across all buttons, cards, and tables.
  - High-contrast black (`#0A0A0A`) on pure white (`#FAFAFA`).
  - Tactical red accent (`#EF4444`) used strictly as a scalpel for critical risks and alerts.
  - Three specialized fonts: Archivo Black for headlines, Work Sans for controls, and Space Mono for logs.

---

## Slide 6: How to Run & Demo the System
- **Talking Point:** "The project is designed for immediate zero-config demonstration:"
  1. Run Backend: `mvn spring-boot:run` in `backend/` (runs on port 8080).
  2. Run Frontend: `npm run dev` in `frontend/` (runs on port 5173).
  3. Demo Attack Simulator: One-click buttons in the UI immediately inject real-world breach scenarios.
  4. CSV Upload: Evaluators can click 'Upload CSV Logs' and select `sample_threat_logs.csv` to scan 140 realistic logs in real-time.

---

## Slide 7: Test Benchmark & Results
- **Talking Point:** "We evaluated the system against a realistic synthetic dataset of 140 logs spanning 20 employees across HR, Engineering, Legal, and Finance:"
  - 100% detection rate on brute-force attempts (`marcus.vance`).
  - 100% detection rate on mass data exfiltration (`elena.rostova`).
  - 100% detection rate on privilege tampering (`david.kim`).
  - **Zero false positives** on the 120 routine corporate daytime views and document reads.

---

## Slide 8: Conclusion & Future Scope
- **Talking Point:** "In conclusion, this project provides a high-performance, real-time log analysis platform tailored for insider threat containment. In the future, this can be extended with unsupervised Machine Learning models (such as Isolation Forests) and integrated into enterprise SIEM platforms like Splunk or Elastic."
- **Closing:** "Thank you. I am now open to questions and ready for the live demonstration."
