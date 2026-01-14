const API_BASE = ""; // empty because we use Vite proxy

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      // For your actorMiddleware (if you require it for PATCH routes)
      // "x-user-id": "<put-a-real-user-id-here-if-needed>",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  getAlerts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiGet(`/api/alerts${qs ? `?${qs}` : ""}`);
  },
  getLatestLogs: (limit = 200) => apiGet(`/api/logs/latest?limit=${limit}`),
  getAudit: (limit = 50) => apiGet(`/api/audit?limit=${limit}`),
};
