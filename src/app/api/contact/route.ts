import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, category, subject, message } = body;

    if (!fullName || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const newContact = await prisma.contactMessage.create({
      data: {
        fullName,
        phone,
        email: email || '',
        category,
        subject,
        message,
      },
    });

    // 🟢 เปลี่ยนมาใช้ host และ port 465 พร้อม secure: true เพื่อความปลอดภัยผ่าน HTTPS/SSL (แก้ปัญหา SonarQube)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const categoryMap: { [key: string]: string } = {
      general: 'สอบถามข้อมูลทั่วไป',
      appointment: 'นัดหมายแพทย์ / ตรวจสุขภาพ',
      insurance: 'สิทธิประกันชีวิตและค่ารักษาพยาบาล',
      'mental-health': 'สอบถามบริการตรวจสุขภาพใจออนไลน์',
      feedback: 'ข้อเสนอแนะการบริการ',
    };

    const categoryText = categoryMap[category] || category;

    await transporter.sendMail({
      from: `"Novaria Hospital Website" <${process.env.EMAIL_SERVER_USER}>`,
      to: process.env.EMAIL_ADMIN_RECEIVER,
      subject: `[แจ้งเตือนจากเว็บไซต์] หัวข้อ: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1a2b6d; border-bottom: 2px solid #1a2b6d; padding-bottom: 10px;">มีข้อความติดต่อใหม่จากเว็บไซต์โรงพยาบาล</h2>
          <p><strong>ประเภทเรื่อง:</strong> ${categoryText}</p>
          <p><strong>ชื่อ-นามสกุล:</strong> ${fullName}</p>
          <p><strong>เบอร์โทรศัพท์:</strong> ${phone}</p>
          <p><strong>อีเมล:</strong> ${email || 'ไม่ได้ระบุ'}</p>
          <p><strong>หัวข้อ:</strong> ${subject}</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <p style="margin-top: 0; font-weight: bold;">รายละเอียดข้อความ:</p>
            <p style="white-space: pre-line; margin-bottom: 0;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #64748b; margin-top: 20px;">ข้อความนี้ถูกส่งจากระบบอัตโนมัติของโรงพยาบาลโนวาเลีย</p>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'ส่งข้อความและบันทึกเข้าระบบเรียบร้อยแล้ว',
      data: newContact
    });

  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการส่งข้อมูลหรือระบบส่งเมล' },
      { status: 500 }
    );
  }
}