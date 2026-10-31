import React from 'react';

export default function KpiCards({ stats }) {
  const cards = [
    {
      label: 'TOTAL LOGS ANALYZED',
      value: stats?.totalLogs ?? 0,
      subtext: 'Synthetic & Live Ingestion',
      isAlert: false
    },
    {
      label: 'ACTIVE THREAT ALERTS',
      value: stats?.openAlerts ?? 0,
      subtext: 'Unresolved Anomalies',
      isAlert: (stats?.openAlerts ?? 0) > 0
    },
    {
      label: 'CRITICAL / HIGH RISKS',
      value: stats?.criticalAlerts ?? 0,
      subtext: 'Requires Immediate Containment',
      isAlert: (stats?.criticalAlerts ?? 0) > 0
    },
    {
      label: 'MONITORED IDENTITIES',
      value: stats?.totalUsers ?? 0,
      subtext: 'Corporate Directory Profiles',
      isAlert: false
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    }}>
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={card.isAlert ? 'voicebox-card-alert' : 'voicebox-card'}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px'
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-secondary)',
              marginBottom: '8px'
            }}>
              {card.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '44px',
              lineHeight: 1.0,
              color: card.isAlert ? 'var(--color-secondary)' : 'var(--color-primary)'
            }}>
              {card.value}
            </div>
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            marginTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '8px'
          }}>
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}
