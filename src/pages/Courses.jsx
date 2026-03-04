import { useState } from "react";
import { Modal, Field, inp, StatusBadge, Btn } from "../components/UI";
import { fmt, today } from "../utils/helpers";
import { COURSE_COLORS } from "../utils/constants";

export default function Courses({ courses, setCourses, teachers, students, setStudents, user, addAudit, showToast }) {
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(emptyForm());

  function emptyForm() {
    return { name: "", type: "offline", price: "", duration: "", teacherId: "", schedule: "", room: "", startDate: "", status: "active" };
  }

  const filtered = courses.filter((c) => {
    if (filter === "active"   && c.status !== "active")   return false;
    if (filter === "archived" && c.status !== "archived") return false;
    if (filter === "online"   && c.type   !== "online")   return false;
    if (filter === "offline"  && c.type   !== "offline")  return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openAdd  = () => { setEditing(null); setForm(emptyForm()); setModal(true); };
  const openEdit = (c) => { setEditing(c.id); setForm({ ...c, teacherId: c.teacherId || "" }); setModal(true); };

  const save = () => {
    if (!form.name) return;
    if (editing) {
      setCourses((prev) => prev.map((c) => c.id === editing ? { ...c, ...form, price: Number(form.price) } : c));
      addAudit("Kursni yangiladi", form.name); showToast("Kurs yangilandi");
    } else {
      setCourses((prev) => [...prev, { ...form, id: Date.now(), price: Number(form.price), students: 0 }]);
      addAudit("Yangi kurs qo'shdi", form.name); showToast("Kurs qo'shildi");
    }
    setModal(false);
  };

  const del = (id, name) => {
    if (!window.confirm(`"${name}" kursini o'chirish?`)) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setStudents((prev) => prev.map((s) => ({ ...s, courseIds: s.courseIds.filter((cid) => cid !== id) })));
    addAudit("Kursni o'chirdi", name); showToast("Kurs o'chirildi", "error");
  };

  const canEdit = ["admin", "staff"].includes(user.role);

  return (
    <div>
      {modal && (
        <Modal title={editing ? "Kursni tahrirlash" : "Yangi kurs"} onClose={() => setModal(false)}>
          <Field label="Kurs nomi">
            <input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kurs nomini kiriting" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Turi">
              <select style={inp} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </Field>
            <Field label="Narxi (so'm)">
              <input style={inp} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="350000" />
            </Field>
            <Field label="Davomiyligi">
              <input style={inp} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3 oy" />
            </Field>
            <Field label="O'qituvchi">
              <select style={inp} value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: Number(e.target.value) })}>
                <option value="">— Tanlang —</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <Field label="Dars vaqti">
              <input style={inp} value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Dush, Chor 10:00" />
            </Field>
            <Field label="Xona / Link">
              <input style={inp} value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="101-xona" />
            </Field>
            <Field label="Boshlanish sanasi">
              <input style={inp} type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </Field>
            <Field label="Holati">
              <select style={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Faol</option>
                <option value="archived">Arxiv</option>
              </select>
            </Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={save} style={{ flex: 1, padding: 11 }}>Saqlash</Btn>
            <Btn onClick={() => setModal(false)} color="#f1f5f9" text="#64748b" style={{ padding: "11px 20px" }}>Bekor</Btn>
          </div>
        </Modal>
      )}

      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["all","Barchasi"],["active","Faol"],["archived","Arxiv"],["online","Online"],["offline","Offline"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding: "7px 14px", borderRadius: 8, border: "none",
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              background: filter === v ? "#6366f1" : "#f1f5f9", color: filter === v ? "#fff" : "#64748b" }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Qidirish..." style={{ ...inp, width: 220 }} />
          {canEdit && <Btn onClick={openAdd}>+ Kurs qo'shish</Btn>}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {filtered.map((c, idx) => {
          const teacher = teachers.find((t) => t.id === c.teacherId);
          const color   = COURSE_COLORS[idx % COURSE_COLORS.length];
          return (
            <div key={c.id} style={{ background: "#fff", borderRadius: 16, padding: 20,
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderTop: `3px solid ${color}`,
              opacity: c.status === "archived" ? 0.75 : 1 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                    background: c.type === "online" ? "#ecfeff" : "#eef2ff",
                    color: c.type === "online" ? "#0891b2" : "#6366f1" }}>{c.type.toUpperCase()}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{c.name}</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  ["💰","Narxi",       fmt(c.price)],
                  ["⏱","Davomiyligi", c.duration],
                  ["👨‍🏫","O'qituvchi", teacher?.name || "—"],
                  ["🎓","Talabalar",   `${c.students} nafar`],
                  ["🕐","Jadval",      c.schedule || "—"],
                  ["🚪","Xona",        c.room || "—"],
                ].map(([icon, lbl, val]) => (
                  <div key={lbl} style={{ background: "#f8fafc", borderRadius: 8, padding: "7px 10px" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>{icon} {lbl}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginTop: 1 }}>{val}</div>
                  </div>
                ))}
              </div>
              {canEdit && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(c)} style={{ flex: 1, padding: 8, background: "#eef2ff", color: "#6366f1", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12, fontFamily: "inherit" }}>✏ Tahrir</button>
                  <button onClick={() => del(c.id, c.name)}   style={{ padding: "8px 14px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12, fontFamily: "inherit" }}>🗑</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
