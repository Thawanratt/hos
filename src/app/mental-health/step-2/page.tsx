'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Smile } from 'lucide-react';

export default function AssessmentStepTwoPage() {
  const [happinessScore, setHappinessScore] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // โหลดข้อมูลเก่าจาก localStorage มาเช็กถ้ามี
    const savedData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    if (savedData.step2?.happinessScore) {
      setHappinessScore(savedData.step2.happinessScore);
    }
  }, []);

  const handleNext = () => {
    if (happinessScore === null) {
      alert('กรุณาเลือกคะแนนความสุขของท่านก่อนดำเนินการต่อ');
      return;
    }

    const existingData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    const updatedData = { ...existingData, step2: { happinessScore } };
    localStorage.setItem('mentalHealthAssessment', JSON.stringify(updatedData));

    window.location.href = '/mental-health/step-3';
  };

  if (!isMounted) {
    return null; // ป้องกันปัญหา Hydration Mismatch ระหว่าง Server และ Client
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans pb-24">
      {/* HEADER BANNER */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <Link href="/mental-health" className="hover:text-[#1a2b6d] transition-colors">ตรวจสุขภาพใจออนไลน์</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">แบบประเมินความสุข</span>
          </nav>
        </div>
      </section>

      {/* TITLE SECTION */}
      <section className="bg-gradient-to-b from-white via-sky-50/20 to-slate-50/50 py-10 border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-[#1a2b6d] text-xs font-semibold">
            <Smile className="w-4 h-4 text-[#1a2b6d]" />
            <span>แบบประเมินความสุข (Happiness Scale)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d]">
            แบบประเมินความสุขตนเอง
          </h1>
          <p className="text-xs text-slate-500">
            ขั้นตอนที่ 2 จาก 8 ขั้นตอนการประเมินสุขภาพจิตมาตรฐานกรมสุขภาพจิต
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 md:px-8 mt-10 space-y-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="text-[#1a2b6d] font-bold">STEP 2 / 8 : แบบประเมินความสุข</span>
          <span>25% Completed</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-[#1a2b6d] h-full w-[25%] rounded-full transition-all"></div>
        </div>

        {/* QUESTION CARD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-8">
          <div className="bg-gradient-to-r from-blue-900 to-[#1a2b6d] text-white p-6 rounded-2xl text-center space-y-3 shadow-sm">
            <h2 className="text-base md:text-lg font-bold">
              ในช่วง 1 เดือนที่ผ่านมา ท่านมีความสุขอยู่ในระดับใด?
            </h2>
            <div className="flex items-center justify-center gap-6 text-xs text-sky-200 font-medium pt-1">
              <span>1 = น้อยที่สุด</span>
              <span>—</span>
              <span>10 = มากที่สุด</span>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              * กรุณาเลือกคะแนนระดับความสุขของท่านด้านล่าง
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = happinessScore === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setHappinessScore(num)}
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl font-bold text-sm md:text-base transition cursor-pointer shadow-xs flex items-center justify-center ${
                      isSelected 
                        ? 'bg-rose-500 text-white shadow-md scale-105 ring-2 ring-rose-300' 
                        : 'bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-[#1a2b6d] border border-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {happinessScore !== null && (
              <p className="text-xs font-semibold text-[#1a2b6d] pt-2">
                ท่านเลือกคะแนนความสุขระดับ: <span className="text-base font-extrabold text-rose-600">{happinessScore} / 10</span>
              </p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-4 flex items-center justify-between gap-4">
          <Link
            href="/mental-health/assessment"
            className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition shadow-xs"
          >
            ← ย้อนกลับ
          </Link>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer"
          >
            <span>ถัดไป (แบบประเมินพลังใจ RQ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>
    </div>
  );
}