import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ใช้ db อ้างอิงเพื่อป้องกันปัญหา TypeScript ขีดแดง
const db = prisma as any;

// 1. GET: ดึงรายการนัดหมาย, ข่าวสาร, แพ็กเกจ และผู้ใช้งานทั้งหมด สำหรับหน้า Admin
export async function GET() {
  try {
    const [appointments, newsList, packagesList, usersList] = await Promise.all([
      // ดึงรายการนัดหมาย
      prisma.appointment.findMany({
        include: {
          patient: { select: { firstName: true, lastName: true, phone: true, email: true } },
          doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
          department: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      // ดึงรายการข่าวสาร
      db.news.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      // ดึงรายการแพ็กเกจ
      db.package.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      // ดึงรายชื่อผู้ใช้งานในระบบ
      prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        appointments,
        news: newsList,
        packages: packagesList, 
        users: usersList,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ดึงข้อมูลไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// Helper Functions สำหรับ PATCH
// ----------------------------------------------------

async function handleUpdateNews(body: any) {
  const { newsId, title, content, category, imageUrl } = body;
  const updatedNews = await db.news.update({
    where: { id: Number(newsId) },
    data: {
      title,
      content,
      category,
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json({
    success: true,
    data: updatedNews,
    message: 'บันทึกการแก้ไขข่าวสารเรียบร้อยแล้ว',
  });
}

async function handleUpdateAppointment(body: any) {
  const { appointmentId, status } = body;
  const updatedAppointment = await prisma.appointment.update({
    where: { id: Number(appointmentId) },
    data: { status },
  });

  return NextResponse.json({
    success: true,
    data: updatedAppointment,
    message: 'อัปเดตสถานะนัดหมายเรียบร้อยแล้ว',
  });
}

async function handleUpdatePackage(body: any) {
  const { packageId, title, subtitle, category, price, originalPrice, tag, imageUrl, features } = body;
  const updatedPackage = await db.package.update({
    where: { id: Number(packageId) },
    data: {
      ...(title && { title }),
      subtitle: subtitle !== undefined ? subtitle : undefined,
      ...(category && { category }),
      ...(price && { price }),
      originalPrice: originalPrice !== undefined ? originalPrice : undefined,
      tag: tag !== undefined ? tag : undefined,
      imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      ...(features && { features }),
    },
  });

  return NextResponse.json({
    success: true,
    data: updatedPackage,
    message: 'แก้ไขข้อมูลแพ็กเกจเรียบร้อยแล้ว',
  });
}

// 2. PATCH: รองรับการอัปเดต นัดหมาย, ข่าวสาร, และแพ็กเกจ
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.newsId) return await handleUpdateNews(body);
    if (body.appointmentId) return await handleUpdateAppointment(body);
    if (body.packageId) return await handleUpdatePackage(body);

    return NextResponse.json(
      { success: false, message: 'ข้อมูลที่ส่งมาไม่ถูกต้อง (ต้องระบุ newsId, appointmentId หรือ packageId)' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'อัปเดตข้อมูลไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// Helper Functions สำหรับ POST
// ----------------------------------------------------

async function handleCreatePackage(body: any) {
  const { title, category, imageUrl, subtitle, price, originalPrice, tag, features } = body;

  if (!title || !price) {
    return NextResponse.json(
      { success: false, message: 'กรุณากรอกชื่อแพ็กเกจและราคา' },
      { status: 400 }
    );
  }

  const newPackage = await db.package.create({
    data: {
      title,
      subtitle: subtitle || null,
      category: category || 'ตรวจสุขภาพประจำปี',
      price,
      originalPrice: originalPrice || null,
      tag: tag || null,
      imageUrl: imageUrl || null,
      features: Array.isArray(features) ? features : [],
    },
  });

  return NextResponse.json(
    { success: true, data: newPackage, message: 'เพิ่มแพ็กเกจเรียบร้อยแล้ว' },
    { status: 201 }
  );
}

async function handleCreateNews(body: any) {
  const { title, content, category, imageUrl } = body;

  if (!title || !content) {
    return NextResponse.json(
      { success: false, message: 'กรุณากรอกหัวข้อและเนื้อหาข่าวสาร' },
      { status: 400 }
    );
  }

  const newNews = await db.news.create({
    data: {
      title,
      content,
      category: category || 'ข่าวประชาสัมพันธ์',
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json(
    { success: true, data: newNews, message: 'เพิ่มข่าวสารเรียบร้อยแล้ว' },
    { status: 201 }
  );
}

// 3. POST: เพิ่มข่าวสาร หรือ เพิ่มแพ็กเกจใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === 'package' || body.price) {
      return await handleCreatePackage(body);
    }

    return await handleCreateNews(body);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เพิ่มข้อมูลไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// Helper Functions สำหรับ DELETE (ใช้ Number.isNaN ตามมาตรฐาน SonarQube)
// ----------------------------------------------------

async function handleDeletePackage(packageId: string) {
  const id = Number(packageId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ success: false, message: 'packageId ไม่ถูกต้อง' }, { status: 400 });
  }
  await db.package.delete({ where: { id } });
  return NextResponse.json({ success: true, message: 'ลบแพ็กเกจเรียบร้อยแล้ว' });
}

async function handleDeleteNews(newsId: string) {
  const id = Number(newsId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ success: false, message: 'newsId ไม่ถูกต้อง' }, { status: 400 });
  }
  await db.news.delete({ where: { id } });
  return NextResponse.json({ success: true, message: 'ลบข่าวสารเรียบร้อยแล้ว' });
}

async function handleDeleteAppointment(appointmentId: string) {
  const id = Number(appointmentId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ success: false, message: 'appointmentId ไม่ถูกต้อง' }, { status: 400 });
  }
  await prisma.appointment.delete({ where: { id } });
  return NextResponse.json({ success: true, message: 'ลบรายการนัดหมายเรียบร้อยแล้ว' });
}

async function handleDeleteUser(userId: string) {
  const id = Number(userId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ success: false, message: 'userId ไม่ถูกต้อง' }, { status: 400 });
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true, message: 'ลบผู้ใช้งานเรียบร้อยแล้ว' });
}

// 4. DELETE: ลบข่าวสาร, แพ็กเกจ, นัดหมาย หรือ ผู้ใช้งาน
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');
    const packageId = searchParams.get('packageId');
    const appointmentId = searchParams.get('appointmentId');
    const userId = searchParams.get('userId');

    if (packageId) return await handleDeletePackage(packageId);
    if (newsId) return await handleDeleteNews(newsId);
    if (appointmentId) return await handleDeleteAppointment(appointmentId);
    if (userId) return await handleDeleteUser(userId);

    return NextResponse.json(
      { success: false, message: 'กรุณาระบุ newsId, packageId, appointmentId หรือ userId ที่ต้องการลบ' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ลบข้อมูลไม่สำเร็จ', error: String(error) }, 
      { status: 500 }
    );
  }
}