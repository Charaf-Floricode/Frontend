// src/Authentication/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import { saveToken, clearToken, getToken } from "../services/Auth";
import { jwtDecode } from "jwt-decode";              // <– named import v4.x+

/* ------------------------------------------------------------------ */
/* Context boilerplate – uitgebreid met 'role'                        */
/* ------------------------------------------------------------------ */
const AuthCtx = createContext({
  token: null,
  role:  null,       // NIEUW
  setToken: () => {},
  logout : () => {},
});

/* ------------------------------------------------------------------ */
/* Helper – haal role uit JWT (null bij ontbreken/fout)               */
/* ------------------------------------------------------------------ */
const extractRole = (token) => {
  if (!token) return null;
  try {
    const { role } = jwtDecode(token);
    return role ?? null;
  } catch {
    return null;     // ongeldig/exp token
  }
};

/* ------------------------------------------------------------------ */
/* Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }) {
  const startToken = getToken();
  const [token, _setToken] = useState(startToken);
  const [role , setRole ]  = useState(extractRole(startToken));

  const setToken = (t) => {
    if (t) saveToken(t);
    else   clearToken();

    _setToken(t);
    setRole(extractRole(t));
  };

  const logout = () => setToken(null);

  return (
    <AuthCtx.Provider value={{ token, role, setToken, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Convenience hook                                                   */
/* ------------------------------------------------------------------ */
export const useAuth = () => useContext(AuthCtx);
