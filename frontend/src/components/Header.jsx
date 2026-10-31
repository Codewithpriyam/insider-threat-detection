import React, { useState, useEffect } from 'react';

export default function Header({ backendConnected, onRefresh, refreshing }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      borderBottom: '4px solid var(--color-primary)',
      backgroundColor: 'var(--color-bg)',
      padding: '24px 32px',
      marginBottom: '32px'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            SECURITY OPERATIONS CENTER // BEHAVIORAL AUDIT
          </div>
          <h1 style={{
            fontSize: '44px',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: 0
          }}>
            INSIDER THREAT RADAR
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '15px',
            marginTop: '6px',
            maxWidth: '650px'
          }}>
            Real-time heuristic analysis of synthetic user logs to identify off-hours logins, data exfiltration bursts, and privilege tampering.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '16px'
          }}>
            <a
              href="#activity-log-stream"
              className="btn btn-primary btn-small"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('activity-log-stream')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              ↓ JUMP TO USER ACTIVITY LOG STREAM
            </a>

            <a
              href="#threat-radar"
              className="btn btn-secondary btn-small"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('threat-radar')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              ↓ JUMP TO ACTIVE THREATS
            </a>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: backendConnected ? 'var(--color-success)' : 'var(--color-secondary)'
            }}></span>
            <span className="mono" style={{ fontSize: '11px', fontWeight: 700 }}>
              {backendConnected ? 'ENGINE ONLINE // PORT 8080' : 'BACKEND OFFLINE / CONNECTING...'}
            </span>
          </div>

          <div className="mono" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {timeStr}
          </div>

          <button
            className="btn btn-secondary btn-small"
            onClick={onRefresh}
            disabled={refreshing}
            style={{ marginTop: '4px' }}
          >
            {refreshing ? 'REFRESHING...' : 'SYNC METRICS'}
          </button>
        </div>
      </div>
    </header>
  );
}
