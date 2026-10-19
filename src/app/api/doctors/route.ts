import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// ป้องกันการสร้าง PrismaClient ซ้ำซ้อนตอน Hot Reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper: สร้างเงื่อนไขช่วงเวลา
function getTimeSlotFilter(timeSlot: string | null) {
  if (!timeSlot || timeSlot === 'ALL') return null;
  if (timeSlot === 'morning') return { gte: '08:00', lte: '12:00' };
  if (timeSlot === 'afternoon') return { gte: '12:00', lte: '16:00' };
  if (timeSlot === 'evening') return { gte: '16:00', lte: '20:00' };
  return null;
}

// Helper: สร้างเงื่อนไขสำหรับ Query ทั้งหมด
function buildWhereCondition(searchParams: URLSearchParams) {
  const search = searchParams.get('search') || '';
  const departmentId = searchParams.get('departmentId');
  const gender = searchParams.get('gender');
  const dayOfWeek = searchParams.get('dayOfWeek');
  const timeSlot = searchParams.get('timeSlot');
  const isInstantBooking = searchParams.get('isInstantBooking');

  const whereCondition: any = {};

  if (departmentId && departmentId !== 'ALL') {
    whereCondition.departmentId = Number.parseInt(departmentId, 10);
  }

  if (isInstantBooking === 'true') {
    whereCondition.isInstantBooking = true;
  }

  const userCondition: any = gender && gender !== 'ALL' ? { gender } : {};

  if (search) {
    whereCondition.OR = [
      { user: { ...userCondition, firstName: { contains: search, mode: 'insensitive' } } },
      { user: { ...userCondition, lastName: { contains: search, mode: 'insensitive' } } },
      { specialization: { contains: search, mode: 'insensitive' } },
    ];
  } else if (Object.keys(userCondition).length > 0) {
    whereCondition.user = userCondition;
  }

  const scheduleFilter: any = {};
  if (dayOfWeek && dayOfWeek !== 'ALL') {
    scheduleFilter.dayOfWeek = Number.parseInt(dayOfWeek, 10);
  }

  const timeFilter = getTimeSlotFilter(timeSlot);
  if (timeFilter) {
    scheduleFilter.startTime = timeFilter;
  }

  if (Object.keys(scheduleFilter).length > 0) {
    whereCondition.schedules = { some: scheduleFilter };
  }

  return whereCondition;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const whereCondition = buildWhereCondition(searchParams);

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