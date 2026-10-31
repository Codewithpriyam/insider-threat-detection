import React, { useState } from 'react';
import { ingestLog } from '../api';

export default function CustomLogModal({ isOpen, onClose, onLogIngested }) {
  const [username, setUsername] = useState('alice.smith');
  const [action, setAction] = useState('LOGIN');
  const [resource, setResource] = useState('/auth/login');
  const [bytesTransferred, setBytesTransferred] = useState(0);
  const [ipAddress, setIpAddress] = useState('192.168.1.50');
  const [status, setStatus] = useState('SUCCESS');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await ingestLog({
        username,
        action,
        resource,
        bytesTransferred: Number(bytesTransferred),
        ipAddress,
        status
      });
      onLogIngested();
      onClose();
    } catch (err) {
      alert(`Error submitting log: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 10, 10, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg)',
        border: '4px solid var(--color-primary)',
        width: '100%',
        maxWidth: '540px',
        padding: '32px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid var(--border-strong)',
          paddingBottom: '12px'
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.1em'
            }}>
              MANUAL FORENSIC ENTRY
            </div>
            <h3 style={{ fontSize: '22px', margin: 0 }}>INGEST ACTIVITY EVENT</h3>
          </div>
          <button
            onClick={onClose}
            className="mono"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px'
            }}>
              USERNAME / SUBJECT IDENTIFIER
            </label>
            <input
              type="text"
              required
              className="voicebox-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px'
              }}>
                EVENT ACTION
              </label>
              <select
                className="voicebox-input"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                style={{ height: '42px' }}
              >
                <option value="LOGIN">LOGIN</option>
                <option value="LOGOUT">LOGOUT</option>
                <option value="FILE_DOWNLOAD">FILE_DOWNLOAD</option>
                <option value="ROLE_CHANGE">ROLE_CHANGE</option>
                <option value="FILE_VIEW">FILE_VIEW</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px'
              }}>
                EVENT STATUS
              </label>
              <select
                className="voicebox-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ height: '42px' }}
              >
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px'
            }}>
              TARGET RESOURCE / PATH
            </label>
            <input
              type="text"
              className="voicebox-input"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              placeholder="e.g., confidential_audit.pdf"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px'
              }}>
                BYTES TRANSFERRED
              </label>
              <input
                type="number"
                className="voicebox-input"
                value={bytesTransferred}
                onChange={(e) => setBytesTransferred(e.target.value)}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px'
              }}>
                SOURCE IP ADDRESS
              </label>
              <input
                type="text"
                className="voicebox-input"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'PROCESSING...' : 'TRIGGER HEURISTIC ENGINE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
