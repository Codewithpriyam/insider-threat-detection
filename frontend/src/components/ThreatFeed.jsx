import React, { useState } from 'react';
import { resolveThreat } from '../api';

export default function ThreatFeed({ threats, onThreatResolved }) {
  const [filter, setFilter] = useState('OPEN');
  const [resolvingId, setResolvingId] = useState(null);

  const filteredThreats = threats.filter(t => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const handleResolve = async (id) => {
    try {
      setResolvingId(id);
      await resolveThreat(id);
      onThreatResolved();
    } catch (err) {
      alert(`Could not resolve threat: ${err.message}`);
    } finally {
      setResolvingId(null);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="chip chip-critical">{severity}</span>;
      case 'MEDIUM':
        return <span className="chip chip-medium">{severity}</span>;
      default:
        return <span className="chip chip-low">{severity}</span>;
    }
  };

  const getThreatLabel = (threatType) => {
    switch (threatType) {
      case 'UNUSUAL_ACCESS':
        return 'UNUSUAL ACCESS / BRUTE FORCE';
      case 'EXCESSIVE_DOWNLOAD':
        return 'MASS DATA EXFILTRATION';
      case 'PRIVILEGE_ESCALATION':
        return 'UNAUTHORIZED PRIVILEGE ESCALATION';
      default:
        return threatType;
    }
  };

  return (
    <div id="threat-radar" style={{ marginBottom: '36px', scrollMarginTop: '24px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '2px solid var(--border-strong)',
        paddingBottom: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-text-secondary)'
          }}>
            TRIAGE & CONTAINMENT
          </div>
          <h2 style={{ fontSize: '26px', margin: '4px 0 0 0' }}>
            ACTIVE THREAT RADAR
          </h2>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['OPEN', 'RESOLVED', 'ALL'].map(statusOption => (
            <button
              key={statusOption}
              className={`filter-chip ${filter === statusOption ? 'active' : ''}`}
              onClick={() => setFilter(statusOption)}
            >
              {statusOption} ({threats.filter(t => statusOption === 'ALL' || t.status === statusOption).length})
            </button>
          ))}
        </div>
      </div>

      {filteredThreats.length === 0 ? (
        <div className="voicebox-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            marginBottom: '8px',
            color: 'var(--color-text-primary)'
          }}>
            NO ANOMALIES MATCHING CRITERIA
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            All user behaviors currently conform to normal corporate profiles. Use the Attack Simulator above to trigger security vectors.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredThreats.map((threat) => {
            const isHighOrCrit = threat.severity === 'CRITICAL' || threat.severity === 'HIGH';
            const isOpen = threat.status === 'OPEN';

            return (
              <div
                key={threat.id}
                className={isHighOrCrit && isOpen ? 'voicebox-card-alert' : 'voicebox-card'}
                style={{
                  padding: '20px 24px',
                  backgroundColor: 'var(--color-bg)'
                }}
              >
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getSeverityBadge(threat.severity)}
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '18px',
                      letterSpacing: '-0.01em'
                    }}>
                      {getThreatLabel(threat.threatType)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      DETECTED: {new Date(threat.detectedAt).toLocaleString()}
                    </span>
                    <span className={`chip ${isOpen ? 'chip-info' : 'chip-resolved'}`}>
                      {threat.status}
                    </span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--color-surface)',
                  borderLeft: isHighOrCrit ? '4px solid var(--color-secondary)' : '4px solid var(--border-strong)',
                  padding: '12px 16px',
                  marginBottom: '14px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '4px'
                  }}>
                    HEURISTIC EVIDENCE & FORENSIC LOG
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--color-text-primary)' }}>
                    {threat.description}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div className="mono" style={{ fontSize: '12px' }}>
                    <strong>TARGET SUBJECT:</strong> <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>{threat.username}</span>
                  </div>

                  {isOpen && (
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => handleResolve(threat.id)}
                      disabled={resolvingId === threat.id}
                    >
                      {resolvingId === threat.id ? 'UPDATING...' : 'RESOLVE INCIDENT'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
