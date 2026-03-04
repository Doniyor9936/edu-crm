import { useState } from "react";
import { roleLabel } from "../utils/constants";
import { Field, inp } from "../components/UI";

export default function Login({ onLogin, staffUsers }) {
  const [email,   setEmail]   = useState("admin@edu.uz");
  const [pass,    setPass]    = useState("admin123");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      const u = staffUsers.find((u) => u.email === email && u.password === pass && u.status !== "inactive");
      if (u) onLogin(u);
      else { setErr("Email/parol noto'g'ri yoki hisob o'chirilgan"); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg,#020617 0%,#0f172a 50%,#1e1b4b 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%,rgba(99,102,241,0.15) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(16,185,129,0.1) 0%,transparent 40%)" }} />
      <div style={{ margin: "auto", width: 440, padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🎓</div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>EduCRM</h1>
          <p style={{ color: "#94a3b8", margin: "6px 0 0", fontSize: 14 }}>O'quv Markaz Boshqaruv Tizimi</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
          <Field label="Email">
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inp, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="email@edu.uz" />
          </Field>
          <Field label="Parol">
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ ...inp, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handle()} />
          </Field>
          {err && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 12px", padding: "8px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 8 }}>⚠ {err}</p>}
          <button onClick={handle} disabled={loading} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", fontFamily: "inherit", opacity: loading ? 0.8 : 1 }}>
            {loading ? "Kirish..." : "Tizimga kirish →"}
          </button>
          <div style={{ marginTop: 20, padding: 14, background: "rgba(99,102,241,0.1)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)" }}>
            <p style={{ color: "#a5b4fc", fontSize: 12, margin: "0 0 8px", fontWeight: 600 }}>Test hisoblar:</p>
            {staffUsers.map((u) => (
              <button key={u.id} onClick={() => { setEmail(u.email); setPass(u.password); }} style={{ display: "block", width: "100%", textAlign: "left", color: "#c7d2fe", fontSize: 11, marginBottom: 4, background: "none", border: "none", cursor: "pointer", padding: "2px 0", fontFamily: "inherit" }}>
                • {u.email} / {u.password} <span style={{ color: "#818cf8", fontWeight: 600 }}>({roleLabel[u.role]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
