import { useState } from "react";
import { Modal, Field, inp, StatusBadge, Btn } from "../components/UI";
import { fmt, today, genQR, downloadCSV } from "../utils/helpers";
import { PAYMENT_METHODS } from "../utils/constants";

export default function Students({ students, setStudents, courses, payments, setPayments, user, addAudit, showToast }) {
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(null); // "form" | "detail" | "pay"
  const [editing, setEditing] = useState(null);
  const [sel,     setSel]     = useState(null);
  const [form,    setForm]    = useState(emptyForm());
  const [payForm, setPayForm] = useState({ courseId: "", amount: "", method: "naqd", note: "" });

  function emptyForm() {
    return { name: "", phone: "", email: "", courseIds: [], status: "active" };
  }

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search)
  );

  const openAdd    = () => { setEditing(null); setForm(emptyForm()); setModal("form"); };
  const openEdit   = (s) => { setEditing(s.id); setForm({ ...s }); setModal("form"); };
  const openDetail = (s) => { setSel(s); setModal("detail"); };
  const openPay    = (s) => { setSel(s); setPayForm({ courseId: s.courseIds[0] || "", amount: "", method: "naqd", note: "" }); setModal("pay"); };

  const save = () => {
    if (!form.name) return;
    if (editing) {
      setStudents((prev) => prev.map((s) => s.id === editing ? { ...s, ...form } : s));
      addAudit("Talabani yangiladi", form.name); showToast("Talaba yangilandi");
    } else {
      const newS = { ...form, id: Date.now(), joinDate: today(), balance: 0, qr: genQR(students.length + 1) };
      setStudents((prev) => [...prev, newS]);
      addAudit("Yangi talaba qo'shdi", form.name); showToast("Talaba qo'shildi");
    }
    setModal(null);
  };

  const del = (id, name) => {
    if (!window.confirm(`"${name}" talabani o'chirish?`)) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    addAudit("Talabani o'chirdi", name); showToast("O'chirildi", "error");
  };

  const addPayment = () => {
    if (!payForm.amount || !payForm.courseId) return;
    const p = { id: Date.now(), studentId: sel.id, courseId: Number(payForm.courseId),
      amount: Number(payForm.amount), date: today(), method: payForm.method, note: payForm.note, status: "paid" };
    setPayments((prev) => [...prev, p]);
    addAudit("To'lov qo'shdi", `${sel.name} — ${fmt(p.amount)}`);
    showToast("To'lov qayd etildi"); setModal(null);
  };

  const exportCSV = () => {
    downloadCSV(filtered.map((s) => ({
      ID: s.qr, Ism: s.name, Telefon: s.phone, Email: s.email, Holati: s.status, "Qo'shilgan": s.joinDate,
    })), "talabalar.csv");
    showToast("CSV yuklab olindi");
  };

  const courseToggle = (id) =>
    setForm((f) => ({ ...f, courseIds: f.courseIds.includes(id) ? f.courseIds.filter((c) => c !== id) : [...f.courseIds, id] }));

  return (
    <div>
      {/* Form Modal */}
      {modal === "form" && (
        <Modal title={editing ? "Talabani tahrirlash" : "Yangi talaba"} onClose={() => setModal(null)}>
          <Field label="To'liq ism">
            <input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ism Familiya" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Telefon">
              <input style={inp} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998901234567" />
            </Field>
            <Field label="Email">
              <input style={inp} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@mail.uz" />
            </Field>
          </div>
          <Field label="Holati">
            <select style={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Faol</option>
              <option value="inactive">Nofaol</option>
            </select>
          </Field>
          <Field label="Kurslar">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {courses.filter((c) => c.status === "active").map((c) => (
                <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                  borderRadius: 8, border: `1.5px solid ${form.courseIds.includes(c.id) ? "#6366f1" : "#e2e8f0"}`,
                  cursor: "pointer", fontSize: 13, fontWeight: 500,
                  background: form.courseIds.includes(c.id) ? "#eef2ff" : "#fff" }}>
                  <input type="checkbox" checked={form.courseIds.includes(c.id)}
                    onChange={() => courseToggle(c.id)} style={{ accentColor: "#6366f1" }} />
                  {c.name}
                </label>
              ))}
            </div>
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={save} style={{ flex: 1, padding: 11 }}>Saqlash</Btn>
            <Btn onClick={() => setModal(null)} color="#f1f5f9" text="#64748b" style={{ padding: "11px 20px" }}>Bekor</Btn>
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {modal === "detail" && sel && (
        <Modal title={`${sel.name} — Ma'lumotlar`} onClose={() => setModal(null)} width={560}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["QR / ID", sel.qr], ["Telefon", sel.phone], ["Email", sel.email || "—"],
              ["Holati", sel.status === "active" ? "Faol" : "Nofaol"], ["Qo'shilgan", sel.joinDate]].map(([k, v]) => (
              <div key={k} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase" }}>Yozilgan kurslar</div>
            {sel.courseIds.map((cid) => {
              const c = courses.find((c) => c.id === cid);
              return c ? <div key={cid} style={{ padding: "8px 12px", borderRadius: 8, background: "#eef2ff",
                color: "#6366f1", fontWeight: 600, fontSize: 13, marginBottom: 6 }}>📚 {c.name} — {fmt(c.price)}</div> : null;
            })}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase" }}>To'lov tarixi</div>
            {payments.filter((p) => p.studentId === sel.id).map((p) => {
              const c = courses.find((c) => c.id === p.courseId);
              return (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 12px", borderRadius: 8, background: "#f8fafc", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{c?.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.date} · {p.method}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{fmt(p.amount)}</div>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Btn onClick={() => { setModal(null); setTimeout(() => openPay(sel), 50); }} color="#059669" style={{ flex: 1, padding: 10 }}>💳 To'lov qo'shish</Btn>
            <Btn onClick={() => { setModal(null); setTimeout(() => openEdit(sel), 50); }} color="#eef2ff" text="#6366f1" style={{ flex: 1, padding: 10 }}>✏ Tahrir</Btn>
          </div>
        </Modal>
      )}

      {/* Pay Modal */}
      {modal === "pay" && sel && (
        <Modal title={`${sel.name} — To'lov qo'shish`} onClose={() => setModal(null)} width={400}>
          <Field label="Kurs">
            <select style={inp} value={payForm.courseId} onChange={(e) => setPayForm({ ...payForm, courseId: e.target.value })}>
              <option value="">— Kurs tanlang —</option>
              {sel.courseIds.map((cid) => {
                const c = courses.find((c) => c.id === cid);
                return c ? <option key={cid} value={cid}>{c.name}</option> : null;
              })}
            </select>
          </Field>
          <Field label="Miqdor (so'm)">
            <input style={inp} type="number" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} placeholder="350000" />
          </Field>
          <Field label="To'lov usuli">
            <select style={inp} value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}>
              {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </Field>
          <Field label="Izoh">
            <input style={inp} value={payForm.note} onChange={(e) => setPayForm({ ...payForm, note: e.target.value })} placeholder="Ixtiyoriy izoh..." />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={addPayment} color="#059669" style={{ flex: 1, padding: 11 }}>💳 Saqlash</Btn>
            <Btn onClick={() => setModal(null)} color="#f1f5f9" text="#64748b" style={{ padding: "11px 20px" }}>Bekor</Btn>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Ism yoki telefon..." style={{ ...inp, width: 280 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={exportCSV} style={{ padding: "9px 16px", background: "#f0fdf4", color: "#059669",
            border: "1.5px solid #86efac", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>📥 CSV</button>
          <Btn onClick={openAdd}>+ Talaba qo'shish</Btn>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["ID/QR","Talaba","Telefon","Kurslar","Holati","To'lov",""].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700,
                  color: "#64748b", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const spays     = payments.filter((p) => p.studentId === s.id);
              const hasOverdue = spays.some((p) => p.status === "overdue");
              const hasPending = spays.some((p) => p.status === "pending");
              return (
                <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff", cursor: "pointer" }}
                  onClick={() => openDetail(s)}>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6366f1",
                      background: "#eef2ff", padding: "2px 8px", borderRadius: 6 }}>{s.qr}</span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%",
                        background: "linear-gradient(135deg,#6366f1,#818cf8)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{s.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.email || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{s.phone}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {s.courseIds.slice(0, 2).map((cid) => {
                        const c = courses.find((c) => c.id === cid);
                        return c ? <span key={cid} style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: "#eef2ff", color: "#6366f1" }}>{c.name.slice(0, 14)}</span> : null;
                      })}
                      {s.courseIds.length > 2 && <span style={{ fontSize: 11, color: "#94a3b8" }}>+{s.courseIds.length - 2}</span>}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}><StatusBadge status={s.status} /></td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    {hasOverdue
                      ? <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⚠ Kechikkan</span>
                      : hasPending
                      ? <span style={{ background: "#fef9c3", color: "#b45309", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>🕐 Kutilmoqda</span>
                      : <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✓ To'landi</span>}
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => openPay(s)}  style={{ padding: "5px 9px", background: "#f0fdf4", color: "#059669", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>💳</button>
                      <button onClick={() => openEdit(s)} style={{ padding: "5px 9px", background: "#eef2ff", color: "#6366f1", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>✏</button>
                      <button onClick={() => del(s.id, s.name)} style={{ padding: "5px 9px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8" }}>
          Jami: {filtered.length} ta talaba
        </div>
      </div>
    </div>
  );
}
