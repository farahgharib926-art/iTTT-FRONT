// src/pages/FAQ.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_ITEMS = [
  {
    category: "Getting started",
    questions: [
      {
        q: "How do I log a repair request?",
        a: "Create an account or log in, then click 'New request' from your dashboard. Fill in your device type, describe the issue, and choose your preferred service method: on-site visit, drop-off, or courier."
      },
      {
        q: "What devices do you repair?",
        a: "We handle laptops, desktop PCs, servers, network equipment, printers, and most business hardware. If you're unsure whether we can help, just log a ticket and a technician will assess it."
      },
      {
        q: "Do I need an account to submit a request?",
        a: "Yes — an account lets you track every ticket in real time and see the full history of each repair. Registration only takes a minute."
      },
    ]
  },
  {
    category: "Service options",
    questions: [
      {
        q: "What's the difference between on-site, drop-off, and courier?",
        a: "On-site visits send a technician directly to your business premises — best for desktops, servers, or urgent issues. Drop-off means you bring the device to one of our offices. Courier arranges a tracked collection if you can't visit us in person."
      },
      {
        q: "Is on-site support available for individual customers?",
        a: "On-site visits are currently offered to business customers only. Individual customers can use drop-off or courier, which typically have faster turnaround times for personal devices."
      },
      {
        q: "How long does a typical repair take?",
        a: "Most repairs are completed within 1–3 business days after the device arrives with us. Complex hardware issues or parts orders may take longer — your technician will keep the ticket updated."
      },
    ]
  },
  {
    category: "Tracking & updates",
    questions: [
      {
        q: "How do I know when my repair is finished?",
        a: "Your ticket status updates in real time on your dashboard. You'll see it move from Pending → In Progress → Completed → Collected. Each step is logged in the ticket's history timeline."
      },
      {
        q: "Can I cancel a ticket I've already submitted?",
        a: "Yes — as long as the status is still 'Pending', you can cancel the ticket from the ticket detail page. Once work has started (In Progress), cancellation must be discussed with the assigned technician."
      },
      {
        q: "Can I add notes or extra information after submitting?",
        a: "Yes. Open the ticket detail page and use the 'Add a note' section to attach any additional context. Your technician will be able to see it immediately."
      },
    ]
  },
  {
    category: "Priority & urgency",
    questions: [
      {
        q: "What does Urgent priority mean?",
        a: "Marking a ticket as Urgent flags it to our team for faster assignment. Urgent tickets appear at the top of the workshop queue. There's no additional charge for the Urgent flag, but please use it for genuine business-critical situations."
      },
      {
        q: "Can I change the priority after submitting?",
        a: "Priority can be changed by the assigned technician or a staff member. If you need to escalate, add a note to the ticket explaining why, and the team will adjust accordingly."
      },
    ]
  },
];

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
      <button className="faq-item__trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{question}</span>
        <span className="faq-item__icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-item__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="faq-item__answer">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openKey, setOpenKey] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = FAQ_ITEMS.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q =>
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  function toggle(key) {
    setOpenKey(prev => (prev === key ? null : key));
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <span className="eyebrow">Knowledge base</span>
            <h1>Frequently asked questions</h1>
            <p>Everything you need to know about the Dern-Support repair portal.</p>
          </div>
        </motion.div>

        {/* Live search */}
        <motion.div
          className="faq-search"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <span className="faq-search__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search questions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="faq-search__input"
          />
          {search && (
            <button className="faq-search__clear" onClick={() => setSearch("")}>×</button>
          )}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="empty-state__icon">🔍</span>
            <h3>No results for "{search}"</h3>
            <p>Try a different search term or browse all categories below.</p>
          </motion.div>
        )}

        {filtered.map((cat, ci) => (
          <motion.section
            key={cat.category}
            className="faq-section"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: ci * 0.06 }}
          >
            <h2 className="faq-section__title">{cat.category}</h2>
            <div className="faq-group">
              {cat.questions.map((item, qi) => {
                const key = `${ci}-${qi}`;
                return (
                  <AccordionItem
                    key={key}
                    question={item.q}
                    answer={item.a}
                    isOpen={openKey === key}
                    onToggle={() => toggle(key)}
                  />
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
