import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ปรับ path ตามโปรเจกต์ของคุณถ้าจำเป็น

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถดึงข้อมูลแผนกได้' },
      { status: 500 }
    );
  }
}