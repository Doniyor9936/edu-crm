import { useState } from "react";
import { Modal, Field, inp, Btn } from "../components/UI";
import { roleLabel, roleColor } from "../utils/constants";

export default function Staff({ staffUsers, setStaffUsers, user, addAudit, showToast }) {
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(emptyForm());
  const [search,  setSearch]  = useState("");

  function emptyForm() {
    return { name: "", email: "", password: "", phone: "", role: "staff", status: "active", avatar: "" };
  }

  const filtered = staffUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setEditing(null); setForm(emptyForm()); setModal(true); };
  const openEdit = (u) => { setEditing(u.id); setForm({ ...u }); setModal(true); };

  const save = () => {
    if (!form.name || !form.email) return;
    const avatar = form.avatar || form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    if (editing) {
      setStaffUsers((prev) => prev.map((u) => u.id === editing ? { ...u, ...form, avatar } : u));
      addAudit("Xodimni yangiladi", form.name); showToast("Xodim yangilandi");
    } else {
      setStaffUsers((prev) => [...prev, { ...form, id: Date.now(), avatar, courseIds: [] }]);
      addAudit("Yangi xodim qo'shdi", form.name); showToast("Xodim qo'shildi");
    }
    setModal(false);
  };

  const del = (id, name) => {
    if (id === user.id) { showToast("O'z hisobingizni o'chira olmaysiz!", "error"); return; }
    if (!window.confirm(`"${name}" xodimini o'chirish?`)) return;
    setStaffUsers((prev) => prev.filter((u) => u.id !== id));
    addAudit("Xodimni o'chirdi", name); showToast("O'chirildi", "error");
  };

  const toggleStatus = (id, current) => {
    if (id === user.id) { showToast("O'z statusingizni o'zgartira olmaysiz!", "error"); return; }
    const newStatus = current === "active" ? "inactive" : "active";
    setStaffUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u));
    showToast(newStatus === "active" ? "Faollashtrildi" : "O'chirildi");
  };

  const RC = { admin: "#7c3aed", teacher: "#0891b2", staff: "#059669" };

  return (
    <div>
      {modal && (
        <Modal title={editing ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"} onClose={() => setModal(false)} width={480}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="To'liq ism">
              <input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ism Familiya" />
            </Field>
            <Field label="Avatar (2 harf)">
              <input style={inp} value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value.toUpperCase().slice(0, 2) })} placeholder="IK" maxLength={2} />
            </Field>
            <Field label="Email">
              <input style={inp} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="xodim@edu.uz" />
            </Field>
            <Field label="Telefon">
              <input style={inp} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998901234567" />
            </Field>
            <Field label="Parol">
              <input style={inp} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editing ? "O'zgartirmaslik uchun bo'sh qoldiring" : "Parol"} />
            </Field>
            <Field label="Rol">
              <select style={inp} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Administrator</option>
                <option value="teacher">O'qituvchi</option>
                <option value="staff">Xodim</option>
              </select>
            </Field>
          </div>
          <Field label="Holati">
            <select style={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Faol</option>
              <option value="inactive">Nofaol</option>
            </select>
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={save} style={{ flex: 1, padding: 11 }}>Saqlash</Btn>
            <Btn onClick={() => setModal(false)} color="#f1f5f9" text="#64748b" style={{ padding: "11px 20px" }}>Bekor</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Jami xodimlar",   val: staffUsers.length,                              color: "#6366f1" },
          { label: "Administratorlar", val: staffUsers.filter((u) => u.role === "admin").length,   color: "#7c3aed" },
          { label: "O'qituvchilar",   val: staffUsers.filter((u) => u.role === "teacher").length, color: "#0891b2" },
          { label: "Xodimlar",        val: staffUsers.filter((u) => u.role === "staff").length,   color: "#059669" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Ism yoki email..." style={{ ...inp, width: 280 }} />
        <Btn onClick={openAdd}>+ Yangi xodim</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
        {filtered.map((u) => (
          <div key={u.id} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderTop: `3px solid ${RC[u.role]}`, opacity: u.status === "inactive" ? 0.7 : 1 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg,${RC[u.role]},${RC[u.role]}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 17 }}>{u.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{u.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: RC[u.role], textTransform: "uppercase", marginTop: 2 }}>{roleLabel[u.role]}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{u.email}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: u.status === "active" ? "#dcfce7" : "#f1f5f9", color: u.status === "active" ? "#15803d" : "#64748b" }}>
                  {u.status === "active" ? "● Faol" : "● Nofaol"}
                </span>
                {u.id === user.id && <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 600, background: "#eef2ff", padding: "2px 8px", borderRadius: 6 }}>Siz</span>}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14, display: "flex", gap: 8 }}>
              <span>📞 {u.phone || "—"}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEdit(u)} style={{ flex: 1, padding: "8px", background: "#eef2ff", color: "#6366f1", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12, fontFamily: "inherit" }}>✏ Tahrirlash</button>
              <button onClick={() => toggleStatus(u.id, u.status)} style={{ padding: "8px 12px", background: u.status === "active" ? "#fffbeb" : "#f0fdf4", color: u.status === "active" ? "#b45309" : "#059669", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12, fontFamily: "inherit" }}>
                {u.status === "active" ? "⏸" : "▶"}
              </button>
              <button onClick={() => del(u.id, u.name)} style={{ padding: "8px 12px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12, fontFamily: "inherit" }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
