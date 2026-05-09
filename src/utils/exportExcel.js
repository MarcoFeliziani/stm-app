import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportMatchToExcel(match, avg = {}) {
  const { player, opponent, pointsHistory } = match;

  const total = pointsHistory.length;

  // 🧠 labels leggibili
  const labels = {
    // PRE
    aperta: "Postura aperta",
    chiusa: "Postura chiusa",
    routine: "Routine stabile",
    sguardo_ok: "Sguardo orientato",
    impulsivo: "Movimento impulsivo",
    disorientato: "Sguardo disorientato",

    // DURING
    ok: "Intensità organizzata",
    bad: "Intensità disordinata",
    avanza: "Avanzamento deciso",
    arretra: "Arretramento evidente",
    decisione: "Decisione chiara",
    freeze: "Freeze",

    // POST
    esulta: "Esultanza",
    reset: "Reset rapido",
    chiusura: "Chiusura corporea",
    self_pos: "Self-talk positivo",
    self_neg: "Self-talk negativo",
    sfogo: "Sfogo"
  };

  // 📊 stats completi
  const stats = {
    // PRE
    aperta: 0,
    chiusa: 0,
    routine: 0,
    sguardo_ok: 0,
    impulsivo: 0,
    disorientato: 0,

    // DURING
    ok: 0,
    bad: 0,
    avanza: 0,
    arretra: 0,
    decisione: 0,
    freeze: 0,

    // POST
    esulta: 0,
    reset: 0,
    chiusura: 0,
    self_pos: 0,
    self_neg: 0,
    sfogo: 0
  };

  // 📈 conteggio pattern
  pointsHistory.forEach(p => {
    [...(p.pre || []), ...(p.during || []), ...(p.post || [])]
      .forEach(v => {
        if (stats[v] !== undefined) {
          stats[v]++;
        }
      });
  });

  // 🧾 SHEET 1 - SUMMARY
  const summary = [
    ["Giocatore", player],
    ["Avversario", opponent],
    ["Totale punti", total]
  ];

  // 🧠 SHEET 2 - PATTERN MENTALI
  const mental = Object.entries(stats).map(([key, val]) => [
    labels[key],
    val,
    total > 0
      ? Math.round((val / total) * 100) + "%"
      : "0%"
  ]);

  mental.unshift([
    "Comportamento",
    "Count",
    "Percentuale"
  ]);

  // 🧠 SHEET 3 - PROFILO MENTALE MEDIO
  const profile = [
    ["Parametro", "Valore"],

    ["Aggressività", avg.aggressivita?.toFixed(2) || "0.00"],
    ["Concentrazione", avg.concentrazione?.toFixed(2) || "0.00"],
    ["Leadership", avg.leadership?.toFixed(2) || "0.00"],
    ["Gioia", avg.gioia?.toFixed(2) || "0.00"],
    ["Determinazione", avg.determinazione?.toFixed(2) || "0.00"],

    ["Ansia", avg.ansia?.toFixed(2) || "0.00"],
    ["Paura", avg.paura?.toFixed(2) || "0.00"],
    ["Tristezza", avg.tristezza?.toFixed(2) || "0.00"],
    ["Rabbia", avg.rabbia?.toFixed(2) || "0.00"],
    ["Frustrazione", avg.frustrazione?.toFixed(2) || "0.00"],

    ["Stratega", avg.stratega?.toFixed(2) || "0.00"],
    ["Rigido", avg.rigido?.toFixed(2) || "0.00"],
    ["Orale", avg.orale?.toFixed(2) || "0.00"],
    ["Masochista", avg.masochista?.toFixed(2) || "0.00"],
    ["Mentale", avg.mentale?.toFixed(2) || "0.00"],
    ["Resilienza", avg.resilienza?.toFixed(2) || "0.00"]
  ];

  // 🎾 SHEET 4 - PUNTI
  const points = pointsHistory.map((p, i) => ({
    Punto: i + 1,
    Outcome: p.outcome,
    Pre: (p.pre || []).join(", "),
    During: (p.during || []).join(", "),
    Post: (p.post || []).join(", ")
  }));

  // 📦 workbook
  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.aoa_to_sheet(summary);
  const ws2 = XLSX.utils.aoa_to_sheet(mental);
  const ws3 = XLSX.utils.aoa_to_sheet(profile);
  const ws4 = XLSX.utils.json_to_sheet(points);

  XLSX.utils.book_append_sheet(wb, ws1, "Summary");
  XLSX.utils.book_append_sheet(wb, ws2, "Mental");
  XLSX.utils.book_append_sheet(wb, ws3, "Profile");
  XLSX.utils.book_append_sheet(wb, ws4, "Points");

  // 💾 export
  const file = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array"
  });

  saveAs(
    new Blob([file], {
      type: "application/octet-stream"
    }),
    `STM_${player}_vs_${opponent}.xlsx`
  );
}