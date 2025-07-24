// src/Authentication/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { auth } = useAuth();          // { token, role } of null
  const location = useLocation();

  if (!auth) {
    // niet ingelogd → stuur naar login en bewaar waar je vandaan kwam
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;                     // token aanwezig → render child
}
