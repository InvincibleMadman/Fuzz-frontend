import type { ApiEnvelope, CoverageHistoryPayload, FuzzStatsPayload } from '../types';
import { readBaseUrl } from './storage';

async function parseEnvelope<T>(response: Response) {
  const json = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !json.is_success) {
    throw new Error(json.msg || `请求失败（${response.status}）`);
  }
  return json;
}

async function request<T>(path: string, options?: RequestInit) {
  const response = await fetch(`${readBaseUrl()}${path}`, options);
  return parseEnvelope<T>(response);
}

export const api = {
  extractProtocol: (payload: {
    src: string;
    out: string;
    protocol: string;
    iterations?: number;
    temperature?: number;
    max_tokens?: number;
  }) =>
    request<Record<string, unknown>>('/extract_protocol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  uploadVuldoc: (files: FileList | File[]) => {
    const form = new FormData();
    Array.from(files).forEach((file) => form.append('file', file));
    return request<string[]>('/upload_Vuldoc', { method: 'POST', body: form });
  },

  generateSeeds: (payload: { iterations: number; vectorCount: number; temperatureCoefficient: number }) =>
    request<Record<string, string>>('/gen_init_seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  riskAnalysis: (payload: {
    targetPath: string;
    temperatureCoefficient: number;
    maxTokens: number;
    iterations: number;
  }) =>
    request<Record<string, unknown>>('/risk_code_analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  uploadRiskResult: (files: FileList | File[]) => {
    const form = new FormData();
    Array.from(files).forEach((file) => form.append('file', file));
    return request<string[]>('/riskres_upload', { method: 'POST', body: form });
  },

  instrumentRiskCode: () => request<Record<string, never>>('/risk_code_instrument', { method: 'POST' }),

  startFuzzing: (payload: { seedPath: string; outputPath: string; targetPath: string; riskAware: string }) =>
    request<{ pid: number; resolvedOutputPath: string; statsFilePath: string; dbPath: string }>('/fuzztesting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  stopFuzzing: (pid: number) =>
    request<{ pid: number; message: string }>('/stop_fuzztesting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pid }),
    }),

  getFuzzStats: (outputPath: string) =>
    request<FuzzStatsPayload>(`/get_fuzz_stats?outputPath=${encodeURIComponent(outputPath)}`),

  getCoverageHistory: (outputPath: string) =>
    request<CoverageHistoryPayload>(`/get_branch_coverage_history?outputPath=${encodeURIComponent(outputPath)}`),

  getDownloadUrl: (dbPath: string) => `${readBaseUrl()}/download_fuzz_log?dbPath=${encodeURIComponent(dbPath)}`,
};
