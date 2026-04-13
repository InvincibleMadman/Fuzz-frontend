import { AnimatePresence, motion } from 'framer-motion';
import type { ToastState } from '../types';

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className={`toast ${toast.type}`}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
