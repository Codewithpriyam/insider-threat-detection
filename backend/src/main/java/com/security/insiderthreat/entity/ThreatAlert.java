package com.security.insiderthreat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "threat_alerts")
public class ThreatAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(name = "threat_type", nullable = false, length = 50)
    private String threatType;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "evidence_log_id")
    private Long evidenceLogId;

    @Column(name = "detected_at", nullable = false)
    private LocalDateTime detectedAt;

    @Column(nullable = false, length = 20)
    private String status;

    public ThreatAlert() {
    }

    public ThreatAlert(Long userId, String username, String threatType, String severity, String description, Long evidenceLogId, LocalDateTime detectedAt, String status) {
        this.userId = userId;
        this.username = username;
        this.threatType = threatType;
        this.severity = severity;
        this.description = description;
        this.evidenceLogId = evidenceLogId;
        this.detectedAt = detectedAt != null ? detectedAt : LocalDateTime.now();
        this.status = status != null ? status : "OPEN";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getThreatType() {
        return threatType;
    }

    public void setThreatType(String threatType) {
        this.threatType = threatType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getEvidenceLogId() {
        return evidenceLogId;
    }

    public void setEvidenceLogId(Long evidenceLogId) {
        this.evidenceLogId = evidenceLogId;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
