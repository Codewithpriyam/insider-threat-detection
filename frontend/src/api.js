const API_BASE = 'http://localhost:8080/api';

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function fetchThreats(status, severity) {
  let url = `${API_BASE}/threats?`;
  if (status && status !== 'ALL') url += `status=${status}&`;
  if (severity && severity !== 'ALL') url += `severity=${severity}&`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch threats');
  return res.json();
}

export async function resolveThreat(id) {
  const res = await fetch(`${API_BASE}/threats/${id}/resolve?status=RESOLVED`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to resolve threat');
  return res.json();
}

export async function fetchLogs(action, status, search, page = 0, size = 15) {
  let url = `${API_BASE}/logs?page=${page}&size=${size}`;
  if (action && action !== 'ALL') url += `&action=${action}`;
  if (status && status !== 'ALL') url += `&status=${status}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function ingestLog(logData) {
  const res = await fetch(`${API_BASE}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData)
  });
  if (!res.ok) throw new Error('Failed to ingest log');
  return res.json();
}

export async function uploadCsvLogs(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/logs/upload-csv`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload log file');
  return res.json();
}

export async function simulateAttack(type, username) {
  let url = `${API_BASE}/simulate/${type}`;
  if (username) url += `?username=${encodeURIComponent(username)}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Simulation ${type} failed`);
  return res.json();
}

export async function resetSystem() {
  const res = await fetch(`${API_BASE}/simulate/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Reset failed');
  return res.json();
}
