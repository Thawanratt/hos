import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const db = prisma as any;

// 1. GET: ดึงรายการแพ็กเกจทั้งหมด
export async function GET() {
  try {
    const packagesList = await db.package.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: packagesList,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ดึงข้อมูลแพ็กเกจไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}

// 2. POST: แอดมินเพิ่มแพ็กเกจใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, category, price, originalPrice, tag, imageUrl, features } = body;

    if (!title || !price) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อแพ็กเกจและราคา' },
        { status: 400 }
      );
    }

    const newPackage = await db.package.create({
      data: {
        title,
        subtitle: subtitle || null,
        category: category || 'ทั่วไป',
        price,
        originalPrice: originalPrice || null,
        tag: tag || null,
        imageUrl: imageUrl || null,
        features: Array.isArray(features) ? features : [],
      },
    });

    return NextResponse.json(
      { success: true, data: newPackage, message: 'เพิ่มแพ็กเกจเรียบร้อยแล้ว' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เพิ่มแพ็กเกจไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}

// 3. PATCH: แอดมินแก้ไขแพ็กเกจ
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, title, subtitle, category, price, originalPrice, tag, imageUrl, features } = body;

    if (!packageId) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ packageId ที่ต้องการแก้ไข' },
        { status: 400 }
      );
    }

    const updatedPackage = await db.package.update({
      where: { id: Number(packageId) },
      data: {
        ...(title && { title }),
        subtitle: subtitle !== undefined ? subtitle : undefined,
        ...(category && { category }),
        ...(price && { price }),
        originalPrice: originalPrice !== undefined ? originalPrice : undefined,
        tag: tag !== undefined ? tag : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        ...(features && { features }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPackage,
      message: 'แก้ไขแพ็กเกจเรียบร้อยแล้ว',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'แก้ไขแพ็กเกจไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}

// 4. DELETE: แอดมินลบแพ็กเกจ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');

    if (!packageId) {
      return NextResponse.json(
        { success: false, message: 'ระบุ packageId ที่ต้องการลบ' },
        { status: 400 }
      );
    }

    await db.package.delete({
      where: { id: Number(packageId) },
    });

    return NextResponse.json({ success: true, message: 'ลบแพ็กเกจเรียบร้อยแล้ว' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ลบแพ็กเกจไม่สำเร็จ', error: String(error) },
      { status: 500 }
    );
  }
}