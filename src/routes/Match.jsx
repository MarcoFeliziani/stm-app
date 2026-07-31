import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import MentalChart from "../components/MentalChart";
import StatsLive from "../components/StatsLive";

export default function Match() {
  const { player, opponent, score, addPoint, canUndo, undoLastPoint, getFormattedPoints } = useMatchStore();
  const navigate = useNavigate();
  

  const [data, setData] = useState({
    pre: [],
    during: [],
    post: [],
    outcome: null
  });

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

  const saveDetailedPoint = (outcome) => {
    const pointData = {
      pre: data.pre,
      during: data.during,
      post: data.post,
      outcome
    };

    addPoint(pointData);

    // vibrazione
    navigator.vibrate?.(50);

    // reset
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
      <div className="match-header">
        <div className="players">
          {player} vs {opponent}
        </div>

        <div className="score-row">
          <span>🎾 Set {score.sets[0]}-{score.sets[1]}</span>
          <span>Game {score.games[0]}-{score.games[1]}</span>
          <span>{getFormattedPoints()}</span>

          {score.tieBreak && (
            <span className="tb">🔥 TB</span>
          )}
        </div>
      </div>

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
          onClick={() => saveDetailedPoint("player")}
        >
          ✅ Giocatore
        </button>

        <button
          className="btn-red"
          onClick={() => saveDetailedPoint("opponent")}
        >
          ❌ Avversario
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