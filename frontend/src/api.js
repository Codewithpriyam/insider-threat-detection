// Configuration & API Layer with Automatic In-Browser Fallback for Live Web Deployments (GitHub Pages)
const DEFAULT_LOCAL_API = 'http://localhost:8080/api';
const ENV_API = import.meta.env.VITE_API_BASE_URL;
const CUSTOM_API_KEY = 'insider_threat_custom_api_url_v1';

export function getCustomApiUrl() {
  try {
    return localStorage.getItem(CUSTOM_API_KEY) || '';
  } catch (err) {
    return '';
  }
}

export function setCustomApiUrl(url) {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem(CUSTOM_API_KEY);
    } else {
      let clean = url.trim().replace(/\/+$/, '');
      if (!clean.endsWith('/api')) {
        clean = `${clean}/api`;
      }
      localStorage.setItem(CUSTOM_API_KEY, clean);
    }
  } catch (err) {
    console.warn('Could not store custom API URL:', err);
  }
}

export function getEffectiveApiBase() {
  const custom = getCustomApiUrl();
  if (custom) return custom;
  return ENV_API || DEFAULT_LOCAL_API;
}

// Tunnel headers to prevent warning interstitial screens (e.g. localtunnel / ngrok)
const TUNNEL_HEADERS = {
  'Bypass-Tunnel-Reminder': 'true',
  'ngrok-skip-browser-warning': 'true'
};

// Mode tracking: 'live' when connected to Spring Boot backend, 'demo' when running in-browser
let activeEngineMode = 'demo';

export function getEngineMode() {
  return activeEngineMode;
}

// Check if browser environment can safely contact backend
function canReachBackend() {
  if (typeof window === 'undefined') return false;
  
  const effectiveBase = getEffectiveApiBase();
  const isHttps = window.location.protocol === 'https:';

  // Mixed Content Prevention:
  // If frontend is hosted over HTTPS (e.g. https://codewithpriyam.github.io)
  // and the API URL is unencrypted HTTP (http://...),
  // browsers strictly block the request with "Failed to fetch".
  if (effectiveBase.startsWith('https://')) {
    return true; // Secure HTTPS tunnel or cloud host
  }

  if (isHttps && effectiveBase.startsWith('http://')) {
    return false; // Insecure mixed content blocked by browser
  }

  // Both are HTTP (e.g. local development on http://localhost:5173)
  return true;
}

export async function testBackendConnection(rawUrl) {
  if (!rawUrl || !rawUrl.trim()) {
    throw new Error('Please enter a valid backend or tunnel URL');
  }

  let clean = rawUrl.trim().replace(/\/+$/, '');
  if (!clean.endsWith('/api')) {
    clean = `${clean}/api`;
  }

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  if (isHttps && clean.startsWith('http://')) {
    throw new Error('Mixed Content Error: Live website is HTTPS, so your tunnel URL must start with https://');
  }

  const res = await fetch(`${clean}/dashboard/stats`, {
    headers: TUNNEL_HEADERS
  });

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
  }

  return await res.json();
}

// -------------------------------------------------------------
// In-Browser Client SOC Engine (State & Heuristics)
// -------------------------------------------------------------

const STORAGE_KEY = 'insider_threat_soc_radar_v2';

const INITIAL_USERS = [
  'david.kim',
  'elena.rostova',
  'marcus.vance',
  'alice.smith',
  'bob.jones',
  'carol.white',
  'frank.miller',
  'grace.hopper',
  'henry.ford',
  'isabel.torres',
  'jack.sparrow',
  'karen.page',
  'lucas.gray',
  'nadia.ali',
  'oscar.wild',
  'priya.patel',
  'quinn.fabray',
  'robert.lang',
  'sarah.connor',
  'trevor.noah'
];

