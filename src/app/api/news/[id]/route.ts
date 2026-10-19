import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE: ลบข่าวสาร
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. เปลี่ยนประเภท params เป็น Promise
) {
  try {
    const { id } = await params; // 2. ใส่ await เพื่อดึงค่า id ออกมาจาก params

    await prisma.news.delete({
      where: { id: parseInt(id, 10) },
    });
    return NextResponse.json({ success: true, message: 'ลบข่าวเรียบร้อย' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ลบข่าวไม่สำเร็จ' }, { status: 500 });
  }
}