import React, { useState } from "react";
import "./Card.css";
import { runRFH, downloadCoderingen } from "../../services/api";

export default function BedrijfLocatie() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  // twee aparte lijsten
  const [errorsBedrijf, setErrorsBedrijf] = useState([]);
  const [errorsLocatie, setErrorsLocatie] = useState([]);

  // kleine helper om 1 fout mooi te tonen
  const renderErr = (e, i) => (
    <li key={i}>
      {typeof e === "string"
        ? e
        : `${e.column ?? "kolom"}[rij ${e.row ?? "?"}]: ${
            e.kind ?? "invalid"
          }${e.maxlen ? ` (max ${e.maxlen})` : ""}${
            e.value != null ? ` — ${String(e.value)}` : ""
          }`}
    </li>
  );

  const handleValidate = async () => {
  setLoading(true);
  setMessage(null);
  setValidated(false);
  setErrorsBedrijf([]);
  setErrorsLocatie([]);

  try {
    // Zelfde stijl als Plantion
    const {
      errors_bedrijf: eb = [],
      errors_locatie: el = [],
      count_bedrijf = 0,
      count_locatie = 0,
      total = (eb?.length || 0) + (el?.length || 0),
    } = await runRFH();

    setErrorsBedrijf(Array.isArray(eb) ? eb : []);
    setErrorsLocatie(Array.isArray(el) ? el : []);

    setMessage(
      `Aantal Fouten— Bedrijf: ${count_bedrijf || eb.length}, ` +
      `Locatie: ${count_locatie || el.length}, Totaal: ${total}.`
    );
    setValidated(true);
  } catch (e) {
    setMessage(`Fout bij controleren: ${e.message || e}`);
  } finally {
    setLoading(false);
  }
};

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Backend: GET /bedrijflocatie/rfh → ZIP
      const blob = await downloadCoderingen();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = "coderingen.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setMessage(`Download mislukt: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Download RFH codering</h2>

      <div style={{ display: "flex", gap: ".6rem", marginBottom: ".5rem" }}>
        <button onClick={handleValidate} disabled={loading}>
          {loading ? "Bezig…" : "Controleren"}
        </button>
        <button onClick={handleDownload} disabled={loading || !validated}>
          {loading ? "Bezig…" : "Download ZIP"}
        </button>
      </div>

      {message && <p>{message}</p>}

      {/* Fouten – Bedrijf */}
      {errorsBedrijf.length > 0 && (
        <>
          <h4 style={{ marginTop: 12 }}>
            Fouten – Bedrijf ({errorsBedrijf.length})
          </h4>
          <ul className="list-disc pl-5 max-h-40 overflow-auto space-y-1">
            {errorsBedrijf.map(renderErr)}
          </ul>
        </>
      )}

      {/* Fouten – Locatie */}
      {errorsLocatie.length > 0 && (
        <>
          <h4 style={{ marginTop: 12 }}>
            Fouten – Locatie ({errorsLocatie.length})
          </h4>
          <ul className="list-disc pl-5 max-h-40 overflow-auto space-y-1">
            {errorsLocatie.map(renderErr)}
          </ul>
        </>
      )}
    </div>
  );
}
