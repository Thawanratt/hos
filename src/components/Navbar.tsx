'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import { Branch } from '@/app/api/branches/branches';
import Image from 'next/image';

interface NavbarProps {
  selectedBranch?: Branch | null;
  onSelectBranch?: (branch: Branch) => void;
}

export default function Navbar({ selectedBranch: propBranch, onSelectBranch }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State สำหรับ Pop-up เลือกรพ. / สาขา
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [internalBranch, setInternalBranch] = useState<Branch | null>(null);

  const activeBranch = propBranch || internalBranch;

  const handleSelectBranch = (branch: Branch) => {
    setInternalBranch(branch);
    if (onSelectBranch) {
      onSelectBranch(branch);
    }
  };

  // ดึงข้อมูลผู้ใช้จาก localStorage
  const loadUser = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
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

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsUserDropdownOpen(false);
    window.location.href = '/login';
  };

  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.role === 'admin' ||
    user?.email === 'admin@novalia.com';

  const userName = user?.firstName || user?.name || (isAdmin ? 'Admin' : 'ผู้ป่วย');

  // Action สำหรับปุ่มนัดหมาย / ดูคิว
  const handlePrimaryAction = () => {
    setIsMobileMenuOpen(false);
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/branches')}`);
    } else if (isAdmin) {
      router.push('/status(admin)/dashboard');
    } else {
      router.push('/branches');
    }
  };

  // State สำหรับเก็บจำนวนสินค้าในตะกร้า
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('novaria_cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
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
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  return (
    <header className="w-full font-sans sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">

      {/* 1. EMERGENCY TOP STRIP */}
      <div className="bg-[#b91c1c] text-white text-xs py-1.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2.5 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="tracking-wide text-[11px] sm:text-xs">ศูนย์อุบัติเหตุและฉุกเฉิน พร้อมบริการ 24 ชั่วโมง</span>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <a href="tel:02165555" className="font-bold hover:underline flex items-center gap-1.5 tracking-wide text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              สายด่วน: 02-165-5555
            </a>
            <span className="opacity-40">|</span>
            <span className="text-red-100 font-light text-xs">รองรับสิทธิ 30 บาท / ประกันสังคม</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between">

        {/* LOGO & BRANDING */}
        <Link href="/" className="flex items-center space-x-0.5 shrink-0 group py-1">
          <Image 
            src="/lll.png" 
            alt="NOVARIA Logo" 
            width={80} 
            height={80} 
            className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            priority
          />
          <div className="flex flex-col justify-center -ml-2">
            <span className="text-lg md:text-xl font-bold text-[#1a2b6d] tracking-tight leading-none group-hover:text-blue-900 transition-colors">
              โรงพยาบาลโนวาเลีย
            </span>
            <span className="text-[10px] md:text-[11px] text-slate-500 font-semibold tracking-[0.15em] uppercase block mt-1">
              NOVARIA HOSPITAL
            </span>
          </div>
        </Link>

        {/* ตรงกลาง: เมนูหลัก (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-xs xl:text-sm font-bold text-slate-700">

          <Link href="/" className={`px-3 py-2 rounded-lg transition ${pathname === '/' ? 'text-[#1a2b6d] bg-sky-50/80' : 'hover:text-[#1a2b6d] hover:bg-slate-50'}`}>
            หน้าหลัก
          </Link>

          {/* 1. เมนู: บริการ */}
          <div className="relative group py-2">
            <button className="px-3 py-2 rounded-lg hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer">
              บริการ
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="w-80 bg-white text-slate-800 shadow-xl rounded-xl p-4 border border-slate-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#1a2b6d] font-extrabold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                    <svg className="w-4 h-4 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m-6-18v18m6-18h.008v.008H12V3zm0 3h.008v.008H12V6zm0 3h.008v.008H12V9zm0 3h.008v.008H12v-1.5zm0 3h.008v.008H12v-1.5zm0 3h.008v.008H12v-1.5z" />
                    </svg>
                    ศูนย์และคลินิกเฉพาะทาง
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-semibold text-slate-600 pt-1">
                    <Link href="/services/heart" className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ศูนย์หัวใจ</Link>
                    <Link href="/services/cancer" className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ศูนย์มะเร็ง</Link>
                    <Link href="/services/bone" className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ศูนย์กระดูก</Link>
                    <Link href="/services/brain" className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ศูนย์สมอง</Link>
                    <Link href="/services/checkup" className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ตรวจสุขภาพ</Link>
                    <Link href="/services" className="p-1.5 rounded-md hover:bg-sky-50 text-sky-600 font-bold transition">ศูนย์ทั้งหมด ➔</Link>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs font-bold text-slate-700">
                  <Link href="/doctors" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    ค้นหาแพทย์
                  </Link>

                  <button onClick={handlePrimaryAction} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-[#1a2b6d] transition cursor-pointer text-left">
                    {isAdmin ? (
                      <>
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z" />
                        </svg>
                        <span className="text-amber-700">ดูสถานะคิว (Admin)</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        ทำนัดหมายออนไลน์
                      </>
                    )}
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
          </div>

          {/* 2. เมนู: ข้อมูลผู้เข้ารับบริการ */}
          <div className="relative group py-2">
            <button className="px-3 py-2 rounded-lg hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer">
              ข้อมูลผู้เข้ารับบริการ
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="w-64 bg-white text-slate-800 shadow-xl rounded-xl p-2.5 border border-slate-100 space-y-0.5 text-xs font-semibold">
                <Link href="/rooms" className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ห้องพักผู้ป่วย (Inpatient Rooms)</Link>
                <Link href="/branches" className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">แผนที่และการเดินทาง</Link>
                <Link href="/insurance" className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ประกัน และสิทธิการรักษา</Link>
              </div>
            </div>
          </div>

          {/* 3. เมนู: ข้อมูลสุขภาพ */}
          <div className="relative group py-2">
            <button className="px-3 py-2 rounded-lg hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer">
              ข้อมูลสุขภาพ
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="w-56 bg-white text-slate-800 shadow-xl rounded-xl p-2.5 border border-slate-100 space-y-0.5 text-xs font-semibold">
                <Link href="/news" className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">บทความทางการแพทย์</Link>
                <Link href="/health-check" className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">แบบประเมินสุขภาพเบื้องต้น</Link>
              </div>
            </div>
          </div>

          {/* 4. เมนู: เกี่ยวกับเรา */}
          <div className="relative group py-2">
            <button className="px-3 py-2 rounded-lg hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer">
              เกี่ยวกับเรา
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="w-56 bg-white text-slate-800 shadow-xl rounded-xl p-2.5 border border-slate-100 space-y-0.5 text-xs font-semibold">
                <Link href="/about" className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ประวัติโรงพยาบาล</Link>
                <Link href="/news" className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ข่าวสารและกิจกรรม</Link>
                <Link href="/contact" className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ติดต่อสอบถาม</Link>
              </div>
            </div>
          </div>

        </nav>

        {/* ฝั่งขวา: USER ACTIONS & DYNAMIC MAIN BUTTON */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">

          {/* ปุ่มตะกร้าสินค้า */}
          <Link
            href="/cart"
            className="relative p-2 text-slate-600 hover:text-[#1a2b6d] hover:bg-slate-100/80 rounded-full transition flex items-center justify-center"
            title="ตะกร้าสินค้า"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>

            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ปุ่ม Search */}
          <button className="p-2 text-slate-600 hover:text-[#1a2b6d] hover:bg-slate-100/80 rounded-full transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* เข้าสู่ระบบ / ข้อมูลผู้ใช้ (Desktop) */}
          {isLoaded && (
            <div className="hidden md:flex items-center text-xs font-bold" ref={dropdownRef}>
              {user ? (
                <div className="relative">
                  {/* USER PILL BUTTON */}
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className={`flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border transition cursor-pointer shadow-2xs ${
                      isAdmin
                        ? 'bg-amber-50/80 border-amber-200/80 text-amber-900 hover:bg-amber-100/80'
                        : 'bg-blue-50/80 border-blue-200/80 text-[#1a2b6d] hover:bg-blue-100/80'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs ${isAdmin ? 'bg-amber-600' : 'bg-[#1a2b6d]'}`}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-70 leading-none">
                        {isAdmin ? 'ADMINISTRATOR' : 'PATIENT'}
                      </span>
                      <span className="text-xs font-bold truncate max-w-[100px] leading-tight">
                        {userName}
                      </span>
                    </div>
                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''} ${isAdmin ? 'text-amber-700' : 'text-[#1a2b6d]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* USER DROPDOWN MENU */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 shadow-xl rounded-2xl p-2 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2.5 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เข้าสู่ระบบโดย</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{user.email || userName}</p>
                      </div>

                      <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                        {isAdmin ? (
                          <Link
                            href="/status(admin)/dashboard"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-50 hover:text-amber-800 transition"
                          >
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            แผงควบคุมระบบ (Admin)
                          </Link>
                        ) : (
                          <>
                            <Link
                              href="/profile"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-sky-50 hover:text-[#1a2b6d] transition"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              ข้อมูลส่วนตัวผู้ป่วย
                            </Link>
                            <Link
                              href="/appointments"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-sky-50 hover:text-[#1a2b6d] transition"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              ประวัติการนัดหมาย
                            </Link>
                          </>
                        )}

                        <div className="border-t border-slate-100 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
                          </svg>
                          ออกจากระบบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className="px-3.5 py-2 text-slate-700 hover:text-[#1a2b6d] hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>เข้าสู่ระบบ</span>
                </Link>
              )}
            </div>
          )}

          {/* ปุ่มหลักฝั่งขวา (Desktop/Tablet) */}
          <div className="hidden sm:block">
            {isAdmin ? (
              <button
                onClick={handlePrimaryAction}
                className="bg-amber-600 text-white hover:bg-amber-700 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z" />
                </svg>
                ดูสถานะคิว
              </button>
            ) : (
              <button
                onClick={handlePrimaryAction}
                className="bg-[#1a2b6d] text-white hover:bg-blue-900 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                ทำนัดหมาย
              </button>
            )}
          </div>

          {/* ปุ่ม Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#1a2b6d] hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

        </div>

      </div>

      {/* 3. MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">

          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBranchModalOpen(true);
              }}
              className="text-xs font-bold text-sky-700 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>{activeBranch ? activeBranch.name : 'เลือกสาขาใกล้คุณ'}</span>
            </button>
            <span className="text-[11px] font-bold text-sky-600">เปลี่ยน ➔</span>
          </div>

          <nav className="flex flex-col space-y-1 text-sm font-bold text-slate-700">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">หน้าหลัก</Link>
            <Link href="/doctors" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">ค้นหาแพทย์</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">ศูนย์และบริการทั้งหมด</Link>
            <Link href="/packages" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">แพ็กเกจสุขภาพ</Link>
            <Link href="/news" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">ข่าวสารและบทความ</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">ติดต่อสอบถาม</Link>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <div className={`p-3 rounded-2xl border flex items-center justify-between ${isAdmin ? 'bg-amber-50/80 border-amber-200/80' : 'bg-blue-50/80 border-blue-200/80'}`}>
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs ${isAdmin ? 'bg-amber-600' : 'bg-[#1a2b6d]'}`}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-extrabold text-slate-500">
                      {isAdmin ? 'ADMINISTRATOR' : 'PATIENT'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{userName}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 font-bold hover:underline px-2 py-1 rounded-lg hover:bg-red-50"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs text-slate-700 transition"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            <button
              onClick={handlePrimaryAction}
              className={`w-full text-center py-2.5 font-bold rounded-xl text-xs text-white shadow-sm transition ${isAdmin ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#1a2b6d] hover:bg-blue-900'}`}
            >
              {isAdmin ? 'ดูสถานะคิว (Admin)' : 'ทำนัดหมายออนไลน์'}
            </button>
          </div>

        </div>
      )}

      {/* BRANCH SELECTOR MODAL */}
      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSelectBranch={handleSelectBranch}
      />
    </header>
  );
}