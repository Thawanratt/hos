'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  idCard?: string;
  dob?: string;
  bloodGroup?: string;
  allergy?: string;
  address?: string;
  role?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setFormData(parsed);
        } catch (e) {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    localStorage.setItem('user', JSON.stringify(formData));
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1a2b6d] border-t-transparent"></div>
      </div>
    );
  }

  const displayName = user.firstName 
    ? `${user.firstName} ${user.lastName || ''}` 
    : user.name || 'ผู้ใช้ทั่วไป';

  return (
    <main className="min-h-screen bg-slate-50/60 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center text-xs font-semibold text-slate-400 space-x-2">
          <Link href="/" className="hover:text-[#1a2b6d] transition">หน้าหลัก</Link>
          <span>/</span>
          <span className="text-slate-700 font-bold">ข้อมูลส่วนตัวผู้ป่วย</span>
        </nav>

        {/* Notification Toast */}
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs md:text-sm font-bold p-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว</span>
            </div>
            <button onClick={() => setSavedSuccess(false)} className="text-emerald-500 hover:text-emerald-700">✕</button>
          </div>
        )}

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#1a2b6d] text-white flex items-center justify-center font-extrabold text-3xl md:text-4xl shadow-md shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="bg-sky-100 text-[#1a2b6d] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  PATIENT PROFILE
                </span>
                <span className="text-xs text-slate-400 font-medium">HN: 6709-04128</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">{displayName}</h1>
              <p className="text-xs text-slate-500 font-medium">{user.email || 'ยังไม่ได้ระบุอีเมล'}</p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              แก้ไขข้อมูลส่วนตัว
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shrink-0"
            >
              ยกเลิก
            </button>
          )}
        </div>

        {/* DETAILS SECTION */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <h2 className="text-base font-bold text-[#1a2b6d] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              ประวัติและข้อมูลสุขภาพทั่วไป
            </h2>
            {isEditing && <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">โหมดแก้ไขข้อมูล</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
            {/* ชื่อ */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-bold">ชื่อจริง</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1a2b6d] focus:ring-1 focus:ring-[#1a2b6d] outline-none font-semibold text-slate-800"
                />
              ) : (
                <p className="p-3 bg-slate-50 rounded-xl text-slate-800 font-bold">{user.firstName || '-'}</p>
              )}
            </div>

            {/* นามสกุล */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-bold">นามสกุล</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1a2b6d] focus:ring-1 focus:ring-[#1a2b6d] outline-none font-semibold text-slate-800"
                />
              ) : (
                <p className="p-3 bg-slate-50 rounded-xl text-slate-800 font-bold">{user.lastName || '-'}</p>
              )}
            </div>

            {/* อีเมล */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-bold">อีเมลติดต่อ</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1a2b6d] focus:ring-1 focus:ring-[#1a2b6d] outline-none font-semibold text-slate-800"
                />
              ) : (
                <p className="p-3 bg-slate-50 rounded-xl text-slate-800 font-bold">{user.email || '-'}</p>
              )}
            </div>

            {/* เบอร์โทรศัพท์ */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-bold">เบอร์โทรศัพท์</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="08X-XXX-XXXX"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1a2b6d] focus:ring-1 focus:ring-[#1a2b6d] outline-none font-semibold text-slate-800"
                />
              ) : (
                <p className="p-3 bg-slate-50 rounded-xl text-slate-800 font-bold">{user.phone || 'ยังไม่ได้ระบุ'}</p>
              )}
            </div>

            {/* กรุ๊ปเลือด */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-bold">หมู่เลือด (Blood Group)</label>
              {isEditing ? (
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1a2b6d] focus:ring-1 focus:ring-[#1a2b6d] outline-none font-semibold text-slate-800 bg-white"
                >
                  <option value="">-- เลือกกรุ๊ปเลือด --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="O">O</option>
                  <option value="AB">AB</option>
                </select>
              ) : (
                <p className="p-3 bg-slate-50 rounded-xl text-slate-800 font-bold">{user.bloodGroup || 'ไม่ทราบ/ยังไม่ระบุ'}</p>
              )}
            </div>

            {/* ประวัติแพ้ยา/อาหาร */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-bold">ประวัติการแพ้ยา/อาหาร</label>
              {isEditing ? (
                <input
                  type="text"
                  name="allergy"
                  value={formData.allergy || ''}
                  onChange={handleChange}
                  placeholder="เช่น แพ้ยาแก้ปวด Penicillin"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1a2b6d] focus:ring-1 focus:ring-[#1a2b6d] outline-none font-semibold text-slate-800"
                />
              ) : (
                <p className="p-3 bg-slate-50 rounded-xl text-red-600 font-bold">{user.allergy || 'ปฏิเสธการแพ้ยา'}</p>
              )}
            </div>
          </div>

          {/* ที่อยู่ปัจจุบัน */}
          <div>
            <label className="block text-slate-500 mb-1.5 font-bold text-xs">ที่อยู่ปัจจุบัน</label>
            {isEditing ? (
              <textarea
                name="address"
                rows={3}
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ..."
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1a2b6d] focus:ring-1 focus:ring-[#1a2b6d] outline-none font-semibold text-slate-800 text-xs"
              />
            ) : (
              <p className="p-3 bg-slate-50 rounded-xl text-slate-800 font-bold text-xs">{user.address || 'ยังไม่ได้บันทึกที่อยู่'}</p>
            )}
          </div>

          {/* ปุ่ม Save เฉพาะตอน Edit */}
          {isEditing && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow-md active:scale-95 cursor-pointer"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          )}
        </form>

        

      </div>
    </main>
  );
}