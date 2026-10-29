'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idCard: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('กรุณากรอกชื่อจริงและนามสกุลให้ครบถ้วน');
      return;
    }
    if (formData.idCard.length !== 13) {
      setErrorMessage('กรุณากรอกเลขบัตรประจำตัวประชาชนให้ครบ 13 หลัก');
      return;
    }
    if (formData.phone.length !== 10) {
      setErrorMessage('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรขึ้นไป');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (!formData.acceptTerms) {
      setErrorMessage('กรุณายอมรับข้อกำหนดและเงื่อนไขการใช้งาน');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          idCard: formData.idCard,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('สมัครสมาชิกสำเร็จ! กำลังพาท่านไปหน้าเข้าสู่ระบบ...');
        setTimeout(() => {
          router.push('/login');
        }, 1200);
      } else {
        setErrorMessage(data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = useGoogleLogin({
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
          const userData = data.data || data;
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn', 'true');
          window.dispatchEvent(new Event('storage'));

          setSuccessMessage('ลงทะเบียนด้วย Google สำเร็จ! กำลังพาท่านไปยังหน้าหลัก...');
          setTimeout(() => {
            router.push('/');
          }, 1200);
        } else {
          setErrorMessage(data.message || 'เกิดข้อผิดพลาดในการลงทะเบียนด้วย Google');
        }
      } catch (error) {
        setErrorMessage('ไม่สามารถเชื่อมต่อกับ Google ได้');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMessage('ยกเลิกหรือล้มเหลวในการลงทะเบียนด้วย Google');
      setGoogleLoading(false);
    },
  });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-amber-50/20 font-sans my-8">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />

      <div className="relative z-10 w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <div className="flex justify-center">
            <Image 
              src="/lll.png" 
              alt="NOVARIA Logo" 
              width={160} 
              height={160} 
              className="h-24 w-auto object-contain"
              priority
            />
          </div>
          
          <h1 className="text-2xl font-bold text-[#1a2b6d]">สมัครสมาชิก</h1>
          <p className="text-xs text-gray-500">สร้างบัญชีใหม่เพื่อใช้งานบริการของเรา</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs py-2 px-4 rounded-xl font-semibold">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 animate-fade-in font-semibold">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left pt-2">
          {/* FIRST NAME */}
          <div className="space-y-1">
            <label htmlFor="firstName" className="text-xs font-semibold text-gray-700">ชื่อ</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input
                id="firstName"
                type="text"
                placeholder="กรอกชื่อจริง"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* LAST NAME */}
          <div className="space-y-1">
            <label htmlFor="lastName" className="text-xs font-semibold text-gray-700">นามสกุล</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input
                id="lastName"
                type="text"
                placeholder="กรอกนามสกุล"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* ID CARD */}
          <div className="space-y-1">
            <label htmlFor="idCard" className="text-xs font-semibold text-gray-700">เลขบัตรประชาชน (13 หลัก)</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3 3 0 00-3 3h6a3 3 0 00-3-3z" /></svg>
              </span>
              <input
                id="idCard"
                type="text"
                inputMode="numeric"
                maxLength={13}
                placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                value={formData.idCard}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 13);
                  setFormData({ ...formData, idCard: val });
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* PHONE NUMBER */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-semibold text-gray-700">เบอร์โทรศัพท์ (10 หลัก)</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone: val });
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-gray-700">อีเมล</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="กรอกอีเมล"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-semibold text-gray-700">รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input
                id="password"
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">ยืนยันรหัสผ่าน</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input
                id="confirmPassword"
                type="password"
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          <div className="pt-2 px-1">
            <label htmlFor="acceptTerms" className="flex items-start space-x-2 cursor-pointer text-[11px] text-[#8a7226]">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="w-3.5 h-3.5 mt-0.5 rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37]"
                required
              />
              <span>
                ฉันยอมรับ <span className="font-semibold underline">ข้อกำหนดและเงื่อนไขการใช้งาน</span> และ <span className="font-semibold underline">นโยบายส่วนตัว</span>
              </span>
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading || !!successMessage}
              className="w-full py-3 bg-[#f5e9ce] hover:bg-[#ebd5a0] text-[#7a5c10] font-bold text-xs rounded-full transition shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'กำลังบันทึกข้อมูล...' : 'สมัครสมาชิก'}
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-[#fff9ed] px-3 text-[11px] text-gray-500 uppercase tracking-wider absolute">หรือ</span>
        </div>

        <button
          type="button"
          onClick={() => handleGoogleRegister()}
          disabled={googleLoading || !!successMessage}
          className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-full border border-gray-300 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {googleLoading ? 'กำลังลงทะเบียนด้วย Google...' : 'สมัครสมาชิกด้วย Google'}
        </button>

        <p className="text-xs text-gray-600 pt-1">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="text-[#b8972e] font-bold hover:underline ml-1">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}