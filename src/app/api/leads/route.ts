import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { withErrorLog } from '@/lib/with-error-log';

export const POST = withErrorLog(async (request) => {
  const body = await request.json();

  const errors: string[] = [];
  if (!body.contactName || body.contactName.trim().length === 0) {
    errors.push('Tên liên hệ là bắt buộc');
  }
  if (!body.phone || body.phone.trim().length === 0) {
    errors.push('Số điện thoại là bắt buộc');
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, errors, message: 'Dữ liệu không hợp lệ' },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.create({
    data: {
      labName: body.labName?.trim() || null,
      contactName: body.contactName!.trim(),
      phone: body.phone!.trim(),
      email: body.email?.trim() || null,
      productInterest: body.productInterest?.trim() || null,
      message: body.message?.trim() || null,
      source: 'website',
      status: 'new',
    },
  });

  logger.info('Lead created', { leadId: lead.id, source: 'website' });

  return NextResponse.json(
    { success: true, message: 'Đã gửi yêu cầu thành công', id: lead.id },
    { status: 200 }
  );
});
