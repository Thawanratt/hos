import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: ดึงรายละเอียดการนัดหมายตาม ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = Number(resolvedParams.id);

    if (Number.isNaN(appointmentId)) {
      return NextResponse.json(
        { success: false, message: 'รหัสการนัดหมายไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
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
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรายการนัดหมายนี้' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: appointment },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: errorMessage },
      { status: 500 }
    );
  }
}

// 🟢 ฟังก์ชันย่อยที่ 1: ตรวจสอบความถูกต้องของรหัส (ใช้ Number.isNaN ตามมาตรฐาน SonarQube)
function parseAppointmentId(idParam: string): number | null {
  const appointmentId = Number(idParam);
  return Number.isNaN(appointmentId) ? null : appointmentId;
}

// 🟢 ฟังก์ชันย่อยที่ 2: ตรวจสอบตารางแพทย์
async function validateDoctorSchedule(status: string, targetDoctorId: number | null, appointmentDate: Date) {
  if (status !== 'CONFIRMED' || !targetDoctorId) return null;

  const dayOfWeek = new Date(appointmentDate).getDay();
  const doctorSchedule = await prisma.doctorSchedule.findFirst({
    where: { doctorId: targetDoctorId, dayOfWeek },
  });

  if (doctorSchedule && !doctorSchedule.isAvailable) {
    return 'ไม่สามารถยืนยันนัดหมายได้ เนื่องจากแพทย์งดออกตรวจในวันดังกล่าว';
  }
  return null;
}

// 🟢 ฟังก์ชันย่อยที่ 3: บันทึกเวชระเบียนอัตโนมัติ
async function recordMedicalHistory(status: string, patientId: number | null, doctorId: number | null, symptoms: string | null) {
  if (status !== 'COMPLETED' || !patientId || !doctorId) return;

  const tenSecondsAgo = new Date(Date.now() - 10000);
  const recentRecord = await prisma.medicalRecord.findFirst({
    where: {
      patientId,
      doctorId,
      createdAt: { gte: tenSecondsAgo },
    },
  });

  if (!recentRecord) {
    await prisma.medicalRecord.create({
      data: {
        doctorId,
        patientId,
        diagnosis: symptoms || '',
        prescription: '',
      },
    });
  }
}

// 2. PATCH: อัปเดตข้อมูล/สถานะการนัดหมาย (ลดความซับซ้อนด้วยการแยกฟังก์ชัน)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = parseAppointmentId(resolvedParams.id);

    if (!appointmentId) {
      return NextResponse.json({ success: false, message: 'รหัสการนัดหมายไม่ถูกต้อง' }, { status: 400 });
    }

    const body = await request.json();
    const { status, symptoms, doctorId } = body; 

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true, doctor: true },
    });

    if (!existingAppointment) {
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลการนัดหมาย' }, { status: 404 });
    }

    const targetDoctorId = doctorId !== undefined ? (doctorId ? Number(doctorId) : null) : existingAppointment.doctorId;
    
    const scheduleError = await validateDoctorSchedule(status, targetDoctorId, existingAppointment.appointmentDate);
    if (scheduleError) {
      return NextResponse.json({ success: false, message: scheduleError }, { status: 400 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(status && { status }), 
        ...(symptoms && { symptoms }),
        ...(doctorId !== undefined && { doctorId: targetDoctorId }), 
      },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        department: true,
      },
    });

    await recordMedicalHistory(status, updatedAppointment.patientId, updatedAppointment.doctorId, updatedAppointment.symptoms);

    return NextResponse.json(
      { success: true, message: 'อัปเดตข้อมูลเรียบร้อยแล้ว', data: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating appointment:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถอัปเดตข้อมูลได้', error: errorMessage },
      { status: 500 }
    );
  }
}

// 3. DELETE: ลบรายการนัดหมาย
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = parseAppointmentId(resolvedParams.id);

    if (!appointmentId) {
      return NextResponse.json({ success: false, message: 'รหัสการนัดหมายไม่ถูกต้อง' }, { status: 400 });
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json(
      { success: true, message: 'ลบรายการนัดหมายเรียบร้อยแล้ว' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: 'ไม่สามารถลบรายการนัดหมายได้', error: errorMessage },
      { status: 500 }
    );
  }
}