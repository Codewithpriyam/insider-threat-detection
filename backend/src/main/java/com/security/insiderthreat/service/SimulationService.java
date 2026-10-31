package com.security.insiderthreat.service;

import com.security.insiderthreat.dto.SimulationResponseDTO;
import com.security.insiderthreat.entity.ActivityLog;
import com.security.insiderthreat.entity.ThreatAlert;
import com.security.insiderthreat.entity.User;
import com.security.insiderthreat.repository.ActivityLogRepository;
import com.security.insiderthreat.repository.ThreatAlertRepository;
import com.security.insiderthreat.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class SimulationService {

    private final ActivityLogRepository logRepository;
    private final ThreatAlertRepository alertRepository;
    private final UserRepository userRepository;
    private final ThreatDetectionService threatDetectionService;

    public SimulationService(ActivityLogRepository logRepository,
                             ThreatAlertRepository alertRepository,
                             UserRepository userRepository,
                             ThreatDetectionService threatDetectionService) {
        this.logRepository = logRepository;
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
        this.threatDetectionService = threatDetectionService;
    }

    @Transactional
    public SimulationResponseDTO simulateUnusualAccess(String targetUsername) {
        String username = (targetUsername != null && !targetUsername.isBlank()) ? targetUsername : "marcus.vance";
        User user = ensureUser(username, "Finance");

        List<String> alerts = new ArrayList<>();
        List<ActivityLog> logs = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 4; i >= 1; i--) {
            ActivityLog failedLog = new ActivityLog(
                    user.getId(),
                    user.getUsername(),
                    "LOGIN",
                    "/auth/login",
                    0L,
                    "198.51.100.44",
                    "FAILED",
                    now.minusMinutes(i)
            );
            logs.add(logRepository.save(failedLog));
        }

        ActivityLog successLog = new ActivityLog(
                user.getId(),
                user.getUsername(),
                "LOGIN",
                "/auth/login",
                0L,
                "198.51.100.44",
                "SUCCESS",
                now
        );
        logs.add(logRepository.save(successLog));

        for (ActivityLog l : logs) {
            List<ThreatAlert> triggered = threatDetectionService.analyzeLog(l);
            for (ThreatAlert t : triggered) {
                alerts.add(t.getThreatType() + ": " + t.getDescription());
            }
        }

        return new SimulationResponseDTO(
                "UNUSUAL_ACCESS_PATTERN",
                "Simulated 4 consecutive failed logins and 1 successful anomalous session for " + username,
                logs.size(),
                alerts
        );
    }

    @Transactional
    public SimulationResponseDTO simulateExcessiveDownload(String targetUsername) {
        String username = (targetUsername != null && !targetUsername.isBlank()) ? targetUsername : "elena.rostova";
        User user = ensureUser(username, "Research & Development");

        List<String> alerts = new ArrayList<>();
        List<ActivityLog> logs = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        String[] sensitiveFiles = {
                "customer_ssn_database_dump.sql",
                "q3_executive_financial_projections.xlsx",
                "merger_acquisition_target_list.pdf",
                "core_platform_private_key.pem",
                "patent_application_draft_v4.docx",
                "employee_compensation_matrix.csv",
                "source_code_repository_backup.tar.gz",
                "internal_audit_investigation_report.pdf",
                "vendor_contracts_master.zip",
                "client_billing_records_2025.parquet",
                "vpn_access_credentials_vault.kdbx",
                "board_meeting_minutes_confidential.pdf"
        };

        for (int i = 0; i < sensitiveFiles.length; i++) {
            long fileSize = (15L + (i * 3)) * 1024 * 1024;
            ActivityLog downloadLog = new ActivityLog(
                    user.getId(),
                    user.getUsername(),
                    "FILE_DOWNLOAD",
                    sensitiveFiles[i],
                    fileSize,
                    "10.10.4.88",
                    "SUCCESS",
                    now.minusMinutes(12 - i)
            );
            ActivityLog saved = logRepository.save(downloadLog);
            logs.add(saved);

            List<ThreatAlert> triggered = threatDetectionService.analyzeLog(saved);
            for (ThreatAlert t : triggered) {
                alerts.add(t.getThreatType() + ": " + t.getDescription());
            }
        }

        return new SimulationResponseDTO(
                "EXCESSIVE_DATA_DOWNLOAD",
                "Simulated rapid mass download of 12 confidential assets (" + logs.size() + " events) by " + username,
                logs.size(),
                alerts
        );
    }

    @Transactional
    public SimulationResponseDTO simulatePrivilegeEscalation(String targetUsername) {
        String username = (targetUsername != null && !targetUsername.isBlank()) ? targetUsername : "david.kim";
        User user = ensureUser(username, "IT Operations");

        List<String> alerts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        ActivityLog privLog = new ActivityLog(
                user.getId(),
                user.getUsername(),
                "ROLE_CHANGE",
                "/admin/iam/assign-roles?grant=ROLE_ADMIN",
                1024L,
                "10.10.2.15",
                "SUCCESS",
                now
        );
        ActivityLog saved = logRepository.save(privLog);

        List<ThreatAlert> triggered = threatDetectionService.analyzeLog(saved);
        for (ThreatAlert t : triggered) {
            alerts.add(t.getThreatType() + ": " + t.getDescription());
        }

        return new SimulationResponseDTO(
                "PRIVILEGE_ESCALATION",
                "Simulated unauthorized role escalation to ROLE_ADMIN executed by " + username,
                1,
                alerts
        );
    }

    @Transactional
    public SimulationResponseDTO resetData() {
        alertRepository.deleteAll();
        logRepository.deleteAll();

        seedBaselineNormalTraffic();

        return new SimulationResponseDTO(
                "SYSTEM_RESET",
                "Cleared all alerts and seeded normal corporate baseline traffic",
                (int) logRepository.count(),
                List.of()
        );
    }

    public void seedBaselineNormalTraffic() {
        User u1 = ensureUser("alice.smith", "Human Resources");
        User u2 = ensureUser("bob.jones", "Engineering");
        User u3 = ensureUser("claire.chen", "Marketing");

        LocalDateTime base = LocalDateTime.now().minusHours(4);

        List<ActivityLog> baselineLogs = Arrays.asList(
                new ActivityLog(u1.getId(), u1.getUsername(), "LOGIN", "/auth/login", 0L, "192.168.1.10", "SUCCESS", base.plusMinutes(10)),
                new ActivityLog(u1.getId(), u1.getUsername(), "FILE_VIEW", "/hr/handbook.pdf", 512000L, "192.168.1.10", "SUCCESS", base.plusMinutes(15)),
                new ActivityLog(u2.getId(), u2.getUsername(), "LOGIN", "/auth/login", 0L, "192.168.1.25", "SUCCESS", base.plusMinutes(20)),
                new ActivityLog(u2.getId(), u2.getUsername(), "FILE_DOWNLOAD", "/git/repo-manifest.json", 204800L, "192.168.1.25", "SUCCESS", base.plusMinutes(35)),
                new ActivityLog(u3.getId(), u3.getUsername(), "LOGIN", "/auth/login", 0L, "192.168.1.80", "SUCCESS", base.plusMinutes(40)),
                new ActivityLog(u3.getId(), u3.getUsername(), "FILE_VIEW", "/marketing/deck_q4.pptx", 1240000L, "192.168.1.80", "SUCCESS", base.plusMinutes(55)),
                new ActivityLog(u1.getId(), u1.getUsername(), "LOGOUT", "/auth/logout", 0L, "192.168.1.10", "SUCCESS", base.plusHours(2))
        );

        logRepository.saveAll(baselineLogs);
    }

    private User ensureUser(String username, String department) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            User newUser = new User(username, username + "@corp-defense.local", department, "ROLE_USER");
            return userRepository.save(newUser);
        });
    }
}
