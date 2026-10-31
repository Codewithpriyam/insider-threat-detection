package com.security.insiderthreat.repository;

import com.security.insiderthreat.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    long countByUsernameAndActionAndStatusAndTimestampAfter(
            String username, String action, String status, LocalDateTime after
    );

    List<ActivityLog> findByUsernameAndActionAndTimestampAfter(
            String username, String action, LocalDateTime after
    );

    @Query("SELECT COALESCE(SUM(l.bytesTransferred), 0) FROM ActivityLog l " +
           "WHERE l.username = :username AND l.action = 'FILE_DOWNLOAD' AND l.timestamp >= :after")
    Long sumBytesTransferredByUsernameAndTimestampAfter(
            @Param("username") String username,
            @Param("after") LocalDateTime after
    );

    @Query("SELECT l FROM ActivityLog l WHERE " +
           "(:action IS NULL OR l.action = :action) AND " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:searchTerm IS NULL OR LOWER(l.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(l.resource) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR l.ipAddress LIKE CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY l.timestamp DESC")
    Page<ActivityLog> searchLogs(
            @Param("action") String action,
            @Param("status") String status,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );
}
