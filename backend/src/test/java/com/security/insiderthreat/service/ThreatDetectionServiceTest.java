package com.security.insiderthreat.service;

import com.security.insiderthreat.entity.ActivityLog;
import com.security.insiderthreat.entity.ThreatAlert;
import com.security.insiderthreat.repository.ActivityLogRepository;
import com.security.insiderthreat.repository.ThreatAlertRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ThreatDetectionServiceTest {

    @Mock
    private ThreatAlertRepository alertRepository;

    @Mock
    private ActivityLogRepository logRepository;

    private ThreatDetectionService detectionService;

    @BeforeEach
    void setUp() {
        detectionService = new ThreatDetectionService(alertRepository, logRepository);
        lenient().when(alertRepository.save(any(ThreatAlert.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void shouldDetectBruteForceWhenFailedLoginsExceedThreshold() {
        ActivityLog log = new ActivityLog(1L, "marcus.vance", "LOGIN", "/auth/login", 0L, "198.51.100.44", "SUCCESS", LocalDateTime.now());
        when(logRepository.countByUsernameAndActionAndStatusAndTimestampAfter(eq("marcus.vance"), eq("LOGIN"), eq("FAILED"), any()))
                .thenReturn(4L);

        List<ThreatAlert> alerts = detectionService.analyzeLog(log);

        assertFalse(alerts.isEmpty());
        assertEquals("UNUSUAL_ACCESS", alerts.get(0).getThreatType());
        assertEquals("HIGH", alerts.get(0).getSeverity());
    }

    @Test
    void shouldDetectExcessiveDownloadWhenBytesExceedThreshold() {
        ActivityLog log = new ActivityLog(2L, "elena.rostova", "FILE_DOWNLOAD", "vault.dump", 50000000L, "10.10.4.88", "SUCCESS", LocalDateTime.now());
        when(logRepository.findByUsernameAndActionAndTimestampAfter(eq("elena.rostova"), eq("FILE_DOWNLOAD"), any()))
                .thenReturn(Collections.singletonList(log));
        when(logRepository.sumBytesTransferredByUsernameAndTimestampAfter(eq("elena.rostova"), any()))
                .thenReturn(200L * 1024 * 1024); // 200 MB

        List<ThreatAlert> alerts = detectionService.analyzeLog(log);

        assertFalse(alerts.isEmpty());
        assertEquals("EXCESSIVE_DOWNLOAD", alerts.get(0).getThreatType());
        assertEquals("HIGH", alerts.get(0).getSeverity());
    }

    @Test
    void shouldDetectPrivilegeEscalationWhenRoleChangeAction() {
        ActivityLog log = new ActivityLog(3L, "david.kim", "ROLE_CHANGE", "/admin/iam/assign-roles", 1024L, "10.10.2.15", "SUCCESS", LocalDateTime.now());

        List<ThreatAlert> alerts = detectionService.analyzeLog(log);

        assertFalse(alerts.isEmpty());
        assertEquals("PRIVILEGE_ESCALATION", alerts.get(0).getThreatType());
        assertEquals("CRITICAL", alerts.get(0).getSeverity());
    }

    @Test
    void shouldNotGenerateAlertForNormalActivity() {
        ActivityLog log = new ActivityLog(4L, "alice.smith", "FILE_VIEW", "/docs/handbook.pdf", 1024L, "192.168.1.10", "SUCCESS", LocalDateTime.now());

        List<ThreatAlert> alerts = detectionService.analyzeLog(log);

        assertTrue(alerts.isEmpty());
        verify(alertRepository, never()).save(any());
    }
}
