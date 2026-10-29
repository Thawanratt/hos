import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt'; //เอาไว้ใช้แฮชรหัสผ่านก่อนบันทึกในdatabase
import crypto from 'node:crypto'; //เอาไว้สุ่มเลข

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId');
    const gender = searchParams.get('gender');
    const dayOfWeek = searchParams.get('dayOfWeek');
    const timeSlot = searchParams.get('timeSlot');
    const isInstantBooking = searchParams.get('isInstantBooking');

    // 🟢 สร้างเงื่อนไข Where สำหรับ Prisma ตามตัวกรองที่ส่งมาจากหน้าบ้าน
    const whereCondition: any = {};

    // 1. ค้นหาจากชื่อ, นามสกุล หรือสาขาความเชี่ยวชาญ
    if (search) {
      whereCondition.OR = [
        { specialization: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // 2. กรองตามแผนก
    if (departmentId && departmentId !== 'ALL') {
      whereCondition.departmentId = Number(departmentId);
    }

    // 3. กรองตามเพศแพทย์
    if (gender && gender !== 'ALL') {
      whereCondition.user = {
        ...whereCondition.user,
        gender: gender,
      };
    }

    // 4. กรองตาม Instant Booking
    if (isInstantBooking === 'true') {
      whereCondition.isInstantBooking = true;
    }

    // 5. กรองตามวันออกตรวจ (dayOfWeek) ใน schedules
    if (dayOfWeek && dayOfWeek !== 'ALL') {
      whereCondition.schedules = {
        some: {
          dayOfWeek: Number(dayOfWeek),
        },
      };
    }

    // ดึงข้อมูลจากฐานข้อมูลตามเงื่อนไข
    const doctors = await prisma.doctor.findMany({
      where: whereCondition,
      include: {
        user: { select: { firstName: true, lastName: true, gender: true, email: true, phone: true } },
        department: { select: { id: true, name: true } },
        schedules: true,
      },
      orderBy: { id: 'asc' },
    });

    // 6. กรองตามช่วงเวลาเพิ่มเติม (Morning, Afternoon, Evening)
    let filteredDoctors = doctors;
    if (timeSlot && timeSlot !== 'ALL') {
      filteredDoctors = doctors.filter((doc) => {
        return doc.schedules.some((sched) => {
          const startHour = Number.parseInt(sched.startTime.split(':')[0], 10);
          if (timeSlot === 'morning') return startHour >= 8 && startHour < 12;
          if (timeSlot === 'afternoon') return startHour >= 12 && startHour < 16;
          if (timeSlot === 'evening') return startHour >= 16 && timeSlot === 'evening' ? startHour >= 16 && startHour < 20 : startHour >= 16 && startHour < 20;
          return true;
        });
      });
    }

    return NextResponse.json({ success: true, data: filteredDoctors });
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
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
              isAvailable: true,
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
              isAvailable: true,
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