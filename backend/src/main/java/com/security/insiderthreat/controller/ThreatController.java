package com.security.insiderthreat.controller;

import com.security.insiderthreat.entity.ActivityLog;
import com.security.insiderthreat.entity.ThreatAlert;
import com.security.insiderthreat.repository.ActivityLogRepository;
import com.security.insiderthreat.repository.ThreatAlertRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/threats")
public class ThreatController {

    private final ThreatAlertRepository alertRepository;
    private final ActivityLogRepository logRepository;

    public ThreatController(ThreatAlertRepository alertRepository, ActivityLogRepository logRepository) {
        this.alertRepository = alertRepository;
        this.logRepository = logRepository;
    }

    @GetMapping
    public ResponseEntity<List<ThreatAlert>> getAlerts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity) {

        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(alertRepository.findByStatusOrderByDetectedAtDesc(status.toUpperCase()));
        }

        if (severity != null && !severity.isBlank() && !"ALL".equalsIgnoreCase(severity)) {
            return ResponseEntity.ok(alertRepository.findBySeverityOrderByDetectedAtDesc(severity.toUpperCase()));
        }

        return ResponseEntity.ok(alertRepository.findAllByOrderByDetectedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAlertDetails(@PathVariable Long id) {
        Optional<ThreatAlert> alertOpt = alertRepository.findById(id);
        if (alertOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ThreatAlert alert = alertOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("alert", alert);

        if (alert.getEvidenceLogId() != null) {
            Optional<ActivityLog> evidenceLog = logRepository.findById(alert.getEvidenceLogId());
            evidenceLog.ifPresent(log -> response.put("evidenceLog", log));
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ThreatAlert> resolveAlert(
            @PathVariable Long id,
            @RequestParam(defaultValue = "RESOLVED") String status) {

        Optional<ThreatAlert> alertOpt = alertRepository.findById(id);
        if (alertOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ThreatAlert alert = alertOpt.get();
        alert.setStatus(status.toUpperCase());
        ThreatAlert updated = alertRepository.save(alert);
        return ResponseEntity.ok(updated);
    }
}
