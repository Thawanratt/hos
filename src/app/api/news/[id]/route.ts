import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE: ลบข่าวสาร
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.news.delete({
      where: { id: parseInt(params.id, 10) },
    });
    return NextResponse.json({ success: true, message: 'ลบข่าวเรียบร้อย' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ลบข่าวไม่สำเร็จ' }, { status: 500 });
  }
}