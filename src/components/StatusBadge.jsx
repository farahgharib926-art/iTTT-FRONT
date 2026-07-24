// src/components/StatusBadge.jsx
const STATUS_CLASS = {
  Pending: "status-badge--pending",
  "In Progress": "status-badge--progress",
  Completed: "status-badge--completed",
  Collected: "status-badge--collected",
};

export default function StatusBadge({ status }) {
  const cls = STATUS_CLASS[status] || "status-badge--pending";
  return <span className={`status-badge ${cls}`}>{status}</span>;
}
