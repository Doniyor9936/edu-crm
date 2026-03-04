import { useState } from "react";
import { Modal, Field, inp, Btn } from "../components/UI";
import { fmt, downloadCSV, today } from "../utils/helpers";
import { EXPENSE_CATEGORIES } from "../utils/constants";

export default function Expenses({ expenses, setExpenses, user, addAudit, showToast }) {
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const [form,    setForm]    = useState(emptyForm());

  function emptyForm() {
    return { category: "Ijara", amount: "", date: today(), note: "" };
  }

  const filtered = expenses.filter((e) => {
    if (filter !== "all" && e.category !== filter) return false;
    if (search && !e.note.toLowerCase().includes(search.toLowerCase()) && !e.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const totalAll      = expenses.reduce((s, e) => s + e.amount, 0);
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  // Kategoriya bo'yicha statistika
  const catStats = EXPENSE_CATEGORIES.map((cat) => ({
    cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
    count: expenses.filter((e) => e.category === cat).length,
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const openAdd  = () => { setEditing(null); setForm(emptyForm()); setModal(true); };
  const openEdit = (e) => { setEditing(e.id); setForm({ ...e }); setModal(true); };

  const save = () => {
    if (!form.amount) return;
    if (editing) {
      setExpenses((prev) => prev.map((e) => e.id === editing ? { ...e, ...form, amount: Number(form.amount) } : e));
      addAudit("Rasxodni yangiladi", form.category); showToast("Rasxod yangilandi");
    } else {
      setExpenses((prev) => [...prev, { ...form, id: Date.now(), amount: Number(form.amount), createdBy: user.id }]);
      addAudit("Yangi rasxod qo'shdi", `${form.category} — ${fmt(form.amount)}`); showToast("Rasxod qo'shildi");
    }
    setModal(false);
  };

  const del = (id, cat) => {
    if (!window.confirm("Rasxodni o'chirishni tasdiqlaysizmi?")) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addAudit("Rasxodni o'chirdi", cat); showToast("O'chirildi", "error");
  };

  const catColors = { "Ijara": "#6366f1", "Kommunal": "#0891b2", "Ish haqi": "#059669", "Jihozlar": "#f59e0b", "Marketing": "#ef4444", "Ta'mirlash": "#8b5cf6", "Boshqa": "#64748b" };
  const c = (cat) => catColors[cat] || "#64748b";

  return (
    <div>
      {modal && (
        <Modal title={editing ? "Rasxodni tahrirlash" : "Yangi rasxod"} onClose={() => setModal(false)} width={420}>
          <Field label="Kategoriya">
            <select style={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {EXPENSE_CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
          </Field>
          <Field label="Miqdor (so'm)">
            <input style={inp} type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="1000000" />
          </Field>
          <Field label="Sana">
            <input style={inp} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Izoh">
            <input style={inp} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Qisqacha tavsif..." />
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={save} style={{ flex: 1, padding: 11 }}>Saqlash</Btn>
            <Btn onClick={() => setModal(false)} color="#f1f5f9" text="#64748b" style={{ padding: "11px 20px" }}>Bekor</Btn>
          </div>
        </Modal>
      )}

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderLeft: "4px solid #ef4444" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Jami rasxodlar</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#ef4444" }}>{fmt(totalAll)}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{expenses.length} ta yozuv</div>
        </div>
        {catStats.slice(0, 3).map((cs) => (
          <div key={cs.cat} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${c(cs.cat)}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>{cs.cat}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c(cs.cat) }}>{fmt(cs.total)}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{cs.count} ta yozuv</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        {/* Main table */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={() => setFilter("all")} style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: filter === "all" ? "#6366f1" : "#f1f5f9", color: filter === "all" ? "#fff" : "#64748b" }}>Barchasi</button>
              {EXPENSE_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setFilter(cat)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: filter === cat ? c(cat) : "#f1f5f9", color: filter === cat ? "#fff" : "#64748b" }}>{cat}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Qidirish..." style={{ ...inp, width: 180 }} />
              <button onClick={() => { downloadCSV(filtered.map((e) => ({ Kategoriya: e.category, Miqdor: e.amount, Sana: e.date, Izoh: e.note })), "rasxodlar.csv"); showToast("CSV yuklab olindi"); }} style={{ padding: "9px 14px", background: "#f0fdf4", color: "#059669", border: "1.5px solid #86efac", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>📥 CSV</button>
              <Btn onClick={openAdd}>+ Rasxod</Btn>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Kategoriya", "Miqdor", "Sana", "Izoh", ""].map((h) => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={e.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: c(e.category) + "18", color: c(e.category) }}>{e.category}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 800, fontSize: 14, color: "#ef4444", borderBottom: "1px solid #f1f5f9" }}>−{fmt(e.amount)}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", borderBottom: "1px solid #f1f5f9" }}>{e.date}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{e.note || "—"}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => openEdit(e)} style={{ padding: "5px 9px", background: "#eef2ff", color: "#6366f1", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>✏</button>
                        <button onClick={() => del(e.id, e.category)} style={{ padding: "5px 9px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
              <span>{filtered.length} ta yozuv</span>
              <span style={{ fontWeight: 700, color: "#ef4444" }}>Jami: {fmt(totalFiltered)}</span>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", alignSelf: "start" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>📊 Kategoriyalar</h3>
          {catStats.map((cs) => {
            const pct = totalAll > 0 ? cs.total / totalAll * 100 : 0;
            return (
              <div key={cs.cat} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{cs.cat}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c(cs.cat) }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 20, height: 7 }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 20, background: c(cs.cat) }} />
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{fmt(cs.total)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