function getInitialBaselineState() {
  const now = Date.now();
  const minute = 60 * 1000;

  const logs = [
    {
      id: 1,
      userId: 1,
      username: 'david.kim',
      action: 'ROLE_CHANGE',
      resource: '/admin/iam/assign-roles?grant=ROLE_ADMIN',
      bytesTransferred: 4096,
      ipAddress: '10.10.2.18',
      status: 'SUCCESS',
      timestamp: new Date(now - 4 * minute).toISOString()
    },
    {
      id: 2,
      userId: 2,
      username: 'elena.rostova',
      action: 'FILE_DOWNLOAD',
      resource: '/restricted/vault/customer_ssn_database_dump.sql',
      bytesTransferred: 48000000,
      ipAddress: '10.10.4.50',
      status: 'SUCCESS',
      timestamp: new Date(now - 7 * minute).toISOString()
    },
    {
      id: 3,
      userId: 2,
      username: 'elena.rostova',
      action: 'FILE_DOWNLOAD',
      resource: '/restricted/vault/core_platform_private_rsa_key.pem',
      bytesTransferred: 35000000,
      ipAddress: '10.10.4.50',
      status: 'SUCCESS',
      timestamp: new Date(now - 8 * minute).toISOString()
    },
    {
      id: 4,
      userId: 2,
      username: 'elena.rostova',
      action: 'FILE_DOWNLOAD',
      resource: '/restricted/vault/proprietary_neural_net_weights.bin',
      bytesTransferred: 84000000,
      ipAddress: '10.10.4.50',
      status: 'SUCCESS',
      timestamp: new Date(now - 9 * minute).toISOString()
    },
    {
      id: 5,
      userId: 2,
      username: 'elena.rostova',
      action: 'FILE_DOWNLOAD',
      resource: '/restricted/vault/merger_acquisition_target_list.pdf',
      bytesTransferred: 28000000,
      ipAddress: '10.10.4.50',
      status: 'SUCCESS',
      timestamp: new Date(now - 10 * minute).toISOString()
    },
    {
      id: 6,
      userId: 3,
      username: 'marcus.vance',
      action: 'LOGIN',
      resource: '/auth/login',
      bytesTransferred: 0,
      ipAddress: '198.51.100.89',
      status: 'SUCCESS',
      timestamp: new Date(now - 14 * minute).toISOString()
    },
    {
      id: 7,
      userId: 3,
      username: 'marcus.vance',
      action: 'LOGIN',
      resource: '/auth/login',
      bytesTransferred: 0,
      ipAddress: '198.51.100.89',
      status: 'FAILED',
      timestamp: new Date(now - 15 * minute).toISOString()
    },
    {
      id: 8,
      userId: 3,
      username: 'marcus.vance',
      action: 'LOGIN',
      resource: '/auth/login',
      bytesTransferred: 0,
      ipAddress: '198.51.100.89',
      status: 'FAILED',
      timestamp: new Date(now - 16 * minute).toISOString()
    },
    {
      id: 9,
      userId: 3,
      username: 'marcus.vance',
      action: 'LOGIN',
      resource: '/auth/login',
      bytesTransferred: 0,
      ipAddress: '198.51.100.89',
      status: 'FAILED',
      timestamp: new Date(now - 17 * minute).toISOString()
    },
    {
      id: 10,
      userId: 3,
      username: 'marcus.vance',
      action: 'LOGIN',
      resource: '/auth/login',
      bytesTransferred: 0,
      ipAddress: '198.51.100.89',
      status: 'FAILED',
      timestamp: new Date(now - 18 * minute).toISOString()
    },
    {
      id: 11,
      userId: 4,
      username: 'alice.smith',
      action: 'LOGIN',
      resource: '/auth/login',
      bytesTransferred: 0,
      ipAddress: '198.51.100.12',
      status: 'SUCCESS',
      timestamp: new Date(now - 28 * minute).toISOString()
    },
    {
      id: 12,
      userId: 4,
      username: 'alice.smith',
      action: 'FILE_VIEW',
      resource: '/hr/employee_handbook_2026.pdf',
      bytesTransferred: 1450000,
      ipAddress: '192.168.1.15',
      status: 'SUCCESS',
      timestamp: new Date(now - 32 * minute).toISOString()
    },
    {
      id: 13,
      userId: 5,
      username: 'bob.jones',
      action: 'FILE_DOWNLOAD',
      resource: '/git/repo/frontend-ui/manifest.json',
      bytesTransferred: 124000,
      ipAddress: '192.168.1.20',
      status: 'SUCCESS',
      timestamp: new Date(now - 40 * minute).toISOString()
    },
    {
      id: 14,
      userId: 6,
      username: 'carol.white',
      action: 'FILE_DOWNLOAD',
      resource: '/marketing/brand_guidelines_q1.pdf',
      bytesTransferred: 4200000,
      ipAddress: '192.168.1.33',
      status: 'SUCCESS',
      timestamp: new Date(now - 45 * minute).toISOString()
    },
    {
      id: 15,
      userId: 7,
      username: 'frank.miller',
      action: 'LOGIN',
      resource: '/auth/login',
      bytesTransferred: 0,
      ipAddress: '192.168.1.45',
      status: 'SUCCESS',
      timestamp: new Date(now - 50 * minute).toISOString()
    },
    {
      id: 16,
      userId: 7,
      username: 'frank.miller',
      action: 'PAGE_VIEW',
      resource: '/sales/crm/client_contact_directory',
      bytesTransferred: 450000,
      ipAddress: '192.168.1.45',
      status: 'SUCCESS',
      timestamp: new Date(now - 55 * minute).toISOString()
    },
    {
      id: 17,
      userId: 8,
      username: 'grace.hopper',
      action: 'FILE_VIEW',
      resource: '/operations/inventory_status_report.pdf',
      bytesTransferred: 2100000,
      ipAddress: '192.168.1.52',
      status: 'SUCCESS',
      timestamp: new Date(now - 60 * minute).toISOString()
    },
    {
      id: 18,
      userId: 8,
      username: 'grace.hopper',
      action: 'PAGE_VIEW',
      resource: '/jira/boards/sprint-42',
      bytesTransferred: 640000,
      ipAddress: '192.168.1.52',
      status: 'SUCCESS',
      timestamp: new Date(now - 65 * minute).toISOString()
    },
    {
      id: 19,
      userId: 9,
      username: 'henry.ford',
      action: 'FILE_DOWNLOAD',
      resource: '/legal/standard_nda_template_v3.docx',
      bytesTransferred: 340000,
      ipAddress: '192.168.1.60',
      status: 'SUCCESS',
      timestamp: new Date(now - 70 * minute).toISOString()
    },
    {
      id: 20,
      userId: 10,
      username: 'isabel.torres',
      action: 'FILE_VIEW',
      resource: '/marketing/social_media_schedule.xlsx',
      bytesTransferred: 980000,
      ipAddress: '192.168.1.71',
      status: 'SUCCESS',
      timestamp: new Date(now - 75 * minute).toISOString()
    },
    {
      id: 21,
      userId: 11,
      username: 'jack.sparrow',
      action: 'FILE_VIEW',
      resource: '/finance/monthly_expense_template.xlsx',
      bytesTransferred: 1200000,
      ipAddress: '192.168.1.84',
      status: 'SUCCESS',
      timestamp: new Date(now - 80 * minute).toISOString()
    },
    {
      id: 22,
      userId: 12,
      username: 'karen.page',
      action: 'PAGE_VIEW',
      resource: '/sales/crm/client_contact_directory',
      bytesTransferred: 450000,
      ipAddress: '192.168.1.92',
      status: 'SUCCESS',
      timestamp: new Date(now - 85 * minute).toISOString()
    },
    {
      id: 23,
      userId: 13,
      username: 'lucas.gray',
      action: 'FILE_VIEW',
      resource: '/operations/inventory_status_report.pdf',
      bytesTransferred: 2100000,
      ipAddress: '192.168.1.103',
      status: 'SUCCESS',
      timestamp: new Date(now - 90 * minute).toISOString()
    },
    {
      id: 24,
      userId: 14,
      username: 'nadia.ali',
      action: 'PAGE_VIEW',
      resource: '/support/knowledgebase/ticket_faq.html',
      bytesTransferred: 180000,
      ipAddress: '192.168.1.115',
      status: 'SUCCESS',
      timestamp: new Date(now - 95 * minute).toISOString()
    },
    {
      id: 25,
      userId: 15,
      username: 'oscar.wild',
      action: 'FILE_DOWNLOAD',
      resource: '/design/figma_design_system_tokens.json',
      bytesTransferred: 880000,
      ipAddress: '192.168.1.122',
      status: 'SUCCESS',
      timestamp: new Date(now - 100 * minute).toISOString()
    },
    {
      id: 26,
      userId: 16,
      username: 'priya.patel',
      action: 'LOGIN',
      resource: '/auth/login',
      bytesTransferred: 0,
      ipAddress: '10.10.3.40',
      status: 'SUCCESS',
      timestamp: new Date(now - 105 * minute).toISOString()
    },
    {
      id: 27,
      userId: 17,
      username: 'quinn.fabray',
      action: 'LOGOUT',
      resource: '/auth/logout',
      bytesTransferred: 0,
      ipAddress: '192.168.1.135',
      status: 'SUCCESS',
      timestamp: new Date(now - 110 * minute).toISOString()
    },
    {
      id: 28,
      userId: 18,
      username: 'robert.lang',
      action: 'FILE_VIEW',
      resource: '/hr/employee_handbook_2026.pdf',
      bytesTransferred: 1450000,
      ipAddress: '192.168.1.144',
      status: 'FAILED',
      timestamp: new Date(now - 115 * minute).toISOString()
    },
    {
      id: 29,
      userId: 19,
      username: 'sarah.connor',
      action: 'PAGE_VIEW',
      resource: '/admin/security-audit-logs',
      bytesTransferred: 320000,
      ipAddress: '10.10.1.5',
      status: 'SUCCESS',
      timestamp: new Date(now - 120 * minute).toISOString()
    },
    {
      id: 30,
      userId: 20,
      username: 'trevor.noah',
      action: 'FILE_VIEW',
      resource: '/git/repo/platform-core/pull/314',
      bytesTransferred: 850000,
      ipAddress: '192.168.1.155',
      status: 'SUCCESS',
      timestamp: new Date(now - 125 * minute).toISOString()
    }
  ];

  const alerts = [
    {
      id: 101,
      userId: 1,
      username: 'david.kim',
      threatType: 'PRIVILEGE_ESCALATION',
      severity: 'CRITICAL',
      description: "Critical privilege change triggered by 'david.kim' on resource '/admin/iam/assign-roles?grant=ROLE_ADMIN' (IP: 10.10.2.18) without dual-authorization signature.",
      evidenceLogId: 1,
      detectedAt: new Date(now - 4 * minute).toISOString(),
      status: 'OPEN'
    },
    {
      id: 102,
      userId: 2,
      username: 'elena.rostova',
      threatType: 'EXCESSIVE_DOWNLOAD',
      severity: 'HIGH',
      description: "Data exfiltration anomaly: User 'elena.rostova' downloaded 4 confidential vault files (195.0 MB) within 10 minutes. Resource target: /restricted/vault/proprietary_neural_net_weights.bin.",
      evidenceLogId: 4,
      detectedAt: new Date(now - 7 * minute).toISOString(),
      status: 'OPEN'
    },
    {
      id: 103,
      userId: 3,
      username: 'marcus.vance',
      threatType: 'UNUSUAL_ACCESS',
      severity: 'HIGH',
      description: "Brute force pattern detected for user 'marcus.vance': 4 failed logins in past 10 mins from IP 198.51.100.89. Latest status: SUCCESS.",
      evidenceLogId: 6,
      detectedAt: new Date(now - 14 * minute).toISOString(),
      status: 'OPEN'
    },
    {
      id: 104,
      userId: 4,
      username: 'alice.smith',
      threatType: 'UNUSUAL_ACCESS',
      severity: 'MEDIUM',
      description: "Off-hours session initiated by user 'alice.smith' at 02:44:12 UTC from IP 198.51.100.12 (Outside normal corporate operating hours). Analyst Note: Verified planned overseas emergency migration.",
      evidenceLogId: 11,
      detectedAt: new Date(now - 28 * minute).toISOString(),
      status: 'RESOLVED'
    }
  ];

  return {
    logs,
    alerts,
    users: [...INITIAL_USERS]
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read from localStorage:', err);
  }
  const initial = getInitialBaselineState();
  saveState(initial);
  return initial;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

// -------------------------------------------------------------
// Behavioral Threat Detection Heuristics
// -------------------------------------------------------------

function runThreatHeuristics(log, recentLogs) {
  const triggered = [];
  const logTime = new Date(log.timestamp || Date.now());
  const tenMinutesAgo = new Date(logTime.getTime() - 10 * 60 * 1000);

  // 1. Unusual Access / Brute Force
  if (log.action === 'LOGIN') {
    const hour = logTime.getHours();
    const isOffHours = hour >= 23 || hour < 5;

    const failedAttempts = recentLogs.filter(l =>
      l.username === log.username &&
      l.action === 'LOGIN' &&
      l.status === 'FAILED' &&
      new Date(l.timestamp) >= tenMinutesAgo &&
      new Date(l.timestamp) <= logTime
    ).length;

    if (failedAttempts >= 3) {
      const isSuccess = log.status === 'SUCCESS';
      triggered.push({
        id: Date.now() + Math.floor(Math.random() * 10000),
        userId: log.userId || null,
        username: log.username,
        threatType: 'UNUSUAL_ACCESS',
        severity: isSuccess ? 'HIGH' : 'MEDIUM',
        description: `Brute force pattern detected for user '${log.username}': ${failedAttempts} failed logins in past 10 mins from IP ${log.ipAddress}. Latest status: ${log.status}.`,
        evidenceLogId: log.id,
        detectedAt: log.timestamp,
        status: 'OPEN'
      });
    } else if (isOffHours && log.status === 'SUCCESS') {
      const timeStr = logTime.toTimeString().split(' ')[0];
      triggered.push({
        id: Date.now() + Math.floor(Math.random() * 10000),
        userId: log.userId || null,
        username: log.username,
        threatType: 'UNUSUAL_ACCESS',
        severity: 'MEDIUM',
        description: `Off-hours session initiated by user '${log.username}' at ${timeStr} from IP ${log.ipAddress} (Outside normal corporate operating hours).`,
        evidenceLogId: log.id,
        detectedAt: log.timestamp,
        status: 'OPEN'
      });
    }
  }

  // 2. Excessive Downloads (Mass Data Exfiltration)
  if (log.action === 'FILE_DOWNLOAD') {
    const recentDownloads = recentLogs.filter(l =>
      l.username === log.username &&
      l.action === 'FILE_DOWNLOAD' &&
      new Date(l.timestamp) >= tenMinutesAgo &&
      new Date(l.timestamp) <= logTime
    );

    const recentCount = recentDownloads.length;
    const totalBytes = recentDownloads.reduce((sum, l) => sum + (Number(l.bytesTransferred) || 0), 0);
    const DOWNLOAD_COUNT_THRESHOLD = 10;
    const DOWNLOAD_BYTE_THRESHOLD = 150 * 1024 * 1024; // 150 MB

    if (recentCount >= DOWNLOAD_COUNT_THRESHOLD || totalBytes >= DOWNLOAD_BYTE_THRESHOLD) {
      const mbTransferred = (totalBytes / (1024 * 1024)).toFixed(1);
      triggered.push({
        id: Date.now() + Math.floor(Math.random() * 10000),
        userId: log.userId || null,
        username: log.username,
        threatType: 'EXCESSIVE_DOWNLOAD',
        severity: 'HIGH',
        description: `Data exfiltration anomaly: User '${log.username}' downloaded ${recentCount} files (${mbTransferred} MB) within 10 minutes. Resource target: ${log.resource}.`,
        evidenceLogId: log.id,
        detectedAt: log.timestamp,
        status: 'OPEN'
      });
    }
  }

  // 3. Privilege Escalation
  const isRoleChange = log.action === 'ROLE_CHANGE' || log.action === 'PRIVILEGE_ELEVATION';
  const hasAdminGrant = log.resource && (
    log.resource.toLowerCase().includes('admin_grant') ||
    log.resource.toLowerCase().includes('assign-roles') ||
    log.resource.toLowerCase().includes('promote')
  );

  if (isRoleChange || hasAdminGrant) {
    triggered.push({
      id: Date.now() + Math.floor(Math.random() * 10000),
      userId: log.userId || null,
      username: log.username,
      threatType: 'PRIVILEGE_ESCALATION',
      severity: 'CRITICAL',
      description: `Critical privilege change triggered by '${log.username}' on resource '${log.resource}' (IP: ${log.ipAddress}) without dual-authorization signature.`,
      evidenceLogId: log.id,
      detectedAt: log.timestamp,
      status: 'OPEN'
    });
  }

  return triggered;
}

// -------------------------------------------------------------
// Client Engine Operations
// -------------------------------------------------------------

const clientEngine = {
  getStats: () => {
    const state = loadState();
    const totalLogs = state.logs.length;
    const openAlerts = state.alerts.filter(a => a.status === 'OPEN').length;
    const criticalAlerts = state.alerts.filter(
      a => a.status === 'OPEN' && (a.severity === 'CRITICAL' || a.severity === 'HIGH')
    ).length;

    const uniqueUsers = new Set(state.users);
    state.logs.forEach(l => { if (l.username) uniqueUsers.add(l.username); });

    const threatsByType = {};
    state.alerts.forEach(a => {
      threatsByType[a.threatType] = (threatsByType[a.threatType] || 0) + 1;
    });

    const logsByAction = {};
    state.logs.forEach(l => {
      logsByAction[l.action] = (logsByAction[l.action] || 0) + 1;
    });

    return {
      totalLogs,
      openAlerts,
      criticalAlerts,
      totalUsers: uniqueUsers.size,
      threatsByType,
      logsByAction
    };
  },

  getThreats: (status, severity) => {
    const state = loadState();
    let result = [...state.alerts];

    if (status && status !== 'ALL') {
      result = result.filter(a => a.status?.toUpperCase() === status.toUpperCase());
    }

    if (severity && severity !== 'ALL') {
      result = result.filter(a => a.severity?.toUpperCase() === severity.toUpperCase());
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));
    return result;
  },

  resolveThreat: (id) => {
    const state = loadState();
    const alert = state.alerts.find(a => String(a.id) === String(id));
    if (alert) {
      alert.status = 'RESOLVED';
      saveState(state);
      return alert;
    }
    throw new Error('Threat alert not found');
  },

  getLogs: (action, status, search, page = 0, size = 15) => {
    const state = loadState();
    let result = [...state.logs];

    if (action && action !== 'ALL') {
      result = result.filter(l => l.action?.toUpperCase() === action.toUpperCase());
    }

    if (status && status !== 'ALL') {
      result = result.filter(l => l.status?.toUpperCase() === status.toUpperCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(l =>
        l.username?.toLowerCase().includes(q) ||
        l.ipAddress?.toLowerCase().includes(q) ||
        l.resource?.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalElements = result.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const start = page * size;
    const content = result.slice(start, start + size);

    return {
      content,
      totalPages,
      totalElements,
      size,
      number: page
    };
  },

  ingestLog: (dto) => {
    const state = loadState();
    const newLog = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      userId: null,
      username: dto.username || 'anonymous',
      action: (dto.action || 'UNKNOWN').toUpperCase(),
      resource: dto.resource || '/system',
      bytesTransferred: Number(dto.bytesTransferred) || 0,
      ipAddress: dto.ipAddress || '127.0.0.1',
      status: (dto.status || 'SUCCESS').toUpperCase(),
      timestamp: new Date().toISOString()
    };

    state.logs.push(newLog);
    if (!state.users.includes(newLog.username)) {
      state.users.push(newLog.username);
    }

    const newAlerts = runThreatHeuristics(newLog, state.logs);
    if (newAlerts.length > 0) {
      state.alerts.push(...newAlerts);
    }

    saveState(state);
    return newLog;
  },

  uploadCsv: async (file) => {
    const text = await file.text();
    if (!text || !text.trim()) {
      throw new Error('Uploaded CSV file is empty');
    }

    // Strip UTF-8 BOM if present
    const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
    const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      throw new Error('CSV must contain a header row and at least one log row');
    }

    const firstLine = lines[0];
    let delimiter = ',';
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(';')) delimiter = ';';
    else if (firstLine.includes('|')) delimiter = '|';

    const parseLine = (line) => {
      const values = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values.map(v => v.replace(/^"|"$/g, '').trim());
    };

    const headers = parseLine(firstLine).map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));

    let userIdx = -1;
    let actionIdx = -1;
    let resourceIdx = -1;
    let bytesIdx = -1;
    let ipIdx = -1;
    let statusIdx = -1;

    headers.forEach((h, i) => {
      if (h.includes('user') || h.includes('actor') || h.includes('account')) userIdx = i;
      else if (h.includes('action') || h.includes('activity') || h.includes('event')) actionIdx = i;
      else if (h.includes('resource') || h.includes('file') || h.includes('target') || h.includes('url') || h.includes('path')) resourceIdx = i;
      else if (h.includes('byte') || h.includes('size') || h.includes('length')) bytesIdx = i;
      else if (h.includes('ip') || h.includes('host') || h.includes('addr')) ipIdx = i;
      else if (h.includes('status') || h.includes('result') || h.includes('outcome')) statusIdx = i;
    });

    if (userIdx === -1) userIdx = 0;
    if (actionIdx === -1) actionIdx = Math.min(1, headers.length - 1);
    if (resourceIdx === -1 && headers.length > 2) resourceIdx = 2;
    if (bytesIdx === -1 && headers.length > 3) bytesIdx = 3;
    if (ipIdx === -1 && headers.length > 4) ipIdx = 4;
    if (statusIdx === -1 && headers.length > 5) statusIdx = 5;

    const state = loadState();
    let ingestedCount = 0;
    const baseTime = Date.now() - (lines.length * 1000);

    const newlyTriggeredAlerts = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      if (cols.length <= Math.max(userIdx, actionIdx)) continue;

      const username = cols[userIdx] || 'anonymous';
      const action = (cols[actionIdx] || 'UNKNOWN').toUpperCase();
      const resource = resourceIdx >= 0 && cols[resourceIdx] ? cols[resourceIdx] : '/system';
      const bytesTransferred = bytesIdx >= 0 && cols[bytesIdx] ? parseInt(cols[bytesIdx], 10) || 0 : 0;
      const ipAddress = ipIdx >= 0 && cols[ipIdx] ? cols[ipIdx] : '192.168.1.100';
      const status = (statusIdx >= 0 && cols[statusIdx] ? cols[statusIdx] : 'SUCCESS').toUpperCase();

      if (!username || !action) continue;

      const log = {
        id: Date.now() + i,
        userId: null,
        username,
        action,
        resource,
        bytesTransferred,
        ipAddress,
        status,
        timestamp: new Date(baseTime + i * 1000).toISOString()
      };

      state.logs.push(log);
      if (!state.users.includes(username)) {
        state.users.push(username);
      }
      ingestedCount++;

      const alerts = runThreatHeuristics(log, state.logs);
      for (const a of alerts) {
        // Deduplicate alerts for same user and threatType in same batch
        const existingIdx = newlyTriggeredAlerts.findIndex(
          existing => existing.username === a.username && existing.threatType === a.threatType
        );
        if (existingIdx >= 0) {
          newlyTriggeredAlerts[existingIdx] = a;
        } else {
          newlyTriggeredAlerts.push(a);
        }
      }
    }

    if (newlyTriggeredAlerts.length > 0) {
      state.alerts.push(...newlyTriggeredAlerts);
    }

    saveState(state);

    return {
      totalIngested: ingestedCount,
      message: `Successfully ingested and analyzed ${ingestedCount} logs from file.`
    };
  },

  simulateAttack: (type, targetUsername) => {
    const state = loadState();
    const now = new Date();
    const alertsTriggered = [];
    let logsGenerated = 0;
    let message = '';

    if (type === 'unusual-access') {
      const username = targetUsername || 'marcus.vance';
      for (let i = 4; i >= 1; i--) {
        state.logs.push({
          id: Date.now() + Math.random(),
          userId: null,
          username,
          action: 'LOGIN',
          resource: '/auth/login',
          bytesTransferred: 0,
          ipAddress: '198.51.100.44',
          status: 'FAILED',
          timestamp: new Date(now.getTime() - i * 60 * 1000).toISOString()
        });
      }
      const successLog = {
        id: Date.now() + Math.random(),
        userId: null,
        username,
        action: 'LOGIN',
        resource: '/auth/login',
        bytesTransferred: 0,
        ipAddress: '198.51.100.44',
        status: 'SUCCESS',
        timestamp: now.toISOString()
      };
      state.logs.push(successLog);
      logsGenerated = 5;

      const alert = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        userId: null,
        username,
        threatType: 'UNUSUAL_ACCESS',
        severity: 'HIGH',
        description: `Brute force pattern detected for user '${username}': 4 failed logins in past 10 mins from IP 198.51.100.44. Latest status: SUCCESS.`,
        evidenceLogId: successLog.id,
        detectedAt: now.toISOString(),
        status: 'OPEN'
      };
      state.alerts.push(alert);
      alertsTriggered.push('UNUSUAL_ACCESS');
      message = `Simulated 4 consecutive failed logins and 1 successful anomalous session for ${username}`;
    } else if (type === 'excessive-download') {
      const username = targetUsername || 'elena.rostova';
      const sensitiveFiles = [
        'customer_ssn_database_dump.sql',
        'q3_executive_financial_projections.xlsx',
        'merger_acquisition_target_list.pdf',
        'core_platform_private_key.pem',
        'patent_application_draft_v4.docx',
        'unreleased_model_checkpoint_weights.bin',
        'employee_payroll_records_2026.csv',
        'source_code_master_backup.tar.gz',
        'audit_committee_confidential_minutes.pdf',
        'pci_dss_compliance_exception_report.xlsx',
        'aws_root_access_keys.kdbx',
        'wire_transfer_swift_authorizations.dat'
      ];

      sensitiveFiles.forEach((file, idx) => {
        state.logs.push({
          id: Date.now() + idx,
          userId: null,
          username,
          action: 'FILE_DOWNLOAD',
          resource: `/restricted/vault/${file}`,
          bytesTransferred: 28000000 + (idx * 3000000),
          ipAddress: '10.10.4.50',
          status: 'SUCCESS',
          timestamp: new Date(now.getTime() - (12 - idx) * 30 * 1000).toISOString()
        });
      });
      logsGenerated = sensitiveFiles.length;

      const alert = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        userId: null,
        username,
        threatType: 'EXCESSIVE_DOWNLOAD',
        severity: 'HIGH',
        description: `Data exfiltration anomaly: User '${username}' downloaded 12 files (368.5 MB) within 10 minutes. Resource target: /restricted/vault/wire_transfer_swift_authorizations.dat.`,
        evidenceLogId: state.logs[state.logs.length - 1].id,
        detectedAt: now.toISOString(),
        status: 'OPEN'
      };
      state.alerts.push(alert);
      alertsTriggered.push('EXCESSIVE_DOWNLOAD');
      message = `Simulated 12 rapid confidential file downloads exceeding 300 MB for ${username}`;
    } else if (type === 'privilege-escalation') {
      const username = targetUsername || 'david.kim';
      const privLog = {
        id: Date.now() + Math.random(),
        userId: null,
        username,
        action: 'ROLE_CHANGE',
        resource: '/admin/iam/assign-roles?grant=ROLE_ADMIN',
        bytesTransferred: 1024,
        ipAddress: '10.10.2.15',
        status: 'SUCCESS',
        timestamp: now.toISOString()
      };
      state.logs.push(privLog);
      logsGenerated = 1;

      const alert = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        userId: null,
        username,
        threatType: 'PRIVILEGE_ESCALATION',
        severity: 'CRITICAL',
        description: `Critical privilege change triggered by '${username}' on resource '/admin/iam/assign-roles?grant=ROLE_ADMIN' (IP: 10.10.2.15) without dual-authorization signature.`,
        evidenceLogId: privLog.id,
        detectedAt: now.toISOString(),
        status: 'OPEN'
      };
      state.alerts.push(alert);
      alertsTriggered.push('PRIVILEGE_ESCALATION');
      message = `Simulated unauthorized role escalation to ROLE_ADMIN executed by ${username}`;
    }

    saveState(state);
    return {
      simulationType: type,
      message,
      logsGenerated,
      alertsTriggered
    };
  },

  resetSystem: () => {
    const fresh = getInitialBaselineState();
    saveState(fresh);
    return {
      simulationType: 'SYSTEM_RESET',
      message: 'Cleared all alerts and restored corporate baseline traffic',
      logsGenerated: fresh.logs.length,
      alertsTriggered: []
    };
  }
};

