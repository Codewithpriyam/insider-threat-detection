package com.security.insiderthreat.dto;

import java.util.Map;

public class DashboardStatsDTO {
    private long totalLogs;
    private long openAlerts;
    private long criticalAlerts;
    private long totalUsers;
    private Map<String, Long> threatsByType;
    private Map<String, Long> logsByAction;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalLogs, long openAlerts, long criticalAlerts, long totalUsers, Map<String, Long> threatsByType, Map<String, Long> logsByAction) {
        this.totalLogs = totalLogs;
        this.openAlerts = openAlerts;
        this.criticalAlerts = criticalAlerts;
        this.totalUsers = totalUsers;
        this.threatsByType = threatsByType;
        this.logsByAction = logsByAction;
    }

    public long getTotalLogs() {
        return totalLogs;
    }

    public void setTotalLogs(long totalLogs) {
        this.totalLogs = totalLogs;
    }

    public long getOpenAlerts() {
        return openAlerts;
    }

    public void setOpenAlerts(long openAlerts) {
        this.openAlerts = openAlerts;
    }

    public long getCriticalAlerts() {
        return criticalAlerts;
    }

    public void setCriticalAlerts(long criticalAlerts) {
        this.criticalAlerts = criticalAlerts;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Map<String, Long> getThreatsByType() {
        return threatsByType;
    }

    public void setThreatsByType(Map<String, Long> threatsByType) {
        this.threatsByType = threatsByType;
    }

    public Map<String, Long> getLogsByAction() {
        return logsByAction;
    }

    public void setLogsByAction(Map<String, Long> logsByAction) {
        this.logsByAction = logsByAction;
    }
}
