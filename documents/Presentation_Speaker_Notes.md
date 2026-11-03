# Presentation Speaker Notes & Viva Guide (9-Slide Edition)

**Project:** Insider Threat Detection System Using User Activity Logs & Behavioral Heuristics  
**PowerPoint File:** `documents/Insider_Threat_Detection_Presentation.pptx`  
**Interactive Slide Deck:** `documents/Interactive_Slide_Deck.html`  
**Sample Dataset:** `documents/sample_threat_logs.csv` (140 logs)  

---

## Slide 1: Cover / Executive Overview
- **Header:** `CYBERSECURITY MINI PROJECT // USER & ENTITY BEHAVIOR ANALYTICS`
- **Title:** `INSIDER THREAT DETECTION SYSTEM`
- **Subtitle:** `Real-Time User Activity Log Auditing & Heuristic Behavioral Analysis (UBA)`
- **Presenter Script:**
  > "Good morning/afternoon, esteemed evaluators and professors. Today, I am presenting our cybersecurity mini-project: **'Insider Threat Detection System Using User Activity Logs & Behavioral Heuristics'**."
  > "This engineering initiative tackles one of the most perilous blindspots in modern cybersecurity: malicious or negligent threats originating from authenticated users within the enterprise network."
- **Key Summary Cards to Highlight:**
  1. **Full-Stack Architecture:** Decoupled modern stack using Java Spring Boot 3.3.4 (REST API & heuristics engine), React 19 + Vite (VoiceBox UI), and MySQL/H2 relational persistence.
  2. **Sliding-Window UBA:** Deterministic 10-minute rolling heuristics targeting brute-force attempts, mass exfiltration, and privilege escalation.
  3. **Benchmark Validation:** Evaluated against 140 realistic logs across 20 corporate employees, achieving 100% detection on injected attacks with zero false positives on routine daytime traffic.

---

## Slide 2: 01 // Project Introduction (System Overview & Core Concepts)
- **Header:** `01 // PROJECT INTRODUCTION`
- **Title:** `SYSTEM OVERVIEW & CORE CONCEPTS`
- **Presenter Script:**
  > "To understand the core motivation behind this system, we must first look at what User Behavior Analytics (UBA) is and why it represents a paradigm shift."
- **Key Talking Points:**
  - **What is UBA?**
    - Traditional cybersecurity monitors external network perimeters. UBA shifts this focus inwardly toward authenticated identities and behavior anomalies.
    - We ingest normalized activity streams (authentication, resource accesses, transfer volumes, and role modifications).
    - We apply a rolling sliding-window engine across 10-minute intervals, catching anomalies before confidential assets exit the organization.
    - Real-time zero-lag dispatch alerts the Security Operations Center (SOC) with one-click containment workflows.
  - **Technical Foundations & Methodology:**
    - Developed with Java Spring Boot 3 utilizing JPA repositories and thread-safe sliding-window evaluations.
    - Built with a React 19 single-page application adhering to the brutalist VoiceBox editorial design system.
    - Features a dual-mode engine enabling client-side evaluation on static deployments (like GitHub Pages) or production REST connectivity.
    - Designed under GitHub SpecKit specification standards for complete transparency and auditability.

---

## Slide 3: 02 // Problem Statement (The Insider Threat Crisis)
- **Header:** `02 // PROBLEM STATEMENT`
- **Title:** `THE INSIDER THREAT CRISIS`
- **Presenter Script:**
  > "Why do traditional enterprise defenses consistently fail against insider breaches? It comes down to the **Perimeter Defense Paradox**."
- **Key Talking Points:**
  - **The Perimeter Defense Paradox:**
    - Insiders operate with valid corporate credentials, issued hardware, and legitimate access rights.
    - Firewalls, VPN gateways, and Network IDSs are fundamentally blind to inside traffic — they cannot distinguish between an employee querying customer files for valid work versus an employee exfiltrating the database before resigning.
    - According to the Ponemon Institute, the average time to identify and contain an insider threat exceeds **85 days**, costing organizations over **$16.2 million annually**, not including severe GDPR/HIPAA regulatory penalties.
  - **Engineering Objectives of This Project:**
    - **High-Speed Ingestion:** Ingest bulk CSV audit files (up to 200MB) with automatic schema normalization.
    - **Transparent Heuristics:** Implement transparent, deterministic sliding-window rules that provide explainable forensic reasoning for every generated alert.
    - **Immediate Containment:** Provide security operators with 1-click incident response tied directly to forensic evidence logs.
    - **Zero False Positives:** Maintain 0% false positives on standard business traffic while capturing 100% of injected threats.

---

