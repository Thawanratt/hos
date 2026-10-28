import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. POST: บันทึกการจองคิวใหม่ (พร้อมระบบเช็กคิวชนกันและเช็กสถานะงดออกตรวจของแพทย์)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, doctorId, departmentId, branch, appointmentDate, timeSlot, symptoms } = body;

    // ตรวจสอบว่ามีข้อมูลจำเป็นครบถ้วนไหม (ไม่บังคับ doctorId แล้ว เพื่อรองรับบริการตรวจสุขภาพ/วัคซีน)
    if (!patientId || !departmentId || !appointmentDate || !timeSlot) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลการนัดหมายให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const formattedDate = new Date(appointmentDate);
    const validPatientId = Number(patientId);
    const validDoctorId = doctorId && Number(doctorId) > 0 ? Number(doctorId) : null;

    if (isNaN(validPatientId)) {
      return NextResponse.json(
        { success: false, message: 'รหัสผู้ป่วยไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // 🔒 1. เช็กว่าแพทย์งดออกตรวจในช่วงเวลานี้หรือไม่ (เช็กเฉพาะกรณีที่มีการเลือกแพทย์)
    if (validDoctorId) {
      const targetDayOfWeek = formattedDate.getDay(); // 0 = วันอาทิตย์, 1 = วันจันทร์, ...

      // ค้นหาตารางออกตรวจของแพทย์ในช่วงเวลานั้น
      const doctorSchedule = await prisma.doctorSchedule.findFirst({
        where: {
          doctorId: validDoctorId,
          dayOfWeek: targetDayOfWeek,
          startTime: {
            lte: timeSlot.substring(0, 5), // เทียบเวลาเริ่มต้น เช่น "09:00"
          },
          endTime: {
            gte: timeSlot.substring(8, 13), // เทียบเวลาสิ้นสุด เช่น "10:00"
          },
        },
      });

      // ถ้ามีการตั้งตารางไว้แต่แพทย์กดงดออกตรวจ (isAvailable: false)
      if (doctorSchedule && !doctorSchedule.isAvailable) {
        return NextResponse.json(
          { success: false, message: 'แพทย์ท่านนี้งดออกตรวจในช่วงเวลานี้ ไม่สามารถจองคิวได้' },
          { status: 400 }
        );
      }

      // เช็กว่าแพทย์ติดนัดหมายอื่นในช่วงเวลานี้แล้วหรือยัง
      const existingDoctorAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId: validDoctorId,
          appointmentDate: formattedDate,
          timeSlot: timeSlot,
          status: {
            not: 'CANCELLED',
          },
        },
      });

      if (existingDoctorAppointment) {
        return NextResponse.json(
          { success: false, message: 'ช่วงเวลานี้แพทย์มีนัดหมายอื่นแล้ว กรุณาเลือกช่วงเวลาอื่น' },
          { status: 400 }
        );
      }
    }

    // 🔒 2. เช็กว่าคนไข้มีการจองซ้ำในช่วงเวลาเดียวกันไหม
    const existingPatientAppointment = await prisma.appointment.findFirst({
      where: {
        patientId: validPatientId,
        appointmentDate: formattedDate,
        timeSlot: timeSlot,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (existingPatientAppointment) {
      return NextResponse.json(
        { success: false, message: 'คุณมีนัดหมายในช่วงเวลานี้แล้ว' },
        { status: 400 }
      );
    }

    // 3. บันทึกรายการนัดหมาย (รองรับ doctorId เป็น null)
    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: validPatientId,
        doctorId: validDoctorId,
        departmentId: Number(departmentId),
        branch: branch || 'novaria-main', 
        appointmentDate: formattedDate,
        timeSlot: timeSlot,
        symptoms: symptoms || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { success: true, message: 'บันทึกการนัดหมายเรียบร้อยแล้ว', data: newAppointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการจองคิว', error: errorMessage },
      { status: 500 }
    );
  }
}

// 2. GET: ดึงรายการนัดหมาย (แยกสิทธิ์ Admin ดูทั้งหมด / Patient ดูแค่ของตัวเอง)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    const whereCondition: any = {};
    
    if (patientId) {
      const pId = Number(patientId);
      if (!isNaN(pId)) whereCondition.patientId = pId;
    }
    
    if (doctorId) {
      const dId = Number(doctorId);
      if (!isNaN(dId)) whereCondition.doctorId = dId;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereCondition,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        department: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { success: true, data: appointments },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching appointments:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถดึงข้อมูลรายการนัดหมายได้', error: errorMessage },
      { status: 500 }
    );
  }
}