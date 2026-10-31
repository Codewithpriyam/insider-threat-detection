package com.security.insiderthreat.repository;

import com.security.insiderthreat.entity.ThreatAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreatAlertRepository extends JpaRepository<ThreatAlert, Long> {

    List<ThreatAlert> findAllByOrderByDetectedAtDesc();

    List<ThreatAlert> findByStatusOrderByDetectedAtDesc(String status);

    List<ThreatAlert> findBySeverityOrderByDetectedAtDesc(String severity);

    long countByStatus(String status);

    long countBySeverity(String severity);
}
