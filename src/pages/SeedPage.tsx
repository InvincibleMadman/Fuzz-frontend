import { Binary, Bug, Play, Upload, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { ActionButton } from '../components/ActionButton';
import { EmptyState } from '../components/EmptyState';
import { Field } from '../components/Field';
import { PageFrame } from '../components/PageFrame';
import { Panel } from '../components/Panel';
import { TagList } from '../components/TagList';
import { UploadBox } from '../components/UploadBox';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';
import type { SeedFiles } from '../types';

function SeedResultList({ files }: { files: SeedFiles }) {
  const entries = Object.entries(files);
  if (!entries.length) return <EmptyState text="生成后会显示 .bin 十六进制内容预览" />;
  return (
    <div className="seed-list">
      {entries.map(([name, content]) => (
        <div key={name} className="seed-item">
          <div className="seed-name">{name}</div>
          <code>
            {content.slice(0, 160)}
            {content.length > 160 ? '...' : ''}
          </code>
        </div>
      ))}
    </div>
  );
}

export function SeedPage() {
  const { notifyError, notifySuccess } = useAppContext();
  const [form, setForm] = useState({ iterations: 40, vectorCount: 10, temperatureCoefficient: 0.1 });
  const [uploadedVuldoc, setUploadedVuldoc] = useState<string[]>([]);
  const [seedFiles, setSeedFiles] = useState<SeedFiles>({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    try {
      setUploading(true);
      const response = await api.uploadVuldoc(files);
      setUploadedVuldoc(response.data);
      notifySuccess('漏洞文档上传成功');
    } catch (error) {
      notifyError(error);
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerate() {
    try {
      setLoading(true);
      const response = await api.generateSeeds(form);
      setSeedFiles(response.data);
      notifySuccess('初始种子生成成功');
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageFrame title="种子工坊" description="漏洞文档上传构建漏洞知识库与初始种子生成" icon={Binary}>
      <div className="page-grid triple-grid">
        <Panel title="漏洞文档上传" icon={Upload}>
          <UploadBox label="支持 pdf / txt / json，多文件上传" onChange={handleUpload} loading={uploading} />
          <TagList items={uploadedVuldoc} emptyText="尚未上传漏洞文档" />
        </Panel>

        <Panel title="生成参数" icon={WandSparkles}>
          <div className="form-grid one-col compact-stack">
            <Field label="iterations">
              <input type="number" value={form.iterations} onChange={(e) => setForm((s) => ({ ...s, iterations: Number(e.target.value) }))} />
            </Field>
            <Field label="vectorCount">
              <input type="number" value={form.vectorCount} onChange={(e) => setForm((s) => ({ ...s, vectorCount: Number(e.target.value) }))} />
            </Field>
            <Field label="temperatureCoefficient">
              <input type="number" step="0.1" value={form.temperatureCoefficient} onChange={(e) => setForm((s) => ({ ...s, temperatureCoefficient: Number(e.target.value) }))} />
            </Field>
          </div>
          <div className="action-row">
            <ActionButton loading={loading} icon={Play} onClick={handleGenerate}>生成种子</ActionButton>
          </div>
        </Panel>

        <Panel title="生成结果" icon={Bug} scrollable>
          <SeedResultList files={seedFiles} />
        </Panel>
      </div>
    </PageFrame>
  );
}
