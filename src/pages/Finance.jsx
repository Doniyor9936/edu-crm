import { useState } from "react";
import { StatusBadge, Btn } from "../components/UI";
import { fmt, downloadCSV } from "../utils/helpers";
import { inp } from "../components/UI";

export default function Finance({ payments, setPayments, students, courses, addAudit, showToast }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = payments.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    const s = students.find((s) => s.id === p.studentId);
    if (search && s && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sum  = (f) => payments.filter(f).reduce((s, p) => s + p.amount, 0);
  const paid = sum((p) => p.status === "paid");
  const pend = sum((p) => p.status === "pending");
  const over = sum((p) => p.status === "overdue");

  const markPaid = (id) => {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "paid" } : p));
    addAudit("To'lovni tasdiqladi", "#" + id); showToast("To'lov tasdiqlandi");
  };

  const exportCSV = () => {
    downloadCSV(filtered.map((p) => {
      const s = students.find((s) => s.id === p.studentId);
      const c = courses.find((c) => c.id === p.courseId);
      return { Talaba: s?.name, Kurs: c?.name, Miqdor: p.amount, Sana: p.date, Usul: p.method, Holati: p.status };
    }), "tolovlar.csv");
    showToast("CSV yuklab olindi");
  };

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Jami tushum",   val: fmt(paid), icon: "✅", color: "#059669", bg: "#f0fdf4" },
          { label: "Kutilmoqda",    val: fmt(pend), icon: "🕐", color: "#b45309", bg: "#fffbeb" },
          { label: "Kechikkan",     val: fmt(over), icon: "⚠️", color: "#dc2626", bg: "#fef2f2" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: c.bg,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{c.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["all","Barchasi"],["paid","To'landi"],["pending","Kutilmoqda"],["overdue","Kechikkan"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding: "7px 14px", borderRadius: 8, border: "none",
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              background: filter === v ? "#6366f1" : "#f1f5f9", color: filter === v ? "#fff" : "#64748b" }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Talaba nomi..." style={{ ...inp, width: 220 }} />
          <button onClick={exportCSV} style={{ padding: "9px 16px", background: "#f0fdf4", color: "#059669",
            border: "1.5px solid #86efac", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>📥 CSV</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Talaba","Kurs","Miqdor","Sana","Usul","Holati",""].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700,
                  color: "#64748b", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const s = students.find((s) => s.id === p.studentId);
              const c = courses.find((c)  => c.id === p.courseId);
              return (
                <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, color: "#0f172a", borderBottom: "1px solid #f1f5f9" }}>{s?.name}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ padding: "2px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#eef2ff", color: "#6366f1" }}>{c?.name}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 800, fontSize: 14, color: "#0f172a", borderBottom: "1px solid #f1f5f9" }}>{fmt(p.amount)}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", borderBottom: "1px solid #f1f5f9" }}>{p.date}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", borderBottom: "1px solid #f1f5f9", textTransform: "capitalize" }}>{p.method}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}><StatusBadge status={p.status} /></td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    {p.status !== "paid" && (
                      <button onClick={() => markPaid(p.id)} style={{ padding: "5px 12px", background: "#f0fdf4",
                        color: "#059669", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>
                        ✓ Tasdiqlash
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8" }}>
          Jami: {filtered.length} ta to'lov yozuvi
        </div>
      </div>
    </div>
  );
}
