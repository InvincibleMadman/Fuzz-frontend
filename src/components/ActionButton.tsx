import type { ReactNode } from 'react';
import { LoaderCircle, type LucideIcon } from 'lucide-react';

export function ActionButton({
  children,
  icon: Icon,
  loading,
  onClick,
  variant = 'primary',
  disabled,
}: {
  children: ReactNode;
  icon: LucideIcon;
  loading?: boolean;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  return (
    <button className={`action-button ${variant}`} onClick={onClick} disabled={disabled || loading}>
      {loading ? <LoaderCircle size={16} className="spin" /> : <Icon size={16} />}
      <span>{children}</span>
    </button>
  );
}
