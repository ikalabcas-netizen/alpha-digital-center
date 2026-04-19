import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type PublicLayoutData = {
  logoUrl: string | null;
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  zalo: string | null;
  hoursValue: string | null;
  hoursSubtitle: string | null;
  addressLine1: string;
  addressLine2: string;
};

export const getPublicLayoutData = cache(async (): Promise<PublicLayoutData> => {
  const [channels, settings] = await Promise.all([
    prisma.cmsContactChannel.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
    prisma.siteSetting.findMany({
      where: { OR: [{ group: 'contact' }, { group: 'general' }] },
    }),
  ]);
  const getSetting = (k: string) => settings.find((s) => s.key === k)?.value;
  return {
    logoUrl: getSetting('site.logoUrl') || null,
    companyName: getSetting('site.companyName') || 'Alpha Digital Center',
    tagline: getSetting('site.tagline') || 'Digital Center',
    phone: channels.find((c) => c.iconKey === 'phone')?.value || '0378 422 496',
    email: channels.find((c) => c.iconKey === 'mail')?.value || 'info@alphacenter.vn',
    zalo: channels.find((c) => c.iconKey === 'zalo')?.value || null,
    hoursValue: channels.find((c) => c.iconKey === 'clock')?.value || null,
    hoursSubtitle: channels.find((c) => c.iconKey === 'clock')?.subtitle || null,
    addressLine1: getSetting('contact.officeAddressLine1') || '242/12 Phạm Văn Hai',
    addressLine2: getSetting('contact.officeAddressLine2') || 'P.5, Q. Tân Bình, TP.HCM',
  };
});
