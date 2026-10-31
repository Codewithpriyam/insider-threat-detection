import React, { useState } from 'react';
import { simulateAttack, resetSystem } from '../api';

export default function SimulatorBar({ onSimulationComplete }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleSimulate = async (type, label) => {
    try {
      setLoadingAction(type);
      const res = await simulateAttack(type);
      setToastMessage({
        type: 'success',
        text: `ATTACK SIMULATED: ${res.message}. Generated ${res.logsGenerated} event(s) and triggered ${res.alertsTriggered?.length || 0} alert(s).`
      });
      onSimulationComplete();
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: `Simulation failed: ${err.message}`
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReset = async () => {
    try {
      setLoadingAction('reset');
      await resetSystem();
      setToastMessage({
        type: 'info',
        text: 'SYSTEM RESET: Log history and threat alerts purged. Re-seeded standard baseline logs.'
      });
      onSimulationComplete();
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: `Reset failed: ${err.message}`
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      border: '2px solid var(--border-strong)',
      padding: '24px',
      marginBottom: '32px'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px'
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
            EVALUATION & DEMO CONTROL
          </div>
          <h2 style={{ fontSize: '22px', margin: '4px 0 0 0' }}>
            SYNTHETIC ATTACK SIMULATOR
          </h2>
        </div>

        <button
          className="btn btn-secondary btn-small"
          onClick={handleReset}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'reset' ? 'RESETTING...' : 'RESET SYSTEM BASELINE'}
        </button>
      </div>

      <p style={{
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        marginBottom: '16px'
      }}>
        Inject pre-configured synthetic breach patterns to test real-time detection heuristic algorithms:
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          className="btn btn-primary"
          onClick={() => handleSimulate('unusual-access', 'Unusual Access')}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'unusual-access' ? 'INJECTING...' : '1. INJECT: UNUSUAL OFF-HOURS ACCESS'}
        </button>

        <button
          className="btn btn-primary"
          onClick={() => handleSimulate('excessive-download', 'Excessive Download')}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'excessive-download' ? 'INJECTING...' : '2. INJECT: MASS DATA EXFILTRATION'}
        </button>

        <button
          className="btn btn-primary"
          onClick={() => handleSimulate('privilege-escalation', 'Privilege Escalation')}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'privilege-escalation' ? 'INJECTING...' : '3. INJECT: PRIVILEGE ESCALATION'}
        </button>
      </div>

      {toastMessage && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: 'var(--color-bg)',
          borderLeft: toastMessage.type === 'error' ? '4px solid var(--color-secondary)' : '4px solid var(--border-strong)',
          borderTop: '1px solid var(--border-subtle)',
          borderRight: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span className="mono" style={{ fontSize: '12px', fontWeight: 700 }}>
            {toastMessage.text}
          </span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            [X]
          </button>
        </div>
      )}
    </div>
  );
}
