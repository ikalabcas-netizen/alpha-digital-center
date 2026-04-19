/* eslint-disable @next/next/no-img-element */
import { PageHero } from '@/components/layout/PageHero';
import { prisma } from '@/lib/prisma';
import { ProductsGrid } from './ProductsGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getData() {
  const [hero, categories, products] = await Promise.all([
    prisma.cmsPageHero.findUnique({ where: { pageSlug: 'products' } }),
    prisma.productCategory.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isActive: true }, orderBy: { priceVnd: 'asc' }, take: 1 },
      },
    }),
  ]);
  return { hero, categories, products };
}

export default async function SanPhamPage() {
  const { hero, categories, products } = await getData();

  const serialized = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    nameVi: p.nameVi,
    descriptionVi: p.descriptionVi,
    categoryId: p.categoryId,
    categoryNameVi: p.category.nameVi,
    isFeatured: p.isFeatured,
    warrantyYears: p.warrantyYears,
    imageUrl: p.images[0]?.imageUrl || null,
    lowestPrice: p.variants[0] ? Number(p.variants[0].priceVnd) : null,
    material: p.material,
  }));

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Products · Sản phẩm'}
        title={hero?.titleLead || 'Danh mục'}
        serif={hero?.titleAccent || 'sản phẩm gia công —'}
        tail={hero?.titleTail || 'đầy đủ & chính hãng.'}
        subtitle={hero?.subtitle || ''}
        image={hero?.imageUrl || undefined}
      />
      <section style={{ padding: '56px 0 120px', background: 'var(--bg)' }}>
        <div className="container">
          <ProductsGrid
            categories={categories.map((c) => ({ id: c.id, nameVi: c.nameVi }))}
            products={serialized}
          />
        </div>
      </section>
    </>
  );
}
