import { Activity, FlaskConical, Play, Square } from 'lucide-react';
import { useState } from 'react';
import { ActionButton } from '../components/ActionButton';
import { ChartPanel } from '../components/ChartPanel';
import { Field } from '../components/Field';
import { PageFrame } from '../components/PageFrame';
import { Panel } from '../components/Panel';
import { StatsPanel } from '../components/StatsPanel';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';
import { buildHistoryChartData, buildTopStats } from '../lib/format';

export function FuzzPage() {
  const { session, setSession, history, stats, statsLoading, notifyError, notifySuccess } = useAppContext();
  const [form, setForm] = useState({ seedPath: '', outputPath: '', targetPath: '', riskAware: true });
  const [loading, setLoading] = useState(false);

  const historyData = buildHistoryChartData(history);
  const topStatsEntries = buildTopStats(stats);

  async function handleStart() {
    try {
      setLoading(true);
      const response = await api.startFuzzing({ ...form, riskAware: String(form.riskAware) });
      setSession({
        pid: response.data.pid,
        outputPath: response.data.resolvedOutputPath,
        dbPath: response.data.dbPath,
        statsFilePath: response.data.statsFilePath,
      });
      notifySuccess(`模糊测试已启动，PID=${response.data.pid}`);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    if (!session.pid) return;
    try {
      setLoading(true);
      await api.stopFuzzing(session.pid);
      setSession((prev) => ({ ...prev, pid: null }));
      notifySuccess('模糊测试已停止');
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageFrame title="模糊测试" description="Fuzz 启动、停止、实时状态、覆盖率历史和日志下载" icon={FlaskConical}>
      <div className="page-grid fuzz-grid">
        <Panel title="启动与控制" icon={FlaskConical}>
          <div className="form-grid two-col compact-stack">
            <Field label="seedPath">
              <input value={form.seedPath} onChange={(e) => setForm((s) => ({ ...s, seedPath: e.target.value }))} />
            </Field>
            <Field label="outputPath">
              <input value={form.outputPath} onChange={(e) => setForm((s) => ({ ...s, outputPath: e.target.value }))} />
            </Field>
            <Field label="targetPath">
              <input value={form.targetPath} onChange={(e) => setForm((s) => ({ ...s, targetPath: e.target.value }))} />
            </Field>
            <label className="toggle-card">
              <span>riskAware / -P</span>
              <input type="checkbox" checked={form.riskAware} onChange={(e) => setForm((s) => ({ ...s, riskAware: e.target.checked }))} />
            </label>
          </div>
          <div className="action-row multi-actions">
            <ActionButton loading={loading} icon={Play} onClick={handleStart}>启动 AFL</ActionButton>
            <ActionButton loading={loading} icon={Square} variant="danger" onClick={handleStop} disabled={!session.pid}>停止 AFL</ActionButton>
            <a className={`download-link ${session.dbPath ? '' : 'disabled'}`} href={session.dbPath ? api.getDownloadUrl(session.dbPath) : '#'}>
              下载 DB 日志
            </a>
          </div>
          <div className="session-strip">
            <span>PID：{session.pid ?? '--'}</span>
            <span>输出目录：{session.outputPath || '--'}</span>
            <span>Stats：{session.statsFilePath || '--'}</span>
          </div>
        </Panel>

        <ChartPanel historyData={historyData} loading={statsLoading} metricName={history?.metric || 't_bits(branch)'} />
        <StatsPanel topStatsEntries={topStatsEntries} status={stats?.status || 'waiting_for_fuzzer_stats'} />
      </div>
    </PageFrame>
  );
}
