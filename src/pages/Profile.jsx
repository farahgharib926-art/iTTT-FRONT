// src/pages/Profile.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const MOCK_STATS = [
  { label: "Tickets submitted", value: 7 },
  { label: "Repairs completed", value: 5 },
  { label: "Avg. resolution (days)", value: 2.3 },
  { label: "Active tickets", value: 2 },
];

function AnimatedCounter({ target, duration = 1.4 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  function start() {
    if (started) return;
    setStarted(true);
    const isFloat = !Number.isInteger(target);
    const steps = 50;
    const interval = (duration * 1000) / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      setCount(isFloat ? parseFloat(val.toFixed(1)) : Math.round(val));
      if (current >= steps) clearInterval(timer);
    }, interval);
  }

  return (
    <motion.span
      onViewportEnter={start}
      viewport={{ once: true }}
    >
      {count}
    </motion.span>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [company, setCompany] = useState(user?.company_name || "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateProfile({
        name,
        company_name: company,
        current_password: currentPw || undefined,
        new_password: newPw || undefined,
      });
      setToastMsg("Profile updated successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
      setCurrentPw("");
      setNewPw("");
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  const initials = (user?.name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 780 }}>
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <span className="eyebrow">Account</span>
            <h1>Profile settings</h1>
            <p>Manage your personal details and view your repair history.</p>
          </div>
        </motion.div>

        {/* Avatar hero */}
        <motion.div
          className="profile-hero"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <div className="profile-avatar">
            <span className="profile-avatar__initials">{initials}</span>
            <span className="profile-avatar__glow" aria-hidden="true" />
          </div>
          <div>
            <h2 className="profile-hero__name">{user?.name}</h2>
            <p className="profile-hero__role">
              {user?.role === "staff" ? "Technician · Staff" : "Customer"}
              {user?.company_name ? ` · ${user.company_name}` : ""}
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        {user?.role === "customer" && (
          <motion.div
            className="profile-stats"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            {MOCK_STATS.map((s, i) => (
              <motion.div
                className="profile-stat"
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
              >
                <span className="profile-stat__value">
                  <AnimatedCounter target={s.value} />
                </span>
                <span className="profile-stat__label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Edit form */}
        <motion.div
          className="profile-grid"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
        >
          <form className="detail-card" onSubmit={handleSave}>
            <h3>Personal information</h3>
            {error && <div className="banner banner--error" style={{ marginBottom: 14 }}>{error}</div>}
            <div className="field">
              <label htmlFor="prof-name">Full name</label>
              <input
                id="prof-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="prof-email">Email address</label>
              <input
                id="prof-email"
                type="email"
                value={email}
                disabled
                title="Email address can't be changed."
              />
            </div>
            {user?.role === "customer" && (
              <div className="field">
                <label htmlFor="prof-company">Company name <span style={{ color: "var(--ink-faint)", fontWeight: 400 }}>(optional)</span></label>
                <input
                  id="prof-company"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Leave blank for individual customers"
                />
              </div>
            )}

            <h3 style={{ marginTop: 20 }}>Change password</h3>
            <div className="field">
              <label htmlFor="prof-cur-pw">Current password</label>
              <input
                id="prof-cur-pw"
                type="password"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="field">
              <label htmlFor="prof-new-pw">New password</label>
              <input
                id="prof-new-pw"
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="8+ characters"
              />
            </div>

            <motion.button
              className="btn btn--primary btn--block"
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.01 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              style={{ marginTop: 8 }}
            >
              {saving ? "Saving…" : "Save changes"}
            </motion.button>
          </form>

          {/* Account info panel */}
          <div className="detail-card">
            <h3>Account info</h3>
            <div className="kv">
              <span>Role</span>
              <span style={{ textTransform: "capitalize" }}>{user?.role}</span>
            </div>
            <div className="kv">
              <span>Member since</span>
              <span>June 2025</span>
            </div>
            <div className="kv">
              <span>Account ID</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>USR-{String(user?.id || 1).padStart(5, "0")}</span>
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 12 }}>Danger zone</p>
              <button className="btn btn--danger btn--sm btn--block" type="button">
                Delete account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Toast show={showToast} message={toastMsg} />
    </div>
  );
}
