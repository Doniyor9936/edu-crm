import { fmt, downloadCSV } from "../utils/helpers";
import { COURSE_COLORS } from "../utils/constants";

const RC = { admin: "#7c3aed", teacher: "#0891b2", staff: "#059669" };

export default function Reports({ payments, students, courses, teachers, expenses }) {
  const paid     = payments.filter((p) => p.status === "paid");
  const totalRev = paid.reduce((s, p) => s + p.amount, 0);
  const totalExp = (expenses || []).reduce((s, e) => s + e.amount, 0);
  const net      = totalRev - totalExp;

  const courseStats = [...courses].map((c) => {
    const cpays = paid.filter((p) => p.courseId === c.id);
    return { ...c, revenue: cpays.reduce((s, p) => s + p.amount, 0), payCount: cpays.length };
  }).sort((a, b) => b.revenue - a.revenue);

  const exportCSV = () => {
    downloadCSV(courseStats.map((c) => ({ Kurs: c.name, Talabalar: c.students, "To'lovlar": c.payCount, Daromad: c.revenue })), "hisobot.csv");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={exportCSV} style={{ padding: "9px 18px", background: "#f0fdf4", color: "#059669", border: "1.5px solid #86efac", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>📥 CSV eksport</button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Jami daromad",   val: fmt(totalRev), icon: "💰", color: "#059669" },
          { label: "Jami rasxod",    val: fmt(totalExp), icon: "💸", color: "#ef4444" },
          { label: "Sof foyda",      val: fmt(net),      icon: net >= 0 ? "📈" : "📉", color: net >= 0 ? "#059669" : "#ef4444" },
          { label: "Jami talabalar", val: students.length, icon: "🎓", color: "#6366f1" },
          { label: "O'qituvchilar",  val: teachers.length, icon: "👨‍🏫", color: "#0891b2" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: c.color }}>{c.val}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Course Revenue */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>💰 Kurslar bo'yicha daromad</h3>
        {courseStats.map((c, i) => {
          const pct = totalRev > 0 ? (c.revenue / totalRev * 100) : 0;
          const col = COURSE_COLORS[i % COURSE_COLORS.length];
          return (
            <div key={c.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{c.name}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: "#94a3b8" }}>{c.students} talaba · {c.payCount} to'lov</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: col }}>{fmt(c.revenue)}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{pct.toFixed(1)}%</div>
                </div>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 20, height: 8 }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 20, background: col }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Teachers */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>👨‍🏫 O'qituvchilar samaradorligi</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {teachers.map((t) => {
            const tCourses  = courses.filter((c) => c.teacherId === t.id);
            const tStudents = tCourses.reduce((s, c) => s + c.students, 0);
            const tRevenue  = tCourses.reduce((sum, c) => sum + paid.filter((p) => p.courseId === c.id).reduce((s, p) => s + p.amount, 0), 0);
            return (
              <div key={t.id} style={{ background: "#f8fafc", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${RC[t.role]},${RC[t.role]}80)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{t.avatar}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{t.name}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, textAlign: "center" }}>
                  {[["Kurs", tCourses.length], ["Talaba", tStudents], ["M so'm", (tRevenue / 1000000).toFixed(1)]].map(([l, v]) => (
                    <div key={l} style={{ background: "#fff", borderRadius: 8, padding: "6px 4px" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#6366f1" }}>{v}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
