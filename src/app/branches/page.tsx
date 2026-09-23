'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BRANCHES_DATA } from '@/app/api/branches/branches';

function BranchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // รับรหัสสาขาที่ส่งมาจากหน้าแรกผ่าน URL (ถ้าไม่มีให้ใช้สาขาแรกเป็นค่าเริ่มต้น)
  const branchId = searchParams.get('branch') || 'novaria-main';
  const currentBranch = BRANCHES_DATA.find((b) => b.id === branchId) || BRANCHES_DATA[0];

  const [selectedService, setSelectedService] = useState<string>('doctor');

  // ประเภทบริการ
  const services = [
    {
      id: 'doctor',
      title: 'นัดหมายแพทย์',
      desc: 'พบแพทย์เฉพาะทางและเลือกตารางออกตรวจตามความต้องการ',
    },
    {
      id: 'checkup',
      title: 'ตรวจสุขภาพ',
      desc: 'โปรแกรมตรวจสุขภาพประจำปีและวิเคราะห์ร่างกายเชิงลึก',
    },
    {
      id: 'vaccine',
      title: 'ฉีดวัคซีนไข้หวัดใหญ่',
      desc: 'สร้างภูมิคุ้มกันโรคไข้หวัดใหญ่สายพันธุ์ใหม่',
    },
  ];

  const handleNext = () => {
    // ส่งสาขาเดิมที่เลือกไว้จาก Popup + บริการที่เลือก ไปยังหน้า /booking
    router.push(`/booking?branch=${branchId}&service=${selectedService}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 text-slate-800">
      
      {/* HEADER BANNER */}
      <div className="bg-[#1a2b6d] text-white py-10 px-6 border-b border-slate-200">
        <div className="max-w-3xl mx-auto space-y-1">
          <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
            {currentBranch.name}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight pt-1">เลือกประเภทบริการ</h1>
          <p className="text-xs text-slate-300">กรุณาเลือกบริการที่ท่านต้องการเข้ารับบริการ ณ สาขาที่คุณเลือก</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
        
        {/* แสดงสาขาที่เลือกไว้แล้ว (เพื่อให้ผู้ใช้รู้ว่ากำลังจองที่สาขาไหน) */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400 block font-medium">สาขาที่เลือก:</span>
            <span className="font-bold text-[#1a2b6d] text-sm">{currentBranch.name}</span>
          </div>
          <Link href="/" className="text-xs text-[#1a2b6d] font-bold hover:underline">
            เปลี่ยนสาขา 
          </Link>
        </div>

        {/* SECTION: SELECT SERVICE TYPE */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2">เลือกประเภทบริการที่ต้องการ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((serv) => (
              <div
                key={serv.id}
                onClick={() => setSelectedService(serv.id)}
                className={`p-5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  selectedService === serv.id
                    ? 'border-[#1a2b6d] bg-blue-50/40 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <h3 className="font-bold text-sm text-slate-900">{serv.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{serv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex justify-between items-center pt-2">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
             กลับสู่หน้าแรก
          </Link>
          <button
            onClick={handleNext}
            className="bg-[#1a2b6d] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-2xs cursor-pointer"
          >
            ถัดไป: ไปหน้าจองคิว ➔
          </button>
        </div>

      </main>

    </div>
  );
}

export default function BranchesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">กำลังโหลด...</div>}>
      <BranchesContent />
    </Suspense>
  );
}