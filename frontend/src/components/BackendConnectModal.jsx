import React, { useState, useEffect } from 'react';
import { getCustomApiUrl, setCustomApiUrl, testBackendConnection } from '../api';

export default function BackendConnectModal({ isOpen, onClose, onConnected }) {
  const [urlInput, setUrlInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setUrlInput(getCustomApiUrl());
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndConnect = async (e) => {
    e.preventDefault();
    if (!urlInput || !urlInput.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a tunnel or cloud backend URL.' });
      return;
    }

    try {
      setTesting(true);
      setStatusMessage({ type: 'info', text: 'Testing handshake with backend API...' });
      
      const stats = await testBackendConnection(urlInput);
      setCustomApiUrl(urlInput);
      setStatusMessage({
        type: 'success',
        text: `Connected! Backend responded (Analyzed ${stats.totalLogs} logs, ${stats.totalUsers} identities).`
      });

      setTimeout(() => {
        if (onConnected) onConnected();
        onClose();
      }, 1200);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `Connection failed: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = () => {
    setCustomApiUrl('');
    setUrlInput('');
    setStatusMessage({
      type: 'info',
      text: 'Switched to in-browser standalone SOC engine.'
    });
    setTimeout(() => {
      if (onConnected) onConnected();
      onClose();
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 10, 10, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg)',
        border: '3px solid var(--border-strong)',
        maxWidth: '560px',
        width: '100%',
        padding: '32px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid var(--border-subtle)',
          paddingBottom: '14px',
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
              SOC GATEWAY CONFIGURATION
            </div>
            <h2 style={{ fontSize: '22px', margin: '4px 0 0 0' }}>
              CONNECT PC BACKEND TUNNEL
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* Quick Instructions */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--border-subtle)',
          padding: '12px 16px',
          fontSize: '12px',
          marginBottom: '20px',
          lineHeight: 1.6
        }}>
          <strong>Quick Setup from your PC:</strong>
          <ol style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
            <li>Run Spring Boot: <code style={{ backgroundColor: '#222', color: '#fff', padding: '1px 5px' }}>mvn spring-boot:run</code></li>
            <li>Run Tunnel: <code style={{ backgroundColor: '#222', color: '#fff', padding: '1px 5px' }}>start-tunnel.bat</code> (or <code style={{ backgroundColor: '#222', color: '#fff', padding: '1px 5px' }}>npx localtunnel --port 8080</code>)</li>
            <li>Paste the generated <code style={{ color: 'var(--color-secondary)' }}>https://...</code> URL below.</li>
          </ol>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTestAndConnect}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '6px',
              letterSpacing: '0.05em'
            }}>
              LIVE BACKEND / TUNNEL URL
            </label>
            <input
              type="url"
              className="voicebox-input"
              placeholder="e.g. https://cold-lemons-trade.loca.lt"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
              required
            />
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Must start with <strong>https://</strong> to comply with browser SSL security policies on GitHub Pages.
            </div>
          </div>

          {/* Feedback banner */}
          {statusMessage && (
            <div style={{
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '12px',
              border: statusMessage.type === 'error'
                ? '1px solid var(--color-secondary)'
                : statusMessage.type === 'success'
                  ? '1px solid var(--color-success)'
                  : '1px solid var(--border-subtle)',
              backgroundColor: statusMessage.type === 'error'
                ? 'rgba(239, 68, 68, 0.1)'
                : statusMessage.type === 'success'
                  ? 'rgba(22, 163, 74, 0.1)'
                  : 'var(--color-surface)',
              color: statusMessage.type === 'error'
                ? 'var(--color-secondary)'
                : statusMessage.type === 'success'
                  ? 'var(--color-success)'
                  : 'var(--color-text-primary)'
            }}>
              {statusMessage.text}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={handleDisconnect}
            >
              DISCONNECT / DEMO MODE
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={onClose}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-small"
                disabled={testing}
              >
                {testing ? 'TESTING...' : 'TEST & CONNECT'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

