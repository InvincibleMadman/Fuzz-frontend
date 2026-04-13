import type { CoverageHistoryPayload, FuzzStatsPayload } from '../types';

export function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function buildHistoryChartData(history: CoverageHistoryPayload | null) {
  return (history?.history || []).map((item) => ({
    timestamp: item.timestamp,
    time: new Date(item.timestamp * 1000).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    coverage: Number(item.coverage.toFixed(3)),
  }));
}

export function buildTopStats(stats: FuzzStatsPayload | null) {
  return Object.entries(stats?.stats || {})
    .slice(0, 12)
    .map(([key, value]) => ({ key, value: String(value) }));
}