import React, { useState } from "react";
import "./Card.css";
import { runPlantion, downloadPlantion } from "../../services/api";

export default function Plantion() {
  const [removed, setRemoved] = useState([]);
  const [msg,     setMsg]     = useState("");
  const [loading, setLoad]    = useState(false);

  const handleGenerate = async () => {
    setLoad(true);
    try {
      const { removed, count_removed } = await runPlantion();
      setRemoved(removed);
      setMsg(`Verwijderd: ${count_removed} nummer(s)`);
    } catch (e) {
      setMsg("Fout: " + e.message);
    } finally {
      setLoad(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadPlantion();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href      = url;
      a.download  = "Plantion.xlsx";
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

      {msg && <p>{msg}</p>}

      {removed.length > 0 && (
        <>
          <button onClick={handleDownload}>Download Excel</button>

          <h4>Verwijderde Plantion-nummers</h4>
          <ul className="list-disc pl-5 max-h-40 overflow-auto space-y-1">
            {removed.map(nr => <li key={nr}>{nr}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}
