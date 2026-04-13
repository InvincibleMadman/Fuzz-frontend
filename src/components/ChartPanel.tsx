import { Gauge } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel } from './Panel';

type RangeKey = '1m' | '5m' | '15m' | '1h';

const RANGE_SECONDS: Record<RangeKey, number> = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
};

export function ChartPanel({
  historyData,
  loading,
  metricName,
}: {
  historyData: Array<{ time: string; coverage: number; timestamp: number }>;
  loading: boolean;
  metricName: string;
}) {
  const [range, setRange] = useState<RangeKey>('5m');

  const filteredData = useMemo(() => {
    if (!historyData.length) return [];
    const lastTs = historyData[historyData.length - 1].timestamp;
    const limit = RANGE_SECONDS[range];
    return historyData.filter((item) => lastTs - item.timestamp <= limit);
  }, [historyData, range]);

  const latestValue = filteredData.length
    ? filteredData[filteredData.length - 1].coverage
    : '--';

  return (
    <Panel title="覆盖率趋势" icon={Gauge}>
      <div className="chart-meta">
        <span>{metricName}</span>
        <span>{loading ? '刷新中…' : `${filteredData.length} 个点`}</span>
      </div>

      <div className="chart-toolbar">
        <div className="chart-current-badge">当前值 {latestValue}</div>

        <div className="chart-range-tabs">
          {(['1m', '5m', '15m', '1h'] as RangeKey[]).map((item) => (
            <button
              key={item}
              type="button"
              className={`chart-range-tab ${range === item ? 'is-active' : ''}`}
              onClick={() => setRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="coverageFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(51,136,255,0.28)" />
                <stop offset="60%" stopColor="rgba(124,58,237,0.12)" />
                <stop offset="100%" stopColor="rgba(124,58,237,0.02)" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              minTickGap={28}
              tick={{ fontSize: 12, fill: '#7a8ea7' }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={52}
              tick={{ fontSize: 12, fill: '#7a8ea7' }}
            />

            <Tooltip
              cursor={{
                stroke: 'rgba(51,136,255,0.40)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
              contentStyle={{
                borderRadius: 14,
                border: '1px solid rgba(148,163,184,0.16)',
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 14px 32px rgba(15,23,42,0.12)',
              }}
            />

            <Area
              type="monotone"
              dataKey="coverage"
              stroke="rgba(51,136,255,0.95)"
              fill="url(#coverageFill)"
              strokeWidth={2.5}
              activeDot={{
                r: 4,
                fill: '#7c3aed',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}