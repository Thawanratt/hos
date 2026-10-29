import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'node:crypto'; 

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์ที่อัปโหลด' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // เก็บไฟล์ไว้ใน public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // 🟢 ใช้ crypto.randomBytes แทน Math.random() เพื่อเคลียร์ Security Hotspots
    const randomString = crypto.randomBytes(8).toString('hex');
    const uniqueSuffix = `${Date.now()}-${randomString}`;
    
    const ext = path.extname(file.name) || '.jpg';
    const filename = `upload-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/${filename}`,
      message: 'อัปโหลดรูปภาพสำเร็จ',
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกไฟล์' },
      { status: 500 }
    );
  }
}