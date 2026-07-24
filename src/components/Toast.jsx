// src/components/Toast.jsx
import { AnimatePresence, motion } from "framer-motion";

// A small fixed-position confirmation toast. Pass `show` + `message`;
// the parent owns the timer that flips `show` back to false.
export default function Toast({ show, message }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <span className="toast__dot" aria-hidden="true" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
