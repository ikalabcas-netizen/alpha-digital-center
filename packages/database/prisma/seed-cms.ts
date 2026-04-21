// Idempotent seed for CMS content tables.
// Usage:
//   - Programmatic: import { seedCmsContent } from '@/prisma/seed-cms'
//   - Script: `node --loader ts-node/esm prisma/seed-cms.ts` (needs ts-node) OR
//     trigger via `/api/admin/seed-cms` after deploy.
//
// Strategy: upsert singletons by pageSlug; for lists, skip if table already has rows.

import { PrismaClient } from '@prisma/client';

const IMG = {
  heroLab: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1400&q=80',
  cadcam: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&q=80',
  tech: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1000&q=80',
  scanner: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1000&q=80',
  tools: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1000&q=80',
  office: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1400&q=80',
  hands: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=1200&q=80',
  crown: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1000&q=80',
  team: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1400&q=80',
};

const PAGE_HEROES = [
  {
    pageSlug: 'home',
    eyebrow: 'Digital dental laboratory · Est. 2020',
    titleLead: 'Nơi tinh hoa',
    titleAccent: 'nha khoa',
    titleTail: 'kỹ thuật số được kiến tạo.',
    subtitle:
      'Alpha Digital Center — đối tác gia công bán thành phẩm cao cấp cho labo và phòng khám. Công nghệ CAD/CAM chính xác, vật liệu Đức/Mỹ, bảo hành đến 19 năm.',
    imageUrl: IMG.heroLab,
  },
  {
    pageSlug: 'about',
    eyebrow: 'About us · Về chúng tôi',
    titleLead: 'Hơn một',
    titleAccent: 'xưởng gia công —',
    titleTail: 'một đối tác kỹ thuật.',
    subtitle:
      'Alpha Digital Center thành lập năm 2020 tại TP.HCM. Chúng tôi đồng hành cùng labo và phòng khám nha khoa bằng dịch vụ gia công số chất lượng, minh bạch, bảo hành dài hạn.',
    imageUrl: IMG.office,
  },
  {
    pageSlug: 'products',
    eyebrow: 'Products · Sản phẩm',
    titleLead: 'Danh mục',
    titleAccent: 'sản phẩm gia công —',
    titleTail: 'đầy đủ & chính hãng.',
    subtitle:
      'Từ sứ Zirconia cao cấp đến custom abutment titanium — toàn bộ vật liệu có Certificate of Authenticity từ nhà sản xuất.',
    imageUrl: IMG.crown,
  },
  {
    pageSlug: 'news',
    eyebrow: 'Insights · Tin tức',
    titleLead: 'Góc nhìn',
    titleAccent: 'chuyên gia —',
    titleTail: 'cập nhật từ phòng lab.',
    subtitle:
      'Chia sẻ kinh nghiệm, công nghệ mới, vật liệu và case study từ đội ngũ kỹ thuật Alpha Digital Center.',
    imageUrl: null,
  },
  {
    pageSlug: 'warranty',
    eyebrow: 'Warranty · Bảo hành',
    titleLead: 'Cam kết',
    titleAccent: 'bảo hành —',
    titleTail: 'đến 19 năm.',
    subtitle:
      'Nhập mã bảo hành in trên phiếu giao hàng để tra cứu thông tin sản phẩm, thời hạn và chính sách.',
    imageUrl: null,
  },
  {
    pageSlug: 'careers',
    eyebrow: 'Careers · Tuyển dụng',
    titleLead: 'Cùng xây dựng',
    titleAccent: 'tương lai',
    titleTail: 'nha khoa số.',
    subtitle:
      'Alpha Digital Center đang mở rộng đội ngũ. Cơ hội nghề nghiệp cho kỹ thuật viên, chuyên viên CAD/CAM, QC, sales và marketing.',
    imageUrl: IMG.team,
  },
  {
    pageSlug: 'contact',
    eyebrow: 'Contact · Liên hệ',
    titleLead: 'Hãy',
    titleAccent: 'trò chuyện',
    titleTail: 'với chúng tôi.',
    subtitle:
      'Dù là báo giá, tư vấn kỹ thuật hay đối tác hợp tác — đội ngũ Alpha Digital Center phản hồi trong vòng 24 giờ.',
    imageUrl: null,
  },
];

