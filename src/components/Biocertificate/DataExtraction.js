// src/components/ImportSection.js
import React, { useState } from "react";
import "./Card.css";
import { bioCertificate } from "../../services/api";

export default function Biocertification() {
  const [message, setMessage] = useState(null);
  const [debug,   setDebug]   = useState([]);
  const [loading, setLoading] = useState(false);

  const extractData = async () => {
    setLoading(true);
    setMessage(null);
    setDebug([]);
    try {
      // ---- NEW: call returns blob + headers
      const { blob, headers } = await bioCertificate();

      // filename from Content-Disposition if present
      let filename = "organic_certificates.xlsx";
      const disp = headers.get("content-disposition");
      const match = disp && disp.match(/filename="(.+)"/);
      if (match) filename = match[1];

      // create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage(`✔️ Downloaded ${filename}`);
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Extract Biocertificates</h2>
      <button onClick={extractData} disabled={loading}>
        {loading ? "Extracting…" : "Extract Data"}
      </button>
      {message && <p>{message}</p>}
      {debug.length > 0 && (
        <ul>{debug.map((step, i) => <li key={i}>{step}</li>)}</ul>
      )}
    </div>
  );
}
