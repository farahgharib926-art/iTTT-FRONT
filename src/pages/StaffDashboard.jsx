// src/pages/StaffDashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import TicketCard from "../components/TicketCard";
import TicketListSkeleton from "../components/TicketListSkeleton";

const FILTERS = ["All", "Pending", "In Progress", "Completed", "Collected"];

export default function StaffDashboard() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const query = filter === "All" ? "" : `?status=${encodeURIComponent(filter)}`;
    api
      .get(`/requests${query}`)
      .then((res) => setRequests(res.data.requests))
      .catch(() => setError("Couldn't load tickets. Please try again."))
      .finally(() => setLoading(false));
  }, [filter]);

  const filtered = requests.filter(r =>
    !search ||
    r.device_type.toLowerCase().includes(search.toLowerCase()) ||
    r.issue_description.toLowerCase().includes(search.toLowerCase()) ||
    (r.customer?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    All: requests.length,
    Pending: requests.filter(r => r.status === "Pending").length,
    "In Progress": requests.filter(r => r.status === "In Progress").length,
    Completed: requests.filter(r => r.status === "Completed").length,
    Collected: requests.filter(r => r.status === "Collected").length,
  };

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
            <span className="eyebrow">Workshop queue</span>
            <h1>All repair tickets</h1>
            <p>Every request logged by every customer, newest first.</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          className="search-bar"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.06 }}
          style={{ marginBottom: 14 }}
        >
          <span className="search-bar__icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search by device, issue, or customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-bar__input"
          />
          {search && <button className="search-bar__clear" onClick={() => setSearch("")}>×</button>}
        </motion.div>

        <div className="filter-chips">
          {FILTERS.map((f, i) => (
            <motion.button
              key={f}
              className={`chip ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              whileTap={{ scale: 0.94 }}
            >
              {f}
              {counts[f] > 0 && <span className="chip__count">{counts[f]}</span>}
            </motion.button>
          ))}
        </div>

        {error && <div className="banner banner--error">{error}</div>}

        {loading ? (
          <TicketListSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="empty-state__icon" aria-hidden="true">🗂️</span>
            <h3>Nothing here</h3>
            <p>{search ? `No tickets match "${search}".` : `No tickets currently match "${filter}".`}</p>
          </motion.div>
        ) : (
          <div className="ticket-list">
            {filtered.map((r, i) => (
              <TicketCard key={r.id} ticket={r} showCustomer index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
