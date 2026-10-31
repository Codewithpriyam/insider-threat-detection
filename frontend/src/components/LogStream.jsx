import React, { useState, useEffect, useRef } from 'react';
import { fetchLogs, uploadCsvLogs } from '../api';

export default function LogStream({ onOpenCustomLogModal, onDataChanged }) {
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const actions = ['ALL', 'LOGIN', 'FILE_DOWNLOAD', 'ROLE_CHANGE', 'FILE_VIEW', 'LOGOUT'];

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchLogs(actionFilter, statusFilter, searchTerm, currentPage, 15);
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter, statusFilter, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadLogs();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadCsvLogs(file);
      alert(`SCAN COMPLETE: Ingested ${res.totalIngested} logs from ${file.name}. Threat radar updated!`);
      if (onDataChanged) onDataChanged();
      loadLogs();
    } catch (err) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLoadSampleCsv = async () => {
    try {
      setUploading(true);
      const response = await fetch('./sample_threat_logs.csv');
      if (!response.ok) throw new Error('Could not load sample_threat_logs.csv from public directory');
      const blob = await response.blob();
      const file = new File([blob], 'sample_threat_logs.csv', { type: 'text/csv' });
      const res = await uploadCsvLogs(file);
      alert(`SCAN COMPLETE: Ingested ${res.totalIngested} benchmark logs from sample_threat_logs.csv. Threat radar updated!`);
      if (onDataChanged) onDataChanged();
      loadLogs();
    } catch (err) {
      alert(`Error loading sample CSV: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '—';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  return (
    <div id="activity-log-stream" style={{ marginBottom: '40px', scrollMarginTop: '24px' }}>
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
            RAW AUDIT TRAIL & LOG INGESTION
          </div>
          <h2 style={{ fontSize: '26px', margin: '4px 0 0 0' }}>
            USER ACTIVITY LOG STREAM
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <input
            type="file"
            accept=".csv,.txt"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <button
            className="btn btn-secondary btn-small"
            onClick={handleLoadSampleCsv}
            disabled={uploading}
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-primary)' }}
          >
            {uploading ? 'LOADING BENCHMARK...' : '⚡ AUTO-INGEST SAMPLE CSV'}
          </button>

          <button
            className="btn btn-secondary btn-small"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'SCANNING LOGS...' : '⬆ UPLOAD CSV'}
          </button>

          <a
            href="./sample_threat_logs.csv"
            download="sample_threat_logs.csv"
            className="btn btn-secondary btn-small"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            ⬇ GET CSV
          </a>

          <button
            className="btn btn-primary btn-small"
            onClick={onOpenCustomLogModal}
          >
            + INGEST EVENT
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '16px',
        alignItems: 'center'
      }}>
        {/* Action Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {actions.map(act => (
            <button
              key={act}
              className={`filter-chip ${actionFilter === act ? 'active' : ''}`}
              onClick={() => {
                setActionFilter(act);
                setCurrentPage(0);
              }}
            >
              {act}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', minWidth: '300px' }}>
          <input
            type="text"
            className="voicebox-input"
            placeholder="FILTER USER, IP, RESOURCE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-small">
            FILTER
          </button>
        </form>
      </div>

      {/* Table */}
      <div style={{
        border: '2px solid var(--border-strong)',
        overflowX: 'auto',
        backgroundColor: 'var(--color-bg)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-tertiary)',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              <th style={{ padding: '12px 14px' }}>TIMESTAMP</th>
              <th style={{ padding: '12px 14px' }}>USER</th>
              <th style={{ padding: '12px 14px' }}>ACTION</th>
              <th style={{ padding: '12px 14px' }}>TARGET RESOURCE</th>
              <th style={{ padding: '12px 14px' }}>BYTES</th>
              <th style={{ padding: '12px 14px' }}>SOURCE IP</th>
              <th style={{ padding: '12px 14px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody className="mono" style={{ fontSize: '12px' }}>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center' }}>
                  FETCHING ACTIVITY LOGS...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  NO ACTIVITY LOGS FOUND MATCHING ACTIVE FILTER
                </td>
              </tr>
            ) : (
              logs.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: idx % 2 === 0 ? 'var(--color-bg)' : 'var(--color-surface)'
                  }}
                >
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>
                    {item.username}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontWeight: 700,
                      color: item.action === 'ROLE_CHANGE' ? 'var(--color-secondary)' : 'var(--color-text-primary)'
                    }}>
                      {item.action}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', maxWidth: '280px', wordBreak: 'break-all' }}>
                    {item.resource || '—'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {formatBytes(item.bytesTransferred)}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {item.ipAddress}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`chip ${item.status === 'SUCCESS' ? 'chip-low' : 'chip-critical'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        marginTop: '8px'
      }}>
        <span className="mono" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          PAGE {currentPage + 1} OF {Math.max(totalPages, 1)}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-small"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          >
            &lt; PREVIOUS
          </button>
          <button
            className="btn btn-secondary btn-small"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            NEXT &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
