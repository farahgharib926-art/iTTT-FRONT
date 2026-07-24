// src/pages/CustomerDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import TicketCard from "../components/TicketCard";
import TicketListSkeleton from "../components/TicketListSkeleton";

const STAT_DEFS = [
  { key: "total", label: "Total tickets", color: "var(--violet)" },
  { key: "pending", label: "Pending", color: "var(--amber)" },
  { key: "progress", label: "In progress", color: "var(--violet)" },
  { key: "completed", label: "Completed", color: "var(--green)" },
];

function AnimatedNumber({ target }) {
  const [val, setVal] = useState(0);
  const [triggered, setTriggered] = useState(false);

  function trigger() {
    if (triggered) return;
    setTriggered(true);
    const steps = 30;
    const interval = 800 / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur++;
      setVal(Math.round((cur / steps) * target));
      if (cur >= steps) clearInterval(t);
    }, interval);
  }

  return (
    <motion.span onViewportEnter={trigger} viewport={{ once: true }}>
      {val}
    </motion.span>
  );
}

export default function CustomerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/requests")
      .then((res) => setRequests(res.data.requests))
      .catch(() => setError("Couldn't load your tickets. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "Pending").length,
    progress: requests.filter(r => r.status === "In Progress").length,
    completed: requests.filter(r => r.status === "Completed" || r.status === "Collected").length,
  };

  const filtered = requests.filter(r =>
    !search ||
    r.device_type.toLowerCase().includes(search.toLowerCase()) ||
    r.issue_description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <span className="eyebrow">My account</span>
            <h1>My repair tickets</h1>
            <p>Every device you've sent in, and where it's at right now.</p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Link to="/requests/new" className="btn btn--primary">
              + New request
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        {!loading && requests.length > 0 && (
          <motion.div
            className="dash-stats"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
          >
            {STAT_DEFS.map((s, i) => (
              <motion.div
                className="dash-stat"
                key={s.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
              >
                <span className="dash-stat__value" style={{ color: s.color }}>
                  <AnimatedNumber target={stats[s.key]} />
                </span>
                <span className="dash-stat__label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Live search */}
        {!loading && requests.length > 0 && (
          <motion.div
            className="search-bar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.12 }}
          >
            <span className="search-bar__icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search tickets…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-bar__input"
            />
            {search && <button className="search-bar__clear" onClick={() => setSearch("")}>×</button>}
          </motion.div>
        )}

        {error && <div className="banner banner--error">{error}</div>}

        {loading ? (
          <TicketListSkeleton rows={3} />
        ) : requests.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="empty-state__icon" aria-hidden="true">🗂️</span>
            <h3>No repair tickets yet</h3>
            <p>When you log a support request, it'll show up here.</p>
            <div style={{ marginTop: 16 }}>
              <Link to="/requests/new" className="btn btn--primary btn--sm">
                Log your first request
              </Link>
            </div>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="empty-state__icon">🔍</span>
            <h3>No tickets match "{search}"</h3>
            <p>Try a different search term.</p>
          </motion.div>
        ) : (
          <div className="ticket-list">
            {filtered.map((r, i) => (
              <TicketCard key={r.id} ticket={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