const TECH_CARDS = [
  {
    tag: '01',
    meta: '±10μm',
    title: 'Máy phay CNC 5 trục',
    description:
      'Hệ thống milling Roland DWX và IMES-ICORE chuyên dụng cho zirconia, lithium disilicate, PMMA và titanium.',
    imageUrl: IMG.cadcam,
    displayOrder: 1,
  },
  {
    tag: '02',
    meta: '7μm',
    title: 'Scanner 3D chính xác cao',
    description:
      '3Shape E4, Medit T710 — quét nhanh mẫu hàm, khung sườn, hold rigid với độ chính xác 7µm.',
    imageUrl: IMG.scanner,
    displayOrder: 2,
  },
  {
    tag: '03',
    meta: '25μm',
    title: 'In 3D kim loại & nhựa',
    description:
      'Máy in Laser SLM cho khung CoCr, Ti abutment. Máy in DLP cho model, splint, temporary crown.',
    imageUrl: IMG.tools,
    displayOrder: 3,
  },
];

const MATERIALS = [
  { name: 'Dentsply Sirona', country: 'Germany / USA', material: 'Cercon HT Zirconia', sinceYear: 'Từ 2016', displayOrder: 1 },
  { name: 'Ivoclar Vivadent', country: 'Liechtenstein', material: 'IPS e.max Press', sinceYear: 'Từ 2017', displayOrder: 2 },
  { name: 'Amann Girrbach', country: 'Austria', material: 'Zolid Gen-X', sinceYear: 'Từ 2019', displayOrder: 3 },
  { name: 'Kuraray Noritake', country: 'Japan', material: 'Katana Zirconia', sinceYear: 'Từ 2020', displayOrder: 4 },
];

const CORE_VALUES = [
  { number: '01', title: 'Chính xác', description: 'Mỗi sản phẩm qua 5 vòng QC — từ scan mẫu, thiết kế, milling đến nhuộm, glaze và kiểm tra cuối.', displayOrder: 1 },
  { number: '02', title: 'Chính hãng', description: 'Chỉ dùng phôi có Certificate of Authenticity từ nhà sản xuất gốc Đức, Áo, Liechtenstein, Nhật.', displayOrder: 2 },
  { number: '03', title: 'Chính trực', description: 'Bảo hành đến 19 năm. Mọi phiếu bảo hành đều có thể tra cứu trực tuyến với mã ADC.', displayOrder: 3 },
  { number: '04', title: 'Chuyên nghiệp', description: 'Đội ngũ 40+ KTV CAD/CAM được đào tạo bài bản, có chứng nhận từ Dentsply Sirona, Ivoclar.', displayOrder: 4 },
];

const TIMELINE = [
  { year: '2020', title: 'Thành lập', description: 'Mở xưởng gia công đầu tiên tại TP.HCM với 3 kỹ thuật viên, phục vụ 20 phòng khám nội thành.', displayOrder: 1 },
  { year: '2016', title: 'Đối tác Dentsply', description: 'Chính thức trở thành đối tác chiến lược của Dentsply Sirona tại khu vực phía Nam.', displayOrder: 2 },
  { year: '2018', title: 'Mở rộng CAD/CAM', description: 'Đầu tư 3 máy CNC 5 trục, 2 scanner E4, mở rộng đội ngũ lên 25 người.', displayOrder: 3 },
  { year: '2020', title: '500 labo đối tác', description: 'Phủ sóng 63 tỉnh thành, trở thành đối tác gia công chủ lực cho labo inhouse và phòng khám lớn.', displayOrder: 4 },
  { year: '2023', title: 'Chứng nhận ISO 13485', description: 'Đạt chuẩn ISO 13485:2016 cho hệ thống quản lý chất lượng thiết bị y tế.', displayOrder: 5 },
  { year: '2026', title: 'Digital Center 2.0', description: 'Ra mắt nền tảng đặt hàng trực tuyến, tra cứu bảo hành, tư vấn kỹ thuật 24/7 cho đối tác.', displayOrder: 6 },
];

