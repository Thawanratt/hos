'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import { Branch } from '@/app/api/branches/branches';
import Image from 'next/image';
import SearchModal from './SearchModal';

interface NavbarProps {
  selectedBranch?: Branch | null;
  onSelectBranch?: (branch: Branch) => void;
}

// 1. แถบแจ้งเหตุฉุกเฉิน 
function EmergencyStrip() {
  return (
    <div className="bg-[#b91c1c] text-white text-xs py-1.5 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0">
        <div className="flex items-center space-x-2.5 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="tracking-wide text-[11px] sm:text-xs">ศูนย์อุบัติเหตุและฉุกเฉิน พร้อมบริการ 24 ชั่วโมง</span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <a href="tel:02165555" className="font-bold hover:underline flex items-center gap-1.5 tracking-wide text-[11px] sm:text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            สายด่วน: 02-165-5555
          </a>
          <span className="opacity-40">|</span>
          <span className="text-red-100 font-light text-[10px] sm:text-xs">รองรับสิทธิ 30 บาท / ประกันสังคม</span>
        </div>
      </div>
    </div>
  );
}

// 2. เมนูหลักฝั่ง Desktop & Tablet 
function DesktopNavigation({ pathname, isAdmin, isDoctor, onPrimaryAction }: { pathname: string; isAdmin: boolean; isDoctor: boolean; onPrimaryAction: () => void }) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav ref={navRef} className="hidden lg:flex items-center space-x-1 text-xs xl:text-sm font-bold text-slate-700 relative">
      <Link href="/" className={`px-2.5 py-2 rounded-lg transition ${pathname === '/' ? 'text-[#1a2b6d] bg-sky-50/80' : 'hover:text-[#1a2b6d] hover:bg-slate-50'}`}>
        หน้าหลัก
      </Link>

      <div className="relative py-2">
        <button
          onClick={() => toggleDropdown('services')}
          className="px-2.5 py-2 rounded-lg hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
        >
          บริการ
          <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeDropdown === 'services' && (
          <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="w-80 bg-white text-slate-800 shadow-xl rounded-xl p-4 border border-slate-100 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#1a2b6d] font-extrabold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                  ศูนย์และคลินิกเฉพาะทาง
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-semibold text-slate-600 pt-1">
                  <Link href="/services/heart" onClick={() => setActiveDropdown(null)} className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ศูนย์หัวใจ</Link>
                  <Link href="/services/cancer" onClick={() => setActiveDropdown(null)} className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ศูนย์มะเร็ง</Link>
                  <Link href="/services/bone" onClick={() => setActiveDropdown(null)} className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ศูนย์กระดูก</Link>
                  <Link href="/services/brain" onClick={() => setActiveDropdown(null)} className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ศูนย์สมอง</Link>
                  <Link href="/services/checkup" onClick={() => setActiveDropdown(null)} className="p-1.5 rounded-md hover:bg-sky-50 hover:text-[#1a2b6d] transition">ตรวจสุขภาพ</Link>
                  <Link href="/services" onClick={() => setActiveDropdown(null)} className="p-1.5 rounded-md hover:bg-sky-50 text-sky-600 font-bold transition">ศูนย์ทั้งหมด ➔</Link>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs font-bold text-slate-700">
                <Link href="/doctors" onClick={() => setActiveDropdown(null)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">ค้นหาแพทย์</Link>
                {!isAdmin && !isDoctor && (
                  <button onClick={() => { setActiveDropdown(null); onPrimaryAction(); }} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-[#1a2b6d] transition cursor-pointer text-left">
                    ทำนัดหมายออนไลน์
                  </button>
                )}
                <Link href="/packages" onClick={() => setActiveDropdown(null)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 hover:text-[#1a2b6d] transition">แพ็กเกจและโปรโมชั่น</Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative py-2">
        <button
          onClick={() => toggleDropdown('patient')}
          className="px-2.5 py-2 rounded-lg hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
        >
          ข้อมูลผู้เข้ารับบริการ
          <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'patient' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeDropdown === 'patient' && (
          <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="w-64 bg-white text-slate-800 shadow-xl rounded-xl p-2.5 border border-slate-100 space-y-0.5 text-xs font-semibold">
              <Link href="/rooms" onClick={() => setActiveDropdown(null)} className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ห้องพักผู้ป่วย (Inpatient Rooms)</Link>
              <Link href="/map" onClick={() => setActiveDropdown(null)} className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">แผนที่และการเดินทาง</Link>
              <Link href="/insurance" onClick={() => setActiveDropdown(null)} className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ประกัน และสิทธิการรักษา</Link>
            </div>
          </div>
        )}
      </div>

      <div className="relative py-2">
        <button
          onClick={() => toggleDropdown('health')}
          className="px-2.5 py-2 rounded-lg hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
        >
          ข้อมูลสุขภาพ
          <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'health' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeDropdown === 'health' && (
          <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="w-56 bg-white text-slate-800 shadow-xl rounded-xl p-2.5 border border-slate-100 space-y-0.5 text-xs font-semibold">
              <Link href="/health" onClick={() => setActiveDropdown(null)} className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">บทความสุขภาพ</Link>
              <Link href="/mental-health" onClick={() => setActiveDropdown(null)} className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">แบบประเมินสุขภาพใจ</Link>
            </div>
          </div>
        )}
      </div>

      <div className="relative py-2">
        <button
          onClick={() => toggleDropdown('about')}
          className="px-2.5 py-2 rounded-lg hover:text-[#1a2b6d] hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
        >
          เกี่ยวกับเรา
          <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeDropdown === 'about' && (
          <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="w-56 bg-white text-slate-800 shadow-xl rounded-xl p-2.5 border border-slate-100 space-y-0.5 text-xs font-semibold">
              <Link href="/about" onClick={() => setActiveDropdown(null)} className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ประวัติโรงพยาบาล</Link>
              <Link href="/news" onClick={() => setActiveDropdown(null)} className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ข่าวสารและกิจกรรม</Link>
              <Link href="/contact" onClick={() => setActiveDropdown(null)} className="block p-2 rounded-lg hover:bg-sky-50 hover:text-[#1a2b6d] transition">ติดต่อสอบถาม</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// 3. User Dropdown Menu Component (Desktop)
function UserMenuDropdown({
  user,
  userName,
  isAdmin,
  isDoctor,
  isOpen,
  setIsOpen,
  onLogout,
  dropdownRef
}: any) {
  const badgeText = isAdmin ? 'ADMINISTRATOR' : isDoctor ? 'DOCTOR' : 'PATIENT';
  const badgeBg = isAdmin ? 'bg-amber-50/80 border-amber-200/80 text-amber-900 hover:bg-amber-100/80' : isDoctor ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-900 hover:bg-emerald-100/80' : 'bg-blue-50/80 border-blue-200/80 text-[#1a2b6d] hover:bg-blue-100/80';
  const avatarBg = isAdmin ? 'bg-amber-600' : isDoctor ? 'bg-emerald-600' : 'bg-[#1a2b6d]';
  const chevronColor = isAdmin ? 'text-amber-700' : isDoctor ? 'text-emerald-700' : 'text-[#1a2b6d]';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-full border transition cursor-pointer shadow-2xs ${badgeBg}`}
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs ${avatarBg}`}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-70 leading-none">
            {badgeText}
          </span>
          <span className="text-xs font-bold truncate max-w-[120px] leading-tight">
            {userName}
          </span>
        </div>
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${chevronColor}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white text-slate-800 shadow-xl rounded-2xl p-2 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2.5 bg-slate-50 rounded-xl mb-1 border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เข้าสู่ระบบโดย</p>
            <p className="text-xs font-bold text-slate-800 truncate">{user.email || userName}</p>
          </div>

          <div className="space-y-0.5 text-xs font-semibold text-slate-700">
            {isAdmin ? (
              <>
                <Link
                  href="/admin/main"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition font-bold"
                >
                  หน้าหลักแอดมิน
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
              </>
            ) : isDoctor ? (
              <>
                <Link
                  href="/doctors/main"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition font-bold"
                >
                  แดชบอร์ดแพทย์ / จัดการคิว
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-sky-50 hover:text-[#1a2b6d] transition"
                >
                  ข้อมูลส่วนตัวผู้ป่วย
                </Link>
                <Link
                  href="/appointments"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-sky-50 hover:text-[#1a2b6d] transition"
                >
                  ประวัตินัดหมาย
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
              </>
            )}

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ selectedBranch: propBranch, onSelectBranch }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [internalBranch, setInternalBranch] = useState<Branch | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeBranch = propBranch || internalBranch;

  const handleSelectBranch = (branch: Branch) => {
    setInternalBranch(branch);
    if (onSelectBranch) onSelectBranch(branch);
  };

  const loadUser = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try { setUser(JSON.parse(storedUser)); } catch (e) { setUser(null); }
      } else { setUser(null); }
    }
    setIsLoaded(true);
  };

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('novaria_cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          setCartCount(items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
        } catch (e) { setCartCount(0); }
      } else { setCartCount(0); }
    }
  };

  useEffect(() => {
    loadUser();
    updateCartCount();
    window.addEventListener('storage', loadUser);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

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

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin' || user?.email === 'admin@novaria.com';
  const isDoctor = user?.role === 'DOCTOR' || user?.role === 'doctor' || (user?.email && user.email.includes('doctor'));
  const userName = user?.firstName || user?.name || (isAdmin ? 'Admin' : isDoctor ? 'Doctor' : 'ผู้ป่วย');

  const handlePrimaryAction = () => {
    setIsMobileMenuOpen(false);
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/branches')}`);
    } else {
      router.push('/branches');
    }
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === menuName ? null : menuName);
  };

  return (
    <header className="w-full font-sans sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <EmergencyStrip />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between gap-3">
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

        <DesktopNavigation pathname={pathname} isAdmin={isAdmin} isDoctor={isDoctor} onPrimaryAction={handlePrimaryAction} />

        <div className="flex items-center space-x-2 shrink-0">
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

          <button 
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-600 hover:text-[#1a2b6d] hover:bg-slate-100/80 rounded-full transition cursor-pointer"
            title="ค้นหา"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {isLoaded && (
            <div className="hidden md:flex items-center text-xs font-bold">
              {user ? (
                <UserMenuDropdown
                  user={user}
                  userName={userName}
                  isAdmin={isAdmin}
                  isDoctor={isDoctor}
                  isOpen={isUserDropdownOpen}
                  setIsOpen={setIsUserDropdownOpen}
                  onLogout={handleLogout}
                  dropdownRef={dropdownRef}
                />
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className="px-3 py-2 text-slate-700 hover:text-[#1a2b6d] hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>เข้าสู่ระบบ</span>
                </Link>
              )}
            </div>
          )}

          {!isAdmin && !isDoctor && (
            <div className="hidden sm:block shrink-0">
              <button
                onClick={handlePrimaryAction}
                className="bg-[#1a2b6d] text-white hover:bg-blue-900 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                ทำนัดหมาย
              </button>
            </div>
          )}

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

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBranchModalOpen(true);
              }}
              className="text-xs font-bold text-sky-700 flex items-center gap-1.5"
            >
              <span>{activeBranch ? activeBranch.name : 'เลือกสาขาใกล้คุณ'}</span>
            </button>
            <span className="text-[11px] font-bold text-sky-600">เปลี่ยน ➔</span>
          </div>

          <nav className="flex flex-col space-y-1 text-sm font-bold text-slate-700">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">
              หน้าหลัก
            </Link>

            <div>
              <button
                onClick={() => toggleSubmenu('services')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left"
              >
                <span>บริการ</span>
                <svg className={`w-4 h-4 transition-transform ${openMobileSubmenu === 'services' ? 'rotate-180 text-[#1a2b6d]' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openMobileSubmenu === 'services' && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50/60 rounded-lg my-1 text-xs font-semibold text-slate-600">
                  <p className="text-[10px] uppercase font-bold text-slate-400 pt-1 pb-0.5">ศูนย์เฉพาะทาง</p>
                  <Link href="/services/heart" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ศูนย์หัวใจ</Link>
                  <Link href="/services/cancer" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ศูนย์มะเร็ง</Link>
                  <Link href="/services/bone" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ศูนย์กระดูก</Link>
                  <Link href="/services/brain" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ศูนย์สมอง</Link>
                  <Link href="/services/checkup" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ตรวจสุขภาพ</Link>
                  <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 text-sky-600 font-bold">ศูนย์ทั้งหมด ➔</Link>
                  <div className="border-t border-slate-200/60 my-1"></div>
                  <Link href="/doctors" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 font-bold text-slate-700">ค้นหาแพทย์</Link>
                  <Link href="/packages" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 font-bold text-slate-700">แพ็กเกจและโปรโมชั่น</Link>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSubmenu('patient-info')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left"
              >
                <span>ข้อมูลผู้เข้ารับบริการ</span>
                <svg className={`w-4 h-4 transition-transform ${openMobileSubmenu === 'patient-info' ? 'rotate-180 text-[#1a2b6d]' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openMobileSubmenu === 'patient-info' && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50/60 rounded-lg my-1 text-xs font-semibold text-slate-600">
                  <Link href="/rooms" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ห้องพักผู้ป่วย (Inpatient Rooms)</Link>
                  <Link href="/map" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">แผนที่และการเดินทาง</Link>
                  <Link href="/insurance" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ประกัน และสิทธิการรักษา</Link>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSubmenu('health-info')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left"
              >
                <span>ข้อมูลสุขภาพ</span>
                <svg className={`w-4 h-4 transition-transform ${openMobileSubmenu === 'health-info' ? 'rotate-180 text-[#1a2b6d]' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openMobileSubmenu === 'health-info' && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50/60 rounded-lg my-1 text-xs font-semibold text-slate-600">
                  <Link href="/health" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">บทความสุขภาพ</Link>
                  <Link href="/mental-health" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">แบบประเมินสุขภาพใจ</Link>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSubmenu('about')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left"
              >
                <span>เกี่ยวกับเรา</span>
                <svg className={`w-4 h-4 transition-transform ${openMobileSubmenu === 'about' ? 'rotate-180 text-[#1a2b6d]' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openMobileSubmenu === 'about' && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50/60 rounded-lg my-1 text-xs font-semibold text-slate-600">
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ประวัติโรงพยาบาล</Link>
                  <Link href="/news" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ข่าวสารและกิจกรรม</Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block p-1.5 hover:text-[#1a2b6d]">ติดต่อสอบถาม</Link>
                </div>
              )}
            </div>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <div className={`p-3.5 rounded-2xl border flex flex-col space-y-3 ${isAdmin ? 'bg-amber-50/80 border-amber-200/80' : isDoctor ? 'bg-emerald-50/80 border-emerald-200/80' : 'bg-blue-50/80 border-blue-200/80'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs ${isAdmin ? 'bg-amber-600' : isDoctor ? 'bg-emerald-600' : 'bg-[#1a2b6d]'}`}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-extrabold text-slate-500">
                        {isAdmin ? 'ADMIN' : isDoctor ? 'DOCTOR' : 'PATIENT'}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{userName}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="text-xs text-red-600 font-bold hover:underline">
                    ออกจากระบบ
                  </button>
                </div>

                {isDoctor ? (
                  <div className="pt-2 border-t border-emerald-200/50">
                    <Link
                      href="/doctors/main"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-2 rounded-xl bg-emerald-600 text-center text-white font-bold text-xs shadow-2xs"
                    >
                      แดชบอร์ดแพทย์ / จัดการคิว
                    </Link>
                  </div>
                ) : !isAdmin && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/50 text-xs font-bold">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-white text-center text-[#1a2b6d] border border-blue-100 hover:bg-sky-50 shadow-2xs"
                    >
                      ข้อมูลส่วนตัว
                    </Link>
                    <Link
                      href="/appointments"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-white text-center text-[#1a2b6d] border border-blue-100 hover:bg-sky-50 shadow-2xs"
                    >
                      ประวัตินัดหมาย
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-slate-100 font-bold rounded-xl text-xs text-slate-700"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {!isAdmin && !isDoctor && (
              <button
                onClick={handlePrimaryAction}
                className="w-full text-center py-2.5 font-bold rounded-xl text-xs text-white bg-[#1a2b6d]"
              >
                ทำนัดหมายออนไลน์
              </button>
            )}
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BranchSelectorModal isOpen={isBranchModalOpen} onClose={() => setIsBranchModalOpen(false)} onSelectBranch={handleSelectBranch} />
    </header>
  );
}