// src/pages/NewRequest.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";

const SERVICE_OPTIONS = [
  { value: "onsite", label: "On-site visit", icon: "🏢" },
  { value: "dropoff", label: "Drop-off", icon: "📦" },
  { value: "courier", label: "Courier", icon: "🚚" },
];

const PRIORITY_OPTIONS = [
  { value: "normal", label: "Normal", icon: "🟢", desc: "Standard queue, 1–3 days" },
  { value: "urgent", label: "Urgent", icon: "🔴", desc: "Business-critical, fast-tracked" },
];

export default function NewRequest() {
  const navigate = useNavigate();
  const [deviceType, setDeviceType] = useState("");
  const [issue, setIssue] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [priority, setPriority] = useState("normal");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!serviceType) {
      setError("Please choose how you'd like this repair handled.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/requests", {
        device_type: deviceType,
        issue_description: issue,
        service_type: serviceType,
        priority,
      });
      navigate(`/requests/${res.data.request.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="page-header">
          <div>
            <span className="eyebrow">New request</span>
            <h1>Log a repair</h1>
            <p>Tell us what's wrong, and how you'd like to get it to us.</p>
          </div>
        </div>

        {error && <div className="banner banner--error">{error}</div>}

        <motion.form
          className="form-card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="field">
            <label htmlFor="device_type">Device</label>
            <input
              id="device_type"
              placeholder="e.g. Dell XPS 13 laptop, office desktop PC, iPhone 13"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="issue">What's the problem?</label>
            <textarea
              id="issue"
              placeholder="Describe the fault as best you can — error messages, when it started, anything you've already tried."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
            />
          </div>

          {/* Priority selector */}
          <div className="field">
            <label>Priority</label>
            <div className="priority-group">
              {PRIORITY_OPTIONS.map((opt) => (
                <motion.button
                  type="button"
                  key={opt.value}
                  className={`priority-tile ${priority === opt.value ? "priority-tile--selected priority-tile--" + opt.value : ""}`}
                  onClick={() => setPriority(opt.value)}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="priority-tile__icon" aria-hidden="true">{opt.icon}</span>
                  <span className="priority-tile__label">{opt.label}</span>
                  <span className="priority-tile__desc">{opt.desc}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>How should we handle this repair?</label>
            <div className="tile-group">
              {SERVICE_OPTIONS.map((opt) => (
                <motion.button
                  type="button"
                  key={opt.value}
                  className={`tile ${serviceType === opt.value ? "tile--selected" : ""}`}
                  onClick={() => setServiceType(opt.value)}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="tile__icon" aria-hidden="true">{opt.icon}</span>
                  {opt.label}
                </motion.button>
              ))}
            </div>
            <p className="field-hint">
              On-site visits are for business customers. Individuals can choose drop-off or courier.
            </p>
          </div>

          <motion.button
            className="btn btn--primary btn--block"
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.01 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
          >
            {submitting ? "Submitting…" : "Submit request"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
