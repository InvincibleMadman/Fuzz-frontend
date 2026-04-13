import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function PageFrame({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="page-frame">
      <div className="page-head">
        <div className="page-head-icon">
          <Icon size={32} />
        </div>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
