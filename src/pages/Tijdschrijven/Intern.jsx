// src/pages/Tijdschrijven/Intern.jsx
import { useEffect, useState } from "react";
import { fetchInternStatus } from "../../services/api";
import "./Intern.css"

export default function InternPage() {
  const [data, setData] = useState({ color:"groen", per_task:{}, sick_hours:0, sick_pct:0, panels: [] });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternStatus()
      .then((json) => setData({
        color: json?.color ?? "groen",
        per_task: json?.per_task ?? {},
        sick_hours: json?.sick_hours ?? 0,
        sick_pct: json?.sick_pct ?? 0,
        panels: Array.isArray(json?.panels) ? json.panels : [],
      }))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Bezig met laden…</p>;
  if (err)     return <p>Fout: {err}</p>;

  const { panels, per_task, sick_pct } = data;

  return (
    <div className="intern-wrap">
      <h2 className="intern-title">Intern – Urenoverzicht</h2>

      <div className="accordion">
        {panels.map((p) => (
          <details key={p.key} className={`acc-item card tone-${p.color || "groen"}`}>
            <summary className="acc-summary">
              <span className={`status-dot ${p.color || "groen"}`} aria-hidden="true" />
              <span className="acc-label">{p.label}</span>
             {(() => {
               const isSick = p.key === "ziekteverzuim";
              
               const pct = (p.sick_pct ?? sick_pct ?? 0);
               const hours = (p.total_hours ?? 0);
               const summaryValue = isSick ? `${pct.toFixed(1)}%` : `${hours.toFixed(1)} u`;
               return <span className="acc-total">{summaryValue}</span>;
             })()}
              <span className="chev" aria-hidden="true">▾</span>
            </summary>

            <div className="acc-body">
              {p.key !== "totale_uren_per_taak" ? (
                (Array.isArray(p.per_person) && p.per_person.length > 0) ? (
                  <table className="fc-table">
                    <thead><tr><th>Persoon</th><th className="right">Uren</th></tr></thead>
                    <tbody>
                      {p.per_person.map((row, i) => (
                        <tr key={i}>
                          <td>{row.name}</td>
                          <td className="right">{(row.hours ?? 0).toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="muted">Geen registraties gevonden.</p>
              ) : (
                <table className="fc-table">
                  <thead><tr><th>Taak</th><th className="right">Uren</th></tr></thead>
                  <tbody>
                    {Object.entries(per_task ?? {}).map(([task, hrs]) => (
                      <tr key={task}>
                        <td>{task}</td>
                        <td className="right">{(hrs ?? 0).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}