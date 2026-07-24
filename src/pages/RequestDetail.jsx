// src/pages/RequestDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import { ticketRef, formatDate } from "../components/TicketCard";

const SERVICE_LABEL = {
  onsite: "On-site visit",
  dropoff: "Drop-off",
  courier: "Courier",
};
const STATUSES = ["Pending", "In Progress", "Completed", "Collected"];

const PRIORITY_BADGE = {
  urgent: <span className="priority-badge priority-badge--urgent">🔴 Urgent</span>,
  normal: <span className="priority-badge priority-badge--normal">🟢 Normal</span>,
};

function formatTimestamp(value) {
  if (!value) return "";
  return new Date(value.replace(" ", "T") + "Z").toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusInput, setStatusInput] = useState("");
  const [assignedInput, setAssignedInput] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Customer note state
  const [customerNote, setCustomerNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  function loadTicket() {
    setLoading(true);
    api
      .get(`/requests/${id}`)
      .then((res) => {
        setRequest(res.data.request);
        setUpdates(res.data.updates);
        setStatusInput(res.data.request.status);
        setAssignedInput(res.data.request.assigned_staff_id || "");
      })
      .catch(() => setError("Couldn't load this ticket."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTicket();
    if (user.role === "staff") {
      api.get("/staff").then((res) => setStaffList(res.data.staff));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await api.patch(`/requests/${id}`, {
        status: statusInput,
        assigned_staff_id: assignedInput ? Number(assignedInput) : null,
        note: note.trim() || undefined,
      });
      setRequest(res.data.request);
      setNote("");
      loadTicket();
      setToastMsg("Ticket updated successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("Cancel this ticket? This can't be undone.")) return;
    setCancelling(true);
    try {
      await api.patch(`/requests/${id}`, { status: "Cancelled" });
      loadTicket();
      setToastMsg("Ticket cancelled");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch {
      setError("Couldn't cancel this ticket.");
    } finally {
      setCancelling(false);
    }
  }

  async function handleCustomerNote(e) {
    e.preventDefault();
    if (!customerNote.trim()) return;
    setAddingNote(true);
    try {
      await api.patch(`/requests/${id}`, { note: customerNote.trim() });
      setCustomerNote("");
      loadTicket();
      setToastMsg("Note added");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch {
      setError("Couldn't add note.");
    } finally {
      setAddingNote(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="skeleton skeleton-line" style={{ width: 120, height: 11 }} />
          <div className="skeleton skeleton-line" style={{ width: 280, height: 26, marginTop: 8 }} />
          <div className="detail-grid" style={{ marginTop: 24 }}>
            <div className="detail-card">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-line" style={{ marginTop: 14 }} />
              ))}
            </div>
            <div className="detail-card">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-line" style={{ marginTop: 14 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error && !request) {
    return (
      <div className="page">
        <div className="container">
          <div className="banner banner--error">{error}</div>
        </div>
      </div>
    );
  }
  if (!request) return null;

  const canCancel = user.role === "customer" && request.status === "Pending";
  const isCancelled = request.status === "Cancelled";

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">{ticketRef(request.id)}</span>
            <h1 style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {request.device_type}
              {request.priority === "urgent" && (
                <span className="priority-badge priority-badge--urgent" style={{ fontSize: 13 }}>🔴 Urgent</span>
              )}
            </h1>
            <p>Logged {formatDate(request.created_at)}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {canCancel && (
              <motion.button
                className="btn btn--danger btn--sm"
                onClick={handleCancel}
                disabled={cancelling}
                whileTap={{ scale: 0.96 }}
              >
                {cancelling ? "Cancelling…" : "Cancel ticket"}
              </motion.button>
            )}
            <Link to="/dashboard" className="btn btn--ghost btn--sm">
              ← Back to tickets
            </Link>
          </div>
        </div>

        {error && <div className="banner banner--error">{error}</div>}
        {isCancelled && <div className="banner banner--error">This ticket has been cancelled.</div>}

        <div className="detail-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="detail-card">
              <h3>Ticket details</h3>
              <div className="kv">
                <span>Status</span>
                <StatusBadge status={request.status} />
              </div>
              <div className="kv">
                <span>Priority</span>
                {PRIORITY_BADGE[request.priority || "normal"]}
              </div>
              <div className="kv">
                <span>Service type</span>
                <span>{SERVICE_LABEL[request.service_type]}</span>
              </div>
              <div className="kv">
                <span>Reported issue</span>
                <span style={{ textAlign: "right", maxWidth: 280 }}>
                  {request.issue_description}
                </span>
              </div>
              {request.customer && (
                <div className="kv">
                  <span>Customer</span>
                  <span>
                    {request.customer.name}
                    {request.customer.company_name ? ` (${request.customer.company_name})` : ""}
                  </span>
                </div>
              )}
              <div className="kv">
                <span>Assigned technician</span>
                <span>{request.staff ? request.staff.name : "Unassigned"}</span>
              </div>
            </div>

            {/* Customer: add a note */}
            {user.role === "customer" && !isCancelled && (
              <form className="detail-card" onSubmit={handleCustomerNote}>
                <h3>Add a note</h3>
                <div className="field">
                  <textarea
                    placeholder="Any additional information for the technician…"
                    value={customerNote}
                    onChange={e => setCustomerNote(e.target.value)}
                    style={{ minHeight: 80 }}
                  />
                </div>
                <motion.button
                  className="btn btn--ghost btn--sm"
                  type="submit"
                  disabled={addingNote || !customerNote.trim()}
                  whileTap={{ scale: 0.97 }}
                >
                  {addingNote ? "Adding…" : "Add note"}
                </motion.button>
              </form>
            )}

            {/* Staff control panel */}
            {user.role === "staff" && (
              <form className="detail-card" onSubmit={handleSave}>
                <h3>Update this ticket</h3>
                <div className="field">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="assigned">Assign technician</label>
                  <select
                    id="assigned"
                    value={assignedInput}
                    onChange={(e) => setAssignedInput(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="note">Add a note (optional)</label>
                  <textarea
                    id="note"
                    placeholder="e.g. Replaced the screen, waiting on customer collection."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <motion.button
                  className="btn btn--primary btn--block"
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: saving ? 1 : 1.01 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                >
                  {saving ? "Saving…" : "Save changes"}
                </motion.button>
              </form>
            )}
          </div>

          <div className="detail-card">
            <h3>History</h3>
            <div className="timeline">
              {updates.length === 0 && (
                <p style={{ color: "var(--ink-faint)", fontSize: 14 }}>No updates yet.</p>
              )}
              {updates.map((u, i) => (
                <motion.div
                  className="timeline__item"
                  key={u.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.06 }}
                >
                  <span className="timeline__dot" aria-hidden="true" />
                  <div className="timeline__time">{formatTimestamp(u.created_at)}</div>
                  <div className="timeline__note">{u.note}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toast show={showToast} message={toastMsg} />
    </div>
  );
}
