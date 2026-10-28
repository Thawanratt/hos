import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: ดึงรายชื่อคนไข้ พร้อมดึงประวัติการรักษา (MedicalRecords) ของแพทย์ท่านนั้นด้วย
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get('doctorId');

    if (!rawId) {
      return NextResponse.json({ success: false, message: 'Missing doctorId' }, { status: 400 });
    }

    const parsedId = Number(rawId);
    let doctor = await prisma.doctor.findUnique({ where: { id: parsedId } });
    if (!doctor) {
      doctor = await prisma.doctor.findUnique({ where: { userId: parsedId } });
    }

    if (!doctor) {
      return NextResponse.json({ success: true, data: [] });
    }

    // ดึงเฉพาะ Appointment ที่จองกับแพทย์ท่านนี้
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            gender: true,
            createdAt: true,
          },
        },
      },
      orderBy: { appointmentDate: 'desc' },
    });

    const uniquePatientsMap = new Map();
    for (const app of appointments) {
      if (app.patient && !uniquePatientsMap.has(app.patient.id)) {
        // ดึงประวัติการรักษาที่แพทย์ท่านนี้เคยบันทึกไว้กับคนไข้คนนี้
        const records = await prisma.medicalRecord.findMany({
          where: { patientId: app.patient.id, doctorId: doctor.id },
          orderBy: { createdAt: 'desc' },
        });

        uniquePatientsMap.set(app.patient.id, {
          ...app.patient,
          medicalRecords: records, // แนบประวัติการรักษาเก่ามาด้วย
        });
      }
    }

    return NextResponse.json({ success: true, data: Array.from(uniquePatientsMap.values()) });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: เพิ่มบันทึกเวชระเบียนใหม่ (ตรวจครั้งใหม่)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorId, patientId, diagnosis, prescription } = body;

    if (!doctorId || !patientId || !diagnosis) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    let doctor = await prisma.doctor.findUnique({ where: { id: Number(doctorId) } });
    if (!doctor) {
      doctor = await prisma.doctor.findUnique({ where: { userId: Number(doctorId) } });
    }

    if (!doctor) {
      return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
    }

    const newRecord = await prisma.medicalRecord.create({
      data: {
        doctorId: doctor.id,
        patientId: Number(patientId),
        diagnosis,
        prescription: prescription || null,
      },
    });

    return NextResponse.json({ success: true, data: newRecord });
  } catch (error) {
    console.error('Error saving medical record:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: แก้ไขเวชระเบียนเดิม (กรณีพิมพ์ผิดหรือต้องการอัปเดตข้อมูลเก่า)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { recordId, diagnosis, prescription } = body;

    if (!recordId || !diagnosis) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const updatedRecord = await prisma.medicalRecord.update({
      where: { id: Number(recordId) },
      data: {
        diagnosis,
        prescription: prescription || null,
      },
    });

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error) {
    console.error('Error updating medical record:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}