import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { token } = useAuth();
  const loc = useLocation();
  return token
    ? children
    : <Navigate to="/login" replace state={{ from: loc }} />;
}
