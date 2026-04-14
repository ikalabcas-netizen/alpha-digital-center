import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint initializes the database schema by running a simple query
// Only works if DATABASE_URL is correctly configured
// Should be called once after deployment
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const setupKey = process.env.DB_SETUP_KEY || 'adc-setup-2026';

  if (authHeader !== `Bearer ${setupKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Test database connection
    await prisma.$connect();

    // Create tables using raw SQL if needed (Prisma db push equivalent)
    // For now, just verify connection works
    const result = await prisma.$queryRaw`SELECT 1 as connected`;

    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
