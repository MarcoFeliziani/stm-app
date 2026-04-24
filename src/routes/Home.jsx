import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";

export default function Home() {
  const [player, setPlayer] = useState("");
  const [opponent, setOpponent] = useState("");

  const navigate = useNavigate();
  const startMatch = useMatchStore((s) => s.startMatch);

  return (
    <div className="container">
      <h1>🎾 STM</h1>

      <input placeholder="Giocatore" onChange={(e) => setPlayer(e.target.value)} />
      <input placeholder="Avversario" onChange={(e) => setOpponent(e.target.value)} />

      <button
        className="btn-primary"
        onClick={() => {
          startMatch(player, opponent);
          navigate("/match");
        }}
      >
        Inizia Match
      </button>
    </div>
  );
}