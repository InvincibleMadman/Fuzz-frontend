import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function Panel({
  title,
  icon: Icon,
  children,
  scrollable = false,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  scrollable?: boolean;
}) {
  return (
    <motion.section whileHover={{ scale: 1.008 }} transition={{ duration: 0.18 }} className="panel card-soft">
      <div className="panel-head">
        <div className="panel-title">
          <Icon size={16} />
          <span>{title}</span>
        </div>
      </div>
      <div className={`panel-body ${scrollable ? 'scroll-area' : ''}`}>{children}</div>
    </motion.section>
  );
}
