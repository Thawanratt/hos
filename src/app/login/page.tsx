'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ฟังก์ชันล็อกอินแบบธรรมดา (ใช้พาท /api/auth/login ให้ตรงกับ Backend)
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

      if (res.ok && data.success) {
        handleLoginSuccess(data);
      } else {
        setErrorMessage(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } 
    } catch (error) {
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันจัดการเมื่อล็อกอินสำเร็จ
  const handleLoginSuccess = (data: any) => {
    const userData = data.user || data.data || data;
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
    }

    window.dispatchEvent(new Event('storage'));
    setSuccessMessage('เข้าสู่ระบบสำเร็จ! กำลังพาท่านไปยังระบบ...');

    const userRole = userData?.role || data.role;
    let targetUrl = '/';
    
    if (userRole === 'ADMIN') {
      targetUrl = '/admin/main';
    } else if (userRole === 'DOCTOR') {
      targetUrl = '/doctors/main'; 
    } else if (redirectTo) {
      targetUrl = decodeURIComponent(redirectTo);
    }

    setTimeout(() => {
      router.push(targetUrl);
    }, 1200);
  };

  // ฟังก์ชันล็อกอินด้วย Google SDK
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setErrorMessage('');

      try {
        const resUser = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await resUser.json();

        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: googleUser.email,
            name: googleUser.name,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          handleLoginSuccess(data);
        } else {
          setErrorMessage(data.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้');
        }
      } catch (error) {
        setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMessage('ยกเลิกหรือล้มเหลวในการล็อกอินด้วย Google');
      setGoogleLoading(false);
    },
  });

  return (
    <div className="relative z-[#10] w-full max-w-md space-y-6 text-center">
      <div className="space-y-2">
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

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
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
            disabled={loading || !!successMessage}
            className="w-full py-3 bg-[#f5e9ce] hover:bg-[#ebd5a0] text-[#7a5c10] font-bold text-xs rounded-full transition shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </form>

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-300 w-full"></div>
        <span className="bg-[#fff9ed] px-3 text-[11px] text-gray-500 uppercase tracking-wider absolute">หรือ</span>
      </div>

      <button
        type="button"
        onClick={() => handleGoogleLogin()}
        disabled={googleLoading || !!successMessage}
        className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-full border border-gray-300 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        {googleLoading ? 'กำลังเข้าสู่ระบบด้วย Google...' : 'เข้าสู่ระบบด้วย Google'}
      </button>

      <p className="text-xs text-gray-600 pt-1">
        ยังไม่มีบัญชีสมาชิก?{' '}
        <Link 
          href={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : '/register'} 
          className="text-[#b8972e] font-bold hover:underline ml-1"
        >
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