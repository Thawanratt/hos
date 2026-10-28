import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GET: ดึงตารางออกตรวจตาม doctorId (รองรับทั้ง doctorId และ userId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get('doctorId');

    if (!rawId) {
      return NextResponse.json({ success: false, message: 'Missing doctorId' }, { status: 400 });
    }

    const parsedId = Number(rawId);

    // 🟢 ลองค้นหาตาราง Doctor โดยตรงก่อน (สมมติว่าเป็น doctor.id)
    let doctor = await prisma.doctor.findUnique({
      where: { id: parsedId },
    });

    // 🟢 ถ้าไม่เจอ ลองมองว่าค่าที่ส่งมาอาจจะเป็น user.id ให้หา Doctor จาก userId แทน
    if (!doctor) {
      doctor = await prisma.doctor.findUnique({
        where: { userId: parsedId },
      });
    }

    if (!doctor) {
      return NextResponse.json({ success: true, data: [] }); // ถ้ายังไม่เจอให้คืนค่าว่างไว้ก่อน ไม่พัง
    }

    // ดึงตารางออกตรวจจาก doctor.id ที่ถูกต้องจริงๆ
    const schedules = await prisma.doctorSchedule.findMany({
      where: { doctorId: doctor.id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return NextResponse.json({ success: true, data: schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. PATCH: ให้แพทย์กดสลับสถานะเปิด/ปิด (isAvailable)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { scheduleId, isAvailable } = body;

    if (!scheduleId || typeof isAvailable !== 'boolean') {
      return NextResponse.json({ success: false, message: 'Invalid data provided' }, { status: 400 });
    }

    const updatedSchedule = await prisma.doctorSchedule.update({
      where: { id: Number(scheduleId) },
      data: { isAvailable },
    });

    return NextResponse.json({ success: true, data: updatedSchedule });
  } catch (error) {
    console.error('Error updating schedule status:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}