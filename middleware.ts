import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ดึง Token การล็อกอินจาก Cookie
  const token = request.cookies.get('userToken')?.value;
  const userRole = request.cookies.get('userRole')?.value; // 'PATIENT' หรือ 'ADMIN'

  const { pathname } = request.nextUrl;

  // 1. ถ้าผู้ใช้ทั่วไปพยายามเข้าหน้า /booking หรือ /history โดยไม่ได้ล็อกอิน
  if (!token && (pathname.startsWith('/booking') || pathname.startsWith('/history'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. ถ้าคนไข้ทั่วไปพยายามแอบเข้าหน้า /admin
  if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// ระบุเส้นทางที่ต้องการให้ Middleware ทำงานตรวจสิทธิ์
export const config = {
  matcher: ['/booking/:path*', '/history/:path*', '/admin/:path*'],
};