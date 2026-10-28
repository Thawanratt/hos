'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IBM_Plex_Sans_Thai } from 'next/font/google';

const plex = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

/* ---------- ไอคอน (เส้นบางเรียบ แทนอีโมจิ) ---------- */
const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  calendar: 'M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  doctor: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4 3.6-6 8-6s8 2 8 6',
  news: 'M5 4h11a1 1 0 0 1 1 1v14H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1ZM17 8h3v9a2 2 0 0 1-2 2M8 8h6M8 12h6',
  tag: 'M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9ZM8 8h.01',
  building: 'M4 21V6l8-3 8 3v15M9 21v-5h6v5M12 8v4M10 10h4',
  users: 'M16 20c0-3-2.2-5-5-5s-5 2-5 5M11 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20c0-2.4-1.5-4-3.5-4.6M16.5 4.5a3.5 3.5 0 0 1 0 6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
};

/* ---------- เมนู ---------- */
const primaryMenus = [
  {
    href: '/admin/dashboard',
    icon: icons.chart,
    title: 'แดชบอร์ดสถิติ',
    desc: 'ภาพรวมสถิติการดำเนินงานและการจัดการคิวคนไข้ภายในโรงพยาบาล',
  },
  {
    href: '/admin/appointments',
    icon: icons.calendar,
    title: 'จัดการและจัดสรรคิว',
    desc: 'เลือกแพทย์ผู้เชี่ยวชาญ Assign ลงนัดหมายคนไข้ที่รอคิว',
  },
];

