import { useMatchStore } from "../store/useMatchStore";
import { useNavigate } from "react-router-dom";
import { exportMatchToExcel } from "../utils/exportExcel";

export default function Summary() {
  const navigate = useNavigate();
  const player = useMatchStore(s => s.player);
  const opponent = useMatchStore(s => s.opponent);
  const pointsHistory = useMatchStore(s => s.pointsHistory);

  const match = { player, opponent, pointsHistory };

  const total = pointsHistory.length;

  if (total === 0) {
    return <div className="container"><h2>Nessun dato</h2></div>;
  }

  // 📊 BASE
  const wins = pointsHistory.filter(p => p.outcome === "player").length;
  const losses = total - wins;

  // 🧠
  const stats = {
    // 🟦 PRE
    aperta: 0,
    chiusa: 0,
    routine: 0,
    sguardo_ok: 0,
    impulsivo: 0,
    disorientato: 0,

    // 🟩 DURING
    ok: 0,
    bad: 0,
    avanza: 0,
    arretra: 0,
    decisione: 0,
    freeze: 0,

    // 🟥 POST
    esulta: 0,
    reset: 0,
    chiusura: 0,
    self_pos: 0,
    self_neg: 0,
    sfogo: 0
  };

  pointsHistory.forEach(p => {
    p.pre.forEach(v => stats[v]++);
    p.during.forEach(v => stats[v]++);
    p.post.forEach(v => stats[v]++);
  });

  const perc = (val) => Math.round((val / total) * 100);

  return (
    <div className="container">
      <h1>🧠 Report Mentale</h1>

      <h2>{player} vs {opponent}</h2>

      <hr />

      {/* 📊 NUMERI */}
      <h3>📊 Sintesi</h3>
      <p>Vinti: {wins}</p>
      <p>Persi: {losses}</p>

      <hr />

      {/* 🧠 PATTERN */}
      <h3>🧠 Pattern mentali</h3>
      <p>Postura aperta: {stats.aperta} ({perc(stats.aperta)}%)</p>
      <p>Postura chiusa: {stats.chiusa} ({perc(stats.chiusa)}%)</p>
      <p>Routine stabile: {stats.routine} ({perc(stats.routine)}%)</p>
      <p>Sguardo orientato: {stats.sguardo_ok} ({perc(stats.sguardo_ok)}%)</p>
      <p>Movimento impulsivo: {stats.impulsivo} ({perc(stats.impulsivo)}%)</p>
      <p>Sguardo disorientato: {stats.disorientato} ({perc(stats.disorientato)}%)</p>

      <hr />

      <p>Intensità organizzata: {stats.ok} ({perc(stats.ok)}%)</p>
      <p>Intensità disordinata: {stats.bad} ({perc(stats.bad)}%)</p>
      <p>Avanzamento deciso: {stats.avanza} ({perc(stats.avanza)}%)</p>
      <p>Arretramento evidente: {stats.arretra} ({perc(stats.arretra)}%)</p>
      <p>Decisione chiara: {stats.decisione} ({perc(stats.decisione)}%)</p>
      <p>Freeze: {stats.freeze} ({perc(stats.freeze)}%)</p>

      <hr />

      <p>Esultanza: {stats.esulta} ({perc(stats.esulta)}%)</p>
      <p>Reset rapido: {stats.reset} ({perc(stats.reset)}%)</p>
      <p>Chiusura corporea: {stats.chiusura} ({perc(stats.chiusura)}%)</p>
      <p>Self-talk positivo: {stats.self_pos} ({perc(stats.self_pos)}%)</p>
      <p>Self-talk negativo: {stats.self_neg} ({perc(stats.self_neg)}%)</p>
      <p>Sfogo: {stats.sfogo} ({perc(stats.sfogo)}%)</p>

      <hr />

      <button
        className="btn-primary"
        onClick={() => exportMatchToExcel(match)}
      >
        📥 Esporta Excel
      </button>

      <button onClick={() => navigate("/")}>
        🔄 Nuovo Match
      </button>
    </div>
  );
}