import { create } from "zustand";
import { DIMENSIONS } from "./dimensions";
import { WEIGHTS } from "./weights";

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

  computeMentalProfile: (point) => {
    const profile = {};

    DIMENSIONS.forEach((d) => {
      profile[d] = 0;
    });

    const allTags = [...point.pre, ...point.during, ...point.post];

    allTags.forEach((tag) => {
      const weights = WEIGHTS[tag];
      if (!weights) return;

      Object.entries(weights).forEach(([dim, value]) => {
        profile[dim] += value;
      });
    });

    return profile;
  },

  addPoint: (point) => {
    const state = get();

    const newScore = applyPoint(state.score, point.outcome);
    const mental = state.computeMentalProfile(point);

    set({
      score: newScore,
      pointsHistory: [...state.pointsHistory, point],
      mentalTimeline: [...state.mentalTimeline, mental]
    });
  },

  undoLastPoint: () => {
    const state = get();

    if (state.pointsHistory.length === 0) return;

    const newHistory = state.pointsHistory.slice(0, -1);
    const newMental = state.mentalTimeline.slice(0, -1);

    const newScore = recalcFromHistory(newHistory);

    set({
      score: newScore,
      pointsHistory: newHistory,
      mentalTimeline: newMental
    });
  },

  canUndo: () => get().pointsHistory.length > 0,

  getMentalAverage: () => {
    const timeline = get().mentalTimeline;

    if (timeline.length === 0) return {};

    const avg = {};

    DIMENSIONS.forEach((d) => (avg[d] = 0));

    timeline.forEach((p) => {
      DIMENSIONS.forEach((d) => {
        avg[d] += p[d];
      });
    });

    DIMENSIONS.forEach((d) => {
      avg[d] = avg[d] / timeline.length;
    });

    return avg;
  },

}));

function applyPoint(score, outcome) {
  let { points, games, sets } = score;

  let p = [...points];
  let g = [...games];
  let s = [...sets];

  const winner = outcome === "player" ? 0 : 1;
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

  return {
    sets: s,
    games: g,
    points: p
  };
}

function recalcFromHistory(history) {
  let score = {
    sets: [0, 0],
    games: [0, 0],
    points: [0, 0]
  };

  history.forEach((p) => {
    score = applyPoint(score, p.outcome);
  });

  return score;
}