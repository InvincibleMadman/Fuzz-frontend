import type { LucideIcon } from 'lucide-react';

export type ApiEnvelope<T> = {
  code: number;
  is_success: boolean;
  msg: string;
  data: T;
};

export type FuzzStatsPayload = {
  stats: Record<string, string | number>;
  resolvedOutputPath: string;
  statsFilePath: string;
  dbPath: string;
  coverageMetric?: string | null;
  branchCoverage?: number | null;
  status: 'waiting_for_fuzzer_stats' | 'ok';
};

export type CoverageHistoryPayload = {
  history: Array<{ timestamp: number; coverage: number }>;
  metric: string;
  dbPath: string;
  statsFilePath: string;
  resolvedOutputPath: string;
};

export type SessionState = {
  pid: number | null;
  outputPath: string;
  dbPath: string;
  statsFilePath: string;
};

export type ToastState = { type: 'success' | 'error'; message: string } | null;

export type NavRoute = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export type SeedFiles = Record<string, string>;
