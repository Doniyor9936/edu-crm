import { STATUS_MAP } from "../utils/constants";

// ===================== MODAL =====================
export function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", borderRadius: 20, width, maxWidth: "95vw",
        maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748b" }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// ===================== FORM FIELD =====================
export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569",
        marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {children}
    </div>
  );
}

// ===================== INPUT STYLE =====================
export const inp = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", background: "#fff", color: "#0f172a",
};

// ===================== STATUS BADGE =====================
export function StatusBadge({ status }) {
  const d = STATUS_MAP[status] || STATUS_MAP.inactive;
  return (
    <span style={{ background: d.bg, color: d.color, padding: "2px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{d.label}</span>
  );
}

// ===================== TOAST =====================
export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000,
      padding: "12px 20px", borderRadius: 12,
      background: toast.type === "success" ? "#dcfce7" : "#fee2e2",
      color: toast.type === "success" ? "#15803d" : "#b91c1c",
      fontWeight: 600, fontSize: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      display: "flex", alignItems: "center", gap: 8 }}>
      {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
    </div>
  );
}

// ===================== BTN =====================
export function Btn({ onClick, children, color = "#6366f1", text = "#fff", style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: "9px 18px", background: color, color: text, border: "none",
      borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13,
      fontFamily: "inherit", ...style }}>
      {children}
    </button>
  );
}
