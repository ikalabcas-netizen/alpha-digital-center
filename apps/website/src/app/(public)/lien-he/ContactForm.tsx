'use client';

import { useState, type CSSProperties, type FormEvent } from 'react';

const fs: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  background: '#fff',
  border: '1px solid var(--line)',
  borderRadius: 10,
  color: 'var(--ink-900)',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'website',
          contactName: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email') || null,
          labName: data.get('lab') || null,
          productInterest: data.get('subject') || null,
          message: data.get('message'),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Gửi không thành công');
      }
      setSent(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div
          style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#fff', fontSize: 28, fontWeight: 700 }}
        >
          ✓
        </div>
        <h3 className="display" style={{ fontSize: 24, margin: '0 0 12px', fontWeight: 600 }}>
          Cảm ơn bạn!
        </h3>
        <p style={{ fontSize: 14, color: 'var(--ink-500)' }}>Chúng tôi sẽ liên hệ trong vòng 24 giờ.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="display" style={{ fontSize: 22, margin: '0 0 6px', fontWeight: 600 }}>
        Gửi tin nhắn
      </h3>
      <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 24px' }}>Đội ngũ sẽ phản hồi trong 24h.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input name="name" required placeholder="Họ và tên *" style={fs} />
          <input name="phone" required type="tel" placeholder="Điện thoại *" style={fs} />
        </div>
        <input name="email" type="email" placeholder="Email" style={fs} />
        <input name="lab" placeholder="Tên labo / phòng khám" style={fs} />
        <select name="subject" defaultValue="" required style={fs}>
          <option value="" disabled>
            Chủ đề *
          </option>
          <option>Yêu cầu báo giá</option>
          <option>Tư vấn kỹ thuật</option>
          <option>Đối tác / hợp tác</option>
          <option>Khác</option>
        </select>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="Nội dung *"
          style={{ ...fs, resize: 'vertical', minHeight: 100 }}
        />
        {err && <div style={{ fontSize: 13, color: '#e11d48' }}>{err}</div>}
        <button
          type="submit"
          disabled={submitting}
          style={{ padding: '14px 24px', borderRadius: 999, background: 'var(--accent)', color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', marginTop: 8, opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? 'Đang gửi…' : 'Gửi yêu cầu →'}
        </button>
      </div>
    </form>
  );
}
