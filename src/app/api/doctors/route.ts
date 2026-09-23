import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// ป้องกันการสร้าง PrismaClient ซ้ำซ้อนตอน Hot Reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId');
    const gender = searchParams.get('gender');
    const dayOfWeek = searchParams.get('dayOfWeek');
    const timeSlot = searchParams.get('timeSlot');
    const isInstantBooking = searchParams.get('isInstantBooking');

    // เงื่อนไขหลัก
    const whereCondition: any = {};

    // 1. กรองตามแผนกการรักษา
    if (departmentId && departmentId !== 'ALL') {
      whereCondition.departmentId = parseInt(departmentId);
    }

    // 2. กรองเฉพาะแพทย์ Instant Booking
    if (isInstantBooking === 'true') {
      whereCondition.isInstantBooking = true;
    }

    // 3. กรองข้อมูล User (ชื่อ, นามสกุล, เพศ)
    const userCondition: any = {};
    if (gender && gender !== 'ALL') {
      userCondition.gender = gender;
    }

    // ถ้ามีการค้นหาชื่อ/นามสกุล/ความเชี่ยวชาญ
    if (search) {
      whereCondition.OR = [
        { user: { ...userCondition, firstName: { contains: search, mode: 'insensitive' } } },
        { user: { ...userCondition, lastName: { contains: search, mode: 'insensitive' } } },
        { specialization: { contains: search, mode: 'insensitive' } },
      ];
    } else if (Object.keys(userCondition).length > 0) {
      whereCondition.user = userCondition;
    }

    // 4. กรองตามวันและช่วงเวลาเข้าตรวจ (DoctorSchedule)
    const scheduleFilter: any = {};

    if (dayOfWeek && dayOfWeek !== 'ALL') {
      scheduleFilter.dayOfWeek = parseInt(dayOfWeek);
    }

    if (timeSlot && timeSlot !== 'ALL') {
      if (timeSlot === 'morning') {
        scheduleFilter.startTime = { gte: '08:00', lte: '12:00' };
      } else if (timeSlot === 'afternoon') {
        scheduleFilter.startTime = { gte: '12:00', lte: '16:00' };
      } else if (timeSlot === 'evening') {
        scheduleFilter.startTime = { gte: '16:00', lte: '20:00' };
      }
    }

    if (Object.keys(scheduleFilter).length > 0) {
      whereCondition.schedules = {
        some: scheduleFilter,
      };
    }

    // ค้นหาข้อมูลแพทย์พร้อม Include
    const doctors = await prisma.doctor.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            gender: true,
            email: true,
            phone: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        schedules: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}