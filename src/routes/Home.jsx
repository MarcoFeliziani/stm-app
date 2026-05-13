import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";

export default function Home() {
  const [player, setPlayer] = useState("");
  const [opponent, setOpponent] = useState("");

  const navigate = useNavigate();
  const startMatch = useMatchStore((s) => s.startMatch);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4">
        
        <h1 className="text-4xl font-bold text-center">
          🎾 STM
        </h1>

        <input
          type="text"
          placeholder="Giocatore"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          className="
            h-14
            px-4
            rounded-2xl
            border
            border-gray-300
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <input
          type="text"
          placeholder="Avversario"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          className="
            h-14
            px-4
            rounded-2xl
            border
            border-gray-300
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <button
          className="
            h-14
            mt-2
            rounded-2xl
            bg-blue-600
            text-white
            text-lg
            font-semibold
            active:scale-95
            transition-transform
          "
          onClick={() => {
            startMatch(player, opponent);
            navigate("/match");
          }}
        >
          Inizia Match
        </button>
      </div>
    </div>
  );
}