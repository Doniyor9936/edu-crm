import { useState } from "react";
import {
  USERS_INIT, INITIAL_COURSES, INITIAL_STUDENTS,
  INITIAL_PAYMENTS, INITIAL_EXPENSES, INITIAL_REWARDS,
  INITIAL_POINT_HISTORY, AUDIT_LOG_INIT,
} from "../data/initialData";

const coursesWithCount = INITIAL_COURSES.map((c) => ({
  ...c,
  students: INITIAL_STUDENTS.filter((s) => s.courseIds.includes(c.id)).length,
}));

export function useAppState() {
  const [user,         setUser]         = useState(null);
  const [tab,          setTab]          = useState("dashboard");
  const [courses,      setCourses]      = useState(coursesWithCount);
  const [students,     setStudents]     = useState(INITIAL_STUDENTS);
  const [payments,     setPayments]     = useState(INITIAL_PAYMENTS);
  const [expenses,     setExpenses]     = useState(INITIAL_EXPENSES);
  const [rewards,      setRewards]      = useState(INITIAL_REWARDS);
  const [pointHistory, setPointHistory] = useState(INITIAL_POINT_HISTORY);
  const [staffUsers,   setStaffUsers]   = useState(USERS_INIT);
  const [auditLog,     setAuditLog]     = useState(AUDIT_LOG_INIT);
  const [toast,        setToast]        = useState(null);

  const teachers = staffUsers.filter((u) => u.role === "teacher");

  const addAudit = (action, target = "") => {
    setAuditLog((prev) => [
      { id: prev.length + 1, userId: user?.id, action, target, time: new Date().toLocaleString("uz-UZ") },
      ...prev,
    ]);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = (u) => {
    setUser(u);
    setAuditLog((prev) => [
      { id: prev.length + 1, userId: u.id, action: "Tizimga kirdi", target: "", time: new Date().toLocaleString("uz-UZ") },
      ...prev,
    ]);
  };

  const logout = () => {
    addAudit("Tizimdan chiqdi");
    setUser(null);
    setTab("dashboard");
  };

  // Talabaga bal berish
  const givePoints = (studentId, points, reason) => {
    setStudents((prev) => prev.map((s) =>
      s.id === studentId ? { ...s, points: (s.points || 0) + points } : s
    ));
    setPointHistory((prev) => [...prev, {
      id: prev.length + 1, studentId, points, reason,
      date: new Date().toISOString().split("T")[0],
      type: points > 0 ? "earn" : "redeem",
      givenBy: user?.id,
    }]);
    addAudit(points > 0 ? "Bal berdi" : "Bal ayirdi", `${points > 0 ? "+" : ""}${points} bal`);
  };

  // Sovg'a olish (redeem)
  const redeemReward = (studentId, reward) => {
    const student = students.find((s) => s.id === studentId);
    if (!student || (student.points || 0) < reward.points) return false;
    givePoints(studentId, -reward.points, `"${reward.name}" sovg'asi olindi`);
    setRewards((prev) => prev.map((r) => r.id === reward.id ? { ...r, claimed: r.claimed + 1 } : r));
    addAudit("Sovg'a oldi", `${student.name} — ${reward.name}`);
    showToast(`🎁 "${reward.name}" muvaffaqiyatli olindi!`);
    return true;
  };

  return {
    user, login, logout,
    tab, setTab,
    courses, setCourses,
    students, setStudents,
    payments, setPayments,
    expenses, setExpenses,
    rewards, setRewards,
    pointHistory, setPointHistory,
    givePoints, redeemReward,
    staffUsers, setStaffUsers,
    auditLog, addAudit,
    teachers,
    toast, showToast,
  };
}
