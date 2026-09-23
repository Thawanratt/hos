import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. POST: บันทึกการจองคิวใหม่ (พร้อมระบบเช็กคิวชนกัน)
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
    const validDoctorId = doctorId && Number(doctorId) > 0 ? Number(doctorId) : null;

    // 🔒 1. เช็กว่าหมอติดคิวในวันและเวลานี้แล้วหรือยัง (เช็กเฉพาะกรณีที่มีการเลือกแพทย์)
    if (validDoctorId) {
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
          { success: false, message: 'ช่วงเวลานี้แพทย์ติดนัดหมายแล้ว กรุณาเลือกช่วงเวลาอื่น' },
          { status: 400 }
        );
      }
    }

    // 🔒 2. เช็กว่าคนไข้มีการจองซ้ำในช่วงเวลาเดียวกันไหม
    const existingPatientAppointment = await prisma.appointment.findFirst({
      where: {
        patientId: Number(patientId),
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
        patientId: Number(patientId),
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
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการจองคิว', error },
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
    if (patientId) whereCondition.patientId = Number(patientId);
    if (doctorId) whereCondition.doctorId = Number(doctorId);

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
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถดึงข้อมูลรายการนัดหมายได้', error },
      { status: 500 }
    );
  }
}