import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ใช้ db อ้างอิงเพื่อป้องกันปัญหา TypeScript ขีดแดง
const db = prisma as any;

// 1. GET: ดึงรายการนัดหมาย, ข่าวสาร และแพ็กเกจทั้งหมด สำหรับหน้า Admin Dashboard
export async function GET() {
  try {
    const [appointments, newsList, packagesList] = await Promise.all([
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
      //  ดึงรายการแพ็กเกจ
      db.package.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        appointments,
        news: newsList,
        packages: packagesList, 
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ดึงข้อมูลไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}

// 2. PATCH: รองรับการอัปเดต นัดหมาย, ข่าวสาร, และแพ็กเกจ
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      newsId, title, content, category, imageUrl, 
      appointmentId, status, 
      packageId, subtitle, price, originalPrice, tag, features 
    } = body;

    // กรณีที่ 1: แก้ไขข่าวสาร
    if (newsId) {
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

    // กรณีที่ 2: เปลี่ยนสถานะนัดหมาย
    if (appointmentId) {
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

    //  กรณีที่ 3: แก้ไขแพ็กเกจ (เมื่อส่ง packageId มา)
    if (packageId) {
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

// 3. POST: เพิ่มข่าวสาร หรือ เพิ่มแพ็กเกจใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, imageUrl, type, subtitle, price, originalPrice, tag, features } = body;

    //  ถ้าระบุ type เป็น 'package' หรือมีส่ง price มา -> บันทึกเป็นแพ็กเกจ
    if (type === 'package' || price) {
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

    // กรณีปกติ: เพิ่มข่าวสารใหม่
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
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เพิ่มข้อมูลไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}

// 4. DELETE: ลบข่าวสาร หรือ ลบแพ็กเกจ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');
    const packageId = searchParams.get('packageId');

    //  ลบแพ็กเกจ
    if (packageId) {
      await db.package.delete({
        where: { id: Number(packageId) },
      });
      return NextResponse.json({ success: true, message: 'ลบแพ็กเกจเรียบร้อยแล้ว' });
    }

    // ลบข่าวสาร
    if (newsId) {
      await db.news.delete({
        where: { id: Number(newsId) },
      });
      return NextResponse.json({ success: true, message: 'ลบข่าวสารเรียบร้อยแล้ว' });
    }

    return NextResponse.json(
      { success: false, message: 'กรุณาระบุ newsId หรือ packageId ที่ต้องการลบ' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ลบข้อมูลไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}