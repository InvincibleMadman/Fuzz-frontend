import { LayoutDashboard } from 'lucide-react';
import { ChartPanel } from '../components/ChartPanel';
import { MetricCard } from '../components/MetricCard';
import { PageFrame } from '../components/PageFrame';
import { StatsPanel } from '../components/StatsPanel';
import { useAppContext } from '../context/AppContext';
import { buildHistoryChartData, buildTopStats } from '../lib/format';

export function OverviewPage() {
  const { session, stats, history, statsLoading } = useAppContext();
  const historyData = buildHistoryChartData(history);
  const topStatsEntries = buildTopStats(stats);

  const overviewMetrics = [
    {
      label: '当前进程',
      value: session.pid ?? '未启动',
      hint: session.outputPath ? '当前会话已绑定输出目录' : '等待启动 AFL',
    },
    {
      label: '分支覆盖',
      value: stats?.branchCoverage ?? '--',
      hint: stats?.coverageMetric || '等待 fuzzer_stats',
    },
    {
      label: '执行速度',
      value: String(stats?.stats?.execs_per_sec ?? '--'),
      hint: 'execs_per_sec',
    },
    {
      label: '总执行数',
      value: String(stats?.stats?.execs_done ?? '--'),
      hint: 'execs_done',
    },
  ];

  return (
    <PageFrame title="总览" description="核心状态、实时指标和覆盖率趋势集中展示" icon={LayoutDashboard}>
      <div className="page-grid overview-grid">
        <div className="metric-grid">
          {overviewMetrics.map((item) => (
            <MetricCard key={item.label} {...item} />
          ))}
        </div>
        <ChartPanel historyData={historyData} loading={statsLoading} metricName={history?.metric || 't_bits(branch)'} />
        <StatsPanel topStatsEntries={topStatsEntries} status={stats?.status || 'waiting_for_fuzzer_stats'} />
      </div>
    </PageFrame>
  );
}
