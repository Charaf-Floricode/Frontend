import { useEffect, useState } from "react";
import { fetchInternStatus } from "../../services/api";

export default function InternPage() {
  const [internStatus, setInternStatus] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchInternStatus()
      .then(setInternStatus)      // data = { color, per_task }
      .catch((e) => setErr(e.message));
  }, []);

  if (err)           return <p>Fout: {err}</p>;
  if (!internStatus) return <p>Bezig met laden…</p>;

  /* ---------- UI ---------- */
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        Uren per taak
      </h2>

      <table className="w-full border-collapse">
        <tbody>
          {Object.entries(internStatus.per_task).map(
            ([taak, uren]) => (
              <tr key={taak}>
                <td className="border px-2 py-1">
                  {taak || "Totaal"}
                </td>
                <td className="border px-2 py-1 text-right">
                  {uren.toFixed(1)}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
        <p className="text-lg">
        Ziekteverzuim: <strong>{internStatus.sick_hours.toFixed(1)} u</strong> (
        <strong>{internStatus.sick_pct}%</strong>)
      </p>
    </div>
  );
}
