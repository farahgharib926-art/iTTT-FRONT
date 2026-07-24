// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useMemo } from "react";

const cards = [
  { icon: "🏢", title: "On-site support", body: "For business customers — a technician comes to you, no need to ship hardware." },
  { icon: "📦", title: "Drop-off", body: "Bring your device to one of our offices and track its repair online." },
  { icon: "🚚", title: "Courier", body: "Arrange a courier collection for your device if visiting isn't convenient." },
];

const PARTICLE_COLORS = ["var(--violet)", "var(--green)", "rgba(166,105,255,0.5)", "rgba(0,217,139,0.5)"];

function Particles() {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    bottom: `${-10 + Math.random() * 20}%`,
    size: 3 + Math.random() * 5,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    dur: `${3 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
  })), []);

  return (
    <div className="hero-particles" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: p.color,
            "--dur": p.dur,
            "--delay": p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container home-hero">
        <div className="home-hero__bg-grid" aria-hidden="true" />
        <Particles />

        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Repair tracking, without the phone tag
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          One ticket per repair, from drop-off to collection.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          Dern-Support's portal lets business and individual customers log a
          repair in minutes, and lets our technicians track every device
          through to completion — on-site, dropped off, or sent by courier.
        </motion.p>
        <motion.div
          className="home-hero__actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          {user ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/dashboard" className="btn btn--primary">Go to my tickets</Link>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="btn btn--primary">Create an account</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="btn btn--ghost">Log in</Link>
              </motion.div>
            </>
          )}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/faq" className="btn btn--ghost">FAQ & Help</Link>
          </motion.div>
        </motion.div>

        <div className="home-grid">
          {cards.map((c, i) => (
            <motion.div
              className="home-grid__card"
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="tile__icon" aria-hidden="true">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
