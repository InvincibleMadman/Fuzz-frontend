import { Database, ShieldAlert, Sparkles, Upload, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { ActionButton } from '../components/ActionButton';
import { CodeBlock } from '../components/CodeBlock';
import { Field } from '../components/Field';
import { PageFrame } from '../components/PageFrame';
import { Panel } from '../components/Panel';
import { TagList } from '../components/TagList';
import { UploadBox } from '../components/UploadBox';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';
import { prettyJson } from '../lib/format';

export function RiskPage() {
  const { notifyError, notifySuccess } = useAppContext();
  const [form, setForm] = useState({ targetPath: '', temperatureCoefficient: 0.1, maxTokens: 2000, iterations: 3 });
  const [result, setResult] = useState('');
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [instrumenting, setInstrumenting] = useState(false);

  async function handleAnalysis() {
    try {
      setAnalysisLoading(true);
      const response = await api.riskAnalysis(form);
      setResult(prettyJson(response.data));
      notifySuccess('风险代码分析完成');
    } catch (error) {
      notifyError(error);
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    try {
      setUploading(true);
      const response = await api.uploadRiskResult(files);
      setUploaded(response.data);
      notifySuccess('风险分析结果上传成功');
    } catch (error) {
      notifyError(error);
    } finally {
      setUploading(false);
    }
  }

  async function handleInstrument() {
    try {
      setInstrumenting(true);
      await api.instrumentRiskCode();
      notifySuccess('风险代码插桩已触发');
    } catch (error) {
      notifyError(error);
    } finally {
      setInstrumenting(false);
    }
  }

  return (
    <PageFrame title="风险分析" description="在线风险路径分析、分析结果上传与分级插桩" icon={ShieldAlert}>
      <div className="page-grid risk-grid">
        <Panel title="风险代码分析" icon={ShieldAlert}>
          <div className="form-grid two-col">
            <Field label="目标程序路径">
              <input value={form.targetPath} onChange={(e) => setForm((s) => ({ ...s, targetPath: e.target.value }))} />
            </Field>
            <Field label="iterations">
              <input type="number" value={form.iterations} onChange={(e) => setForm((s) => ({ ...s, iterations: Number(e.target.value) }))} />
            </Field>
            <Field label="temperatureCoefficient">
              <input type="number" step="0.1" value={form.temperatureCoefficient} onChange={(e) => setForm((s) => ({ ...s, temperatureCoefficient: Number(e.target.value) }))} />
            </Field>
            <Field label="maxTokens">
              <input type="number" value={form.maxTokens} onChange={(e) => setForm((s) => ({ ...s, maxTokens: Number(e.target.value) }))} />
            </Field>
          </div>
          <div className="action-row multi-actions">
            <ActionButton loading={analysisLoading} icon={Sparkles} onClick={handleAnalysis}>运行分析</ActionButton>
            <UploadBox inline label="上传 final_analysis.json" onChange={handleUpload} loading={uploading} />
            <ActionButton loading={instrumenting} icon={WandSparkles} variant="secondary" onClick={handleInstrument}>执行插桩</ActionButton>
          </div>
          <TagList items={uploaded} emptyText="尚未上传风险分析 JSON" />
        </Panel>

        <Panel title="分析结果预览" icon={Database} scrollable>
          <CodeBlock content={result || '// 运行分析后在此查看 JSON 结果'} />
        </Panel>
      </div>
    </PageFrame>
  );
}
