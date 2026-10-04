'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BRANCHES_DATA, Branch } from '@/app/api/branches/branches';
import BranchSelectorModal from '@/components/BranchSelectorModal';

function BranchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // รับรหัสสาขาที่ส่งมาจากหน้าแรกผ่าน URL (ถ้าไม่มีให้ใช้สาขาแรกเป็นค่าเริ่มต้น)
  const branchId = searchParams.get('branch') || 'novaria-main';
  const currentBranch = BRANCHES_DATA.find((b) => b.id === branchId) || BRANCHES_DATA[0];

  const [selectedService, setSelectedService] = useState<string>('doctor');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 🟢 เพิ่ม State สำหรับควบคุม Modal เลือกสาขา
  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);

  // ตรวจสอบการล็อกอินเมื่อโหลดหน้า
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        setIsLoggedIn(true);
      }
    }
  }, []);

  // ฟังก์ชันเมื่อผู้ใช้เลือกสาขาใหม่จาก Modal
  const handleSelectNewBranch = (branch: Branch) => {
    // อัปเดต URL พารามิเตอร์ branch ให้เปลี่ยนตามสาขาที่เลือก
    router.push(`/branches?branch=${branch.id}`);
  };

  // ประเภทบริการ
  const services = [
    {
      id: 'doctor',
      title: 'นัดหมายแพทย์',
      desc: 'พบแพทย์เฉพาะทางและเลือกตารางออกตรวจตามความต้องการ',
      icon: (
        <svg className="w-6 h-6 text-[#1a2b6d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'checkup',
      title: 'ตรวจสุขภาพ',
      desc: 'โปรแกรมตรวจสุขภาพประจำปีและวิเคราะห์ร่างกายเชิงลึก',
      icon: (
        <svg className="w-6 h-6 text-[#1a2b6d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'vaccine',
      title: 'ฉีดวัคซีนไข้หวัดใหญ่',
      desc: 'สร้างภูมิคุ้มกันโรคไข้หวัดใหญ่สายพันธุ์ใหม่ประจำปี',
      icon: (
        <svg className="w-6 h-6 text-[#1a2b6d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.1l-1.9 1.9a1 1 0 000 1.414l1.88 1.88a1 1 0 001.414 0l1.9-1.9 2.27 1.135a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 001.022-.547z" />
        </svg>
      ),
    },
  ];

  // URL ปลายทางสำหรับส่งต่อไปยังหน้า Booking
  const targetBookingPath = `/booking?branch=${branchId}&service=${selectedService}`;

  const handleNext = () => {
    if (isLoggedIn) {
      router.push(targetBookingPath);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 text-slate-800">
      
      {/* HEADER BANNER */}
      <div className="bg-[#1a2b6d] text-white py-12 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-medium tracking-wide">
            {currentBranch.name}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">เลือกประเภทบริการ</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto">
            กรุณาเลือกบริการทางการแพทย์ที่ท่านต้องการเข้ารับบริการ ณ สาขาที่คุณเลือก
          </p>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-4xl mx-auto px-6 mt-8 space-y-6">
        
        {/* แสดงสาขาที่เลือกไว้แล้ว + ปุ่มกดเปิด Modal เปลี่ยนสาขา */}
        <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4 md:p-5 flex justify-between items-center text-xs shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a2b6d]/10 flex items-center justify-center text-[#1a2b6d]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-slate-400 block font-medium text-[11px]">สาขาที่เลือกเข้ารับบริการ:</span>
              {/* 🟢 แสดงชื่อสาขาปัจจุบันแบบ Dynamic ตามที่ส่งผ่านมา */}
              <span className="font-bold text-[#1a2b6d] text-sm md:text-base">
                {currentBranch ? currentBranch.name : 'สาขาใกล้คุณ'}
              </span>
            </div>
          </div>

          {/* 🟢 ปุ่มเปลี่ยนสาขา กดแล้วเรียก Modal ขึ้นมา */}
          <button 
            onClick={() => setIsBranchModalOpen(true)}
            className="text-xs text-[#1a2b6d] font-bold hover:underline px-4 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            เปลี่ยนสาขา
          </button>
        </div>

        {/* CARD CONTAINER: SELECT SERVICE TYPE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-10 space-y-8">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">เลือกบริการที่ต้องการ</h2>
            <p className="text-xs text-slate-500">เลือกประเภทบริการเพื่อเข้าสู่ขั้นตอนนัดหมายถัดไป</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((serv) => {
              const isSelected = selectedService === serv.id;
              return (
                <div
                  key={serv.id}
                  onClick={() => setSelectedService(serv.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-[#1a2b6d] bg-blue-50/30 shadow-xs ring-1 ring-[#1a2b6d]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50/80 flex items-center justify-center">
                      {serv.icon}
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#1a2b6d] bg-[#1a2b6d]' : 'border-slate-300'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">{serv.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{serv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM ACTION BUTTONS */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              ย้อนกลับ
            </Link>
            <button
              onClick={handleNext}
              className="bg-[#1a2b6d] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-xs cursor-pointer flex items-center space-x-2"
            >
              <span>ต่อไป: ไปหน้าจองคิว</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </main>

      {/* 🔐 LOGIN MODAL POPUP */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="w-14 h-14 bg-blue-50 border border-blue-100 text-[#1a2b6d] rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">กรุณาเข้าสู่ระบบก่อนดำเนินการ</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                ท่านจำเป็นต้องเข้าสู่ระบบสมาชิกของโรงพยาบาลเพื่อความปลอดภัยและใช้ยืนยันการทำนัดหมาย
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href={`/register?redirect=${encodeURIComponent(targetBookingPath)}`}
                className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-center flex items-center justify-center"
              >
                สร้างบัญชีใหม่
              </Link>
              <Link
                href={`/login?redirect=${encodeURIComponent(targetBookingPath)}`}
                className="py-3 px-4 rounded-xl bg-[#1a2b6d] text-xs font-semibold text-white hover:bg-[#0f1a42] transition shadow-xs text-center flex items-center justify-center"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 🏥 BRANCH SELECTOR MODAL (เชื่อมต่อ Pop-up เลือกสาขา) */}
      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSelectBranch={handleSelectNewBranch}
      />

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