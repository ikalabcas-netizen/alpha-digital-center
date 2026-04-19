import { colors, fonts } from '@/lib/styles';
import { prisma } from '@/lib/prisma';

async function getData() {
  const [channels, settings] = await Promise.all([
    prisma.cmsContactChannel.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
    prisma.siteSetting.findMany({ where: { group: 'contact' } }),
  ]);
  const phone = channels.find((c) => c.iconKey === 'phone')?.value;
  const email = channels.find((c) => c.iconKey === 'mail')?.value;
  const line1 = settings.find((s) => s.key === 'contact.officeAddressLine1')?.value;
  const line2 = settings.find((s) => s.key === 'contact.officeAddressLine2')?.value;
  const addr = [line1, line2].filter(Boolean).join(', ');
  return {
    phone: phone || '0378 422 496',
    email: email || 'info@alphacenter.vn',
    addr: addr || '242/12 Phạm Văn Hai, Q. Tân Bình, TP.HCM',
  };
}

export async function TopBar() {
  const { phone, email, addr } = await getData();
  return (
    <div
      style={{
        background: colors.navy950,
        color: 'rgba(255,255,255,0.58)',
        fontSize: 12,
        padding: '8px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <span>📞 {phone}</span>
          <span>✉ {email}</span>
        </div>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <span>📍 {addr}</span>
          <span
            style={{
              color: colors.goldLight,
              fontFamily: fonts.mono,
              letterSpacing: '0.1em',
              fontSize: 10,
            }}
          >
            EST. 2014
          </span>
        </div>
      </div>
    </div>
  );
}
