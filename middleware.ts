import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // ปล่อยให้ /booking และ /history ผ่านได้ แล้วให้ Client-side เช็ก localStorage เอาเอง

  // ดักเฉพาะคนไข้ทั่วไปที่พยายามแอบเข้าหน้า /admin เท่านั้น
  if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// ตัด /booking และ /history ออกจาก matcher ให้เหลือเฉพาะหน้า admin
export const config = {
  matcher: ['/admin/:path*'],
};