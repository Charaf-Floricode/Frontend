import React, { useState } from "react";
import {
  Box, Paper, TextField, Typography,
  Alert, CircularProgress
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { loginJwt } from "../services/api";
import { useAuth } from "../Authentication/AuthContext";
import "./Login.css"
import formatError from "../components/formatError";
import BrandButton from "../styles/BrandButton"
export default function Login() {
  const nav               = useNavigate();
  const { token, setToken } = useAuth();

  /* 🟢  HOOKS ALTIJD EERST */
  const [form, setForm]   = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr]     = useState("");

  /* Hierdoor blijft de hook-volgorde identiek in elke render-pass */
  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const tok = await loginJwt(form);
      setToken(tok);
      nav("/", { replace: true });
    } catch (e) {
      setErr(formatError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ h:"100vh", display:"flex",
               justifyContent:"center", alignItems:"center" }}>
      <div className="login">
      <Paper sx={{ p:4, width:320 }}>
        <Typography variant="h6" mb={2}>Log in</Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Gebruikersnaam"
                     value={form.username}
                     onChange={e=>setForm({ ...form, username:e.target.value })}/>
          <TextField fullWidth margin="normal" type="password" label="Wachtwoord"
                     value={form.password}
                     onChange={e=>setForm({ ...form, password:e.target.value })}/>

          {err && <Alert severity="error" sx={{ mt:2 }}>{err}</Alert>}

          <BrandButton type="submit" fullWidth disabled={loading} sx={{ mt:3 }}>
            {loading ? <CircularProgress size={24}/> : "Inloggen"}
          </BrandButton>
        </form>
      </Paper>
      </div>
    </Box>
  );
}
