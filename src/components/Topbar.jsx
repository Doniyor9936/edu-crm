import { useState } from "react";
import { NAV_ITEMS } from "../utils/constants";

export default function Topbar({ tab, notifications, logout }) {
  const [open, setOpen] = useState(false);
  const current = NAV_ITEMS.find((n) => n.id === tab);

  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "12px 28px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
        {current?.icon} {current?.label}
      </h2>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setOpen(!open)} style={{ position: "relative", padding: "8px 12px",
            borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff",
            cursor: "pointer", fontSize: 16 }}>
            🔔
            {notifications.length > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18,
                borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 10,
                fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {notifications.length}
              </span>
            )}
          </button>

          {open && (
            <div style={{ position: "absolute", right: 0, top: "110%", width: 300, background: "#fff",
              borderRadius: 14, boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
              border: "1px solid #f1f5f9", zIndex: 200, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9",
                fontWeight: 700, fontSize: 13, color: "#0f172a" }}>
                Bildirishnomalar ({notifications.length})
              </div>
              {notifications.length === 0
                ? <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                    Bildirishnoma yo'q
                  </div>
                : notifications.map((n, i) => (
                    <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc",
                      display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 14 }}>{n.type === "danger" ? "🔴" : "🟡"}</span>
                      <span style={{ fontSize: 12, color: "#475569" }}>{n.msg}</span>
                    </div>
                  ))}
            </div>
          )}
        </div>

        <div style={{ height: 28, width: 1, background: "#e2e8f0" }} />
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{new Date().toLocaleDateString("uz-UZ")}</div>
      </div>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
