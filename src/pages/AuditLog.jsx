const RC = { admin: "#7c3aed", teacher: "#0891b2", staff: "#059669" };
const RL = { admin: "Administrator", teacher: "O'qituvchi", staff: "Xodim" };

export default function AuditLog({ log, users }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
          🔒 Audit Log — Barcha amallar ({log.length})
        </h3>
      </div>
      <div style={{ maxHeight: 600, overflowY: "auto" }}>
        {log.map((entry, i) => {
          const u = users.find((u) => u.id === entry.userId);
          return (
            <div key={entry.id} style={{ display: "flex", gap: 14, padding: "14px 20px",
              borderBottom: "1px solid #f1f5f9", alignItems: "flex-start",
              background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%",
                background: u ? `linear-gradient(135deg,${RC[u.role]},${RC[u.role]}80)` : "#e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                {u?.avatar || "?"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{u?.name || "Noma'lum"}</span>
                  {u && (
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                      background: RC[u.role] + "18", color: RC[u.role] }}>{RL[u.role]}</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
                  {entry.action}
                  {entry.target && <span style={{ fontWeight: 600, color: "#6366f1" }}> → {entry.target}</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                {entry.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
