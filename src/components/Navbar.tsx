'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import { Branch } from '@/app/api/branches/branches';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // State สำหรับ Pop-up เลือกรพ. / สาขา
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // ดึงข้อมูลผู้ใช้จาก localStorage
  const loadUser = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const handleBooking = () => {
    if (!user) {
      router.push('/login?redirect=/booking');
    } else {
      router.push('/booking');
    }
  };
  //  เพิ่ม State สำหรับเก็บจำนวนสินค้าในตะกร้า
  const [cartCount, setCartCount] = useState(0);

  // ฟังก์ชันดึงจำนวนสินค้าจาก localStorage
  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('novaria_cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          // รวมจำนวน quantity ทั้งหมดในตะกร้า
          const total = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          setCartCount(total);
        } catch (e) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    updateCartCount();
    // ฟังอีเวนต์เวลามีการอัปเดตตะกร้าจากหน้าอื่น
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  return (
    <header className="w-full font-sans sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      
      {/* 1. EMERGENCY TOP STRIP (แถบสีแดงฉุกเฉินด้านบนสุด) */}
      <div className="bg-[#b91c1c] text-white text-xs py-1.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="tracking-wide">ศูนย์อุบัติเหตุและฉุกเฉิน พร้อมบริการ 24 ชั่วโมง</span>

            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="ml-3 hidden lg:flex items-center gap-1.5 bg-black/20 hover:bg-black/30 text-white px-2.5 py-0.5 rounded text-xs font-medium transition cursor-pointer"
            >
              <span>{selectedBranch ? selectedBranch.name : 'สาขาใกล้คุณ'}</span>
              <svg className="w-3 h-3 text-red-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <a href="tel:02165555" className="font-bold hover:underline flex items-center gap-1.5 tracking-wide text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              สายด่วนฉุกเฉิน: 02-165-5555
            </a>
            <span className="opacity-40">|</span>
            <span className="text-red-100 font-light text-xs">รองรับสิทธิ 30 บาท / ประกันสังคม</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR (สไตล์สว่าง คลีน พรีเมียม วางโลโก้และเมนูเรียงในแถวเดียวแบบต้นฉบับ) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        
        {/* ฝั่งซ้าย: LOGO */}
        <Link href="/" className="flex items-center space-x-3 shrink-0 group">
          <div className="w-10 h-10 rounded-lg bg-[#1a2b6d] flex items-center justify-center font-extrabold text-white text-xl shadow-sm">
            N
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black text-[#1a2b6d] tracking-tight block leading-none">
              โรงพยาบาลโนวาเลีย
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5 block">
              NOVARIA HOSPITAL
            </span>
          </div>
        </Link>

        {/* ตรงกลาง: เมนูหลัก (Dropdown สไตล์ต้นฉบับการวางแบบในรูปภาพ) */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-bold text-slate-700">
          
          <Link href="/" className="px-3 py-2 rounded-md hover:text-[#1a2b6d] hover:bg-slate-50 transition">
            หน้าหลัก
          </Link>

          {/* 1. เมนู: บริการ */}
          <div className="relative group py-2">
            <button className="px-3 py-2 rounded-md hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer">
              บริการ
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Box แบบต้นฉบับ */}
            <div className="absolute top-full left-0 w-80 bg-white text-slate-800 shadow-xl rounded-xl p-4 border border-slate-100 hidden group-hover:block space-y-4 z-50 transition-all">
              
              {/* กลุ่ม: ศูนย์และคลินิก */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#1a2b6d] font-extrabold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                  <svg className="w-4 h-4 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m-6-18v18m6-18h.008v.008H12V3zm0 3h.008v.008H12V6zm0 3h.008v.008H12V9zm0 3h.008v.008H12v-1.5zm0 3h.008v.008H12v-1.5zm0 3h.008v.008H12v-1.5z" />
                  </svg>
                  ศูนย์และคลินิกเฉพาะทาง
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-600 pt-1">
                  <Link href="/services/heart" className="p-1.5 rounded hover:bg-slate-50 hover:text-[#1a2b6d] transition">ศูนย์หัวใจ</Link>
                  <Link href="/services/cancer" className="p-1.5 rounded hover:bg-slate-50 hover:text-[#1a2b6d] transition">ศูนย์มะเร็ง</Link>
                  <Link href="/services/bone" className="p-1.5 rounded hover:bg-slate-50 hover:text-[#1a2b6d] transition">ศูนย์กระดูก</Link>
                  <Link href="/services/brain" className="p-1.5 rounded hover:bg-slate-50 hover:text-[#1a2b6d] transition">ศูนย์สมอง</Link>
                  <Link href="/services/checkup" className="p-1.5 rounded hover:bg-slate-50 hover:text-[#1a2b6d] transition">ตรวจสุขภาพ</Link>
                  <Link href="/services" className="p-1.5 rounded hover:bg-slate-50 text-sky-600 font-bold transition">ศูนย์ทั้งหมด ➔</Link>
                </div>
              </div>

              {/* กลุ่ม: แพทย์และนัดหมาย */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-700">
                <Link href="/doctors" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  ค้นหาแพทย์
                </Link>

                <button onClick={handleBooking} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-[#1a2b6d] transition cursor-pointer text-left">
                  <svg className="w-4 h-4 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  ทำนัดหมายออนไลน์
                </button>

                <Link href="/packages" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25" />
                  </svg>
                  แพ็กเกจและโปรโมชั่น
                </Link>

              </div>

            </div>
          </div>

          {/* 2. เมนู: ข้อมูลผู้เข้ารับบริการ */}
          <div className="relative group py-2">
            <button className="px-3 py-2 rounded-md hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer">
              ข้อมูลผู้เข้ารับบริการ
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 w-64 bg-white text-slate-800 shadow-xl rounded-xl p-3 border border-slate-100 hidden group-hover:block space-y-1 text-xs font-semibold z-50">
              <Link href="/rooms" className="block p-2 rounded.lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">ห้องพักผู้ป่วย (Inpatient Rooms)</Link>
              <Link href="/branches" className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">แผนที่และการเดินทาง</Link>
              <Link href="/insurance" className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">ประกัน และสิทธิการรักษา</Link>
            </div>
          </div>

          {/* 3. เมนู: ข้อมูลสุขภาพ */}
          <div className="relative group py-2">
            <button className="px-3 py-2 rounded-md hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer">
              ข้อมูลสุขภาพ
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 w-56 bg-white text-slate-800 shadow-xl rounded-xl p-3 border border-slate-100 hidden group-hover:block space-y-1 text-xs font-semibold z-50">
              <Link href="/news" className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">บทความทางการแพทย์</Link>
              <Link href="/health-check" className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">แบบประเมินสุขภาพเบื้องต้น</Link>
            </div>
          </div>

          {/* 4. เมนู: เกี่ยวกับเรา */}
          <div className="relative group py-2">
            <button className="px-3 py-2 rounded-md hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer">
              เกี่ยวกับเรา
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 w-56 bg-white text-slate-800 shadow-xl rounded-xl p-3 border border-slate-100 hidden group-hover:block space-y-1 text-xs font-semibold z-50">
              <Link href="/about" className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">ประวัติโรงพยาบาล</Link>
              <Link href="/news" className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">ข่าวสารและกิจกรรม</Link>
              <Link href="/contact" className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">ติดต่อสอบถาม</Link>
            </div>
          </div>

        </nav>

        {/* ฝั่งขวา: USER ACTIONS & BOOKING BUTTON (จัดวางปุ่มเปลี่ยนภาษา ค้นหา สมาชิก และทำนัดหมายแบบต้นฉบับ) */}
        <div className="flex items-center space-x-3 shrink-0">
        {/* ปุ่มตะกร้าสินค้า */}
          <Link 
            href="/cart" 
            className="relative p-2 text-slate-500 hover:text-[#1a2b6d] hover:bg-slate-100 rounded-full transition flex items-center justify-center"
            title="ตะกร้าสินค้า"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            
            {/*  แสดงตัวเลขเฉพาะตอนที่มีสินค้าในตะกร้ามากกว่า 0 */}
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* ปุ่ม Search */}
          <button className="p-2 text-slate-500 hover:text-[#1a2b6d] hover:bg-slate-100 rounded-full transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* เข้าสู่ระบบ / ข้อมูลผู้ป่วย */}
          {isLoaded && (
            <div className="hidden md:flex items-center text-xs font-bold">
              {user ? (
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-700">
                  <span>ผู้ป่วย: {user.firstName || user.name || 'ทั่วไป'}</span>
                  <button onClick={handleLogout} className="text-red-600 hover:underline cursor-pointer ml-1">
                    [ออก]
                  </button>
                </div>
              ) : (
                <Link href="/login" className="p-2 text-slate-600 hover:text-[#1a2b6d] transition flex items-center gap-1">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>เข้าสู่ระบบ</span>
                </Link>
              )}
            </div>
          )}

          {/* ปุ่มทำนัดหมาย (สีน้ำเงินพรีเมียม สไตล์ต้นฉบับ) */}
          <button 
            onClick={handleBooking}
            className="bg-[#1a2b6d] text-white hover:bg-blue-900 font-bold px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            ทำนัดหมาย
          </button>

        </div>

      </div>

      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSelectBranch={(branch) => setSelectedBranch(branch)}
      />
    </header>
  );
}