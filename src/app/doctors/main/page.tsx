'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IBM_Plex_Sans_Thai } from 'next/font/google';

const plex = IBM_Plex_Sans_Thai({
    subsets: ['thai', 'latin'],
    weight: ['300', '400', '500', '600', '700'],
});

const Icon = ({ d, className = 'w-5 h-5' }: { d: string; className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const icons = {
    queue: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM9 12h6M9 16h4',
    calendar: 'M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
    record: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M12 11v6M9 14h6',
    arrow: 'M5 12h14M13 6l6 6-6 6',
};

export default function DoctorMainPage() {
    const [doctorUser, setDoctorUser] = useState<any>(null);
    const [today, setToday] = useState('');
    const [clock, setClock] = useState('');
    const [greeting, setGreeting] = useState('สวัสดี');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setDoctorUser(JSON.parse(storedUser));
            } catch (e) {
                console.error(e);
            }
        }

        const tick = () => {
            const now = new Date();
            setToday(now.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
            setClock(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }));
            const h = now.getHours();
            setGreeting(h < 12 ? 'สวัสดีตอนเช้า' : h < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น');
        };
        tick();
        const timer = setInterval(tick, 30000);
        return () => clearInterval(timer);
    }, []);

    const TITLE_RE = /^(นพ\.|พญ\.|นายแพทย์|แพทย์หญิง|ดร\.|ศ\.|รศ\.|ผศ\.)\s*/;
    const first = (doctorUser?.firstName || '').trim();
    const last = (doctorUser?.lastName || '').trim();
    const hasTitle = TITLE_RE.test(first);

    // 🟢 แยกตัวแปรจัดการชื่อเพื่อเลี่ยงเทอร์นารีซ้อน
    let prefixTitle = 'นพ. ';
    if (hasTitle) {
        prefixTitle = '';
    }
    const baseName = doctorUser ? `${prefixTitle}${first} ${last}`.trim() : 'แพทย์ผู้เชี่ยวชาญ';
    const fullName = baseName;

    return (
        <div className={`${plex.className} min-h-screen bg-[#f6f8fb] text-slate-800 pb-20`}>
            <style>{`
        @keyframes ripple { 0% { transform: translate(-50%,-50%) scale(.35); opacity: .0; } 15% { opacity: .75; } 100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; } }
        @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes status-pulse { 0% { box-shadow: 0 0 0 0 rgba(47,85,151,.5); } 70% { box-shadow: 0 0 0 7px rgba(47,85,151,0); } 100% { box-shadow: 0 0 0 0 rgba(47,85,151,0); } }
        .ripple-ring { position: absolute; left: 50%; top: 50%; border-radius: 9999px; border: 1.5px solid rgba(47,85,151,.28); animation: ripple 6s ease-out infinite; }
        .rise { opacity: 0; animation: rise .7s cubic-bezier(.2,.7,.2,1) forwards; }
        .status-dot { animation: status-pulse 2.4s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ripple-ring { animation: none; opacity: .35; transform: translate(-50%,-50%) scale(1); }
          .rise { animation: none; opacity: 1; }
          .status-dot { animation: none; }
        }
      `}</style>

            {/* ---------- ส่วนต้อนรับ ---------- */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
                <div className="rise relative overflow-hidden rounded-2xl border border-[#d6e0ee] bg-[#e9eff7]">
                    <div className="pointer-events-none absolute right-[11%] top-1/2 w-0 h-0 hidden md:block" aria-hidden="true">
                        <span className="ripple-ring w-[300px] h-[300px]" style={{ animationDelay: '0s' }} />
                        <span className="ripple-ring w-[300px] h-[300px]" style={{ animationDelay: '2s' }} />
                        <span className="ripple-ring w-[300px] h-[300px]" style={{ animationDelay: '4s' }} />
                    </div>

                    <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center px-6 md:px-10 py-10 md:py-12">
                        <div>
                            <p className="text-sm font-medium text-[#2f5597]">{greeting}</p>
                            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-[#1e3a6e]">{fullName}</h1>
                            <p className="mt-3 max-w-xl text-sm md:text-[15px] leading-relaxed text-slate-600">
                                ศูนย์รวมการจัดการคิวตรวจคนไข้ เวชระเบียน และตารางออกตรวจ เลือกเมนูด้านล่างเพื่อเริ่มปฏิบัติงาน
                            </p>
                        </div>

                        {/* แผงสถานะวันนี้ */}
                        <div className="relative min-w-[230px] rounded-xl bg-white ring-1 ring-[#d6e0ee] px-5 py-4">
                            <div className="text-xs text-slate-500">{today || 'กำลังโหลดวันที่...'}</div>
                            <div className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-[#1e3a6e]">
                                {clock || '--:--'} <span className="text-sm font-normal text-slate-400">น.</span>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-2 text-xs font-medium text-slate-700">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                สถานะแพทย์: พร้อมปฏิบัติงาน
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- เมนู ---------- */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 mt-10 space-y-5">
                <h2 className="rise text-lg font-semibold text-[#1e3a6e] px-1" style={{ animationDelay: '.15s' }}>เมนูการปฏิบัติงาน</h2>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    {/* งานหลัก: จัดการคิว (การ์ดใหญ่) */}
                    <Link
                        href="/doctors/dashboard"
                        style={{ animationDelay: '.25s' }}
                        className="rise group relative overflow-hidden lg:col-span-3 lg:row-span-2 flex flex-col justify-between bg-white rounded-xl p-7 md:p-8 border border-slate-200 hover:border-[#2f5597]/50 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5597]"
                    >
                        <div className="relative">
                            <div className="w-14 h-14 rounded-xl bg-[#2f5597] text-white flex items-center justify-center">
                                <Icon d={icons.queue} className="w-6 h-6" />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-[#1e3a6e]">จัดการคิวและสถานะการตรวจ</h3>
                            <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                                ตรวจสอบรายชื่อผู้ป่วยในความดูแล อัปเดตสถานะการตรวจ (กำลังตรวจ, ตรวจเสร็จสิ้น) และดูเวลานัดหมาย
                            </p>
                        </div>
                        <div className="relative mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-[#2f5597]">
                            เข้าสู่ระบบจัดการคิว
                            <span className="group-hover:translate-x-1 transition-transform">
                                <Icon d={icons.arrow} />
                            </span>
                        </div>
                    </Link>

                    {/* ตารางออกตรวจ */}
                    <Link
                        href="/doctors/schedule"
                        style={{ animationDelay: '.35s' }}
                        className="rise group lg:col-span-2 flex items-start gap-4 bg-white rounded-xl p-6 border border-slate-200 hover:border-[#2f5597]/50 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5597]"
                    >
                        <div className="shrink-0 w-11 h-11 rounded-lg bg-[#e9eff7] text-[#2f5597] group-hover:bg-[#2f5597] group-hover:text-white flex items-center justify-center transition-colors">
                            <Icon d={icons.calendar} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[15px] font-semibold text-[#1e3a6e]">ตารางออกตรวจประจำสัปดาห์</h3>
                            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                                ตรวจสอบตารางเวลาการออกตรวจ แผนก และห้องตรวจประจำวันของท่าน
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#2f5597]">
                                ดูตารางออกตรวจ
                                <span className="group-hover:translate-x-0.5 transition-transform"><Icon d={icons.arrow} className="w-3.5 h-3.5" /></span>
                            </span>
                        </div>
                    </Link>

                    {/* เวชระเบียน */}
                    <Link
                        href="/doctors/patients"
                        style={{ animationDelay: '.45s' }}
                        className="rise group lg:col-span-2 flex items-start gap-4 bg-white rounded-xl p-6 border border-slate-200 hover:border-[#2f5597]/50 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5597]"
                    >
                        <div className="shrink-0 w-11 h-11 rounded-lg bg-[#e9eff7] text-[#2f5597] group-hover:bg-[#2f5597] group-hover:text-white flex items-center justify-center transition-colors">
                            <Icon d={icons.record} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[15px] font-semibold text-[#1e3a6e]">เวชระเบียนและประวัติการรักษา</h3>
                            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                                บันทึกผลการวินิจฉัย (Diagnosis) ประวัติการรักษาเดิม และการสั่งจ่ายยาเบื้องต้น
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#2f5597]">
                                เข้าสู่ระบบเวชระเบียน
                                <span className="group-hover:translate-x-0.5 transition-transform"><Icon d={icons.arrow} className="w-3.5 h-3.5" /></span>
                            </span>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}