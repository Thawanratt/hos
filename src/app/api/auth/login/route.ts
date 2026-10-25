//ตรวจสอบและเข้าสู่ระบบ

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // 1. ค้นหาผู้ใช้ด้วยอีเมลใน PostgreSQL ผ่าน Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. ถ้าไม่อยู่ในระบบ
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบบัญชีผู้ใช้งานนี้ในระบบ' },
        { status: 404 }
      );
    }

    // 3. เช็กรหัสผ่านด้วย bcrypt.compare
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // 4. ส่งข้อมูลผู้ใช้กลับไปเมื่อเข้าสู่ระบบสำเร็จ (ตัดฟิลด์ password ออกก่อนส่ง)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { 
        success: true, 
        message: 'เข้าสู่ระบบสำเร็จ', 
        user: userWithoutPassword 
      },
      { status: 200 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: errorMessage },
      { status: 500 }
    );
  }
}