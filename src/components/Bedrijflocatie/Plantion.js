import React, { useState } from "react";
import "./Card.css";
import { plantion } from "../../services/api";

export default function Plantion() {
const [message, setMessage] = useState(null);
const [debug,   setDebug]   = useState([]);
const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    try {
      const blob = await plantion();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = "Plantion.xls";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Download mislukt: " + e.message);
    }
  };

    return (
    <div className="card">
      <h2>Download Plantion codering</h2>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Extracting…" : "Extract Data"}
      </button>
      {message && <p>{message}</p>}
      {debug.length > 0 && (
        <ul>{debug.map((step, i) => <li key={i}>{step}</li>)}</ul>
      )}
    </div>
  );
}