import { TopBar } from './TopBar';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { getPublicLayoutData } from '@/lib/public-layout-data';

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const data = await getPublicLayoutData();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar phone={data.phone} email={data.email} address={`${data.addressLine1}, ${data.addressLine2}`} />
      <PublicHeader logoUrl={data.logoUrl} companyName={data.companyName} tagline={data.tagline} />
      <main style={{ flex: 1 }}>{children}</main>
      <PublicFooter data={data} />
    </div>
  );
}
