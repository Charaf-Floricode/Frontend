// util helpers to keep all token plumbing in one place
const STORAGE_KEY = "floricode_token";

export function saveToken(token) {
  localStorage.setItem(STORAGE_KEY, token);
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEY) || null;
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}
