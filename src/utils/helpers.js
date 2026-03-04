export const fmt   = (n) => Number(n).toLocaleString("uz-UZ") + " so'm";
export const today = ()  => new Date().toISOString().split("T")[0];
export const genQR = (i) => "STD-" + String(i).padStart(3, "0");

export function downloadCSV(rows, filename) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${r[h] ?? ""}"`).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