## Slide 4: 03 // Threat Vector Scope (Three Core Attack Vectors)
- **Header:** `03 // THREAT VECTOR SCOPE`
- **Title:** `THREE CORE ATTACK VECTORS DETECTED`
- **Presenter Script:**
  > "Our heuristics engine monitors three primary insider threat vectors that represent over 90% of observed internal enterprise breaches:"
- **Key Vectors to Explain:**
  1. **Vector 01: Unusual Access Patterns (Brute-Force & Off-Hours Logins):**
     - Flags logins between 11:00 PM and 5:00 AM outside normal operational hours.
     - Flags more than 3 consecutive failed login attempts within 10 minutes.
     - *Severity:* HIGH / MEDIUM — catches credential stuffing, compromised VPNs, and off-hours snooping.
  2. **Vector 02: Mass Data Exfiltration (Spike Downloads & Large Transfers):**
     - Flags when a user downloads more than 10 files in a rolling 10-minute window.
     - Flags when cumulative transfer size exceeds 150 MB.
     - *Severity:* HIGH — halts exfiltration of intellectual property, proprietary models, and database dumps.
  3. **Vector 03: Unauthorized Privilege Escalation:**
     - Flags unauthorized role modifications (e.g. self-promotion from `ROLE_USER` to `ROLE_ADMIN`).
     - Detects access group tampering without authorized management signatures.
     - *Severity:* CRITICAL — stops administrative hijacking and malicious tampering with audit trails.

---

## Slide 5: 04 // System Architecture (End-to-End Pipeline)
- **Header:** `04 // SYSTEM ARCHITECTURE`
- **Title:** `END-TO-END DATA PIPELINE`
- **Presenter Script:**
  > "The platform is engineered across four modular, decoupled tiers, ensuring high availability, sub-second latency, and horizontal scalability:"
- **Tier-by-Tier Explanation:**
  1. **Tier 01 (Log Sources & Ingestion):**
     - Ingests batch CSV files up to 200MB, streaming `/api/logs` REST events, and synthetic breach simulations.
     - Normalizes incoming events into timestamped, IP-addressed, and role-annotated audit schemas.
  2. **Tier 02 (Spring Boot Heuristics Engine):**
     - Core detection microservice running in-memory sliding-window aggregations across rolling 10-minute intervals.
     - Calculates deterministic severity scores (LOW, MEDIUM, HIGH, CRITICAL) and dispatches alerts to the incident queue.
  3. **Tier 03 (Storage Tier):**
     - Relational storage powered by MySQL 8 (production) or H2 (development/testing).
     - Maintains `users`, `activity_logs`, and `threat_alerts` tables with referential integrity.
  4. **Tier 04 (SOC Dashboard):**
     - React 19 single-page application built with the VoiceBox brutalist design system.
     - Features 1-click threat triage, search and filter controls, and paginated audit streams.

---

## Slide 6: 05 // Frontend Design Specification (VoiceBox Editorial System)
- **Header:** `05 // FRONTEND DESIGN SPECIFICATION`
- **Title:** `VOICEBOX EDITORIAL DESIGN SYSTEM`
- **Presenter Script:**
  > "Rather than using generic component libraries with rounded corners and gradients, we implemented a custom VoiceBox Brutalist Editorial design system built specifically for high-stress SOC environments:"
- **Five Core Tenets:**
  1. **Strict 0px Border-Radius:** Angular, geometric precision across all buttons, cards, dialogs, and tables — no soft rounded corners.
  2. **High-Contrast Monochrome:** Authoritative `#0A0A0A` black typography on `#FAFAFA` white background, maximizing readability during incident response.
  3. **Tactical Red Accent (`#EF4444`):** Used strictly like a surgeon's scalpel for critical threats, breach warnings, and containment triggers.
  4. **Three Specialized Font Roles:**
     - `Archivo Black` for authoritative, high-impact headlines.
     - `Work Sans / Arial` for crisp, ergonomic UI controls and metadata.
     - `Consolas / Space Mono` for raw, fixed-width forensic audit log inspection.
  5. **Hero Jump Navigation:** Top-level CTA jump navigation buttons allowing operators to instantly toggle between high-level metric cards and raw audit trails.

---

## Slide 7: 06 // Step-by-Step Run Guide (How to Run & Demo)
- **Header:** `06 // STEP-BY-STEP RUN GUIDE`
- **Title:** `HOW TO RUN & DEMO THE SYSTEM`
- **Presenter Script:**
  > "We have made running, reproducing, and demonstrating the entire system seamless with zero external dependencies required:"
