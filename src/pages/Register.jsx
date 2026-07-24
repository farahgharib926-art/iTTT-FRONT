// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company_name: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ ...form, role });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <motion.div
          className="auth-panel__content"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="navbar__tag-icon" aria-hidden="true" />
          <h1>Get your repairs on record.</h1>
          <p>
            Create a free account to log support requests and track them
            through to completion.
          </p>
          <div className="auth-panel__list">
            {[
              "Individuals can drop off or arrange a courier.",
              "Businesses get on-site visits from a technician.",
              "Staff accounts manage every open ticket in one place.",
            ].map((text, i) => (
              <motion.div
                className="auth-panel__list-item"
                key={text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.08 }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="auth-form-wrap">
        <motion.div
          className="form-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h2>Create your account</h2>
          <p>Tell us a little about you to get started.</p>

          <div className="role-toggle">
            <button
              type="button"
              className={role === "customer" ? "active" : ""}
              onClick={() => setRole("customer")}
            >
              I'm a customer
            </button>
            <button
              type="button"
              className={role === "staff" ? "active" : ""}
              onClick={() => setRole("staff")}
            >
              I'm Dern-Support staff
            </button>
          </div>

          {error && <div className="banner banner--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={form.name} onChange={update("name")} required autoFocus />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={update("email")}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={update("password")}
                required
              />
              <p className="field-hint">At least 6 characters.</p>
            </div>
            <div className="field">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" value={form.phone} onChange={update("phone")} />
            </div>
            {role === "customer" && (
              <div className="field">
                <label htmlFor="company_name">Company name (leave blank if individual)</label>
                <input
                  id="company_name"
                  value={form.company_name}
                  onChange={update("company_name")}
                />
              </div>
            )}
            <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="form-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