// -------------------------------------------------------------
// Unified Public Export API with Live Fallback
// -------------------------------------------------------------

export async function fetchDashboardStats() {
  if (canReachBackend()) {
    try {
      const base = getEffectiveApiBase();
      const res = await fetch(`${base}/dashboard/stats`, {
        headers: TUNNEL_HEADERS
      });
      if (res.ok) {
        activeEngineMode = 'live';
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, using in-browser demo engine:', err.message);
    }
  }
  activeEngineMode = 'demo';
  return clientEngine.getStats();
}

export async function fetchThreats(status, severity) {
  if (canReachBackend()) {
    try {
      const base = getEffectiveApiBase();
      let url = `${base}/threats?`;
      if (status && status !== 'ALL') url += `status=${status}&`;
      if (severity && severity !== 'ALL') url += `severity=${severity}&`;
      const res = await fetch(url, {
        headers: TUNNEL_HEADERS
      });
      if (res.ok) {
        activeEngineMode = 'live';
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, using in-browser demo engine:', err.message);
    }
  }
  activeEngineMode = 'demo';
  return clientEngine.getThreats(status, severity);
}

export async function resolveThreat(id) {
  if (canReachBackend()) {
    try {
      const base = getEffectiveApiBase();
      const res = await fetch(`${base}/threats/${id}/resolve?status=RESOLVED`, {
        method: 'POST',
        headers: TUNNEL_HEADERS
      });
      if (res.ok) {
        activeEngineMode = 'live';
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, resolving in-browser:', err.message);
    }
  }
  activeEngineMode = 'demo';
  return clientEngine.resolveThreat(id);
}

export async function fetchLogs(action, status, search, page = 0, size = 15) {
  if (canReachBackend()) {
    try {
      const base = getEffectiveApiBase();
      let url = `${base}/logs?page=${page}&size=${size}`;
      if (action && action !== 'ALL') url += `&action=${action}`;
      if (status && status !== 'ALL') url += `&status=${status}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url, {
        headers: TUNNEL_HEADERS
      });
      if (res.ok) {
        activeEngineMode = 'live';
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, using in-browser logs:', err.message);
    }
  }
  activeEngineMode = 'demo';
  return clientEngine.getLogs(action, status, search, page, size);
}

export async function ingestLog(logData) {
  if (canReachBackend()) {
    try {
      const base = getEffectiveApiBase();
      const res = await fetch(`${base}/logs`, {
        method: 'POST',
        headers: {
          ...TUNNEL_HEADERS,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      });
      if (res.ok) {
        activeEngineMode = 'live';
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, ingesting in-browser:', err.message);
    }
  }
  activeEngineMode = 'demo';
  return clientEngine.ingestLog(logData);
}

export async function uploadCsvLogs(file) {
  if (canReachBackend()) {
    try {
      const base = getEffectiveApiBase();
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${base}/logs/upload-csv`, {
        method: 'POST',
        headers: TUNNEL_HEADERS,
        body: formData
      });
      if (res.ok) {
        activeEngineMode = 'live';
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend upload failed, processing in browser:', err.message);
    }
  }
  activeEngineMode = 'demo';
  return await clientEngine.uploadCsv(file);
}

export async function simulateAttack(type, username) {
  if (canReachBackend()) {
    try {
      const base = getEffectiveApiBase();
      let url = `${base}/simulate/${type}`;
      if (username) url += `?username=${encodeURIComponent(username)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: TUNNEL_HEADERS
      });
      if (res.ok) {
        activeEngineMode = 'live';
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, simulating in browser:', err.message);
    }
  }
  activeEngineMode = 'demo';
  return clientEngine.simulateAttack(type, username);
}

export async function resetSystem() {
  if (canReachBackend()) {
    try {
      const base = getEffectiveApiBase();
      const res = await fetch(`${base}/simulate/reset`, {
        method: 'POST',
        headers: TUNNEL_HEADERS
      });
      if (res.ok) {
        activeEngineMode = 'live';
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, resetting in browser:', err.message);
    }
  }
  activeEngineMode = 'demo';
  return clientEngine.resetSystem();
}
