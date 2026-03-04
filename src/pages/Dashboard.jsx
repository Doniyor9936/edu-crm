import { fmt } from "../utils/helpers";
import { COURSE_COLORS } from "../utils/constants";

export default function Dashboard({ students, courses, payments, expenses, notifications }) {
  const totalRevenue  = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit     = totalRevenue - totalExpenses;
  const activeCourses = courses.filter((c) => c.status === "active").length;
  const activeStudents = students.filter((s) => s.status === "active").length;

  const monthlyRev = [
    { month: "Okt", rev: 1200000, exp: 900000 }, { month: "Nov", rev: 1450000, exp: 950000 },
    { month: "Dec", rev: 1350000, exp: 980000 },  { month: "Jan", rev: 1680000, exp: 1050000 },
    { month: "Feb", rev: 1540000, exp: 1020000 }, { month: "Mar", rev: totalRevenue, exp: totalExpenses },
  ];
  const maxVal = Math.max(...monthlyRev.map((d) => Math.max(d.rev, d.exp)));

  // Top 3 students by points
  const topStudents = [...students].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 3);

  return (
    <div>
      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Jami talabalar",   value: students.length,     sub: `${activeStudents} faol`,        icon: "🎓", color: "#6366f1" },
          { label: "Faol kurslar",     value: activeCourses,       sub: `${courses.length} jami`,         icon: "📚", color: "#0891b2" },
          { label: "Daromad",          value: fmt(totalRevenue),   sub: "To'langan to'lovlar",            icon: "💰", color: "#059669" },
          { label: "Rasxodlar",        value: fmt(totalExpenses),  sub: `${expenses.length} ta yozuv`,   icon: "💸", color: "#ef4444" },
          { label: "Sof foyda",        value: fmt(netProfit),      sub: netProfit >= 0 ? "Ijobiy" : "Manfiy", icon: "📈", color: netProfit >= 0 ? "#059669" : "#ef4444" },
          { label: "Kechikkan to'lov", value: payments.filter((p) => p.status === "overdue").length, sub: "darhol e'tibor", icon: "⚠️", color: "#dc2626" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 18, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${c.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{c.sub}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Revenue vs Expenses Chart */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0f172a" }}>📊 Daromad vs Rasxod</h3>
            <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#6366f1", display: "inline-block" }} />Daromad</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#ef4444", display: "inline-block" }} />Rasxod</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
            {monthlyRev.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 120 }}>
                  <div style={{ flex: 1, borderRadius: "4px 4px 0 0", background: i === 5 ? "#6366f1" : "#c7d2fe", height: `${(d.rev / maxVal) * 100}%`, minHeight: 4 }} />
                  <div style={{ flex: 1, borderRadius: "4px 4px 0 0", background: i === 5 ? "#ef4444" : "#fecaca", height: `${(d.exp / maxVal) * 100}%`, minHeight: 4 }} />
                </div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top students */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>🏆 Top talabalar</h3>
          {topStudents.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
              <span style={{ fontSize: 18 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{s.name}</div>
                <div style={{ background: "#f1f5f9", borderRadius: 20, height: 5, marginTop: 4 }}>
                  <div style={{ width: `${Math.min((s.points || 0) / 600 * 100, 100)}%`, height: "100%", borderRadius: 20, background: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : "#cd7c3f" }} />
                </div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 14, color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : "#cd7c3f" }}>{s.points || 0}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 14px", background: "linear-gradient(135deg,#eef2ff,#f0fdf4)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>Sof foyda (Mar)</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: netProfit >= 0 ? "#059669" : "#ef4444" }}>{fmt(netProfit)}</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {notifications.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>🔔 Diqqat talab qiluvchi holatlar</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
            {notifications.map((n, i) => (
              <div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: n.type === "danger" ? "#fef2f2" : "#fffbeb", border: `1px solid ${n.type === "danger" ? "#fecaca" : "#fde68a"}`, display: "flex", gap: 8, alignItems: "center" }}>
                <span>{n.type === "danger" ? "🔴" : "🟡"}</span>
                <span style={{ fontSize: 12, color: "#374151" }}>{n.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
