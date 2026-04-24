import { useMatchStore } from "../store/useMatchStore";

export default function MentalChart() {
  const timeline = useMatchStore((s) => s.mentalTimeline);

  const width = 300;
  const height = 120;

  const max = 10;

  const points = timeline.map((val, i) => {
    const x = (i / Math.max(1, timeline.length - 1)) * width;
    const y = height / 2 - (val / max) * (height / 2);
    return `${x},${y}`;
  });

  const path = `M ${points.join(" L ")}`;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>🧠 Mental Flow</h3>

      <svg width={width} height={height} style={{ background: "#111827", borderRadius: 12 }}>
        {/* linea zero */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#374151" />

        {/* linea mentale */}
        <path d={path} stroke="#22c55e" fill="none" strokeWidth="2" />
      </svg>
    </div>
  );
}