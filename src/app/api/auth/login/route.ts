//ตรวจสอบและเข้าสู่ระบบ

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. ค้นหาผู้ใช้ด้วยอีเมลใน PostgreSQL ผ่าน Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. ถ้าไม่อยู่ในระบบ
    if (!user) {
      return NextResponse.json(
        { message: 'ไม่พบบัญชีผู้ใช้งานนี้ในระบบ' },
        { status: 404 }
      );
    }

    // 3. เช็กรหัสผ่านว่าตรงกันไหม (หากใช้ bcrypt ให้เปลี่ยนเป็น bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // 4. ส่งข้อมูลผู้ใช้กลับไปเมื่อเข้าสู่ระบบสำเร็จ
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { 
        success: true, // 👈 เพิ่มบรรทัดนี้
        message: 'เข้าสู่ระบบสำเร็จ', 
        user: userWithoutPassword 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error },
      { status: 500 }
    );
  }
}