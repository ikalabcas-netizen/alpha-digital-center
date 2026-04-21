'use client';

import { useRef, useState, type CSSProperties, type ChangeEvent, type DragEvent } from 'react';
import { colors, radii, fonts, transitions, secondaryButton, dangerButton } from '@/lib/styles';

type Props = {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  prefix?: 'home' | 'about' | 'products' | 'blog' | 'testimonials' | 'tech' | 'materials' | 'team' | 'misc';
  label?: string;
  hint?: string;
  width?: number | string;
  height?: number | string;
  accept?: string;
  disabled?: boolean;
};

const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const dropZoneBase: CSSProperties = {
  position: 'relative',
  border: `1.5px dashed ${colors.border}`,
  borderRadius: radii.md,
  background: '#F9FAFB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 8,
  padding: 16,
  cursor: 'pointer',
  transition: transitions.fast,
  overflow: 'hidden',
};

const previewImg: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const actionBarStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: colors.textPrimary,
  fontFamily: fonts.body,
};

const hintStyle: CSSProperties = {
  fontSize: 12,
  color: colors.textLight,
  fontFamily: fonts.body,
};

const errorStyle: CSSProperties = {
  fontSize: 12,
  color: colors.danger,
  fontFamily: fonts.body,
};

const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(11,18,32,0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.white,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: fonts.body,
};

export function ImageUpload({
  value,
  onChange,
  prefix = 'misc',
  label,
  hint,
  width = '100%',
  height = 180,
  accept = 'image/*',
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh quá lớn (tối đa 5MB)');
      return;
    }

    const form = new FormData();
    form.append('file', file);
    form.append('prefix', prefix);

    setUploading(true);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload thất bại');
      onChange(data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!value) return;
    setError(null);
    // Fire-and-forget delete on storage — don't block UI if network fails
    if (/^https?:\/\//i.test(value)) {
      fetch(`/api/admin/upload?url=${encodeURIComponent(value)}`, { method: 'DELETE' }).catch(() => {});
    }
    onChange(null);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    // reset so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled || uploading) return;
    handleFiles(e.dataTransfer.files);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || uploading) return;
    setDragOver(true);
  }

  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  const dropZoneStyle: CSSProperties = {
    ...dropZoneBase,
    width,
    height,
    borderColor: dragOver ? colors.accent : colors.border,
    background: dragOver ? colors.accent50 : value ? colors.white : '#F9FAFB',
    padding: value ? 0 : 16,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  };

  return (
    <div style={wrapperStyle}>
      {label && <div style={labelStyle}>{label}</div>}

      <div
        style={dropZoneStyle}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" style={previewImg} />
        ) : (
          <>
            <div style={{ fontSize: 24, color: colors.ink400 }}>📷</div>
            <div style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fonts.body }}>
              Kéo thả hoặc nhấp để chọn ảnh
            </div>
            <div style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.body }}>
              JPG / PNG / WEBP · Tối đa 5MB
            </div>
          </>
        )}

        {uploading && <div style={overlayStyle}>Đang tải lên…</div>}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onInputChange}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
        />
      </div>

      {hint && !error && <div style={hintStyle}>{hint}</div>}
      {error && <div style={errorStyle}>{error}</div>}

      {value && !uploading && (
        <div style={actionBarStyle}>
          <button
            type="button"
            style={secondaryButton}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={disabled}
          >
            Thay ảnh
          </button>
          <button
            type="button"
            style={dangerButton}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={disabled}
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
