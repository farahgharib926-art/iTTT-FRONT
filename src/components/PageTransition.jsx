// src/components/PageTransition.jsx
import { motion } from "framer-motion";

// Wraps a page's content so route changes animate with a soft fade + rise
// instead of snapping straight in. Kept short and quick so it reads as
// "polished", not as a loading delay.
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
