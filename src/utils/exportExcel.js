import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportMatchToExcel(match) {
  const { player, opponent, pointsHistory } = match;

  const total = pointsHistory.length;

  // 📊 stats per gesto
  const stats = {};

  pointsHistory.forEach(p => {
    [...p.pre, ...p.during, ...p.post].forEach(v => {
      stats[v] = (stats[v] || 0) + 1;
    });
  });

  // 🧾 SHEET 1 - SUMMARY
  const summary = [
    ["Giocatore", player],
    ["Avversario", opponent],
    ["Totale punti", total]
  ];

  // 🧠 SHEET 2 - MENTALE
  const mental = Object.entries(stats).map(([key, val]) => [
    key,
    val,
    Math.round((val / total) * 100) + "%"
  ]);

  mental.unshift(["Comportamento", "Count", "Percentuale"]);

  // 🎾 SHEET 3 - PUNTI
  const points = pointsHistory.map((p, i) => ({
    Punto: i + 1,
    Outcome: p.outcome,
    Pre: p.pre.join(", "),
    During: p.during.join(", "),
    Post: p.post.join(", ")
  }));

  // 📦 workbook
  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.aoa_to_sheet(summary);
  const ws2 = XLSX.utils.aoa_to_sheet(mental);
  const ws3 = XLSX.utils.json_to_sheet(points);

  XLSX.utils.book_append_sheet(wb, ws1, "Summary");
  XLSX.utils.book_append_sheet(wb, ws2, "Mental");
  XLSX.utils.book_append_sheet(wb, ws3, "Points");

  const file = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  saveAs(
    new Blob([file], { type: "application/octet-stream" }),
    `STM_${player}_vs_${opponent}.xlsx`
  );
}