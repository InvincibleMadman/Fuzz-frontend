import { EmptyState } from './EmptyState';

export function TagList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (!items.length) return <EmptyState text={emptyText} />;
  return (
    <div className="tag-list">
      {items.map((item) => (
        <span key={item} className="tag-item">
          {item}
        </span>
      ))}
    </div>
  );
}
