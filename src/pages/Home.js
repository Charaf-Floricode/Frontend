// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import { fetchInternStatus } from "../services/api";   // voeg toe

export default function HomePage() {
  /* 1️⃣  runtime-kleur voor de Intern-tegel */
  const [internColor, setInternColor] = useState("groen");

  useEffect(() => {
    fetchInternStatus()
      .then((data) => setInternColor(data.color))   // { color: "groen" | ... }
      .catch(() => setInternColor("rood"));         // fallback bij fout
  }, []);

  /* 2️⃣  sectors definieer je nu **binnen** de component,
         zodat internColor er elke render in zit */
  const sectors = [
    { key: "financieel", label: "Financieel", status: "groen",  route: "/financien" },
    { key: "intern",     label: "Intern",     status: internColor, route: "/intern" },
    { key: "extern",     label: "Extern",     status: "groen",  route: "/extern"    },
    { key: "innovatie",  label: "Innovatie",  status: "rood",   route: "/innovatie" },
  ];

  return (
    <div className="home-wrapper">
      {/* Welkom-tekst */}
      <div className="home-page">
        <h2>Welkom bij de Floricode Automation Dashboard</h2>
        <p>Kies in de sidebar voor jouw automatisering om van start te gaan.</p>
      </div>

      {/* 2×2-grid met status-boxen */}
      <div className="grid-2col">
        {sectors.map(({ key, label, status, route }) => (
          <Link key={key} to={route} className={`link-box bg-${status}`}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
