'use client';

import { useCallback, useRef, useState, type CSSProperties, type ChangeEvent } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
  colors,
  fonts,
  radii,
  inputStyle,
  primaryButton,
  secondaryButton,
  dangerButton,
  modalBackdrop,
} from '@/lib/styles';

type Props = {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  aspectPresets?: { key: string; label: string; ratio: number | null }[];
  defaultAspect?: number;
  prefix?: 'home' | 'about' | 'products' | 'blog' | 'testimonials' | 'tech' | 'materials' | 'team' | 'misc';
  previewBg?: string;
  hint?: string;
};

const DEFAULT_ASPECTS = [
  { key: '1', label: '1:1 (vuông)', ratio: 1 },
  { key: '16-9', label: '16:9 ngang', ratio: 16 / 9 },
  { key: '3-1', label: '3:1 banner', ratio: 3 },
  { key: '4-1', label: '4:1 siêu rộng', ratio: 4 },
  { key: 'free', label: 'Tự do', ratio: null as number | null },
];

const cardWrap: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: colors.textPrimary,
  fontFamily: fonts.body,
};

const previewBox: CSSProperties = {
  position: 'relative',
  border: `1.5px dashed ${colors.border}`,
  borderRadius: radii.md,
  padding: 16,
  minHeight: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const cropperBox: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: 420,
  background: '#0b1220',
  borderRadius: 12,
  overflow: 'hidden',
};

export function LogoUpload({
  value,
  onChange,
  label = 'Logo',
  aspectPresets = DEFAULT_ASPECTS,
  defaultAspect = 3,
  prefix = 'misc',
  previewBg = '#0b1220',
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string>('logo');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectKey, setAspectKey] = useState<string>(
    aspectPresets.find((p) => p.ratio === defaultAspect)?.key || 'free',
  );
  const aspect = aspectPresets.find((p) => p.key === aspectKey)?.ratio;
  const [pixelArea, setPixelArea] = useState<Area | null>(null);
  const [padColor, setPadColor] = useState<'transparent' | 'white' | 'navy'>('transparent');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onCropComplete = useCallback((_area: Area, px: Area) => {
    setPixelArea(px);
  }, []);

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErr('Chỉ chấp nhận ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErr('Ảnh quá lớn (tối đa 5MB)');
      return;
    }
    setErr(null);
    setSourceName(file.name);
    setSourceUrl(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function doUpload() {
    if (!sourceUrl || !pixelArea) return;
    setBusy(true);
    setErr(null);
    try {
      const blob = await cropToBlob(sourceUrl, pixelArea, padColor);
      const form = new FormData();
      form.append('file', blob, sourceName.replace(/\.[^/.]+$/, '') + '.png');
      form.append('prefix', prefix);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload thất bại');
      onChange(data.url);
      setSourceUrl(null);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function clearLogo() {
    if (value && /^https?:\/\//i.test(value)) {
      fetch(`/api/admin/upload?url=${encodeURIComponent(value)}`, { method: 'DELETE' }).catch(() => {});
    }
    onChange(null);
  }

  return (
    <div style={cardWrap}>
      {label && <div style={labelStyle}>{label}</div>}

      {/* Preview */}
      {value ? (
        <div style={{ ...previewBox, background: previewBg }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Logo preview"
            style={{ maxWidth: '100%', maxHeight: 140, objectFit: 'contain', display: 'block' }}
          />
        </div>
      ) : (
        <div style={previewBox} onClick={() => inputRef.current?.click()}>
          <div style={{ textAlign: 'center', color: colors.textLight, fontSize: 13 }}>
            📷 Chưa có logo — nhấp để tải lên
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" style={secondaryButton} onClick={() => inputRef.current?.click()}>
          {value ? 'Thay logo mới' : 'Tải lên'}
        </button>
        {value && (
          <button type="button" style={dangerButton} onClick={clearLogo}>
            Xóa logo
          </button>
        )}
      </div>

      {hint && <div style={{ fontSize: 12, color: colors.textLight }}>{hint}</div>}
      {err && <div style={{ fontSize: 12, color: colors.danger }}>{err}</div>}

      {sourceUrl && (
        <div style={modalBackdrop} onClick={(e) => e.target === e.currentTarget && !busy && setSourceUrl(null)}>
          <div
            style={{
              background: colors.white,
              borderRadius: 16,
              padding: 20,
              width: '100%',
              maxWidth: 760,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontFamily: fonts.heading, fontSize: 18 }}>Cắt logo</h3>
              <button
                type="button"
                style={{ ...secondaryButton, padding: '4px 10px', fontSize: 12 }}
                onClick={() => setSourceUrl(null)}
                disabled={busy}
              >
                Đóng
              </button>
            </div>

            <div style={cropperBox}>
              <Cropper
                image={sourceUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect ?? undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={false}
                showGrid
                minZoom={0.3}
                maxZoom={4}
                zoomSpeed={0.4}
                objectFit="contain"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Tỉ lệ</div>
                <select
                  style={{ ...inputStyle, appearance: 'auto' }}
                  value={aspectKey}
                  onChange={(e) => setAspectKey(e.target.value)}
                >
                  {aspectPresets.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                  Zoom ({zoom.toFixed(2)}x)
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={4}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Nền khi tràn</div>
                <select
                  style={{ ...inputStyle, appearance: 'auto' }}
                  value={padColor}
                  onChange={(e) => setPadColor(e.target.value as any)}
                >
                  <option value="transparent">Trong suốt (PNG)</option>
                  <option value="white">Trắng</option>
                  <option value="navy">Navy #0B1220</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: 12, color: colors.textLight, marginTop: 10 }}>
              💡 Có thể kéo ảnh ra ngoài khung — vùng tràn sẽ được tô bằng màu nền đã chọn.
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" style={secondaryButton} onClick={() => setSourceUrl(null)} disabled={busy}>
                Hủy
              </button>
              <button type="button" style={primaryButton} onClick={doUpload} disabled={busy || !pixelArea}>
                {busy ? 'Đang tải lên…' : 'Cắt và lưu'}
              </button>
            </div>

            {err && <div style={{ fontSize: 12, color: colors.danger, marginTop: 8 }}>{err}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// Load HTMLImage from url (CORS-safe for blob URLs from File)
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function cropToBlob(
  sourceUrl: string,
  area: Area,
  padColor: 'transparent' | 'white' | 'navy',
): Promise<Blob> {
  const img = await loadImage(sourceUrl);
  const w = Math.max(1, Math.round(area.width));
  const h = Math.max(1, Math.round(area.height));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2d không khả dụng');

  // Fill background for padding area
  if (padColor === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  } else if (padColor === 'navy') {
    ctx.fillStyle = '#0B1220';
    ctx.fillRect(0, 0, w, h);
  }
  // transparent = leave default

  // Draw source image at offset = -area.x, -area.y
  // Positive area.x/y means crop starts inside image; negative means outside (pad).
  ctx.drawImage(img, -area.x, -area.y, img.naturalWidth, img.naturalHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Không xuất được ảnh'))),
      'image/png',
    );
  });
}

export default LogoUpload;
