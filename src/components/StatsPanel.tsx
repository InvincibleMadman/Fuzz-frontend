import { Activity } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Panel } from './Panel';

export function StatsPanel({
  topStatsEntries,
  status,
}: {
  topStatsEntries: Array<{ key: string; value: string }>;
  status: string;
}) {
  return (
    <Panel title="实时状态" icon={Activity} scrollable>
      <div className="chart-meta">
        <span>状态：{status}</span>
        <span>{topStatsEntries.length} 项</span>
      </div>
      <div className="stats-list">
        {topStatsEntries.length ? (
          topStatsEntries.map((item) => (
            <div key={item.key} className="stat-row">
              <div className="stat-row__inner">
                <span className="stat-key">{item.key}</span>
                <strong className="stat-value">{item.value}</strong>
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="等待 fuzzer_stats 生成或请先启动模糊测试" />
        )}
      </div>
    </Panel>
  );
}
