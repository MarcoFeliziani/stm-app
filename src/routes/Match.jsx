import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import MentalChart from "../components/MentalChart";
import StatsLive from "../components/StatsLive";

export default function Match() {
  const { player, opponent, score, addPoint, canUndo, undoLastPoint } = useMatchStore();
  const navigate = useNavigate();

  const [data, setData] = useState({
    pre: [],
    during: [],
    post: [],
    outcome: null
  });

  const formatPoints = (p1, p2) => {
    if (p1 >= 3 && p2 >= 3) {
      if (p1 === p2) return "40-40";
      if (p1 > p2) return "AD-40";
      return "40-AD";
    }
    const tennis = [0, 15, 30, 40];
    return `${tennis[p1]} - ${tennis[p2]}`;
  };

  const toggle = (category, value) => {
    setData((prev) => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };

  const saveDetailedPoint = () => {
    if (!data.outcome) {
      alert("Seleziona esito");
      return;
    }

    addPoint(data);

    // 💥 feedback rapido
    navigator.vibrate?.(50);

    // 🔥 reset completo
    setData({
      pre: [],
      during: [],
      post: [],
      outcome: null
    });

  };

  const Button = ({ label, value, cat, color }) => {
    const active = data[cat].includes(value);

    return (
      <button
        className={color}
        style={{ opacity: active ? 1 : 0.5 }}
        onClick={() => toggle(cat, value)}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="container">
      <h2>{player} vs {opponent}</h2>

      <p>Set: {score.sets[0]} - {score.sets[1]}</p>
      <p>Game: {score.games[0]} - {score.games[1]}</p>
      <p>Punti: {formatPoints(score.points[0], score.points[1])}</p>

      <StatsLive />
      <MentalChart />

        <hr />

        <h3>🟦 Prima</h3>
        <div className="grid">
          <Button label="Postura aperta" value="aperta" cat="pre" color="btn-green" />
          <Button label="Postura chiusa" value="chiusa" cat="pre" color="btn-red" />
          <Button label="Routine stabile" value="routine" cat="pre" color="btn-green" />
          <Button label="Sguardo orientato" value="sguardo_ok" cat="pre" color="btn-green" />
          <Button label="Movimento impulsivo" value="impulsivo" cat="pre" color="btn-red" />
          <Button label="Sguardo disorientato" value="disorientato" cat="pre" color="btn-red" />
        </div>

        <h3>🟩 Durante</h3>
        <div className="grid">
          <Button label="Intensità organizzata" value="ok" cat="during" color="btn-green" />
          <Button label="Intensità disordinata" value="bad" cat="during" color="btn-red" />
          <Button label="Avanzamento deciso" value="avanza" cat="during" color="btn-green" />
          <Button label="Arretramento evidente" value="arretra" cat="during" color="btn-red" />
          <Button label="Decisione chiara" value="decisione" cat="during" color="btn-green" />
          <Button label="Freeze" value="freeze" cat="during" color="btn-red" />
        </div>

        <h3>🟥 Dopo</h3>
        <div className="grid">
          <Button label="Esultanza" value="esulta" cat="post" color="btn-green" />
          <Button label="Reset rapido" value="reset" cat="post" color="btn-green" />
          <Button label="Chiusura corporea" value="chiusura" cat="post" color="btn-red" />
          <Button label="Self-talk positivo" value="self_pos" cat="post" color="btn-green" />
          <Button label="Self-talk negativo" value="self_neg" cat="post" color="btn-red" />
          <Button label="Sfogo" value="sfogo" cat="post" color="btn-red" />
        </div>

        <h3>🎯 Esito</h3>
        <button
          className="btn-green"
          style={{ opacity: data.outcome === "player" ? 1 : 0.4 }}
          onClick={() => setData({ ...data, outcome: "player" })}
        >
          ✅ Giocatore
        </button>

        <button
          className="btn-red"
          style={{ opacity: data.outcome === "opponent" ? 1 : 0.4 }}
          onClick={() => setData({ ...data, outcome: "opponent" })}
        >
          ❌ Avversario
        </button>

        <hr />

        <button className="btn-primary" onClick={saveDetailedPoint}>
          💾 Salva Punto
        </button>

        <button onClick={undoLastPoint} style={{ marginLeft: 10 }}>
          ⏪ Undo
        </button>

        <hr />

        <button
          className="btn-primary"
          style={{ marginTop: 20 }}
          onClick={() => {
            if (window.confirm("Chiudere il match?")) {
              navigate("/summary");
            }
          }}
        >
          🛑 Chiudi Match
        </button>
    </div>
  );
}