// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
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
          <h1>Welcome back to Dern-Support.</h1>
          <p>Log in to check the status of your repairs or manage incoming tickets.</p>
          <div className="auth-panel__list">
            {[
              "See live status on every open repair.",
              "Full history of notes from our technicians.",
              "One account for all your devices.",
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
          <h2>Log in</h2>
          <p>Enter your details to access your account.</p>

          {error && <div className="banner banner--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="form-footer">
            New here? <Link to="/register">Create an account</Link>
          </div>
          <div className="form-footer">
            Demo staff login: staff@dernsupport.com / password123
          </div>
        </motion.div>
      </div>
    </div>
  );
}
