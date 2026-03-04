import { useState } from "react";
import { Modal, Field, inp, Btn } from "../components/UI";
import { today } from "../utils/helpers";

const RANK_TIERS = [
  { min: 0,   max: 99,   label: "Yangi boshlovchi", icon: "🌱", color: "#94a3b8", bg: "#f1f5f9" },
  { min: 100, max: 249,  label: "Izlanuvchan",       icon: "⭐", color: "#f59e0b", bg: "#fffbeb" },
  { min: 250, max: 499,  label: "Faol talaba",        icon: "🔥", color: "#f97316", bg: "#fff7ed" },
  { min: 500, max: 999,  label: "Yulduz",             icon: "🏅", color: "#6366f1", bg: "#eef2ff" },
  { min: 1000, max: 9999, label: "Chempion",          icon: "🏆", color: "#059669", bg: "#f0fdf4" },
];

function getRank(points) {
  return RANK_TIERS.find((t) => points >= t.min && points <= t.max) || RANK_TIERS[0];
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ background: "#f1f5f9", borderRadius: 20, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 20, background: color, transition: "width 0.4s ease" }} />
    </div>
  );
}

export default function Gamification({ students, rewards, setRewards, pointHistory, setPointHistory, setStudents, user, addAudit, showToast, givePoints, redeemReward }) {
  const [activeTab,  setActiveTab]  = useState("leaderboard");
  const [modal,      setModal]      = useState(null); // "give" | "reward_form" | "redeem"
  const [selStudent, setSelStudent] = useState(null);
  const [selReward,  setSelReward]  = useState(null);
  const [giveForm,   setGiveForm]   = useState({ studentId: "", points: "", reason: "" });
  const [rewardForm, setRewardForm] = useState(emptyReward());
  const [editingRew, setEditingRew] = useState(null);

  function emptyReward() { return { name: "", points: "", icon: "🎁", stock: "", description: "" }; }

  const canManage   = ["admin", "teacher", "staff"].includes(user.role);
  const canEditRew  = ["admin"].includes(user.role);

  const sorted = [...students].sort((a, b) => (b.points || 0) - (a.points || 0));

  const handleGive = () => {
    if (!giveForm.studentId || !giveForm.points || !giveForm.reason) return;
    givePoints(Number(giveForm.studentId), Number(giveForm.points), giveForm.reason);
    showToast(`+${giveForm.points} bal berildi`);
    setModal(null); setGiveForm({ studentId: "", points: "", reason: "" });
  };

  const handleRedeem = () => {
    if (!selStudent || !selReward) return;
    const ok = redeemReward(selStudent.id, selReward);
    if (!ok) { showToast("Bal yetarli emas!", "error"); }
    setModal(null);
  };

  const saveReward = () => {
    if (!rewardForm.name || !rewardForm.points) return;
    if (editingRew) {
      setRewards((prev) => prev.map((r) => r.id === editingRew ? { ...r, ...rewardForm, points: Number(rewardForm.points), stock: Number(rewardForm.stock) } : r));
      showToast("Sovg'a yangilandi");
    } else {
      setRewards((prev) => [...prev, { ...rewardForm, id: Date.now(), points: Number(rewardForm.points), stock: Number(rewardForm.stock), claimed: 0 }]);
      showToast("Sovg'a qo'shildi");
    }
    addAudit(editingRew ? "Sovg'ani yangiladi" : "Yangi sovg'a qo'shdi", rewardForm.name);
    setModal(null); setEditingRew(null);
  };

  const tabStyle = (t) => ({
    padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit",
    fontSize: 13, fontWeight: 600, background: activeTab === t ? "#6366f1" : "#f1f5f9",
    color: activeTab === t ? "#fff" : "#64748b",
  });

  return (
    <div>
      {/* Give Points Modal */}
      {modal === "give" && (
        <Modal title="🎯 Bal berish" onClose={() => setModal(null)} width={420}>
          <Field label="Talaba">
            <select style={inp} value={giveForm.studentId} onChange={(e) => setGiveForm({ ...giveForm, studentId: e.target.value })}>
              <option value="">— Tanlang —</option>
              {students.filter((s) => s.status === "active").map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.points || 0} bal)</option>
              ))}
            </select>
          </Field>
          <Field label="Bal miqdori (manfiy = ayirish)">
            <input style={inp} type="number" value={giveForm.points} onChange={(e) => setGiveForm({ ...giveForm, points: e.target.value })} placeholder="50" />
          </Field>
          <Field label="Sabab">
            <input style={inp} value={giveForm.reason} onChange={(e) => setGiveForm({ ...giveForm, reason: e.target.value })} placeholder="Darsda faol ishtirok..." />
          </Field>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase" }}>Tezkor sabablar</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Darsda faol ishtirok", "Uy vazifasi topshirildi", "Test sinovida yuqori ball", "Olimpiadada ishtirok", "Oyning eng faol talabasi"].map((r) => (
                <button key={r} onClick={() => setGiveForm((f) => ({ ...f, reason: r }))} style={{ padding: "4px 10px", borderRadius: 6, border: `1.5px solid ${giveForm.reason === r ? "#6366f1" : "#e2e8f0"}`, background: giveForm.reason === r ? "#eef2ff" : "#fff", color: giveForm.reason === r ? "#6366f1" : "#64748b", cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "inherit" }}>{r}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handleGive} style={{ flex: 1, padding: 11 }}>✓ Tasdiqlash</Btn>
            <Btn onClick={() => setModal(null)} color="#f1f5f9" text="#64748b" style={{ padding: "11px 20px" }}>Bekor</Btn>
          </div>
        </Modal>
      )}

      {/* Redeem Modal */}
      {modal === "redeem" && selStudent && selReward && (
        <Modal title="🎁 Sovg'a olish" onClose={() => setModal(null)} width={400}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>{selReward.icon}</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{selReward.name}</h3>
            <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>{selReward.description}</p>
            <div style={{ display: "inline-flex", gap: 24, background: "#f8fafc", borderRadius: 12, padding: "14px 24px", marginBottom: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Talaba ballar</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#6366f1" }}>{selStudent.points || 0}</div>
              </div>
              <div style={{ width: 1, background: "#e2e8f0" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Kerakli bal</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>{selReward.points}</div>
              </div>
              <div style={{ width: 1, background: "#e2e8f0" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Qolgan bal</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: (selStudent.points || 0) >= selReward.points ? "#059669" : "#ef4444" }}>
                  {(selStudent.points || 0) - selReward.points}
                </div>
              </div>
            </div>
            {(selStudent.points || 0) < selReward.points && (
              <div style={{ background: "#fef2f2", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#b91c1c", fontSize: 13, fontWeight: 600 }}>
                ⚠ Bal yetarli emas! Yana {selReward.points - (selStudent.points || 0)} bal kerak.
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handleRedeem} color={(selStudent.points || 0) >= selReward.points ? "#059669" : "#94a3b8"} style={{ flex: 1, padding: 11 }}>
              🎁 Sovg'ani olish
            </Btn>
            <Btn onClick={() => setModal(null)} color="#f1f5f9" text="#64748b" style={{ padding: "11px 20px" }}>Bekor</Btn>
          </div>
        </Modal>
      )}

      {/* Reward Form Modal */}
      {modal === "reward_form" && (
        <Modal title={editingRew ? "Sovg'ani tahrirlash" : "Yangi sovg'a"} onClose={() => { setModal(null); setEditingRew(null); }} width={420}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 12 }}>
            <Field label="Sovg'a nomi"><input style={inp} value={rewardForm.name} onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })} placeholder="Kitob sovg'a" /></Field>
            <Field label="Icon"><input style={inp} value={rewardForm.icon} onChange={(e) => setRewardForm({ ...rewardForm, icon: e.target.value })} placeholder="🎁" /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Kerakli bal"><input style={inp} type="number" value={rewardForm.points} onChange={(e) => setRewardForm({ ...rewardForm, points: e.target.value })} placeholder="200" /></Field>
            <Field label="Ombordagi soni"><input style={inp} type="number" value={rewardForm.stock} onChange={(e) => setRewardForm({ ...rewardForm, stock: e.target.value })} placeholder="10" /></Field>
          </div>
          <Field label="Tavsif"><input style={inp} value={rewardForm.description} onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })} placeholder="Sovg'a haqida qisqacha..." /></Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={saveReward} style={{ flex: 1, padding: 11 }}>Saqlash</Btn>
            <Btn onClick={() => { setModal(null); setEditingRew(null); }} color="#f1f5f9" text="#64748b" style={{ padding: "11px 20px" }}>Bekor</Btn>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["leaderboard","🏆 Reyting"], ["rewards","🎁 Sovg'alar"], ["history","📋 Bal tarixi"]].map(([t, l]) => (
            <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>{l}</button>
          ))}
        </div>
        {canManage && activeTab === "leaderboard" && (
          <Btn onClick={() => setModal("give")}>🎯 Bal berish</Btn>
        )}
        {canEditRew && activeTab === "rewards" && (
          <Btn onClick={() => { setEditingRew(null); setRewardForm(emptyReward()); setModal("reward_form"); }}>+ Sovg'a qo'shish</Btn>
        )}
      </div>

      {/* ======= LEADERBOARD ======= */}
      {activeTab === "leaderboard" && (
        <div>
          {/* Top 3 podium */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, marginBottom: 28, padding: "0 20px" }}>
            {[sorted[1], sorted[0], sorted[2]].filter(Boolean).map((s, i) => {
              const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
              const heights = { 1: 110, 2: 80, 3: 65 };
              const colors  = { 1: "#f59e0b", 2: "#94a3b8", 3: "#cd7c3f" };
              const podH    = heights[pos] || 65;
              const rank    = getRank(s.points || 0);
              return (
                <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: pos === 1 ? 1.2 : 1 }}>
                  <div style={{ fontSize: pos === 1 ? 22 : 16, marginBottom: 6 }}>{rank.icon}</div>
                  <div style={{ width: pos === 1 ? 52 : 42, height: pos === 1 ? 52 : 42, borderRadius: "50%", background: `linear-gradient(135deg,${colors[pos]},${colors[pos]}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: pos === 1 ? 18 : 14, marginBottom: 6, boxShadow: pos === 1 ? "0 4px 16px rgba(245,158,11,0.4)" : "none" }}>{s.name[0]}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", marginBottom: 4, textAlign: "center" }}>{s.name.split(" ")[0]}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: colors[pos], marginBottom: 6 }}>{s.points || 0} bal</div>
                  <div style={{ width: "80%", height: podH, background: `linear-gradient(180deg,${colors[pos]}33,${colors[pos]}11)`, borderRadius: "8px 8px 0 0", border: `2px solid ${colors[pos]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: colors[pos] }}>{pos}</div>
                </div>
              );
            })}
          </div>

          {/* Full leaderboard */}
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            {sorted.map((s, i) => {
              const rank = getRank(s.points || 0);
              const nextTier = RANK_TIERS.find((t) => t.min > (s.points || 0));
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: "1px solid #f1f5f9", background: i < 3 ? rank.bg : "#fff" }}>
                  <div style={{ width: 28, textAlign: "center", fontWeight: 800, fontSize: 16, color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7c3f" : "#94a3b8" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{s.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 12, padding: "1px 8px", borderRadius: 20, background: rank.bg, color: rank.color, fontWeight: 600 }}>{rank.icon} {rank.label}</span>
                      {nextTier && <span style={{ fontSize: 11, color: "#94a3b8" }}>Keyingi: {nextTier.min - (s.points || 0)} bal</span>}
                    </div>
                  </div>
                  <div style={{ width: 180 }}>
                    <ProgressBar value={(s.points || 0) % 500} max={500} color={rank.color} />
                  </div>
                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: rank.color }}>{s.points || 0}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>ball</div>
                  </div>
                  {canManage && (
                    <button onClick={() => { setGiveForm({ studentId: String(s.id), points: "", reason: "" }); setModal("give"); }} style={{ padding: "6px 12px", background: "#eef2ff", color: "#6366f1", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>+Bal</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======= REWARDS ======= */}
      {activeTab === "rewards" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
            {rewards.map((r) => {
              const available = r.stock - r.claimed;
              return (
                <div key={r.id} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: available === 0 ? "1.5px solid #f1f5f9" : "1.5px solid #e0e7ff", opacity: available === 0 ? 0.65 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ fontSize: 40 }}>{r.icon}</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Qolgan soni</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: available > 0 ? "#059669" : "#ef4444" }}>{available}</div>
                    </div>
                  </div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{r.name}</h3>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: "#64748b" }}>{r.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 16 }}>⭐</span>
                      <span style={{ fontWeight: 800, fontSize: 18, color: "#6366f1" }}>{r.points}</span>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>bal</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{r.claimed} marta olindi</span>
                  </div>
                  <ProgressBar value={r.claimed} max={r.stock} color="#6366f1" />
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={() => {
                      setSelReward(r);
                      setModal("select_student");
                    }} disabled={available === 0} style={{ flex: 1, padding: "9px", background: available > 0 ? "#eef2ff" : "#f1f5f9", color: available > 0 ? "#6366f1" : "#94a3b8", border: "none", borderRadius: 8, cursor: available > 0 ? "pointer" : "default", fontWeight: 700, fontSize: 12, fontFamily: "inherit" }}>
                      🎁 Taqdim etish
                    </button>
                    {canEditRew && (
                      <button onClick={() => { setEditingRew(r.id); setRewardForm({ name: r.name, points: r.points, icon: r.icon, stock: r.stock, description: r.description }); setModal("reward_form"); }} style={{ padding: "9px 12px", background: "#f8fafc", color: "#64748b", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>✏</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Select Student for Reward */}
      {modal === "select_student" && selReward && (
        <Modal title={`🎁 "${selReward.name}" — Talaba tanlang`} onClose={() => setModal(null)} width={480}>
          <div style={{ marginBottom: 12, padding: "12px 16px", background: "#eef2ff", borderRadius: 10, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>{selReward.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{selReward.name}</div>
              <div style={{ fontSize: 12, color: "#6366f1" }}>Kerakli bal: <strong>{selReward.points}</strong></div>
            </div>
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {[...students].sort((a, b) => (b.points || 0) - (a.points || 0)).map((s) => {
              const rank   = getRank(s.points || 0);
              const enough = (s.points || 0) >= selReward.points;
              return (
                <div key={s.id} onClick={() => { if (!enough) return; setSelStudent(s); setModal("redeem"); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, marginBottom: 6, cursor: enough ? "pointer" : "default", background: enough ? "#f8fafc" : "#f1f5f9", opacity: enough ? 1 : 0.5, border: "1.5px solid transparent", transition: "all 0.15s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{s.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{rank.icon} {rank.label}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: enough ? "#059669" : "#ef4444" }}>{s.points || 0}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>ball</div>
                  </div>
                  {enough && <span style={{ fontSize: 16 }}>→</span>}
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* ======= BAL TARIXI ======= */}
      {activeTab === "history" && (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
            📋 Barcha bal harakatlari ({pointHistory.length})
          </div>
          {[...pointHistory].reverse().map((h, i) => {
            const s = students.find((s) => s.id === h.studentId);
            return (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: h.points > 0 ? "linear-gradient(135deg,#059669,#34d399)" : "linear-gradient(135deg,#ef4444,#f87171)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                  {h.points > 0 ? "+" : "−"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{s?.name || "—"}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{h.reason}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: h.points > 0 ? "#059669" : "#ef4444" }}>
                    {h.points > 0 ? "+" : ""}{h.points}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{h.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