- **Execution Steps:**
  1. **Step 01 - Run Backend:**
     - Command: `cd backend && mvn spring-boot:run`
     - Starts the Spring Boot REST API on port `8080`, seeds initial users, and initializes the in-memory H2 database.
  2. **Step 02 - Run Frontend:**
     - Command: `cd frontend && npm run dev`
     - Launches the Vite React SOC dashboard at `http://localhost:5173`.
  3. **Step 03 - 1-Click Attack Simulator:**
     - Built-in UI buttons allow evaluators to inject pre-configured breach patterns (Off-Hours access, Mass Exfiltration, Privilege Escalation) and observe real-time detection.
  4. **Step 04 - Batch CSV Ingestion:**
     - Security operators can upload `documents/sample_threat_logs.csv` (140 logs) or click 'Auto-Ingest Benchmark' to trigger bulk analysis across realistic corporate scenarios.

---

## Slide 8: 07 // Evaluation & Benchmarks (Test Results)
- **Header:** `07 // EVALUATION & BENCHMARKS`
- **Title:** `TEST BENCHMARK RESULTS (140 LOG SAMPLES)`
- **Presenter Script:**
  > "To validate our heuristics engine, we executed a rigorous evaluation using our 140-log benchmark dataset covering 20 enterprise employees across HR, Engineering, Finance, and Legal departments:"
- **Walk Through the Evaluation Table:**
  - **Scenario 1 (Brute Force):** `marcus.vance` — 5 failed logins within 6 minutes followed by an IP switch. *Result: FLAGGED as HIGH SEVERITY instantly.*
  - **Scenario 2 (Mass Exfiltration):** `elena.rostova` — 10 confidential documents downloaded totaling over 300 MB in 8 minutes. *Result: FLAGGED as HIGH SEVERITY instantly.*
  - **Scenario 3 (Privilege Escalation):** `david.kim` — Attempted self-promotion to `ROLE_ADMIN` without two-person rule sign-off. *Result: FLAGGED as CRITICAL SEVERITY instantly.*
  - **Scenario 4 (Baseline Operations):** 120 routine corporate daytime interactions (wiki reads, code reviews, PR approvals). *Result: PASSED with 0 False Positives.*

---

## Slide 9: 08 // Conclusion & Summary (Deliverables & Roadmap)
- **Header:** `08 // CONCLUSION & SUMMARY`
- **Title:** `PROJECT ACHIEVEMENTS & FUTURE SCOPE`
- **Presenter Script:**
  > "In summary, our Insider Threat Detection System successfully bridges the critical visibility gap left behind by traditional perimeter firewalls."
- **Key Project Deliverables:**
  - **Production-Grade Architecture:** Engineered a decoupled platform combining Java Spring Boot 3, React 19, and relational audit storage under zero-trust principles.
  - **Zero-Lag Behavioral Detection:** Sub-second heuristic correlation catching fast-moving attacks within minutes rather than months.
  - **VoiceBox Editorial UX:** Clean, distraction-free SOC interface designed for rapid incident containment.
- **Future Research Scope:**
  - Integration of unsupervised machine learning (Isolation Forests & Deep Autoencoders) to automatically cluster emergent threat patterns without manual threshold tuning.
  - Native integration with enterprise SIEM and SOAR pipelines (Splunk, Elastic, Microsoft Sentinel).
- **Closing:**
  > "Thank you for your time and attention. I am now pleased to demonstrate the live system and answer your questions."

---

## Likely Viva Questions & Model Answers

**Q1: Why use deterministic sliding-window heuristics instead of Machine Learning?**
> *Answer:* "While ML models (such as autoencoders or random forests) are powerful, they often suffer from 'black box' explainability issues, high training overhead, and frequent false positives on evolving baseline data. In cybersecurity compliance, deterministic heuristics guarantee that every alert is 100% explainable, transparent, and auditable by security analysts. In our future scope, we plan to combine heuristics with unsupervised anomaly clustering."

**Q2: How does the sliding-window mechanism prevent false positives from legitimate bulk downloads?**
> *Answer:* "The sliding window calculates cumulative download count and byte volume within a strict 10-minute rolling duration. Furthermore, the system combines volume thresholds with role context and off-hours correlation. A graphic designer downloading assets during business hours has different normal profiles than an engineering contractor downloading customer databases at 2:00 AM."

**Q3: Can an attacker bypass detection by downloading files very slowly over weeks?**
> *Answer:* "That is known as a 'low-and-slow' exfiltration attack. A 10-minute sliding window is optimized for fast, impulsive data theft (e.g., an employee exfiltrating data right before quitting). To catch low-and-slow attacks, an extended second sliding window (e.g. 7-day or 30-day cumulative profile) is added to compare total monthly baseline egress against departmental averages."
