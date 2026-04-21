'use client';

import { type CSSProperties, type ReactNode } from 'react';
import { colors, radii, fonts, secondaryButton } from '@/lib/styles';

type Item = { id: string };

type Props<T extends Item> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onReorder: (items: T[]) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyText?: string;
};

const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  background: colors.cardBg,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  marginBottom: 8,
};

const ctrls: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const arrowBtn: CSSProperties = {
  ...secondaryButton,
  padding: '2px 6px',
  fontSize: 11,
  lineHeight: 1,
  minWidth: 24,
};

const actionWrap: CSSProperties = {
  display: 'flex',
  gap: 6,
  marginLeft: 'auto',
};

export function OrderableList<T extends Item>({
  items,
  renderItem,
  onReorder,
  onEdit,
  onDelete,
  emptyText = 'Chưa có mục nào',
}: Props<T>) {
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onReorder(next);
  }

  if (items.length === 0) {
    return (
      <div style={{ ...row, justifyContent: 'center', color: colors.textLight, fontFamily: fonts.body }}>
        {emptyText}
      </div>
    );
  }

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.id} style={row}>
          <div style={ctrls}>
            <button type="button" style={arrowBtn} onClick={() => move(i, -1)} disabled={i === 0} title="Lên">
              ↑
            </button>
            <button type="button" style={arrowBtn} onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Xuống">
              ↓
            </button>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>{renderItem(item, i)}</div>
          <div style={actionWrap}>
            {onEdit && (
              <button type="button" style={secondaryButton} onClick={() => onEdit(item)}>
                Sửa
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                style={{ ...secondaryButton, color: colors.danger, borderColor: 'rgba(225,29,72,0.2)' }}
                onClick={() => onDelete(item)}
              >
                Xóa
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderableList;