const STORY_ABOUT = {
  pageSlug: 'about',
  imageUrl1: IMG.office,
  imageUrl2: IMG.hands,
  paragraph1:
    'Alpha Digital Center được thành lập năm 2020 tại TP.HCM bởi nhóm kỹ thuật viên trẻ đam mê nha khoa số. Ban đầu chỉ là một xưởng gia công nhỏ phục vụ 20 phòng khám nội thành, chúng tôi dần tạo dựng uy tín bằng chất lượng ổn định và dịch vụ tận tâm.',
  paragraph2:
    'Sau hơn 12 năm, Alpha Digital Center đã trở thành đối tác gia công tin cậy của hơn 500 labo, phòng khám trên cả nước. Đội ngũ 45 kỹ thuật viên, 3 xưởng sản xuất chuẩn ISO 13485, hàng chục máy CNC 5 trục và scanner 3D — tất cả phục vụ sứ mệnh: giúp nha sĩ và labo tập trung vào điều trị, để Alpha lo phần kỹ thuật.',
  foundedYear: '2020',
};

const WARRANTY_GROUPS = [
  {
    categoryName: 'Toàn sứ (Zirconia)',
    displayOrder: 1,
    items: [
      { productName: 'Cercon HT', warrantyText: '10 năm', displayOrder: 1 },
      { productName: 'Zolid Gen-X', warrantyText: '15 năm', displayOrder: 2 },
      { productName: 'Katana UTML', warrantyText: '12 năm', displayOrder: 3 },
    ],
  },
  {
    categoryName: 'Sứ ép',
    displayOrder: 2,
    items: [
      { productName: 'IPS e.max Press', warrantyText: '7 năm', displayOrder: 1 },
      { productName: 'IPS e.max CAD', warrantyText: '7 năm', displayOrder: 2 },
    ],
  },
  {
    categoryName: 'Implant',
    displayOrder: 3,
    items: [
      { productName: 'Custom Abutment Ti', warrantyText: '10 năm', displayOrder: 1 },
      { productName: 'Abutment Zirconia', warrantyText: '10 năm', displayOrder: 2 },
    ],
  },
  {
    categoryName: 'Hàm tháo lắp',
    displayOrder: 4,
    items: [
      { productName: 'Flexi Partial', warrantyText: '5 năm', displayOrder: 1 },
      { productName: 'Hàm nhựa', warrantyText: '3 năm', displayOrder: 2 },
    ],
  },
];

const CONTACT_CHANNELS = [
  { label: 'HOTLINE · 24/7', value: '0378 422 496', subtitle: 'Hỗ trợ kỹ thuật & đặt hàng', iconKey: 'phone', displayOrder: 1 },
  { label: 'EMAIL', value: 'info@alphacenter.vn', subtitle: 'Phản hồi trong 2 giờ', iconKey: 'mail', displayOrder: 2 },
  { label: 'ZALO OFFICIAL', value: '0378 422 496', subtitle: 'Chat nhanh, gửi file CAD', iconKey: 'zalo', displayOrder: 3 },
  { label: 'GIỜ LÀM VIỆC', value: '07:30 — 17:30', subtitle: 'Thứ 2 đến Thứ 7', iconKey: 'clock', displayOrder: 4 },
];

const JOB_PERKS = [
  { title: 'Lương cạnh tranh', description: 'Base + thưởng sản lượng theo case. Reviewed 6 tháng/lần. Thưởng dự án, thưởng Tết 13-14 tháng.', displayOrder: 1 },
  { title: 'Đào tạo quốc tế', description: 'Workshop định kỳ từ Dentsply Sirona, Ivoclar, Amann Girrbach. Có cơ hội tham dự IDS Cologne.', displayOrder: 2 },
  { title: 'Bảo hiểm cao cấp', description: 'BHYT + BHNT + gói khám sức khỏe định kỳ. Hỗ trợ 100% chi phí nha khoa cho nhân viên và gia đình.', displayOrder: 3 },
  { title: 'Môi trường chuyên nghiệp', description: 'Xưởng sản xuất đạt ISO 13485, thiết bị hiện đại. Đội ngũ 45 người, 70% gắn bó trên 5 năm.', displayOrder: 4 },
];

