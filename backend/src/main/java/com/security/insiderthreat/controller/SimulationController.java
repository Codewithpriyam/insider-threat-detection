package com.security.insiderthreat.controller;

import com.security.insiderthreat.dto.SimulationResponseDTO;
import com.security.insiderthreat.service.SimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulate")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/unusual-access")
    public ResponseEntity<SimulationResponseDTO> simulateUnusualAccess(
            @RequestParam(required = false, defaultValue = "marcus.vance") String username) {
        return ResponseEntity.ok(simulationService.simulateUnusualAccess(username));
    }

    @PostMapping("/excessive-download")
    public ResponseEntity<SimulationResponseDTO> simulateExcessiveDownload(
            @RequestParam(required = false, defaultValue = "elena.rostova") String username) {
        return ResponseEntity.ok(simulationService.simulateExcessiveDownload(username));
    }

    @PostMapping("/privilege-escalation")
    public ResponseEntity<SimulationResponseDTO> simulatePrivilegeEscalation(
            @RequestParam(required = false, defaultValue = "david.kim") String username) {
        return ResponseEntity.ok(simulationService.simulatePrivilegeEscalation(username));
    }

    @PostMapping("/reset")
    public ResponseEntity<SimulationResponseDTO> resetData() {
        return ResponseEntity.ok(simulationService.resetData());
    }
}
