import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: NextRequest) {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, gender: true, email: true, phone: true } },
        department: { select: { id: true, name: true } },
        schedules: true,
      },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ success: true, data: doctors });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, idCard, departmentId, licenseNumber, specialization, bio, imageUrl, isInstantBooking, schedules } = body;

    if (!firstName || !lastName || !email || !password || !licenseNumber) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let createdUserId: number;

    const newDoctor = await prisma.$transaction(async (tx: any) => {
      // 🟢 ใช้ crypto.randomInt แทน Math.random() เพื่อป้องกัน Security Hotspots
      const randomNum = crypto.randomInt(100000000, 1000000000);

      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone: phone || '-',
          idCard: idCard || `DOC-${randomNum}`,
          role: Role.DOCTOR,
        },
      });

      createdUserId = user.id;

      // 🟢 บันทึก Doctor พร้อม schedules และค่าเริ่มต้น isAvailable: true
      const doctor = await tx.doctor.create({
        data: {
          user: { connect: { id: createdUserId } },
          department: { connect: { id: Number(departmentId) } },
          licenseNumber,
          specialization: specialization || 'แพทย์ทั่วไป',
          bio: bio || null,
          imageUrl: imageUrl || null,
          isInstantBooking: Boolean(isInstantBooking),
          schedules: schedules && schedules.length > 0 ? {
            create: schedules.map((sch: any) => ({
              dayOfWeek: Number(sch.dayOfWeek),
              startTime: sch.startTime,
              endTime: sch.endTime,
              maxSlots: Number(sch.maxSlots || 10),
              isAvailable: true, // 🟢 กำหนดค่าเริ่มต้นให้เปิดให้บริการ
            }))
          } : undefined,
        },
        include: { user: true, department: true, schedules: true },
      });

      return doctor;
    });

    return NextResponse.json({ success: true, data: newDoctor }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating doctor:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, message: 'อีเมลหรือเลขใบประกอบวิชาชีพนี้มีอยู่ในระบบแล้ว' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'ไม่สามารถเพิ่มแพทย์ได้' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { doctorId, firstName, lastName, email, phone, departmentId, licenseNumber, specialization, bio, imageUrl, isInstantBooking, schedules } = body;

    if (!doctorId) {
      return NextResponse.json({ success: false, message: 'ไม่พบรหัสแพทย์' }, { status: 400 });
    }

    const doctorRecord = await prisma.doctor.findUnique({ where: { id: Number(doctorId) } });
    if (!doctorRecord) {
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลแพทย์' }, { status: 404 });
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.user.update({
        where: { id: doctorRecord.userId },
        data: { firstName, lastName, email, phone },
      });

      // 🟢 เคลียร์ตารางออกตรวจเก่าออก แล้วสร้างใหม่ตามที่แอดมินเลือก
      await tx.doctorSchedule.deleteMany({
        where: { doctorId: Number(doctorId) },
      });

      await tx.doctor.update({
        where: { id: Number(doctorId) },
        data: {
          department: departmentId ? { connect: { id: Number(departmentId) } } : undefined,
          licenseNumber,
          specialization,
          bio,
          imageUrl,
          isInstantBooking,
          schedules: schedules && schedules.length > 0 ? {
            create: schedules.map((sch: any) => ({
              dayOfWeek: Number(sch.dayOfWeek),
              startTime: sch.startTime,
              endTime: sch.endTime,
              maxSlots: Number(sch.maxSlots || 10),
              isAvailable: true, // 🟢 กำหนดค่าเริ่มต้นให้เปิดให้บริการเมื่อแอดมินตั้งค่าใหม่
            }))
          } : undefined,
        },
      });
    });

    return NextResponse.json({ success: true, message: 'แก้ไขข้อมูลสำเร็จ' });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ success: false, message: 'แก้ไขข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctor_id') || searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ success: false, message: 'ไม่พบรหัสแพทย์' }, { status: 400 });
    }

    const doctorRecord = await prisma.doctor.findUnique({ where: { id: Number(doctorId) } });
    if (!doctorRecord) {
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลแพทย์' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: doctorRecord.userId } });

    return NextResponse.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ไม่สามารถลบได้' }, { status: 500 });
  }
}