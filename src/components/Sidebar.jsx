import { useState } from "react";
import { NAV_ITEMS, roleLabel, roleColor } from "../utils/constants";
import { roleColor as RC, roleLabel as RL } from "../utils/helpers";

const roleC = { admin: "#7c3aed", teacher: "#0891b2", staff: "#059669" };
const roleL = { admin: "Administrator", teacher: "O'qituvchi", staff: "Xodim" };

export default function Sidebar({ user, tab, setTab, logout }) {
  const [open, setOpen] = useState(true);

  const items = NAV_ITEMS.filter((n) => !n.roles || n.roles.includes(user.role));

  return (
    <div style={{ width: open ? 230 : 64, background: "#0f172a", display: "flex",
      flexDirection: "column", transition: "width 0.25s ease",
      position: "sticky", top: 0, height: "100vh", flexShrink: 0, overflow: "hidden" }}>

      {/* Logo */}
      <div style={{ padding: open ? "22px 18px" : "22px 12px", display: "flex",
        alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,#6366f1,#4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0 }}>🎓</div>
        {open && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}>EduCRM</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>v2.0</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {items.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} title={item.label}
            style={{ display: "flex", alignItems: "center", gap: 11, width: "100%",
              padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer",
              marginBottom: 2, transition: "all 0.15s", fontFamily: "inherit",
              background: tab === item.id ? "rgba(99,102,241,0.2)" : "transparent",
              color: tab === item.id ? "#818cf8" : "#64748b" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {open && (
              <span style={{ fontSize: 13, fontWeight: tab === item.id ? 700 : 500, whiteSpace: "nowrap" }}>
                {item.label}
              </span>
            )}
            {open && tab === item.id && (
              <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%",
                background: "#6366f1", flexShrink: 0 }} />
            )}
          </button>
        ))}
      </nav>

      {/* User + collapse */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px",
          borderRadius: 10, background: "rgba(255,255,255,0.04)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${roleC[user.role]}, ${roleC[user.role]}99)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            {user.avatar}
          </div>
          {open && (
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: roleC[user.role], textTransform: "uppercase" }}>
                {roleL[user.role]}
              </div>
            </div>
          )}
        </div>
        <button onClick={() => setOpen(!open)} style={{ width: "100%", marginTop: 6,
          padding: "8px", borderRadius: 8, border: "none",
          background: "rgba(255,255,255,0.05)", color: "#64748b", cursor: "pointer", fontSize: 12 }}>
          {open ? "◀ Yig'ish" : "▶"}
        </button>
        <button onClick={logout} style={{ width: "100%", marginTop: 4, padding: "8px", borderRadius: 8,
          border: "none", background: "rgba(239,68,68,0.08)", color: "#f87171",
          cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
          {open ? "← Chiqish" : "←"}
        </button>
      </div>
    </div>
  );
}
