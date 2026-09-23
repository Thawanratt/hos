import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { maskIdCard, maskPhone } from '@/utils/maskData';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, any>;

    const firstName = body.firstName ?? body.firstname ?? body.first_name;
    const lastName = body.lastName ?? body.lastname ?? body.last_name;
    const idCard = body.idCard ?? body.id_card ?? body.idcard;
    const phone = body.phone;
    const email = body.email;
    const password = body.password; // 🟢 ใช้รหัสผ่านปกติ ไม่แฮช เพื่อให้ล็อกอินทดสอบต่อได้ง่าย

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

    // 🟢 เซนเซอร์ข้อมูลอ่อนไหวถาวร (เบอร์โทรโชว์ 4 ตัวท้าย, บัตร ปชช. ซ่อนกลาง)
    const securedPhone = maskPhone(phone);
    const securedIdCard = maskIdCard(idCard);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        idCard: securedIdCard, // บันทึกแบบซ่อน
        phone: securedPhone,   // บันทึกแบบซ่อน (โชว์ 4 ตัวท้าย)
        email,
        password,              // บันทึกรหัสผ่านปกติ
        role: Role.PATIENT,
      },
    });

    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ', user: newUser },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', error: message }, { status: 500 });
  }
}