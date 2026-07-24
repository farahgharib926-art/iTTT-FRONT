// src/components/TicketCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

const SERVICE_LABEL = {
  onsite: "On-site visit",
  dropoff: "Drop-off",
  courier: "Courier",
};

function ticketRef(id) {
  return `DS-${String(id).padStart(5, "0")}`;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value.replace(" ", "T") + "Z").toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TicketCard({ ticket, showCustomer = false, index = 0 }) {
  const isUrgent = ticket.priority === "urgent";

  return (
    <motion.article
      className={`ticket-card ${isUrgent ? "ticket-card--urgent" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.4), ease: "easeOut" }}
      whileHover={{ y: -3 }}
    >
      <div className="ticket-card__main">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="ticket-card__id">{ticketRef(ticket.id)}</span>
          {isUrgent && <span className="priority-pill">URGENT</span>}
        </div>
        <h3 className="ticket-card__title">{ticket.device_type}</h3>
        <p className="ticket-card__issue">{ticket.issue_description}</p>
        <div className="ticket-card__footer">
          <span className="service-tag">{SERVICE_LABEL[ticket.service_type]}</span>
          <span>Logged {formatDate(ticket.created_at)}</span>
          {showCustomer && ticket.customer && (
            <span>
              · {ticket.customer.name}
              {ticket.customer.company_name ? ` (${ticket.customer.company_name})` : ""}
            </span>
          )}
          {ticket.staff && <span>· Assigned to {ticket.staff.name}</span>}
        </div>
      </div>
      <div className="ticket-card__side">
        <StatusBadge status={ticket.status} />
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
          <Link to={`/requests/${ticket.id}`} className="btn btn--ghost btn--sm">
            View ticket
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}

export { ticketRef, formatDate };
