import { useMatchStore } from "../store/useMatchStore";

const tennisPoints = [0, 15, 30, 40];

export default function Scoreboard() {
  const { player, opponent, score } = useMatchStore();

  const formatPoints = (p1, p2) => {
    if (p1 >= 3 && p2 >= 3) {
      if (p1 === p2) return "40-40";
      if (p1 > p2) return "AD-40";
      return "40-AD";
    }
    return `${tennisPoints[p1]} - ${tennisPoints[p2]}`;
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>{player} vs {opponent}</h2>

      <p>Set: {score.sets[0]} - {score.sets[1]}</p>
      <p>Game: {score.games[0]} - {score.games[1]}</p>
      <p>Punti: {formatPoints(score.points[0], score.points[1])}</p>
    </div>
  );
}