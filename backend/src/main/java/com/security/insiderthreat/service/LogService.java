package com.security.insiderthreat.service;

import com.security.insiderthreat.dto.LogRequestDTO;
import com.security.insiderthreat.entity.ActivityLog;
import com.security.insiderthreat.entity.User;
import com.security.insiderthreat.repository.ActivityLogRepository;
import com.security.insiderthreat.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class LogService {

    private final ActivityLogRepository logRepository;
    private final UserRepository userRepository;
    private final ThreatDetectionService threatDetectionService;

    public LogService(ActivityLogRepository logRepository, UserRepository userRepository, ThreatDetectionService threatDetectionService) {
        this.logRepository = logRepository;
        this.userRepository = userRepository;
        this.threatDetectionService = threatDetectionService;
    }

    @Transactional
    public ActivityLog ingestLog(LogRequestDTO dto) {
        Long userId = null;
        if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
            Optional<User> userOpt = userRepository.findByUsername(dto.getUsername());
            if (userOpt.isPresent()) {
                userId = userOpt.get().getId();
            } else {
                User newUser = new User(dto.getUsername(), dto.getUsername() + "@corp-defense.local", "General", "ROLE_USER");
                userId = userRepository.save(newUser).getId();
            }
        }

        ActivityLog log = new ActivityLog(
                userId,
                (dto.getUsername() != null && !dto.getUsername().isBlank()) ? dto.getUsername() : "anonymous",
                (dto.getAction() != null && !dto.getAction().isBlank()) ? dto.getAction().toUpperCase() : "UNKNOWN",
                dto.getResource(),
                dto.getBytesTransferred(),
                (dto.getIpAddress() != null && !dto.getIpAddress().isBlank()) ? dto.getIpAddress() : "127.0.0.1",
                (dto.getStatus() != null && !dto.getStatus().isBlank()) ? dto.getStatus().toUpperCase() : "SUCCESS",
                LocalDateTime.now()
        );

        ActivityLog saved = logRepository.save(log);
        threatDetectionService.analyzeLog(saved);

        return saved;
    }

    @Transactional
    public Map<String, Object> importCsv(MultipartFile file) throws Exception {
        int totalIngested = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new IllegalArgumentException("Uploaded CSV file is empty");
            }

            String delimiter = ",";
            if (headerLine.contains("\t")) {
                delimiter = "\t";
            } else if (headerLine.contains(";")) {
                delimiter = ";";
            } else if (headerLine.contains("|")) {
                delimiter = "\\|";
            }

            String[] headers = headerLine.split(delimiter);
            int userIdx = -1;
            int actionIdx = -1;
            int resourceIdx = -1;
            int bytesIdx = -1;
            int ipIdx = -1;
            int statusIdx = -1;

            for (int i = 0; i < headers.length; i++) {
                String h = headers[i].trim().toLowerCase().replaceAll("[^a-z0-9_]", "");
                if (h.contains("user") || h.contains("actor") || h.contains("account") || h.contains("src_user")) {
                    userIdx = i;
                } else if (h.contains("action") || h.contains("activity") || h.contains("event") || h.contains("operation")) {
                    actionIdx = i;
                } else if (h.contains("resource") || h.contains("file") || h.contains("target") || h.contains("path") || h.contains("url")) {
                    resourceIdx = i;
                } else if (h.contains("byte") || h.contains("size") || h.contains("length")) {
                    bytesIdx = i;
                } else if (h.contains("ip") || h.contains("host") || h.contains("address")) {
                    ipIdx = i;
                } else if (h.contains("status") || h.contains("result") || h.contains("outcome")) {
                    statusIdx = i;
                }
            }

            if (userIdx == -1) userIdx = 0;
            if (actionIdx == -1) actionIdx = Math.min(1, headers.length - 1);
            if (resourceIdx == -1 && headers.length > 2) resourceIdx = 2;
            if (bytesIdx == -1 && headers.length > 3) bytesIdx = 3;
            if (ipIdx == -1 && headers.length > 4) ipIdx = 4;
            if (statusIdx == -1 && headers.length > 5) statusIdx = 5;

            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isBlank()) {
                    continue;
                }

                String[] parts = line.split(delimiter, -1);
                if (parts.length <= Math.max(userIdx, actionIdx)) {
                    continue;
                }

                String username = parts[userIdx].trim().replace("\"", "");
                String action = parts[actionIdx].trim().replace("\"", "");
                String resource = resourceIdx >= 0 && resourceIdx < parts.length ? parts[resourceIdx].trim().replace("\"", "") : "/system";
                long bytes = 0L;
                if (bytesIdx >= 0 && bytesIdx < parts.length) {
                    try {
                        bytes = Long.parseLong(parts[bytesIdx].trim().replace("\"", ""));
                    } catch (Exception ignored) {
                    }
                }
                String ip = ipIdx >= 0 && ipIdx < parts.length ? parts[ipIdx].trim().replace("\"", "") : "192.168.1.100";
                if (ip.isBlank()) {
                    ip = "192.168.1.100";
                }
                String status = statusIdx >= 0 && statusIdx < parts.length ? parts[statusIdx].trim().replace("\"", "") : "SUCCESS";
                if (status.isBlank()) {
                    status = "SUCCESS";
                }

                if (!username.isBlank() && !action.isBlank()) {
                    LogRequestDTO dto = new LogRequestDTO();
                    dto.setUsername(username);
                    dto.setAction(action);
                    dto.setResource(resource);
                    dto.setBytesTransferred(bytes);
                    dto.setIpAddress(ip);
                    dto.setStatus(status);

                    ingestLog(dto);
                    totalIngested++;
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalIngested", totalIngested);
        result.put("message", "Successfully ingested and analyzed " + totalIngested + " logs from file.");
        return result;
    }

    public Page<ActivityLog> getLogs(String action, String status, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String cleanAction = (action == null || action.isBlank() || "ALL".equalsIgnoreCase(action)) ? null : action.toUpperCase();
        String cleanStatus = (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) ? null : status.toUpperCase();
        String cleanSearch = (search == null || search.isBlank()) ? null : search.trim();

        return logRepository.searchLogs(cleanAction, cleanStatus, cleanSearch, pageable);
    }
}
