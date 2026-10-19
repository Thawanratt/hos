import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper สร้าง Ref ID สุ่ม 8 หลักด้วย Web Crypto API
function generateRefId(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomNumber = 10000000 + (array[0] % 90000000);
  return randomNumber.toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      gender,
      ageGroup,
      riskFactors, // รับแบบ Array จาก Step 1
      riskFactor,
      happiness,
      rqScore,
      burnoutScore,
      st5Score,
      q2Score,
      q9Score,
      suicideScore
    } = body;

    // แปลง Array ปัจจัยเสี่ยงให้เป็น String เพื่อเซฟลง DB
    let formattedRiskFactor = 'ไม่อยู่ในกลุ่มข้างต้น';
    if (Array.isArray(riskFactors) && riskFactors.length > 0) {
      formattedRiskFactor = riskFactors.join(', ');
    } else if (typeof riskFactor === 'string') {
      formattedRiskFactor = riskFactor;
    }

    const rawHappiness = Number(happiness || 0);
    const rawRq = Number(rqScore || 0);
    const rawBurnout = Number(burnoutScore || 0);
    const rawSt5 = Number(st5Score || 0);
    const rawQ2 = Number(q2Score || 0);
    const rawQ9 = Number(q9Score || 0);
    const rawSuicide = Number(suicideScore || 0);

    // ปรับเกณฑ์ประเมินความเสี่ยงให้ตรงกับหน้าเว็บและกรมสุขภาพจิต
    let overallRisk = 'ปกติ';
    if (rawSuicide >= 17 || rawQ9 >= 19 || rawSt5 >= 10) {
      overallRisk = 'เสี่ยงสูง / วิกฤต (ต้องพบแพทย์เร่งด่วน)';
    } else if (rawSuicide >= 1 || rawQ9 >= 7 || rawSt5 >= 5 || rawBurnout >= 5 || rawHappiness < 5) {
      overallRisk = 'มีความเสี่ยงด้านสุขภาพจิต';
    }

    // สร้าง Ref ID สุ่ม 8 หลักอย่างปลอดภัย
    const refId = generateRefId();

    // บันทึกลงฐานข้อมูล
    const newAssessment = await prisma.mentalHealthAssessment.create({
      data: {
        refId,
        gender: gender || 'ไม่ระบุ',
        ageGroup: ageGroup || 'ไม่ระบุ',
        riskFactor: formattedRiskFactor,
        happiness: rawHappiness,
        rqScore: rawRq,
        burnoutScore: rawBurnout,
        st5Score: rawSt5,
        q2Score: rawQ2,
        q9Score: rawQ9,
        suicideScore: rawSuicide,
        overallRisk
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