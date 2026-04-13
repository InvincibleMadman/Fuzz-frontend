import { Upload } from 'lucide-react';

export function UploadBox({
  label,
  onChange,
  loading,
  inline = false,
}: {
  label: string;
  onChange: (files: FileList | null) => void;
  loading?: boolean;
  inline?: boolean;
}) {
  return (
    <label className={`upload-box ${inline ? 'inline-upload' : ''}`}>
      <Upload size={16} />
      <span>{loading ? '上传中…' : label}</span>
      <input type="file" multiple onChange={(e) => onChange(e.target.files)} />
    </label>
  );
}
