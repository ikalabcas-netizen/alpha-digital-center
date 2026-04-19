import { PageHero } from '@/components/layout/PageHero';
import { prisma } from '@/lib/prisma';
import { WarrantyLookup } from './WarrantyLookup';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getData() {
  const [hero, groups] = await Promise.all([
    prisma.cmsPageHero.findUnique({ where: { pageSlug: 'warranty' } }),
    prisma.cmsWarrantyPolicyGroup.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { items: { orderBy: { displayOrder: 'asc' } } },
    }),
  ]);
  return { hero, groups };
}

export default async function BaoHanhPage() {
  const { hero, groups } = await getData();

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Warranty · Bảo hành'}
        title={hero?.titleLead || 'Cam kết'}
        serif={hero?.titleAccent || 'bảo hành —'}
        tail={hero?.titleTail || 'đến 19 năm.'}
        subtitle={hero?.subtitle || ''}
      />

      <WarrantyLookup />

      {groups.length > 0 && (
        <section style={{ padding: '120px 0', background: 'var(--bg-warm)' }}>
          <div className="container pol" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: 'var(--accent)' }} />
                <span className="eyebrow">Chính sách</span>
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', margin: '0 0 24px' }}>
                Bảo hành{' '}
                <span className="serif" style={{ color: 'var(--ink-500)', fontWeight: 400 }}>
                  minh bạch
                </span>
                .
              </h2>
              <p style={{ fontSize: 15, color: 'var(--ink-500)', lineHeight: 1.75 }}>
                Mọi sản phẩm rời xưởng đều kèm phiếu bảo hành ghi rõ thời hạn, phạm vi. Lỗi gia công — làm lại miễn phí trong 72h.
              </p>
            </div>
            <div>
              {groups.map((g, i) => (
                <div
                  key={g.id}
                  style={{
                    padding: '28px 0',
                    borderTop: '1px solid var(--line)',
                    borderBottom: i === groups.length - 1 ? '1px solid var(--line)' : 'none',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.6fr',
                    gap: 32,
                    alignItems: 'flex-start',
                  }}
                >
                  <h3 className="display" style={{ fontSize: 18, margin: 0, fontWeight: 600 }}>
                    {g.categoryName}
                  </h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {g.items.map((item) => (
                      <li
                        key={item.id}
                        style={{ padding: '6px 0', fontSize: 14, color: 'var(--ink-700)', display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
                        {item.productName} · {item.warrantyText}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <style>{`@media (max-width:900px){ .pol { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
        </section>
      )}
    </>
  );
}