const SITE_SETTINGS = [
  { key: 'contact.officeAddressLine1', value: '242/12 Phạm Văn Hai', group: 'contact' },
  { key: 'contact.officeAddressLine2', value: 'Phường 5, Quận Tân Bình, TP.HCM, Việt Nam', group: 'contact' },
  { key: 'contact.mapEmbedUrl', value: 'https://maps.google.com/?q=242/12+Phạm+Văn+Hai,+Tân+Bình,+TP.HCM', group: 'contact' },
  { key: 'contact.mapButton1Url', value: 'https://maps.google.com/?q=242/12+Phạm+Văn+Hai,+Tân+Bình,+TP.HCM', group: 'contact' },
  { key: 'contact.mapButton2Url', value: 'https://www.google.com/maps/dir/?api=1&destination=242/12+Phạm+Văn+Hai,+Tân+Bình,+TP.HCM', group: 'contact' },
  { key: 'site.companyName', value: 'Alpha Digital Center', group: 'general' },
  { key: 'site.tagline', value: 'Digital dental laboratory — Est. 2020', group: 'general' },
  { key: 'stats.years', value: '12+', group: 'stats' },
  { key: 'stats.labs', value: '500+', group: 'stats' },
  { key: 'stats.warrantyMax', value: '19 năm', group: 'stats' },
  { key: 'seo.defaultTitle', value: 'Alpha Digital Center — Labo gia công nha khoa số', group: 'seo' },
  { key: 'seo.defaultDescription', value: 'Đối tác gia công bán thành phẩm cao cấp. CAD/CAM chính xác, vật liệu Đức/Mỹ/Nhật, bảo hành đến 19 năm.', group: 'seo' },
];

export async function seedCmsContent(prisma: PrismaClient) {
  const summary: Record<string, number> = {};

  for (const hero of PAGE_HEROES) {
    await prisma.cmsPageHero.upsert({
      where: { pageSlug: hero.pageSlug },
      create: hero,
      update: {},
    });
  }
  summary.pageHero = PAGE_HEROES.length;

  await prisma.cmsStoryBlock.upsert({
    where: { pageSlug: STORY_ABOUT.pageSlug },
    create: STORY_ABOUT,
    update: {},
  });
  summary.storyBlock = 1;

  if ((await prisma.cmsTechCard.count()) === 0) {
    await prisma.cmsTechCard.createMany({ data: TECH_CARDS });
    summary.techCards = TECH_CARDS.length;
  }

  if ((await prisma.cmsMaterial.count()) === 0) {
    await prisma.cmsMaterial.createMany({ data: MATERIALS });
    summary.materials = MATERIALS.length;
  }

  if ((await prisma.cmsCoreValue.count()) === 0) {
    await prisma.cmsCoreValue.createMany({ data: CORE_VALUES });
    summary.coreValues = CORE_VALUES.length;
  }

  if ((await prisma.cmsTimelineEntry.count()) === 0) {
    await prisma.cmsTimelineEntry.createMany({ data: TIMELINE });
    summary.timeline = TIMELINE.length;
  }

  if ((await prisma.cmsWarrantyPolicyGroup.count()) === 0) {
    for (const group of WARRANTY_GROUPS) {
      await prisma.cmsWarrantyPolicyGroup.create({
        data: {
          categoryName: group.categoryName,
          displayOrder: group.displayOrder,
          items: { create: group.items },
        },
      });
    }
    summary.warrantyGroups = WARRANTY_GROUPS.length;
  }

  if ((await prisma.cmsContactChannel.count()) === 0) {
    await prisma.cmsContactChannel.createMany({ data: CONTACT_CHANNELS });
    summary.contactChannels = CONTACT_CHANNELS.length;
  }

  if ((await prisma.cmsJobPerk.count()) === 0) {
    await prisma.cmsJobPerk.createMany({ data: JOB_PERKS });
    summary.jobPerks = JOB_PERKS.length;
  }

  for (const s of SITE_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      create: s,
      update: {},
    });
  }
  summary.siteSettings = SITE_SETTINGS.length;

  return summary;
}
