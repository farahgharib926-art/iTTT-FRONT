// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const MOCK_NOTIFS = [
  { id: 1, text: "Ticket DS-00003 status changed to In Progress", time: "2 min ago", read: false },
  { id: 2, text: "Technician assigned to DS-00001", time: "1h ago", read: false },
  { id: 3, text: "DS-00002 marked as Completed", time: "3h ago", read: true },
  { id: 4, text: "New message on ticket DS-00004", time: "Yesterday", read: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const panelRef = useRef(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("dernsupport_theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dernsupport_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === "dark" ? "light" : "dark"));
  }

  const unread = notifs.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__tag-icon" aria-hidden="true" />
          <span className="navbar__brand-text">
            <span className="navbar__brand-name">Dern-Support</span>
            <span className="navbar__brand-sub">IT REPAIR &amp; SUPPORT</span>
          </span>
        </Link>

        <nav className="navbar__nav">
          <Link to="/" className={`navbar__nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
          <Link to="/faq" className={`navbar__nav-link ${isActive("/faq") ? "active" : ""}`}>FAQ</Link>
          {user && (
            <Link to="/dashboard" className={`navbar__nav-link ${isActive("/dashboard") ? "active" : ""}`}>
              {user.role === "staff" ? "All tickets" : "My tickets"}
            </Link>
          )}
        </nav>

        <div className="navbar__right">
          <button
            className="navbar__notif-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          {user ? (
            <>
              {/* Notification bell */}
              <div className="navbar__notif-wrap" ref={panelRef}>
                <button
                  className="navbar__notif-btn"
                  onClick={() => setNotifOpen(o => !o)}
                  aria-label="Notifications"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  {unread > 0 && <span className="navbar__notif-dot">{unread}</span>}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      className="notif-panel"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="notif-panel__header">
                        <span>Notifications</span>
                        {unread > 0 && (
                          <button className="notif-panel__mark-read" onClick={markAllRead}>
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="notif-panel__list">
                        {notifs.map(n => (
                          <div
                            key={n.id}
                            className={`notif-item ${!n.read ? "notif-item--unread" : ""}`}
                            onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                          >
                            {!n.read && <span className="notif-item__dot" />}
                            <div className="notif-item__body">
                              <p>{n.text}</p>
                              <span className="notif-item__time">{n.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/profile" className={`navbar__nav-link ${isActive("/profile") ? "active" : ""}`}>
                <span className="navbar__avatar">{user.name.charAt(0).toUpperCase()}</span>
              </Link>
              <motion.button
                className="btn btn--ghost btn--sm"
                onClick={logout}
                whileTap={{ scale: 0.94 }}
              >
                Log out
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className={`btn btn--ghost btn--sm ${isActive("/login") ? "btn--ghost-active" : ""}`}>
                Log in
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn btn--primary btn--sm">
                  Create account
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
