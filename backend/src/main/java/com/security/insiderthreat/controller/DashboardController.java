package com.security.insiderthreat.controller;

import com.security.insiderthreat.dto.DashboardStatsDTO;
import com.security.insiderthreat.repository.ActivityLogRepository;
import com.security.insiderthreat.repository.ThreatAlertRepository;
import com.security.insiderthreat.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ActivityLogRepository logRepository;
    private final ThreatAlertRepository alertRepository;
    private final UserRepository userRepository;

    public DashboardController(ActivityLogRepository logRepository, ThreatAlertRepository alertRepository, UserRepository userRepository) {
        this.logRepository = logRepository;
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        long totalLogs = logRepository.count();
        long openAlerts = alertRepository.countByStatus("OPEN");
        long criticalAlerts = alertRepository.countBySeverity("CRITICAL") + alertRepository.countBySeverity("HIGH");
        long totalUsers = userRepository.count();

        Map<String, Long> threatsByType = new HashMap<>();
        alertRepository.findAll().forEach(alert -> {
            threatsByType.put(alert.getThreatType(), threatsByType.getOrDefault(alert.getThreatType(), 0L) + 1);
        });

        Map<String, Long> logsByAction = new HashMap<>();
        logRepository.findAll().forEach(l -> {
            logsByAction.put(l.getAction(), logsByAction.getOrDefault(l.getAction(), 0L) + 1);
        });

        DashboardStatsDTO stats = new DashboardStatsDTO(
                totalLogs,
                openAlerts,
                criticalAlerts,
                totalUsers,
                threatsByType,
                logsByAction
        );

        return ResponseEntity.ok(stats);
    }
}
