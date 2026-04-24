import { useNavigate } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import MentalChart from "../components/MentalChart";
import StatsLive from "../components/StatsLive";

export default function Match() {
  const navigate = useNavigate();
  const { player, opponent, score, addPoint } = useMatchStore();

  const formatPoints = (p1, p2) => {
    if (p1 >= 3 && p2 >= 3) {
      if (p1 === p2) return "40-40";
      if (p1 > p2) return "AD-40";
      return "40-AD";
    }
    const tennis = [0, 15, 30, 40];
    return `${tennis[p1]} - ${tennis[p2]}`;
  };

  const quickPoint = (outcome) => {
    addPoint({
      pre: [],
      during: [],
      post: [],
      outcome
    });
  };

  return (
    <div className="container">
      <h2>{player} vs {opponent}</h2>

      <p>Set: {score.sets[0]} - {score.sets[1]}</p>
      <p>Game: {score.games[0]} - {score.games[1]}</p>
      <p>Punti: {formatPoints(score.points[0], score.points[1])}</p>

      {/* 🔥 TRACKING */}
      <StatsLive />
      <MentalChart />

      <hr />

      <button className="btn-green" onClick={() => quickPoint("player")}>
        ✅ VINTO
      </button>

      <button className="btn-red" onClick={() => quickPoint("opponent")}>
        ❌ PERSO
      </button>

      <button className="btn-primary" onClick={() => navigate("/point")}>
        + Dettaglio
      </button>

      {/* 🛑 NUOVO */}
      <button
        style={{ marginTop: 20 }}
        onClick={() => navigate("/summary")}
      >
        🛑 Chiudi Match
      </button>
    </div>
  );
}