import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. ดึงรายการนัดหมายของคนไข้ทุกคนในระบบ
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { firstName: true, lastName: true, phone: true, email: true } },
        doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ดึงข้อมูลไม่สำเร็จ', error: String(error) }, { status: 500 });
  }
}

// 2. แอดมินกดเปลี่ยนสถานะคิว (PENDING, CONFIRMED, COMPLETED, CANCELLED)
export async function PATCH(request: NextRequest) {
  try {
    const { appointmentId, status } = await request.json();

    const updated = await prisma.appointment.update({
      where: { id: Number(appointmentId) },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated, message: 'อัปเดตสถานะเรียบร้อย' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'อัปเดตสถานะไม่สำเร็จ', error: String(error) }, { status: 500 });
  }
}