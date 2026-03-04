// ===================== ROL MA'LUMOTLARI =====================
export const roleLabel = {
  admin:   "Administrator",
  teacher: "O'qituvchi",
  staff:   "Xodim",
};

export const roleColor = {
  admin:   "#7c3aed",
  teacher: "#0891b2",
  staff:   "#059669",
};

// ===================== RANGLAR =====================
export const COURSE_COLORS = ["#6366f1", "#0891b2", "#059669", "#f59e0b", "#ef4444", "#8b5cf6"];

export const EXPENSE_CATEGORIES = [
  "Ijara", "Kommunal", "Ish haqi", "Jihozlar", "Marketing", "Ta'mirlash", "Boshqa"
];

export const STATUS_MAP = {
  active:   { bg: "#dcfce7", color: "#15803d", label: "Faol" },
  inactive: { bg: "#f1f5f9", color: "#64748b", label: "Nofaol" },
  archived: { bg: "#fef9c3", color: "#a16207", label: "Arxiv" },
  paid:     { bg: "#dcfce7", color: "#15803d", label: "To'landi" },
  pending:  { bg: "#fef9c3", color: "#b45309", label: "Kutilmoqda" },
  overdue:  { bg: "#fee2e2", color: "#b91c1c", label: "Kechikkan" },
};

export const PAYMENT_METHODS = [
  { value: "naqd",     label: "Naqd pul" },
  { value: "karta",    label: "Plastik karta" },
  { value: "transfer", label: "Bank transfer" },
];

// ===================== NAV ITEMS =====================
export const NAV_ITEMS = [
  { id: "dashboard",    icon: "⊞",  label: "Dashboard",          roles: null },
  { id: "courses",      icon: "📚", label: "Kurslar",            roles: null },
  { id: "students",     icon: "🎓", label: "Talabalar",          roles: null },
  { id: "teachers",     icon: "👨‍🏫", label: "O'qituvchilar",    roles: ["admin", "staff"] },
  { id: "finance",      icon: "💳", label: "Moliya",             roles: ["admin", "staff"] },
  { id: "expenses",     icon: "💸", label: "Rasxodlar",          roles: ["admin", "staff"] },
  { id: "gamification", icon: "🏆", label: "Gamifikatsiya",      roles: null },
  { id: "schedule",     icon: "📅", label: "Jadval",             roles: null },
  { id: "reports",      icon: "📊", label: "Hisobotlar",         roles: ["admin", "staff"] },
  { id: "staff",        icon: "👥", label: "Xodimlar",           roles: ["admin"] },
  { id: "audit",        icon: "🔒", label: "Audit Log",          roles: ["admin"] },
];
