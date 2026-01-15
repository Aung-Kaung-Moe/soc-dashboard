const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      // Optional: if you want audit/patch later
      "x-user-id": localStorage.getItem("actorUserId") || ""
    }
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}
