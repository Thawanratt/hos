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

    if (isNaN(appointmentId)) {
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

// 2. PATCH: อัปเดตข้อมูล/สถานะการนัดหมาย (พร้อมระบบป้องกันการบันทึกเวชระเบียนเบิ้ลซ้ำ)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = Number(resolvedParams.id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { success: false, message: 'รหัสการนัดหมายไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, symptoms, doctorId } = body; 

    // ดึงข้อมูลนัดหมายเดิมมาตรวจสอบก่อนอัปเดต
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true, doctor: true },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลการนัดหมาย' },
        { status: 404 }
      );
    }

    // 🟢 ตรวจสอบสถานะความพร้อม (isAvailable) หากมีการยืนยันนัดหมาย (CONFIRMED) หรือเปลี่ยนแพทย์
    const targetDoctorId = doctorId !== undefined ? (doctorId ? Number(doctorId) : null) : existingAppointment.doctorId;
    
    if (status === 'CONFIRMED' && targetDoctorId) {
      const appointmentDateObj = new Date(existingAppointment.appointmentDate);
      const dayOfWeek = appointmentDateObj.getDay();

      const doctorSchedule = await prisma.doctorSchedule.findFirst({
        where: {
          doctorId: targetDoctorId,
          dayOfWeek: dayOfWeek,
        },
      });

      // ถ้าแพทย์กดปิดสถานะการออกตรวจ (isAvailable: false) ห้ามยืนยันนัดหมาย
      if (doctorSchedule && !doctorSchedule.isAvailable) {
        return NextResponse.json(
          { success: false, message: 'ไม่สามารถยืนยันนัดหมายได้ เนื่องจากแพทย์งดออกตรวจในวันดังกล่าว' },
          { status: 400 }
        );
      }
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

    // 🟢 ระบบอัตโนมัติ: ถ้าสถานะเปลี่ยนเป็น COMPLETED (ตรวจเสร็จสิ้น) ให้บันทึกเวชระเบียนลงตาราง medical_records
    if (status === 'COMPLETED' && updatedAppointment.patientId && updatedAppointment.doctorId) {
      // ป้องกันการเบิ้ลซ้ำ: เช็กว่าในช่วง 10 วินาทีที่ผ่านมา เคยมีการสร้างเวชระเบียนของแพทย์และคนไข้คู่นี้ไปแล้วหรือยัง
      const tenSecondsAgo = new Date(Date.now() - 10000);

      const recentRecord = await prisma.medicalRecord.findFirst({
        where: {
          patientId: updatedAppointment.patientId,
          doctorId: updatedAppointment.doctorId,
          createdAt: {
            gte: tenSecondsAgo, // ป้องกันการยิงซ้ำติดๆ กันใน 10 วิ
          },
        },
      });

      if (!recentRecord) {
        await prisma.medicalRecord.create({
          data: {
            doctorId: updatedAppointment.doctorId,
            patientId: updatedAppointment.patientId,
            diagnosis: updatedAppointment.symptoms || '', // ดึงอาการที่คนไข้กรอกมาตรงๆ
            prescription: '', // ปล่อยว่างไว้ตามที่ต้องการ
          },
        });
      }
    }

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
    const appointmentId = Number(resolvedParams.id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { success: false, message: 'รหัสการนัดหมายไม่ถูกต้อง' },
        { status: 400 }
      );
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