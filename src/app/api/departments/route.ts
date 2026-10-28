import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: ดึงข้อมูลแผนกทั้งหมด (พร้อมนับจำนวนแพทย์และคิว)
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            doctors: true,
            appointments: true,
          },
        },
      },
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

// 2. POST: เพิ่มแผนกใหม่
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อแผนก' },
        { status: 400 }
      );
    }

    const newDept = await prisma.department.create({
      data: {
        name,
        description: description || null,
      },
    });

    return NextResponse.json(
      { success: true, data: newDept },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating department:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'ชื่อแผนกนี้มีอยู่ในระบบแล้ว' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถเพิ่มแผนกได้' },
      { status: 500 }
    );
  }
}

// 3. PATCH: แก้ไขข้อมูลแผนก
export async function PATCH(request: NextRequest) {
  try {
    const { id, name, description } = await request.json();

    if (!id || !name) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุรหัสและชื่อแผนกที่ต้องการแก้ไข' },
        { status: 400 }
      );
    }

    const updatedDept = await prisma.department.update({
      where: { id: Number(id) },
      data: {
        name,
        description: description || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'แก้ไขข้อมูลแผนกสำเร็จ',
      data: updatedDept,
    });
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถแก้ไขข้อมูลแผนกได้' },
      { status: 500 }
    );
  }
}

// 4. DELETE: ลบแผนก
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรหัสแผนกที่ต้องการลบ' },
        { status: 400 }
      );
    }

    await prisma.department.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบแผนกสำเร็จ',
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถลบแผนกที่มีแพทย์สังกัดอยู่ได้' },
      { status: 500 }
    );
  }
}