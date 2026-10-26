import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลอีเมลจาก Google' },
        { status: 400 }
      );
    }

    // 1. ค้นหาผู้ใช้จาก Email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. ถ้ายังไม่มี ให้สร้างผู้ใช้ใหม่โดยใส่ค่าสุ่มลงในฟิลด์บังคับ
    if (!user) {
      // แยกชื่อ-นามสกุลเบื้องต้นจาก name ของ Google
      const nameParts = (name || 'ผู้ป่วย Google').split(' ');
      const firstName = nameParts[0] || 'ผู้ป่วย';
      const lastName = nameParts.slice(1).join(' ') || 'Google';

      // สร้างเลขบัตรประชาชนชั่วคราวชั่วคราวป้องกัน idCard ซ้ำกัน
      const dummyIdCard = `GOOGLE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          idCard: dummyIdCard, // ฟิลด์บังคับใน Schema
          phone: '0000000000',  // ฟิลด์บังคับใน Schema (ผู้ใช้ไปอัปเดตในโปรไฟล์ทีหลังได้)
          password: `OAUTH_GOOGLE_${Date.now()}`, // ฟิลด์บังคับใน Schema
          role: 'PATIENT',
        },
      });
    }

    // 3. ส่งข้อมูลผู้ใช้กลับไปให้ Client บันทึก LocalStorage
    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบด้วย Google สำเร็จ',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google' },
      { status: 500 }
    );
  }
}