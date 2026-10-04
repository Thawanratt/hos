'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
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
        router.push('/login');
      } else {
        setErrorMessage(data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-amber-50/20 font-sans my-8">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />

      <div className="relative z-10 w-full max-w-md space-y-6 text-center">
        {/* HEADER SECTION */}
        <div className="space-y-2">
          {/* รูปโลโก้โรงพยาบาลแทนวงกลม N+ เดิม */}
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
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs py-2 px-4 rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left pt-2">
          {/* FIELD 1: FIRST NAME */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">ชื่อ</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input
                type="text"
                placeholder="กรอกชื่อจริง"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* FIELD 2: LAST NAME */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">นามสกุล</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input
                type="text"
                placeholder="กรอกนามสกุล"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* FIELD 3: ID CARD */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">เลขบัตรประชาชน</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3 3 0 00-3 3h6a3 3 0 00-3-3z" /></svg>
              </span>
              <input
                type="text"
                maxLength={13}
                placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                value={formData.idCard}
                onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* FIELD 4: PHONE NUMBER */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">เบอร์โทรศัพท์</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              <input
                type="tel"
                placeholder="กรอกเบอร์โทรศัพท์"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* FIELD 5: EMAIL */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">อีเมล</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <input
                type="email"
                placeholder="กรอกอีเมล"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* FIELD 6: PASSWORD */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">รหัสผ่าน</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-4 py-2.5 bg-[#f5e9ce]/70 focus:bg-[#f5e9ce] text-xs text-gray-800 placeholder-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                required
              />
            </div>
          </div>

          {/* FIELD 7: CONFIRM PASSWORD */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">ยืนยันรหัสผ่าน</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input
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
            <label className="flex items-start space-x-2 cursor-pointer text-[11px] text-[#8a7226]">
              <input
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
              disabled={loading}
              className="w-full py-3 bg-[#f5e9ce] hover:bg-[#ebd5a0] text-[#7a5c10] font-bold text-xs rounded-full transition shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึกข้อมูล...' : 'สมัครสมาชิก'}
            </button>
          </div>
        </form>

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