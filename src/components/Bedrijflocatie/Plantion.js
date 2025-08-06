import React, { useState } from "react";
import "./Card.css";
import "./Plantion.css";
import { runPlantion, downloadPlantion } from "../../services/api";

export default function Plantion() {
  const [removed, setRemoved] = useState([]);
  const [errors, setErrors]   = useState([]);
  const [msg, setMsg]         = useState("");
  const [loading, setLoad]    = useState(false);
  const [ready, setReady]     = useState(false);

  const handleGenerate = async () => {
    setLoad(true);
    setReady(false); // reset
    setErrors([]);
    setRemoved([]);
    setMsg("");

    try {
      const { removed: r = [], count_removed = 0, errors: errs = [] } = await runPlantion();
      setErrors(Array.isArray(errs) ? errs : []);
      setRemoved(Array.isArray(r) ? r : []);
      setMsg(`Verwijder: ${count_removed} nummer(s). Fouten: ${Array.isArray(errs) ? errs.length : 0}`);
      setReady(true); // ⬅️ Excel staat klaar, knop tonen
    } catch (e) {
      setMsg("Fout: " + (e?.message || e));
    } finally {
      setLoad(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadPlantion();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = "Plantion.xls";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Download mislukt: " + e.message);
    }
  };

  return (
    <div className="card">
      <h2>Plantion GLN-rapport</h2>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Bezig…" : "Genereer lijst"}
      </button>

      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}

      {/* Fouten netjes onder elkaar */}
      {errors.length > 0 && (
        <>
          <h4 style={{ marginTop: 12 }}>Fouten in het bestand:</h4>
          <ul className="list-disc pl-5 max-h-40 overflow-auto space-y-1">
            {errors.map((e, i) => (
              <li key={i}>
                {typeof e === "string"
                  ? e
                  : // fallback als backend objecten terugstuurt
                    `${e.column ?? "kolom"}[rij ${e.row ?? "?"}]: ${
                      e.kind ?? "invalid"
                    }${e.maxlen ? ` (max ${e.maxlen})` : ""}${
                      e.value != null ? ` — ${String(e.value)}` : ""
                    }`}
              </li>
            ))}
          </ul>
        </>
      )}

      {ready && (
        <>
  
          <h4 style={{ marginTop: 14 }}>Verwijder volgende Plantion-nummers:</h4>
          <ul className="list-disc pl-5 max-h-40 overflow-auto space-y-1">
            {removed.map((nr) => (
              <li key={nr}>{nr}</li>
            ))}
          </ul>
            <button onClick={handleDownload} style={{ marginTop: 10 }}>Download Excel</button>
        </>
        
      )}
    </div>
  );
}
