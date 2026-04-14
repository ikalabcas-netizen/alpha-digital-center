import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Alpha Digital Center - Gia Công Nha Khoa Chuyên Nghiệp',
    template: '%s | Alpha Digital Center',
  },
  description:
    'Alpha Digital Center - Chuyên gia công sản phẩm nha khoa bán thành phẩm: Zirconia, sứ ép E.Max, Cercon, tháo lắp, implant. Công nghệ CAD/CAM, in 3D hiện đại.',
  keywords: [
    'labo nha khoa',
    'gia công nha khoa',
    'zirconia',
    'sứ ép',
    'E.Max',
    'Cercon',
    'Alpha Digital Center',
    'Alpha Milling Center',
    'implant nha khoa',
    'CAD/CAM nha khoa',
  ],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Alpha Digital Center',
    title: 'Alpha Digital Center - Gia Công Nha Khoa Chuyên Nghiệp',
    description:
      'Chuyên gia công sản phẩm nha khoa bán thành phẩm cho labo. Công nghệ CAD/CAM và in 3D hiện đại.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
