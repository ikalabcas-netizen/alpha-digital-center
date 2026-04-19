import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, badRequest, notFound } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

type Delegate = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
};

export interface CrudConfig<TInput> {
  delegate: Delegate;
  modelName: string;
  orderBy?: any;
  pick: (body: any) => TInput | { error: string };
}

export function makeListRoute<TInput>(cfg: CrudConfig<TInput>) {
  return {
    async GET() {
      const session = await requireAdmin();
      if (!session) return unauthorized();
      const items = await cfg.delegate.findMany(
        cfg.orderBy ? { orderBy: cfg.orderBy } : undefined,
      );
      return NextResponse.json(items);
    },
    async POST(req: NextRequest) {
      const session = await requireAdmin();
      if (!session) return unauthorized();
      const body = await req.json();
      const data = cfg.pick(body);
      if ('error' in (data as any)) return badRequest((data as any).error);
      try {
        const item = await cfg.delegate.create({ data });
        logger.info(`${cfg.modelName} created`, { id: item.id });
        return NextResponse.json(item, { status: 201 });
      } catch (err) {
        logger.error(`${cfg.modelName} create failed`, err);
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
      }
    },
  };
}

export function makeItemRoute<TInput>(cfg: CrudConfig<TInput>) {
  return {
    async GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      const session = await requireAdmin();
      if (!session) return unauthorized();
      const { id } = await params;
      const item = await cfg.delegate.findUnique({ where: { id } });
      if (!item) return notFound(cfg.modelName);
      return NextResponse.json(item);
    },
    async PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      const session = await requireAdmin();
      if (!session) return unauthorized();
      const { id } = await params;
      const body = await req.json();
      const data = cfg.pick(body);
      if ('error' in (data as any)) return badRequest((data as any).error);
      try {
        const item = await cfg.delegate.update({ where: { id }, data });
        logger.info(`${cfg.modelName} updated`, { id });
        return NextResponse.json(item);
      } catch (err) {
        logger.error(`${cfg.modelName} update failed`, err, { id });
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
      }
    },
    async DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      const session = await requireAdmin();
      if (!session) return unauthorized();
      const { id } = await params;
      try {
        await cfg.delegate.delete({ where: { id } });
        logger.info(`${cfg.modelName} deleted`, { id });
        return NextResponse.json({ ok: true });
      } catch (err) {
        logger.error(`${cfg.modelName} delete failed`, err, { id });
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
      }
    },
  };
}

export function req<T>(body: any, ...fields: (keyof T)[]): { error: string } | null {
  for (const f of fields) {
    if (body[f] === undefined || body[f] === null || body[f] === '') {
      return { error: `Thiếu field "${String(f)}"` };
    }
  }
  return null;
}
