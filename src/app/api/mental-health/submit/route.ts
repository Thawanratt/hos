import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      gender,
      ageGroup,
      riskFactor,
      province,
      happiness,
      rqScore,
      burnoutScore,
      st5Score,
      q2Score,
      q9Score,
      suicideScore,
      isConsent
    } = body;

    // สร้าง Ref ID สุ่ม 8 หลักไม่ซ้ำกัน
    const refId = Math.floor(10000000 + Math.random() * 90000000).toString();

    // ประเมินความเสี่ยงโดยรวมตามหลักการแพทย์เบื้องต้น
    let overallRisk = 'ปกติ';
    if (suicideScore > 0 || q9Score >= 19 || st5Score >= 13) {
      overallRisk = 'เสี่ยงสูง / วิกฤต';
    } else if (q9Score >= 13 || st5Score >= 10 || rqScore < 10) {
      overallRisk = 'ปานกลางถึงสูง';
    }

    // บันทึกลงฐานข้อมูล PostgreSQL ผ่าน Prisma (แมตช์ฟิลด์กับ Step 1)
    const newAssessment = await prisma.mentalHealthAssessment.create({
      data: {
        refId,
        gender: gender || 'ไม่ระบุ',
        ageGroup: ageGroup || '20 - 39 ปี',
        riskFactor: riskFactor || 'ไม่ระบุ',
        province: province || 'นครปฐม',
        happiness: Number(happiness || 0),
        rqScore: Number(rqScore || 0),
        burnoutScore: Number(burnoutScore || 0),
        st5Score: Number(st5Score || 0),
        q2Score: Number(q2Score || 0),
        q9Score: Number(q9Score || 0),
        suicideScore: Number(suicideScore || 0),
        overallRisk,
        isConsent: Boolean(isConsent)
      }
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกผลการประเมินสุขภาพจิตสำเร็จ',
      data: newAssessment
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving mental health assessment:', error);
    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      error: String(error)
    }, { status: 500 });
  }
}