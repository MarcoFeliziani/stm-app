import { useMatchStore } from "../store/useMatchStore";

export default function StatsLive() {
  const { pointsHistory } = useMatchStore();

  if (pointsHistory.length === 0) return <p>Nessun dato</p>;

  const total = pointsHistory.length;

  const positive = pointsHistory.filter(p =>
    p.pre.includes("aperta") ||
    p.during.includes("ok") ||
    p.post.includes("self_pos")
  ).length;

  const negative = pointsHistory.filter(p =>
    p.pre.includes("chiusa") ||
    p.during.includes("freeze") ||
    p.post.includes("self_neg")
  ).length;

  return (
    <div>
      <h3>📊 Stats Live</h3>
      <p>Positivi: {Math.round((positive / total) * 100)}%</p>
      <p>Negativi: {Math.round((negative / total) * 100)}%</p>
      <p>Tot punti: {total}</p>
    </div>
  );
}