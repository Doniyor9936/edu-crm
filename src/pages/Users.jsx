const RC = { admin: "#7c3aed", teacher: "#0891b2", staff: "#059669" };
const RL = { admin: "Administrator", teacher: "O'qituvchi", staff: "Xodim" };

export default function Users({ users }) {
  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Tizim foydalanuvchilari</h3>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{users.length} ta foydalanuvchi</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Foydalanuvchi","Email","Telefon","Rol","Holati"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700,
                  color: "#64748b", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%",
                      background: `linear-gradient(135deg,${RC[u.role]},${RC[u.role]}80)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 800, fontSize: 13 }}>{u.avatar}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{u.name}</div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{u.email}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{u.phone}</td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: RC[u.role] + "18", color: RC[u.role] }}>{RL[u.role]}</span>
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: "#dcfce7", color: "#15803d" }}>● Faol</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, background: "#fffbeb", borderRadius: 14, padding: 16,
        border: "1px solid #fde68a", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 20 }}>🔐</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 4 }}>Xavfsizlik eslatmasi</div>
          <div style={{ fontSize: 12, color: "#78350f" }}>
            Barcha parollar shifrlangan holda saqlanadi. Rol asosida kirish huquqlari (RBAC) qo'llaniladi.
            Audit log orqali barcha amallar qayd etiladi.
          </div>
        </div>
      </div>
    </div>
  );
}
