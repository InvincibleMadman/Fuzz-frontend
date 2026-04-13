import { Gauge } from 'lucide-react';

export function Topbar({
  baseUrl,
  onChangeBaseUrl,
  pid,
}: {
  baseUrl: string;
  onChangeBaseUrl: (value: string) => void;
  pid: number | null;
}) {
  return (
    <header className="topbar glass-panel">
      <div>
        <div className="eyebrow">解耦合 · 高性能 · 模块化</div>
        <div className="topbar-title">工业控制协议模糊测试系统控制台</div>
      </div>

      <div className="topbar-actions">
        <label className="field compact-field">
          <span>API Base URL</span>
          <input value={baseUrl} onChange={(e) => onChangeBaseUrl(e.target.value)} placeholder="http://127.0.0.1:5000" />
        </label>
        <div className="status-chip strong">
          <Gauge size={14} /> {pid ? `运行中 PID ${pid}` : '空闲中'}
        </div>
      </div>
    </header>
  );
}
