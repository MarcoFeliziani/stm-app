import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";

export default function PointEntry() {
  const navigate = useNavigate();
  const addPoint = useMatchStore((s) => s.addPoint);

  const [data, setData] = useState({
    pre: [],
    during: [],
    post: [],
    outcome: null
  });

  const toggle = (category, value) => {
    setData((prev) => {
      const current = prev[category] || [];
      const exists = current.includes(value);

      return {
        ...prev,
        [category]: exists
          ? current.filter((v) => v !== value)
          : [...current, value]
      };
    });
  };

  const Button = ({ label, value, cat, color }) => {
    const active = (data[cat] || []).includes(value);

    return (
      <button
        className={color}
        style={{ opacity: active ? 1 : 0.4 }}
        onClick={() => toggle(cat, value)}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="container">
      <h2>🧠 Dettaglio Punto</h2>

      {/* 🟦 PRIMA */}
      <h3>🟦 Prima del punto</h3>
      <div className="grid">
        <Button label="Postura aperta" value="aperta" cat="pre" color="btn-green" />
        <Button label="Postura chiusa" value="chiusa" cat="pre" color="btn-red" />
        <Button label="Routine stabile" value="routine" cat="pre" color="btn-green" />
        <Button label="Sguardo orientato" value="sguardo_ok" cat="pre" color="btn-green" />
        <Button label="Movimento impulsivo" value="impulsivo" cat="pre" color="btn-red" />
        <Button label="Sguardo disorientato" value="disorientato" cat="pre" color="btn-red" />
      </div>

      {/* 🟩 DURANTE */}
      <h3>🟩 Durante il punto</h3>
      <div className="grid">
        <Button label="Intensità organizzata" value="ok" cat="during" color="btn-green" />
        <Button label="Intensità disordinata" value="bad" cat="during" color="btn-red" />
        <Button label="Avanzamento deciso" value="avanza" cat="during" color="btn-green" />
        <Button label="Arretramento evidente" value="arretra" cat="during" color="btn-red" />
        <Button label="Decisione chiara" value="decisione" cat="during" color="btn-green" />
        <Button label="Blocco (freeze)" value="freeze" cat="during" color="btn-red" />
      </div>

      {/* 🟥 DOPO */}
      <h3>🟥 Dopo il punto</h3>
      <div className="grid">
        <Button label="Esultanza" value="esulta" cat="post" color="btn-green" />
        <Button label="Reset rapido" value="reset" cat="post" color="btn-green" />
        <Button label="Chiusura corporea" value="chiusura" cat="post" color="btn-red" />
        <Button label="Self-talk positivo" value="self_pos" cat="post" color="btn-green" />
        <Button label="Self-talk negativo" value="self_neg" cat="post" color="btn-red" />
        <Button label="Sfogo" value="sfogo" cat="post" color="btn-red" />
      </div>

      {/* 🎯 ESITO */}
      <h3>🎯 Esito</h3>
      <button
        className="btn-green"
        onClick={() => setData({ ...data, outcome: "player" })}
      >
        ✅ Giocatore
      </button>

      <button
        className="btn-red"
        onClick={() => setData({ ...data, outcome: "opponent" })}
      >
        ❌ Avversario
      </button>

      {/* 💾 SALVA */}
      <button
        className="btn-primary"
        onClick={() => {
          if (!data.outcome) {
            alert("Seleziona esito");
            return;
          }

          addPoint(data);
          navigate("/match");
        }}
      >
        💾 Salva Punto
      </button>
    </div>
  );
}