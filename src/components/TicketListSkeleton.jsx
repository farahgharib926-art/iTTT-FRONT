// src/components/TicketListSkeleton.jsx
export default function TicketListSkeleton({ rows = 3 }) {
  return (
    <div className="ticket-list" aria-busy="true" aria-label="Loading tickets">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton skeleton-ticket" style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}
