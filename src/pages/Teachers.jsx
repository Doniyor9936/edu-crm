import { fmt } from "../utils/helpers";
import { roleColor, roleLabel } from "../utils/constants";

const RC = { admin: "#7c3aed", teacher: "#0891b2", staff: "#059669" };
const RL = { admin: "Administrator", teacher: "O'qituvchi", staff: "Xodim" };

export default function Teachers({ teachers, courses, payments }) {
  const paid = payments.filter((p) => p.status === "paid");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
      {teachers.map((t) => {
        const tCourses = courses.filter((c) => c.teacherId === t.id);
        const revenue  = tCourses.reduce((s, c) =>
          s + paid.filter((p) => p.courseId === c.id).reduce((a, p) => a + p.amount, 0), 0);

        return (
          <div key={t.id} style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%",
                background: `linear-gradient(135deg,${RC[t.role]},${RC[t.role]}99)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 18 }}>{t.avatar}</div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{t.name}</h3>
                <div style={{ fontSize: 11, fontWeight: 700, color: RC[t.role], textTransform: "uppercase", marginTop: 2 }}>{RL[t.role]}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{t.phone}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>
                Kurslari ({tCourses.length})
              </div>
              {tCourses.length === 0
                ? <div style={{ fontSize: 12, color: "#94a3b8" }}>Kurs biriktirilmagan</div>
                : tCourses.map((c) => (
                    <div key={c.id} style={{ padding: "7px 10px", borderRadius: 8, background: "#f8fafc",
                      marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 700 }}>{c.students} ta</span>
                    </div>
                  ))}
            </div>

            <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Jami daromad</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#059669" }}>{fmt(revenue)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
