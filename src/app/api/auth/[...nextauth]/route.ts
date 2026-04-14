import { NextRequest } from 'next/server';

async function getHandlers() {
  const { handlers } = await import('@/lib/auth');
  return handlers;
}

export async function GET(req: NextRequest) {
  const { GET } = await getHandlers();
  return GET(req);
}

export async function POST(req: NextRequest) {
  const { POST } = await getHandlers();
  return POST(req);
}
