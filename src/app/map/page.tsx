'use client';

import Link from 'next/link';

export default function MapPage() {
  // ข้อมูลโรงพยาบาลหลัก 
  const hospitalData = {
    name: 'โรงพยาบาลโนวาเลีย (สำนักงานใหญ่)',
    address: '123 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900',
    phone: '02-165-5555',
    lat: 13.8240,
    lng: 100.5650,
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900 pb-20">
      
      {/* 🏥 HEADER BANNER - EXECUTIVE ACCENT BAR STYLE */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          
          {/* Breadcrumb & Executive Title Banner */}
          <div className="space-y-3">
            <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">แผนที่และการเดินทาง</span>
            </nav>

            {/* Executive Accent Header */}
            <div className="pl-4 border-l-4 border-[#1a2b6d] py-0.5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight leading-tight">
                  แผนที่และ <span className="font-semibold text-[#1a2b6d]">การเดินทาง</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
                  ตรวจสอบที่ตั้ง ช่องทางติดต่อ และเส้นทางคมนาคมเพื่อเดินทางมายังโรงพยาบาลโนวาเลีย
                </p>
              </div>
            </div>
          </div> 

        </div>
      </section>

      {/* 🗺️ LARGE MAP CONTAINER (แผนที่ขนาดใหญ่วางเต็มตา พร้อมกล่องข้อมูลลอยด้านบนซ้าย) */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative h-[650px] w-full">
          
          {/* GOOGLE MAPS EMBED (ขนาดใหญ่เต็มพื้นที่) */}
          <iframe
            title="Hospital Location Map"
            src={`https://maps.google.com/maps?q=${hospitalData.lat},${hospitalData.lng}&z=16&output=embed`}
            className="w-full h-full border-0 absolute inset-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* FLOATING INFO CARD (กล่องข้อมูลโรงพยาบาลลอยอยู่มุมซ้ายบนของแผนที่) */}
          <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full space-y-4">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1a2b6d] mb-1">
                Headquarters
              </span>
              <h2 className="text-base font-bold text-[#0b192c]">{hospitalData.name}</h2>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="leading-relaxed">{hospitalData.address}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-500">โทรศัพท์:</span>
                <span className="font-mono font-bold text-[#0b192c]">{hospitalData.phone}</span>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospitalData.name + ' ' + hospitalData.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#1a2b6d] hover:bg-[#15294a] text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 text-center cursor-pointer"
            >
              <span>เปิดใน Google Maps</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

        </div>
      </main>

    </div>
  );
}