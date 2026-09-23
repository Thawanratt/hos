import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: ดึงรายละเอียดการนัดหมายตาม ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = Number(resolvedParams.id);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        department: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรายการนัดหมายนี้' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: appointment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error },
      { status: 500 }
    );
  }
}

// 2. PATCH: อัปเดตข้อมูล/สถานะการนัดหมาย (เช่น ยกเลิกคิว)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = Number(resolvedParams.id);
    const body = await request.json();
    const { status, symptoms } = body;

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(status && { status }), // เช่น CANCELLED
        ...(symptoms && { symptoms }),
      },
    });

    return NextResponse.json(
      { success: true, message: 'อัปเดตข้อมูลเรียบร้อยแล้ว', data: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถอัปเดตข้อมูลได้', error },
      { status: 500 }
    );
  }
}

// 3. DELETE: ลบรายการนัดหมาย
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = Number(resolvedParams.id);

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json(
      { success: true, message: 'ลบรายการนัดหมายเรียบร้อยแล้ว' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถลบรายการนัดหมายได้', error },
      { status: 500 }
    );
  }
}