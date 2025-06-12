// src/pages/OmzetDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { fetchOmzetData } from "../services/api";
import { FLORICODE_BASE, FLORICODE_TINTS } from "../styles/colors";

export default function OmzetDashboard() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchOmzetData().then(setD).catch(e => setErr(e + ""));
  }, []);

  if (err)  return <p className="text-red-600">{err}</p>;
  if (!d)   return <p>Loading…</p>;

  const toPairs = obj =>
    Object.entries(obj).map(([name, value]) => ({ name, value }));

  /* helpers */
  const landData     = toPairs(d.land_counts);
  const dienstData   = toPairs(d.dienst_counts);
  const monthData    = toPairs(d.nieuw_per_maand);
  const totalRelData = toPairs(d.totaal_per_relatietype);

  /* histogram dataset → mid-bin + freq */
  const histData = d.histogram.bins.slice(0, -1).map((bin, i) => ({
    name: `${bin}–${d.histogram.bins[i + 1]}`,
    value: d.histogram.freq[i],
  }));

  /* boxplot placeholder: gebruik bijv. Nivo BoxPlot of je eigen implementatie */
  // const boxData = Object.entries(d.boxplot) …

  return (
    <section className="grid gap-8 md:grid-cols-2">
      {/* 1️⃣ Landen */}
      <ChartCard title="Abonnementen per land">
        <BarChartReponsive data={landData}>
          <Bar dataKey="value" radius={[4,4,0,0]} fill={FLORICODE_BASE} />
        </BarChartReponsive>
      </ChartCard>

      {/* 2️⃣ Top-diensten */}
      <ChartCard title="Top-10 diensten">
        <BarChartReponsive data={dienstData}>
          <Bar dataKey="value" radius={[4,4,0,0]}>
            {dienstData.map((_, i) => (
              <Cell key={i} fill={FLORICODE_TINTS[i % FLORICODE_TINTS.length]} />
            ))}
          </Bar>
        </BarChartReponsive>
      </ChartCard>

      {/* 3️⃣ Histogram netto prijs */}
      <ChartCard title="Verdeling netto prijs">
        <BarChartReponsive data={histData}>
          <Bar dataKey="value" fill={FLORICODE_BASE} />
        </BarChartReponsive>
      </ChartCard>

      {/* 4️⃣ Nieuwe per maand */}
      <ChartCard title="Nieuwe abonnementen per maand">
        <LineChartResponsive data={monthData} />
      </ChartCard>

      {/* 5️⃣ Totale prijs relatietype */}
      <ChartCard title="Totale prijs per relatietype">
        <BarChartReponsive data={totalRelData}>
          <Bar dataKey="value" fill={FLORICODE_BASE} radius={[4,4,0,0]} />
        </BarChartReponsive>
      </ChartCard>

      {/* 6️⃣ Boxplot – implementeer zelf of met een library */}
      {/* <ChartCard title="Prijsverdeling per dienst (≥15)">…</ChartCard> */}
    </section>
  );
}

/* ----------   kleine hulpfuncties   ---------- */

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
      <h3 className="font-semibold text-sm md:text-base" style={{ color: FLORICODE_BASE }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function BarChartReponsive({ data, children }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
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
    <ResponsiveContainer width="100%" height={200}>
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