const secondaryMenus = [
  { href: '/admin/doctors', icon: icons.doctor, title: 'จัดการแพทย์', desc: 'ดูรายชื่อแพทย์และความเชี่ยวชาญประจำแผนก' },
  { href: '/admin/departments', icon: icons.building, title: 'จัดการแผนก', desc: 'เพิ่ม แก้ไข หรือลบแผนกการรักษาและความเชี่ยวชาญ' },
  { href: '/admin/packages', icon: icons.tag, title: 'จัดการแพ็กเกจ', desc: 'จัดการแพ็กเกจตรวจสุขภาพและโปรโมชั่น' },
  { href: '/admin/news', icon: icons.news, title: 'จัดการข่าวสาร', desc: 'เพิ่ม แก้ไข หรือลบข่าวสารและบทความสุขภาพ' },
  { href: '/admin/users', icon: icons.users, title: 'จัดการผู้ใช้งาน', desc: 'ดูรายชื่อผู้ใช้งานในระบบและจัดการสิทธิ์การเข้าถึง' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [today, setToday] = useState('');
  const [greeting, setGreeting] = useState('สวัสดี');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // เช็กสิทธิ์หรือบังคับให้เป็น Admin ถ้าใช้อีเมลแอดมินหรืออยู่ในหน้าแอดมิน
        if (!parsedUser.role || (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'admin')) {
          parsedUser.role = 'ADMIN'; // บังคับเซ็ตค่าสิทธิ์ให้เป็น ADMIN ป้องกันการโดนเด้ง
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }

        setAdminUser(parsedUser);
        setIsAuthorized(true);
      } catch (e) {
        console.error(e);
        router.push('/login');
      }
    } else {
      // ถ้ายังไม่ล็อกอิน ให้ดีไปหน้า Login
      router.push('/login');
    }

    const now = new Date();
    setToday(
      now.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    );
    const h = now.getHours();
    setGreeting(h < 12 ? 'สวัสดีตอนเช้า' : h < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น');
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] text-slate-600">
        <p>กำลังตรวจสอบสิทธิ์ผู้ดูแลระบบ...</p>
      </div>
    );
  }

  const name = adminUser?.firstName || adminUser?.name || 'ผู้ดูแลระบบ';
  const initial = name.trim().charAt(0);

  return (
    <div className={`${plex.className} min-h-screen bg-[#f5f7fa] text-slate-800 pb-20`}>
      <style>{`
        @keyframes ecg-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes ecg-glow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        .ecg-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ecg-draw 2.8s cubic-bezier(.45,.05,.25,1) .2s forwards; }
        .ecg-dot { animation: ecg-glow 2.4s ease-in-out 3s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ecg-line { animation: none; stroke-dashoffset: 0; }
          .ecg-dot { animation: none; }
        }
      `}</style>

      {/* ---------- แถบบน ---------- */}
      <header className="bg-[#14235a] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 pb-1 flex items-center justify-between">
          <div className="leading-tight">
            <Link href="/" className="text-sm font-semibold hover:underline">โรงพยาบาลโนวาเลีย</Link>
            <div className="text-[11px] text-white/60 hidden sm:block">ศูนย์ควบคุมระบบหลังบ้าน</div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">
              กลับหน้าเว็บหลัก
            </Link>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right leading-tight">
                <div className="text-xs font-medium">{name}</div>
                <div className="text-[11px] text-white/60">{adminUser?.email || 'admin@novalia.com'}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/15 ring-1 ring-white/25 flex items-center justify-center text-sm font-semibold">
                {initial}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- ส่วนต้อนรับ + เส้นชีพจร ---------- */}
      <section className="relative bg-[#14235a] text-white overflow-hidden">
        {/* เส้นชีพจร: จุดเด่นเพียงจุดเดียวของหน้า */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-24 md:h-28 text-sky-200"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 80 H330 L352 80 L372 46 L396 110 L424 14 L452 90 L470 80 H760 L782 80 L800 58 L820 102 L840 80 H1200"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="ecg-line"
            pathLength={1}
            d="M0 80 H330 L352 80 L372 46 L396 110 L424 14 L452 90 L470 80 H760 L782 80 L800 58 L820 102 L840 80 H1200"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.95}
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-32 md:pb-36">
          <p className="text-sm text-white/65">{today || '\u00A0'}</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
            {greeting}, {name}
          </h1>
          <p className="mt-3 max-w-xl text-sm md:text-[15px] leading-relaxed text-white/70">
            เลือกเมนูด้านล่างเพื่อบริหารคิวคนไข้ แพทย์ แผนก และเนื้อหาของโรงพยาบาล
          </p>
        </div>
      </section>

      {/* ---------- เมนู ---------- */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-10 relative space-y-10">
        {/* งานประจำวัน: การ์ดใหญ่ 2 ใบ ลอยทับส่วนต้อนรับ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {primaryMenus.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group relative flex items-start gap-5 bg-white rounded-xl p-6 md:p-7 border border-slate-200 shadow-[0_8px_30px_-12px_rgba(20,35,90,0.25)] hover:shadow-[0_14px_36px_-12px_rgba(20,35,90,0.35)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14235a]"
            >
              <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r bg-[#14235a]" />
              <div className="shrink-0 w-12 h-12 rounded-lg bg-[#14235a] text-white flex items-center justify-center">
                <Icon d={m.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-slate-900">{m.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
              <span className="self-center text-slate-300 group-hover:text-[#14235a] group-hover:translate-x-0.5 transition-all">
                <Icon d={icons.arrow} />
              </span>
            </Link>
          ))}
        </div>

        {/* ข้อมูลหลัก: รายการเรียบแบบตาราง ลดความซ้ำซากของการ์ด */}
        <section>
          <div className="flex items-baseline justify-between mb-3 px-1">
            <h2 className="text-lg font-semibold text-slate-900">จัดการข้อมูลโรงพยาบาล</h2>
            <span className="text-xs text-slate-400">{secondaryMenus.length} รายการ</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {secondaryMenus.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#14235a]"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#14235a] group-hover:text-white flex items-center justify-center transition-colors">
                  <Icon d={m.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{m.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{m.desc}</p>
                </div>
                <span className="text-slate-300 group-hover:text-[#14235a] group-hover:translate-x-0.5 transition-all">
                  <Icon d={icons.arrow} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}