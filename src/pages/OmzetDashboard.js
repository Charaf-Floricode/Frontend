// src/pages/OmzetDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { fetchOmzetData } from "../services/api";
import "./OmzetDashboard.css";
import { FLORICODE_BASE, FLORICODE_TINTS } from "../styles/colors";

export default function OmzetDashboard() {
  const [d, setD]   = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  function useReflowOnToggle() {
  return React.useCallback(() => {
    // in de volgende event‑loop zodat details al open is
    setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
  }, []);
}

/* in OmzetDashboard.jsx */
  const handleToggle = useReflowOnToggle();
  useEffect(() => {
    fetchOmzetData()
      .then((json) => setD(json))
      .catch((e) => setErr(e + ""))
      .finally(() => setLoading(false));
  }, []);

  if (err)     return <p className="text-red-600">{err}</p>;
  if (loading) return <p>Loading…</p>;
  if (!d)      return <p>Geen data.</p>;

  /* ---------- helpers ---------- */
  const toPairs = (obj) => Object.entries(obj || {}).map(([name, value]) => ({ name, value }));
  const sumValues = (arr) => arr.reduce((acc, x) => acc + (x?.value ?? 0), 0);

  // datasets uit backend
  const landData     = toPairs(d.land_counts);
  const dienstData   = toPairs(d.dienst_counts);
  const monthData    = toPairs(d.nieuw_per_maand);
  const totalRelData = toPairs(d.totaal_per_relatietype);

  const histData = (d.histogram?.bins?.length ? d.histogram.bins : []).slice(0, -1).map((bin, i) => ({
    name: `${bin}–${d.histogram.bins[i + 1]}`,
    value: d.histogram.freq?.[i] ?? 0,
  }));

  // eenvoudige KPI's voor de panel-header
  const totaalOmzet = sumValues(totalRelData);   // som van "totaal_per_relatietype"
  const nieuweLaatste = monthData.at(-1)?.value ?? 0;
  const nieuweVorige  = monthData.at(-2)?.value ?? 0;
  const groeiDelta    = nieuweLaatste - nieuweVorige;

  // heuristische statuskleuren (pas drempels gerust aan)
  const colorOmzet = (() => {
    // groei in nieuwe abonnementen geeft richting: >0 groen, =0 oranje, <0 rood
    if (totaalOmzet  > 800000)  return "groen";
    if (totaalOmzet  === 800000) return "oranje";
    return "rood";
  })();

  const colorKosten   = "oranje"; // placeholder tot kosten-data beschikbaar is
  const colorFacturen = "groen";  // placeholder; pas aan zodra factuur-KPI’s er zijn

  return (
    <div className="omzet-wrap">
      <h2 className="omzet-title">Omzetdashboard</h2>
    
      <div className="accordion">
      <details className={`acc-item card tone-${colorOmzet}`} onToggle={handleToggle}>
        <summary className="acc-summary">
          <span className={`status-dot ${colorOmzet}`} aria-hidden="true" />
          <span className="acc-label">Omzet</span>
          <span className="acc-total">
            € {Intl.NumberFormat("nl-NL").format(Math.round(totaalOmzet))}
          </span>
          <span className="chev" aria-hidden="true">▾</span>
        </summary>

        <div className="acc-body">
          <section className="chart-grid">
            {/* Totale prijs per relatietype */}
            <ChartCard title="Totale prijs per relatietype">
              <BarChartReponsive data={totalRelData}>
                <Bar dataKey="value" fill={FLORICODE_BASE} radius={[4,4,0,0]} />
              </BarChartReponsive>
            </ChartCard>

            {/* Verdeling netto prijs */}
            <ChartCard title="Verdeling netto prijs">
              <BarChartReponsive data={histData}>
                <Bar dataKey="value" fill={FLORICODE_BASE} />
              </BarChartReponsive>
            </ChartCard>

            {/* Nieuwe abonnementen per maand */}
            <ChartCard title="Nieuwe abonnementen per maand">
              <LineChartResponsive data={monthData} />
            </ChartCard>
              
            {/* Abonnementen per land */}
            <ChartCard title="Abonnementen per land">
              <BarChartReponsive data={landData}>
                <Bar dataKey="value" radius={[4,4,0,0]} fill={FLORICODE_BASE} />
              </BarChartReponsive>
            </ChartCard>

            {/* Top-10 diensten */}
            <ChartCard title="Top-10 diensten">
              <BarChartReponsive data={dienstData}>
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {dienstData.map((_, i) => (
                    <Cell key={i} fill={FLORICODE_TINTS[i % FLORICODE_TINTS.length]} />
                  ))}
                </Bar>
              </BarChartReponsive>
            </ChartCard>
      
          </section>
        </div>
      </details>

      {/* ─────────────────────────────────────────────────────── */}
      {/* Panel 2: KOSTEN                                        */}
      {/* ─────────────────────────────────────────────────────── */}
      <details className={`acc-item card tone-${colorKosten}`}>
        <summary className="acc-summary">
          <span className={`status-dot ${colorKosten}`} aria-hidden="true" />
          <span className="acc-label">Kosten</span>
          <span className="acc-total">—</span>
          <span className="chev" aria-hidden="true">▾</span>
        </summary>

        <div className="acc-body">
          {/* Als je later kosten-data terugkrijgt, render hier kaarten */}
          <div className="placeholder">
            <p>Nog geen kosten-dataset gekoppeld.</p>
            <p className="muted">Koppel een endpoint (bijv. <code>/omzet/kosten</code>) en voeg grafieken toe.</p>
          </div>
        </div>
      </details>

      {/* ─────────────────────────────────────────────────────── */}
      {/* Panel 3: FACTUREN                                      */}
      {/* ─────────────────────────────────────────────────────── */}
      <details className={`acc-item card tone-${colorFacturen}`}>
        <summary className="acc-summary">
          <span className={`status-dot ${colorFacturen}`} aria-hidden="true" />
          <span className="acc-label">Facturen</span>
          <span className="acc-total">{landData.length + dienstData.length} items</span>
          <span className="chev" aria-hidden="true">▾</span>
        </summary>

        <div className="acc-body">
            <div className="placeholder">
            <p>Nog geen kosten-dataset gekoppeld.</p>
            <p className="muted">Koppel een endpoint (bijv. <code>/omzet/kosten</code>) en voeg grafieken toe.</p>
          </div>
        </div>
      </details>
    </div>
    </div>
  );
}

/* ----------   kleine hulpfuncties   ---------- */

function ChartCard({ title, children }) {
  return (
    <div className="omzet-card">
      <h3 className="omzet-card-title" style={{ color: FLORICODE_BASE }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function BarChartReponsive({ data, children }) {
  return (
    <ResponsiveContainer width="100%" height={300}>   {/* ↑ was 220/300 */}
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        {children}
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineChartResponsive({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>   {/* ↑ was 220/300 */}
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke={FLORICODE_BASE}
          strokeWidth={2}
          dot={{ stroke: FLORICODE_BASE, fill: "#fff", r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}