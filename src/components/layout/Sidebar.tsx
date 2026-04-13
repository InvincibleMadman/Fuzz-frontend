import { Activity, ChevronLeft, ChevronRight, Gauge, Link2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navRoutes } from '../../config/navigation';

export function Sidebar({
  baseUrl,
  collapsed,
  onToggle,
  pid,
  coverage,
  isPolling,
}: {
  baseUrl: string;
  collapsed: boolean;
  onToggle: () => void;
  pid: number | null;
  coverage: number | null;
  isPolling: boolean;
}) {
  return (
    <aside className={`sidebar glass-panel ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="brand-block">
          <div className="brand-mark">Φ</div>

          <div className="brand-copy">
            <div className="eyebrow">Fuzzing System</div>
            <h1>Light Console</h1>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? '展开导航' : '折叠导航'}
          title={collapsed ? '展开导航' : '折叠导航'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="sidebar-nav-shell">
        <nav className="nav-list">
          {navRoutes.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'is-icon-only' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <span className="nav-item__active-rail" />
              <span className="nav-item__icon">
                <Icon size={20} />
              </span>
              <span className="nav-item__label">{label}</span>
              {!collapsed && <ChevronRight size={16} className="nav-arrow" />}
            </NavLink>
          ))}
        </nav>
      </div>

      {!collapsed && (
        <div className="sidebar-footer card-soft system-panel">
          <div className="system-panel__title">System Status</div>

          <div className="system-panel__row">
            <span className="system-panel__label">
              <Link2 size={14} />
              API
            </span>
            <strong className="system-panel__value" title={baseUrl}>
              {baseUrl}
            </strong>
          </div>

          <div className="system-panel__row">
            <span className="system-panel__label">
              <Activity size={14} />
              Engine
            </span>
            <strong className="system-panel__value">
              {pid ? `Running · PID ${pid}` : 'Idle'}
            </strong>
          </div>

          <div className="system-panel__row">
            <span className="system-panel__label">
              <Gauge size={14} />
              Coverage
            </span>
            <strong className="system-panel__value">
              {coverage ?? '--'}
            </strong>
          </div>

          <div className={`system-panel__pulse ${isPolling ? 'is-live' : ''}`}>
            {isPolling ? 'Polling metrics…' : 'Waiting for next refresh'}
          </div>
        </div>
      )}
    </aside>
  );
}