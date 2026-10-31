package com.security.insiderthreat.dto;

import java.util.List;

public class SimulationResponseDTO {
    private String scenarioName;
    private String message;
    private int logsGenerated;
    private List<String> alertsTriggered;

    public SimulationResponseDTO() {
    }

    public SimulationResponseDTO(String scenarioName, String message, int logsGenerated, List<String> alertsTriggered) {
        this.scenarioName = scenarioName;
        this.message = message;
        this.logsGenerated = logsGenerated;
        this.alertsTriggered = alertsTriggered;
    }

    public String getScenarioName() {
        return scenarioName;
    }

    public void setScenarioName(String scenarioName) {
        this.scenarioName = scenarioName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getLogsGenerated() {
        return logsGenerated;
    }

    public void setLogsGenerated(int logsGenerated) {
        this.logsGenerated = logsGenerated;
    }

    public List<String> getAlertsTriggered() {
        return alertsTriggered;
    }

    public void setAlertsTriggered(List<String> alertsTriggered) {
        this.alertsTriggered = alertsTriggered;
    }
}
