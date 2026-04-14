import { NextRequest, NextResponse } from 'next/server';

interface LeadSubmission {
  labName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  productInterest?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadSubmission = await request.json();

    // Validate required fields
    const errors: string[] = [];

    if (!body.contactName || body.contactName.trim().length === 0) {
      errors.push('Ten lien he la bat buoc');
    }

    if (!body.phone || body.phone.trim().length === 0) {
      errors.push('So dien thoai la bat buoc');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
          message: 'Du lieu khong hop le',
        },
        { status: 400 }
      );
    }

    // TODO: Save to database via Prisma when Supabase is configured
    // const lead = await prisma.lead.create({
    //   data: {
    //     labName: body.labName?.trim() || null,
    //     contactName: body.contactName!.trim(),
    //     phone: body.phone!.trim(),
    //     email: body.email?.trim() || null,
    //     productInterest: body.productInterest?.trim() || null,
    //     message: body.message?.trim() || null,
    //     source: 'website',
    //     status: 'new',
    //   },
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Da gui yeu cau thanh cong',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Loi he thong. Vui long thu lai sau.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Phuong thuc khong duoc ho tro',
    },
    { status: 405 }
  );
}
