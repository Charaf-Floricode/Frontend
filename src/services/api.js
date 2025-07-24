// src/services/api.js
import axios from "axios";
import { getToken } from "./Auth";
// Base URL comes from your environment or defaults to root
export const API_BASE = process.env.REACT_APP_API_BASE || '/';

export function authFetch(path, options = {}) {
  const token = getToken();                   // JWT uit storage

  // Combineer headers netjes: bestaande + Authorization (indien token)
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${API_BASE}${path}`, { ...options, headers });
}
// Health check
export async function fetchHealth() {
  const res = await fetch(`${API_BASE}health`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Import Excel
export async function runImport() {
  const res = await fetch(`${API_BASE}import/import-excel`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Run Access Export
export async function runAccess() {
  const res = await fetch(`${API_BASE}access/run-access`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function bioCertificate() {
  const res = await fetch(`${API_BASE}biocertificate/scraper`, {
    method: 'POST'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  // ---- NEW: return both blob and headers
  const blob = await res.blob();
  return { blob, headers: res.headers };
}

export async function downloadCoderingen() {
  const res = await fetch(
    `${API_BASE}bedrijflocatie/rfh`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();         // zip als blob
}
export async function runPlantion() {
  const res = await fetch(`${API_BASE}bedrijflocatie/plantion`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function downloadPlantion() {
  const res = await fetch(`${API_BASE}bedrijflocatie/plantion/download`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();          // Excel-blob
}
export async function downloadEdibulb() {
  const res = await fetch(`${API_BASE}bedrijflocatie/edibulb`,{
    method: "POST",
});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();          // Excel-blob
}
export async function fetchOmzetData() {
  const res = await authFetch("omzet/data");        // ← authFetch!
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---------- AUTH ENDPOINTS ----------
export async function loginJwt({ username, password }) {
  const res = await fetch(`${API_BASE}auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  const { access_token } = await res.json();
  return access_token;
}

export async function fetchInternStatus() {
  const res = await authFetch("intern/status");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();           // { color, per_task, tasks }
}