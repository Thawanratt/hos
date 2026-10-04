'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect'); // อ่านค่าหน้าที่ต้องการให้เด้งกลับไป

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. บันทึกข้อมูล user ลง localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('isLoggedIn', 'true');
        }

        // 2. ยิงสัญญาณบอก Navbar ให้สลับเป็นปุ่ม "ออกจากระบบ" ทันที
        window.dispatchEvent(new Event('storage'));

        // 3. เช็ก Role และ Target URL
        const userRole = data.user?.role || data.role;
        
        let targetUrl = '/';
        
        if (userRole === 'ADMIN') {
          targetUrl = '/status(admin)/dashboard';
        } else if (redirectTo) {
          // ถ้ามี param redirect ส่งมา (เช่น จากปุ่มเพิ่มสินค้าลงตะกร้า) ให้เด้งกลับไปหน้านั้น
          targetUrl = decodeURIComponent(redirectTo);
        } else {
          // ถ้าไม่มี redirect ส่งมา ให้เด้งไปหน้าหลัก (/)
          targetUrl = '/';
        }

        // 4. เปลี่ยนหน้าไปยัง URL ปลายทาง
        window.location.href = targetUrl;
      } else {
        setErrorMessage(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } 
      
    } catch (error) {
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="relative z-10 w-full max-w-md space-y-6 text-center">
      <div className="space-y-2">
        {/* รูปโลโก้โรงพยาบาล */}
        <div className="flex justify-center">
          <Image 
            src="/lll.png" 
            alt="NOVARIA Logo" 
            width={140} 
            height={140} 
            className="h-30 w-auto object-contain"
            priority
          />
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a2b6d]">เข้าสู่ระบบ</h1>
        <p className="text-xs text-gray-500">ยินดีต้อนรับกลับ เข้าสู่ระบบเพื่อจัดการการนัดหมาย</p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 border border-red-200 text-xs py-2 px-4 rounded-xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-left pt-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">อีเมล</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </span>
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">รหัสผ่าน</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </span>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
              required
            />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#f5e9ce] hover:bg-[#ebd5a0] text-[#7a5c10] font-bold text-xs rounded-full transition shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-600 pt-1">
        ยังไม่มีบัญชีสมาชิก?{' '}
        <Link href="/register" className="text-[#b8972e] font-bold hover:underline ml-1">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-amber-50/20 font-sans my-8">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />
      <Suspense fallback={<div className="text-center py-10 text-xs text-gray-500">กำลังโหลด...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}