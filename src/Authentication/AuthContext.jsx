import React, { createContext, useContext, useState } from "react";
import { saveToken, clearToken, getToken } from "../services/Auth";
import { jwtDecode } from "jwt-decode";

/* ------------------------------------------------------------------ */
/* Context boilerplate                                                */
/* ------------------------------------------------------------------ */
const AuthCtx = createContext({
  auth:   null,    // { token, role }  of null
  setToken: () => {},
  logout : () => {},
});

/* Helper: haal role uit JWT ---------------------------------------- */
const extractRole = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token).role ?? null;
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------ */
/* Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }) {
  const startToken = getToken();
  const [token, _setToken] = useState(startToken);
  const [role , setRole ]  = useState(extractRole(startToken));

  /* samengevoegd object */
  const auth = token ? { token, role } : null;

  const setToken = (t) => {
    if (t) saveToken(t);
    else   clearToken();

    _setToken(t);
    setRole(extractRole(t));
  };

  const logout = () => setToken(null);

  return (
    <AuthCtx.Provider value={{ auth, setToken, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

/* Convenience hook */
export const useAuth = () => useContext(AuthCtx);
