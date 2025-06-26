import { Link } from "react-router-dom";
import "./Home.css";

const sectors = [
  { key: "financieel", label: "Financieel", status: "groen",  route: "/financien" },
  { key: "intern",     label: "Intern",     status: "oranje", route: "/intern"    },
  { key: "extern",     label: "Extern",     status: "groen",  route: "/extern"    },
  { key: "innovatie",  label: "Innovatie",  status: "rood",   route: "/innovatie" },
];

export default function HomePage() {
  return (
    <div className="home-wrapper">
      {/* Welkom-tekst  */}
      <div className="home-page">
        <h2>Welkom bij de Floricode Automation Dashboard</h2>
        <p>Kies in de sidebar voor jouw automatisering om van start te gaan.</p>
      </div>

      {/* 2 × 2-grid met status-boxen */}
      <div className="grid-2col">
        {sectors.map(({ key, label, status, route }) => (
          <Link
            key={key}
            to={route}
            className={`link-box bg-${status}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
