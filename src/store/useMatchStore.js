import { create } from "zustand";

const tennisPoints = [0, 15, 30, 40];

export const useMatchStore = create((set, get) => ({
  player: "",
  opponent: "",

  score: {
    sets: [0, 0],
    games: [0, 0],
    points: [0, 0]
  },

  pointsHistory: [],
  mentalTimeline: [],

  startMatch: (player, opponent) =>
    set({
      player,
      opponent,
      score: { sets: [0, 0], games: [0, 0], points: [0, 0] },
      pointsHistory: [],
      mentalTimeline: []
    }),

  computeMentalScore: (point) => {
    let score = 0;

    if (point.pre.includes("aperta")) score++;
    if (point.pre.includes("chiusa")) score--;

    if (point.during.includes("ok")) score += 2;
    if (point.during.includes("freeze")) score -= 2;

    if (point.post.includes("pos")) score++;
    if (point.post.includes("neg")) score--;

    return score;
  },

  addPoint: (point) => {
    const state = get();
    let { points, games, sets } = state.score;

    let p = [...points];
    let g = [...games];
    let s = [...sets];

    const winner = point.outcome === "player" ? 0 : 1;
    const loser = winner === 0 ? 1 : 0;

    p[winner]++;

    if (p[winner] >= 4 && p[winner] - p[loser] >= 2) {
      g[winner]++;
      p = [0, 0];
    }

    if (g[winner] >= 6 && g[winner] - g[loser] >= 2) {
      s[winner]++;
      g = [0, 0];
    }

    const mental = get().computeMentalScore(point);

    set({
      score: { sets: s, games: g, points: p },
      pointsHistory: [...state.pointsHistory, point],
      mentalTimeline: [...state.mentalTimeline, mental]
    });
  }
}));