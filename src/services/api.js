// src/services/api.js


// Base URL comes from your environment or defaults to root
export const API_BASE = process.env.REACT_APP_API_BASE || '/';


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
export async function plantion() {
  const res = await fetch(
    `${API_BASE}bedrijflocatie/plantion`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();         // zip als blob
}

