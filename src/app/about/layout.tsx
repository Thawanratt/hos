'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Target, Users, ChevronRight } from 'lucide-react';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'ข้อมูลโรงพยาบาล', href: '/about', icon: Building2 },
    { name: 'วิสัยทัศน์และพันธกิจ', href: '/about/vision', icon: Target },
    { name: 'ทีมผู้บริหาร', href: '/about/executives', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pb-20">
      {/* 🏥 HEADER BANNER */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-4">
          <nav className="text-[11px] text-slate-400 font-medium uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">เกี่ยวกับเรา</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">ข้อมูลโรงพยาบาล</span>
          </nav>

          <div className="pl-4 border-l-4 border-[#1a2b6d]">
            <h1 className="text-2xl md:text-3xl font-light text-slate-900">
              ข้อมูล <span className="font-semibold text-[#1a2b6d]">โรงพยาบาลโนวาเลีย</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              ประวัติความเป็นมา วิสัยทัศน์ พันธกิจ และคณะผู้บริหาร
            </p>
          </div>
        </div>
      </section>

      {/* 🏛️ MAIN CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1a2b6d] text-white'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* PAGE CONTENT */}
          <section className="lg:col-span-9">
            {children}
          </section>

        </div>
      </main>
    </div>
  );
}