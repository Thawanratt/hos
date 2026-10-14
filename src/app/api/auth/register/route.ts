import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { maskIdCard, maskPhone } from '@/utils/maskData';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, any>;

    const firstName = body.firstName ?? body.firstname ?? body.first_name;
    const lastName = body.lastName ?? body.lastname ?? body.last_name;
    // ลบขีดหรือช่องว่างออกก่อนนับจำนวน (เผื่อผู้ใช้พิมพ์มาแบบ 1-2345-...)
    const idCard = String(body.idCard ?? body.id_card ?? body.idcard ?? '').replace(/[^0-9]/g, '');
    const phone = String(body.phone ?? '').replace(/[^0-9]/g, ''); const email = body.email;
    const password = body.password || '';

    // ==========================================
    // 🛡️ 1. ระบบตรวจสอบความถูกต้องของข้อมูล (Validation)
    // ==========================================

    // ตรวจสอบเลขบัตรประชาชน (ต้อง 13 หลัก)
    if (idCard.length !== 13) {
      return NextResponse.json(
        { message: 'กรุณากรอกเลขประจำตัวประชาชนให้ครบ 13 หลัก' },
        { status: 400 }
      );
    }

    // ตรวจสอบเบอร์โทรศัพท์ (ต้อง 10 หลัก)
    if (phone.length !== 10) {
      return NextResponse.json(
        { message: 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก' },
        { status: 400 }
      );
    }

    // ตรวจสอบความยาวรหัสผ่าน (ต้อง 8 ตัวขึ้นไป)
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรขึ้นไป' },
        { status: 400 }
      );
    }

    // ==========================================
    // 🔍 2. ตรวจสอบข้อมูลซ้ำในระบบ
    // ==========================================
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { idCard }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'อีเมลหรือเลขบัตรประชาชนนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // ==========================================
    // 💾 3. บันทึกข้อมูล
    // ==========================================
    // เซนเซอร์ข้อมูลอ่อนไหวถาวร (เบอร์โทรโชว์ 4 ตัวท้าย, บัตร ปชช. ซ่อนกลาง)
    const securedPhone = maskPhone(phone);
    const securedIdCard = maskIdCard(idCard);

    // เข้ารหัส (Hash) รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        idCard: securedIdCard,
        phone: securedPhone,
        email,
        password: hashedPassword,
        role: Role.PATIENT,
      },
    });

    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ', user: newUser },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', error: message },
      { status: 500 }
    );
  }
}