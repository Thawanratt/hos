import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดึงรายการข่าวทั้งหมดไปแสดงหน้าบ้าน
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// POST: เพิ่มข่าวใหม่จากหน้าแอดมิน
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newArticle = await prisma.news.create({
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        imageUrl: body.imageUrl || null,
      },
    });
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'เพิ่มข่าวไม่สำเร็จ' }, { status: 500 });
  }
}