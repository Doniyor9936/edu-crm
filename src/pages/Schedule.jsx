import { COURSE_COLORS } from "../utils/constants";

const DAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const DAY_SHORT = ["dush", "sesh", "chor", "pay", "juma", "shan"];

export default function Schedule({ courses, teachers }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
      {DAYS.map((day, di) => {
        const dayCourses = courses.filter((c) =>
          c.status === "active" && c.schedule &&
          c.schedule.toLowerCase().includes(DAY_SHORT[di])
        );
        return (
          <div key={day} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "12px 16px", background: "linear-gradient(135deg,#0f172a,#1e293b)", color: "#fff" }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{day}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{dayCourses.length} ta dars</div>
            </div>
            <div style={{ padding: 12 }}>
              {dayCourses.length === 0
                ? <div style={{ textAlign: "center", padding: "16px 0", color: "#cbd5e1", fontSize: 13 }}>Dars yo'q</div>
                : dayCourses.map((c, i) => {
                    const t     = teachers.find((t) => t.id === c.teacherId);
                    const color = COURSE_COLORS[i % COURSE_COLORS.length];
                    return (
                      <div key={c.id} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 12,
                        marginBottom: 10, background: color + "08", borderRadius: "0 8px 8px 0", padding: "8px 10px 8px 12px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                          🕐 {c.schedule?.match(/\d+:\d+/)?.[0] || "—"} · 🚪 {c.room}
                        </div>
                        {t && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>👨‍🏫 {t.name}</div>}
                      </div>
                    );
                  })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
