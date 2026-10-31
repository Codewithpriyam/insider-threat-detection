package com.security.insiderthreat.controller;

import com.security.insiderthreat.dto.LogRequestDTO;
import com.security.insiderthreat.entity.ActivityLog;
import com.security.insiderthreat.service.LogService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    @GetMapping
    public ResponseEntity<Page<ActivityLog>> getLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        return ResponseEntity.ok(logService.getLogs(action, status, search, page, size));
    }

    @PostMapping
    public ResponseEntity<ActivityLog> ingestLog(@RequestBody LogRequestDTO request) {
        ActivityLog created = logService.ingestLog(request);
        return ResponseEntity.ok(created);
    }

    @PostMapping(value = "/upload-csv", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(logService.importCsv(file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
