import { useAppState }   from "./hooks/useAppState";
import Login             from "./pages/Login";
import Dashboard         from "./pages/Dashboard";
import Courses           from "./pages/Courses";
import Students          from "./pages/Students";
import Teachers          from "./pages/Teachers";
import Finance           from "./pages/Finance";
import Expenses          from "./pages/Expenses";
import Gamification      from "./pages/Gamification";
import Schedule          from "./pages/Schedule";
import Reports           from "./pages/Reports";
import Staff             from "./pages/Staff";
import AuditLog          from "./pages/AuditLog";
import Sidebar           from "./components/Sidebar";
import Topbar            from "./components/Topbar";
import { Toast }         from "./components/UI";

export default function App() {
  const state = useAppState();
  const {
    user, login, logout,
    tab, setTab,
    courses,      setCourses,
    students,     setStudents,
    payments,     setPayments,
    expenses,     setExpenses,
    rewards,      setRewards,
    pointHistory, setPointHistory,
    givePoints,   redeemReward,
    staffUsers,   setStaffUsers,
    auditLog,     addAudit,
    teachers,
    toast,        showToast,
  } = state;

  if (!user) return <Login onLogin={login} staffUsers={staffUsers} />;

  const notifications = [
    ...payments.filter((p) => p.status === "overdue").map((p) => ({
      type: "danger",
      msg: `${students.find((s) => s.id === p.studentId)?.name} — kechikkan to'lov`,
    })),
    ...payments.filter((p) => p.status === "pending").map((p) => ({
      type: "warn",
      msg: `${students.find((s) => s.id === p.studentId)?.name} — kutilayotgan to'lov`,
    })),
  ];

  const shared = { courses, setCourses, students, setStudents, payments, setPayments, teachers, user, addAudit, showToast };

  const pages = {
    dashboard:    <Dashboard students={students} courses={courses} payments={payments} expenses={expenses} notifications={notifications} />,
    courses:      <Courses {...shared} />,
    students:     <Students {...shared} />,
    teachers:     <Teachers teachers={teachers} courses={courses} payments={payments} />,
    finance:      <Finance payments={payments} setPayments={setPayments} students={students} courses={courses} addAudit={addAudit} showToast={showToast} />,
    expenses:     <Expenses expenses={expenses} setExpenses={setExpenses} user={user} addAudit={addAudit} showToast={showToast} />,
    gamification: <Gamification students={students} rewards={rewards} setRewards={setRewards} pointHistory={pointHistory} setPointHistory={setPointHistory} setStudents={setStudents} user={user} addAudit={addAudit} showToast={showToast} givePoints={givePoints} redeemReward={redeemReward} />,
    schedule:     <Schedule courses={courses} teachers={teachers} user={user} />,
    reports:      <Reports payments={payments} students={students} courses={courses} teachers={teachers} expenses={expenses} />,
    staff:        <Staff staffUsers={staffUsers} setStaffUsers={setStaffUsers} user={user} addAudit={addAudit} showToast={showToast} />,
    audit:        <AuditLog log={auditLog} users={staffUsers} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <Sidebar user={user} tab={tab} setTab={setTab} logout={logout} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Topbar tab={tab} notifications={notifications} logout={logout} />
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {pages[tab] || <div style={{ color: "#94a3b8", textAlign: "center", marginTop: 60 }}>Sahifa topilmadi</div>}
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
