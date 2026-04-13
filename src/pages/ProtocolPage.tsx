import { FolderCog, Orbit, Sparkles, Database } from 'lucide-react';
import { useState } from 'react';
import { ActionButton } from '../components/ActionButton';
import { CodeBlock } from '../components/CodeBlock';
import { Field } from '../components/Field';
import { PageFrame } from '../components/PageFrame';
import { Panel } from '../components/Panel';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';
import { prettyJson } from '../lib/format';

export function ProtocolPage() {
  const { notifyError, notifySuccess } = useAppContext();
  const [form, setForm] = useState({
    src: '',
    out: '',
    protocol: 'bacnet',
    iterations: 3,
    temperature: 0.2,
    max_tokens: 2000,
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);
      const response = await api.extractProtocol(form);
      setResult(prettyJson(response.data));
      notifySuccess('协议提取完成');
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageFrame title="协议提取" description="向后端服务器 API 提交源路径、输出路径和协议名" icon={Orbit}>
      <div className="page-grid split-grid">
        <Panel title="提取参数" icon={FolderCog}>
          <div className="form-grid two-col">
            <Field label="源码路径">
              <input value={form.src} onChange={(e) => setForm((s) => ({ ...s, src: e.target.value }))} />
            </Field>
            <Field label="输出路径">
              <input value={form.out} onChange={(e) => setForm((s) => ({ ...s, out: e.target.value }))} />
            </Field>
            <Field label="协议名">
              <input value={form.protocol} onChange={(e) => setForm((s) => ({ ...s, protocol: e.target.value }))} />
            </Field>
            <Field label="迭代次数">
              <input type="number" value={form.iterations} onChange={(e) => setForm((s) => ({ ...s, iterations: Number(e.target.value) }))} />
            </Field>
            <Field label="temperature">
              <input type="number" step="0.1" value={form.temperature} onChange={(e) => setForm((s) => ({ ...s, temperature: Number(e.target.value) }))} />
            </Field>
            <Field label="max_tokens">
              <input type="number" value={form.max_tokens} onChange={(e) => setForm((s) => ({ ...s, max_tokens: Number(e.target.value) }))} />
            </Field>
          </div>
          <div className="action-row">
            <ActionButton loading={loading} icon={Sparkles} onClick={handleSubmit}>开始提取</ActionButton>
          </div>
        </Panel>

        <Panel title="返回结果" icon={Database} scrollable>
          <CodeBlock content={result || '// 提交后显示提取结果 JSON'} />
        </Panel>
      </div>
    </PageFrame>
  );
}
