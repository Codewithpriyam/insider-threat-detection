package com.security.insiderthreat.service;

import com.security.insiderthreat.entity.ActivityLog;
import com.security.insiderthreat.entity.ThreatAlert;
import com.security.insiderthreat.repository.ActivityLogRepository;
import com.security.insiderthreat.repository.ThreatAlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ThreatDetectionService {

    private static final int FAILED_LOGIN_THRESHOLD = 3;
    private static final int DOWNLOAD_COUNT_THRESHOLD = 10;
    private static final long DOWNLOAD_BYTE_THRESHOLD = 150L * 1024 * 1024; // 150 MB

    private final ThreatAlertRepository alertRepository;
    private final ActivityLogRepository logRepository;

    public ThreatDetectionService(ThreatAlertRepository alertRepository, ActivityLogRepository logRepository) {
        this.alertRepository = alertRepository;
        this.logRepository = logRepository;
    }

    public List<ThreatAlert> analyzeLog(ActivityLog log) {
        List<ThreatAlert> triggeredAlerts = new ArrayList<>();

        ThreatAlert accessAlert = checkUnusualAccess(log);
        if (accessAlert != null) {
            triggeredAlerts.add(alertRepository.save(accessAlert));
        }

        ThreatAlert downloadAlert = checkExcessiveDownloads(log);
        if (downloadAlert != null) {
            triggeredAlerts.add(alertRepository.save(downloadAlert));
        }

        ThreatAlert privilegeAlert = checkPrivilegeEscalation(log);
        if (privilegeAlert != null) {
            triggeredAlerts.add(alertRepository.save(privilegeAlert));
        }

        return triggeredAlerts;
    }

    private ThreatAlert checkUnusualAccess(ActivityLog log) {
        if (!"LOGIN".equalsIgnoreCase(log.getAction())) {
            return null;
        }

        LocalDateTime logTime = log.getTimestamp() != null ? log.getTimestamp() : LocalDateTime.now();
        LocalTime timeOfDay = logTime.toLocalTime();

        boolean isOffHours = timeOfDay.isAfter(LocalTime.of(23, 0)) || timeOfDay.isBefore(LocalTime.of(5, 0));

        LocalDateTime tenMinutesAgo = logTime.minusMinutes(10);
        long failedAttempts = logRepository.countByUsernameAndActionAndStatusAndTimestampAfter(
                log.getUsername(), "LOGIN", "FAILED", tenMinutesAgo
        );

        if (failedAttempts >= FAILED_LOGIN_THRESHOLD) {
            String severity = "SUCCESS".equalsIgnoreCase(log.getStatus()) ? "HIGH" : "MEDIUM";
            return new ThreatAlert(
                    log.getUserId(),
                    log.getUsername(),
                    "UNUSUAL_ACCESS",
                    severity,
                    String.format("Brute force pattern detected for user '%s': %d failed logins in past 10 mins from IP %s. Latest status: %s.",
                            log.getUsername(), failedAttempts, log.getIpAddress(), log.getStatus()),
                    log.getId(),
                    logTime,
                    "OPEN"
            );
        } else if (isOffHours && "SUCCESS".equalsIgnoreCase(log.getStatus())) {
            return new ThreatAlert(
                    log.getUserId(),
                    log.getUsername(),
                    "UNUSUAL_ACCESS",
                    "MEDIUM",
                    String.format("Off-hours session initiated by user '%s' at %s from IP %s (Outside normal corporate operating hours).",
                            log.getUsername(), timeOfDay.toString(), log.getIpAddress()),
                    log.getId(),
                    logTime,
                    "OPEN"
            );
        }

        return null;
    }

    private ThreatAlert checkExcessiveDownloads(ActivityLog log) {
        if (!"FILE_DOWNLOAD".equalsIgnoreCase(log.getAction())) {
            return null;
        }

        LocalDateTime tenMinutesAgo = (log.getTimestamp() != null ? log.getTimestamp() : LocalDateTime.now()).minusMinutes(10);
        List<ActivityLog> recentDownloads = logRepository.findByUsernameAndActionAndTimestampAfter(
                log.getUsername(), "FILE_DOWNLOAD", tenMinutesAgo
        );

        long recentCount = recentDownloads.size();
        Long totalBytes = logRepository.sumBytesTransferredByUsernameAndTimestampAfter(log.getUsername(), tenMinutesAgo);
        if (totalBytes == null) {
            totalBytes = 0L;
        }

        if (recentCount >= DOWNLOAD_COUNT_THRESHOLD || totalBytes >= DOWNLOAD_BYTE_THRESHOLD) {
            double mbTransferred = totalBytes / (1024.0 * 1024.0);
            return new ThreatAlert(
                    log.getUserId(),
                    log.getUsername(),
                    "EXCESSIVE_DOWNLOAD",
                    "HIGH",
                    String.format("Data exfiltration anomaly: User '%s' downloaded %d files (%.1f MB) within 10 minutes. Resource target: %s.",
                            log.getUsername(), recentCount, mbTransferred, log.getResource()),
                    log.getId(),
                    log.getTimestamp() != null ? log.getTimestamp() : LocalDateTime.now(),
                    "OPEN"
            );
        }

        return null;
    }

    private ThreatAlert checkPrivilegeEscalation(ActivityLog log) {
        if ("ROLE_CHANGE".equalsIgnoreCase(log.getAction()) || 
            "PRIVILEGE_ELEVATION".equalsIgnoreCase(log.getAction()) ||
            (log.getResource() != null && log.getResource().toLowerCase().contains("admin_grant"))) {

            return new ThreatAlert(
                    log.getUserId(),
                    log.getUsername(),
                    "PRIVILEGE_ESCALATION",
                    "CRITICAL",
                    String.format("Critical privilege change triggered by '%s' on resource '%s' (IP: %s) without dual-authorization signature.",
                            log.getUsername(), log.getResource(), log.getIpAddress()),
                    log.getId(),
                    log.getTimestamp() != null ? log.getTimestamp() : LocalDateTime.now(),
                    "OPEN"
            );
        }

        return null;
    }
}
