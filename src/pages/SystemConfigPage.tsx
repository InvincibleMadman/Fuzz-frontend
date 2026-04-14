import { BrainCircuit, KeyRound, RefreshCcw, Save, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { ActionButton } from '../components/ActionButton';
import { Field } from '../components/Field';
import { PageFrame } from '../components/PageFrame';
import { Panel } from '../components/Panel';
import { useAppContext } from '../context/AppContext';

type ModelValue = 'gpt-4o' | 'gpt-4.1-mini' | 'gpt-4.1';

type SystemConfigForm = {
  llmBaseUrl: string;
  apiKey: string;
  backupApiKey: string;
  model: ModelValue;
  temperature: number;
  maxTokens: number;
  timeoutSeconds: number;
  systemPrompt: string;
};

const DEFAULT_CONFIG: SystemConfigForm = {
  llmBaseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  backupApiKey: '',
  model: 'gpt-4o',
  temperature: 0.2,
  maxTokens: 4096,
  timeoutSeconds: 60,
  systemPrompt: '你是一个工业控制协议模糊测试助手，请优先输出结构化、工程化、可直接落地的结果。',
};

const MODEL_OPTIONS: Array<{ value: ModelValue; title: string; hint: string }> = [
  { value: 'gpt-4o', title: 'GPT-4o', hint: '默认主模型，适合协议理解、分析与综合任务。' },
  { value: 'gpt-4.1-mini', title: 'GPT-4.1 Mini', hint: '更轻量，适合快速验证、低成本推理。' },
  { value: 'gpt-4.1', title: 'GPT-4.1', hint: '适合更复杂推理、长上下文与代码分析。' },
];

export function SystemConfigPage() {
  const { notifySuccess } = useAppContext();
  const [form, setForm] = useState<SystemConfigForm>(DEFAULT_CONFIG);

  function updateField<K extends keyof SystemConfigForm>(key: K, value: SystemConfigForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFakeSave() {
    notifySuccess('操作成功');
  }

  function resetDefaults() {
    setForm(DEFAULT_CONFIG);
    notifySuccess('已恢复默认值');
  }

  return (
    <PageFrame
      title="系统配置"
      description="配置 LLM 模型、API Key、Base URL 与默认请求参数。当前版本仅提供前端交互，不接入后端接口。"
      icon={Settings2}
    >
      <div className="page-grid system-config-grid">
        <Panel title="模型接入配置" icon={KeyRound} scrollable>
          <div className="form-grid one-col compact-stack">
            <Field label="LLM Base URL">
              <input
                value={form.llmBaseUrl}
                onChange={(e) => updateField('llmBaseUrl', e.target.value)}
                placeholder="https://api.openai.com/v1"
              />
            </Field>

            <Field label="API Key">
              <input
                type="password"
                autoComplete="off"
                value={form.apiKey}
                onChange={(e) => updateField('apiKey', e.target.value)}
                placeholder="sk-..."
              />
            </Field>

            <Field label="备用 API Key">
              <input
                type="password"
                autoComplete="off"
                value={form.backupApiKey}
                onChange={(e) => updateField('backupApiKey', e.target.value)}
                placeholder="可选，用于代理或备用通道"
              />
            </Field>

            <div className="action-row">
              <ActionButton icon={Save} onClick={handleFakeSave}>
                保存接入配置
              </ActionButton>
            </div>
          </div>
        </Panel>

        <Panel title="模型与默认参数" icon={BrainCircuit} scrollable>
          <div className="form-grid one-col compact-stack">
            <div className="model-option-grid">
              {MODEL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`model-option ${form.model === option.value ? 'is-active' : ''}`}
                  onClick={() => updateField('model', option.value)}
                >
                  <span className="model-option__title">{option.title}</span>
                  <span className="model-option__hint">{option.hint}</span>
                </button>
              ))}
            </div>

            <div className="form-grid two-col">
              <Field label="Temperature">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={form.temperature}
                  onChange={(e) => updateField('temperature', Number(e.target.value))}
                />
              </Field>

              <Field label="Max Tokens">
                <input
                  type="number"
                  min="128"
                  step="128"
                  value={form.maxTokens}
                  onChange={(e) => updateField('maxTokens', Number(e.target.value))}
                />
              </Field>

              <Field label="请求超时（秒）">
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={form.timeoutSeconds}
                  onChange={(e) => updateField('timeoutSeconds', Number(e.target.value))}
                />
              </Field>

              <Field label="当前模型">
                <input value={form.model} readOnly />
              </Field>
            </div>

            <div className="action-row">
              <ActionButton icon={Save} onClick={handleFakeSave}>
                保存模型配置
              </ActionButton>

              <ActionButton icon={RefreshCcw} variant="secondary" onClick={resetDefaults}>
                恢复默认
              </ActionButton>
            </div>
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}