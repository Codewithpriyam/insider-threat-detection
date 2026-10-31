# Insider Threat Detection System

> **A Security Operations Center (SOC) Log Audit & User Behavior Analytics (UBA) Platform**  
> Built as an academic engineering mini-project featuring real-time heuristic threat detection, behavioral auditing, and an interactive dashboard.

---

## 1. Project Overview

Organizations face severe cybersecurity risks from **insider threats** — legitimate credentials misused to exfiltrate proprietary data, escalate access, or conduct unauthorized operations.

This system ingests synthetic and real user activity logs and runs deterministic, sliding-window behavioral heuristics to detect three primary threat vectors:
1. **Unusual Access Patterns:** Off-hours logins (between 23:00 and 05:00) and brute-force consecutive failed authentication bursts.
2. **Excessive Downloads:** High-volume data exfiltration spikes (e.g., >10 files or >150 MB downloaded within a rolling 10-minute window).
3. **Suspicious Privilege Escalation:** Unauthorized role tampering or promotion to `ROLE_ADMIN` without supervisor authorization signatures.

---

## 2. Tech Stack

- **Frontend:** React 19, Vite, Vanilla CSS adhering to `voicebox-DESIGN.md` (0px border-radius, monochrome `#0A0A0A` on `#FAFAFA`, tactical `#EF4444` red highlight, Archivo Black & Space Mono typography).
- **Backend:** Java Spring Boot 3.3.4 (REST API, Spring Data JPA, Hibernate).
- **Database:** MySQL 8.x (with zero-config H2 MySQL-compatibility mode active for instant test runs).

---

## 3. Quick Start Guide

### 3.1 Prerequisites
- **Java 17+** (JDK 26, 21, or 17 supported)
- **Apache Maven 3.8+**
- **Node.js 18+** & npm

---

### 3.2 Running the Backend (Spring Boot)

Open a terminal in the `backend/` directory:

```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

- Backend runs at: **`http://localhost:8080`**
- H2 In-Memory DB Console (when active): **`http://localhost:8080/h2-console`**

#### Switching to Local MySQL
Open `backend/src/main/resources/application.properties`:
1. Comment out the active `spring.datasource.url=jdbc:h2:mem:...` lines.
2. Uncomment the MySQL configuration lines:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/insider_threat_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   ```
3. Restart Spring Boot (`mvn spring-boot:run`). Hibernate will automatically create the tables: `users`, `activity_logs`, and `threat_alerts`.

---

### 3.3 Running the Frontend (React + Vite)

Open a second terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

- Open your browser at: **`http://localhost:5173/`**

---

## 4. Live Evaluation & Demo Features

The UI includes a dedicated **Synthetic Attack Simulator** panel specifically designed for college project demonstrations and lab evaluations:

| Scenario Button | Injected Attack Pattern | Expected Detection Result |
| :--- | :--- | :--- |
| **`1. INJECT: UNUSUAL OFF-HOURS ACCESS`** | Injects 4 consecutive failed logins followed by 1 successful login from external IP `198.51.100.44`. | Triggers `UNUSUAL_ACCESS` threat alert (Brute-force / Credential Stuffing). |
| **`2. INJECT: MASS DATA EXFILTRATION`** | Injects 12 rapid downloads of confidential assets totaling >300 MB within minutes for user `elena.rostova`. | Triggers `EXCESSIVE_DOWNLOAD` alert (`HIGH` severity exfiltration spike). |
| **`3. INJECT: PRIVILEGE ESCALATION`** | Standard user `david.kim` triggers role escalation to `ROLE_ADMIN` on `/admin/iam/assign-roles`. | Triggers `PRIVILEGE_ESCALATION` (`CRITICAL` severity alert). |
| **`RESET SYSTEM BASELINE`** | Purges active threat alerts and re-seeds normal employee activity. | Restores clean corporate baseline. |

### Manual Event Ingestion
Click **`+ INGEST CUSTOM EVENT`** in the top right of the log table to inject an arbitrary custom user activity event (specifying username, action, resource, bytes, IP, and status) and observe the detection heuristics evaluate it live.

---

## 5. REST API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/dashboard/stats` | `GET` | Aggregated KPI counts (total logs, open threats, critical count, monitored users). |
| `/api/threats` | `GET` | List detected threats (filterable by `?status=OPEN` and `?severity=CRITICAL`). |
| `/api/threats/{id}/resolve` | `POST` | Acknowledge and resolve an active threat incident. |
| `/api/logs` | `GET` | Paginated activity logs (searchable by `?search=...`, filterable by `?action=...`). |
| `/api/logs` | `POST` | Ingest a new activity log event and trigger real-time detection heuristics. |
| `/api/simulate/unusual-access` | `POST` | Trigger off-hours brute force simulation. |
| `/api/simulate/excessive-download` | `POST` | Trigger mass data exfiltration simulation. |
| `/api/simulate/privilege-escalation` | `POST` | Trigger unauthorized privilege change simulation. |
| `/api/simulate/reset` | `POST` | Purge alerts and seed routine corporate baseline. |

---

## 6. UI & Design System

The frontend interface utilizes a focused security-operations aesthetic:
- **Geometry:** Clean border definitions across all panels, tables, and modal components.
- **Palette:** High-contrast neutral theme (`#0A0A0A` on `#FAFAFA`) with surface elevation layers.
- **Alert Highlights:** Security alert indicators (`#EF4444` red, `#16A34A` green, `#CA8A04` amber) for threat triage.
- **Typography:** Display headings, clean control text, and dedicated monospace formatting for forensic log streams and timestamps.

---

## 7. Project Presentation & Evaluation Documents

All presentation assets and benchmark datasets are organized in the [`documents/`](documents/) folder:
1. **[`Insider_Threat_Detection_Presentation.pptx`](documents/Insider_Threat_Detection_Presentation.pptx):** Complete 8-slide PowerPoint presentation file for lab review and defense.
2. **[`Interactive_Slide_Deck.html`](documents/Interactive_Slide_Deck.html):** Standalone browser-based presentation deck with keyboard arrow navigation.
3. **[`Presentation_Speaker_Notes.md`](documents/Presentation_Speaker_Notes.md):** Slide-by-slide speaking script and viva Q&A guide.
4. **[`sample_threat_logs.csv`](documents/sample_threat_logs.csv):** Benchmark dataset of 140 logs covering 20 users across multiple departments with embedded threat patterns.
