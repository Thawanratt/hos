'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';

export default function AssessmentStepSixPage() {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isMounted, setIsMounted] = useState(false);

  const questions = [
    { 
      id: 1, 
      category: 'แบบคัดกรองภาวะซึมเศร้า 2 คำถาม (2Q+)', 
      text: '1. ใน 2 สัปดาห์ที่ผ่านมา รวมถึงวันนี้ ท่านรู้สึกหดหู่ เศร้า หรือท้อแท้สิ้นหวัง หรือไม่?' 
    },
    { 
      id: 2, 
      category: 'แบบคัดกรองภาวะซึมเศร้า 2 คำถาม (2Q+)', 
      text: '2. ใน 2 สัปดาห์ที่ผ่านมา รวมถึงวันนี้ ท่านรู้สึกเบื่อ ทำอะไรก็ไม่เพลิดเพลิน หรือไม่?' 
    },
    { 
      id: 3, 
      category: 'คำถามคัดกรองการฆ่าตัวตาย', 
      text: '1. ใน 1 เดือนที่ผ่านมา รวมถึงวันนี้ ท่านมีความรู้สึกทุกข์ใจจนไม่อยากมีชีวิตอยู่ ?' 
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    const savedData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    if (savedData.step6) {
      setAnswers(savedData.step6);
    }
  }, []);

  const handleSelect = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (Object.keys(answers).length < questions.length) {
      alert('กรุณาตอบคำถามให้ครบทุกข้อก่อนดำเนินการต่อ');
      return;
    }

    // บันทึกคำตอบ Step 6 ลงใน localStorage
    const existingData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    const updatedData = { ...existingData, step6: answers };
    localStorage.setItem('mentalHealthAssessment', JSON.stringify(updatedData));

    // ไปยัง Step 7
    window.location.href = '/mental-health/step-7';
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans pb-24">
      
      {/* 🏥 HEADER BANNER */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <Link href="/mental-health" className="hover:text-[#1a2b6d] transition-colors">ตรวจสุขภาพใจออนไลน์</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">แบบคัดกรอง 2Q+ และความเสี่ยง</span>
          </nav>
        </div>
      </section>

      {/* 🌟 TITLE SECTION */}
      <section className="bg-gradient-to-b from-white via-sky-50/20 to-slate-50/50 py-10 border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-[#1a2b6d] text-xs font-semibold">
            <HelpCircle className="w-4 h-4 text-[#1a2b6d]" />
            <span>แบบคัดกรองภาวะซึมเศร้า 2 คำถาม (2Q PLUS)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d]">
            แบบคัดกรองภาวะซึมเศร้า 2 คำถาม (2Q PLUS) และคำถามคัดกรองการฆ่าตัวตาย
          </h1>
          <p className="text-xs text-slate-500">
            ขั้นตอนที่ 6 จาก 8 ขั้นตอนการประเมินสุขภาพจิตมาตรฐานกรมสุขภาพจิต
          </p>
        </div>
      </section>

      {/* 📝 MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 md:px-8 mt-10 space-y-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="text-[#1a2b6d] font-bold">STEP 6 / 8 : แบบคัดกรอง 2Q+ และความเสี่ยง</span>
          <span>75% Completed</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-[#1a2b6d] h-full w-[75%] rounded-full transition-all"></div>
        </div>

        {/* 📋 SECTION 1: 2Q+ */}
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 flex items-center gap-2 text-[#1a2b6d] font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>แบบคัดกรองภาวะซึมเศร้า 2 คำถาม (2Q+)</span>
          </div>

          {questions.slice(0, 2).map((q) => {
            const currentScore = answers[q.id];
            return (
              <div key={q.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
                <h3 className="text-sm md:text-base font-bold text-slate-800">
                  {q.text}
                </h3>
                
                {/* Options: 0 (ไม่ใช่) หรือ 1 (ใช่) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { val: 0, label: 'ไม่ใช่' },
                    { val: 1, label: 'ใช่' },
                  ].map((opt) => {
                    const isSelected = currentScore === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleSelect(q.id, opt.val)}
                        className={`p-3.5 rounded-xl text-xs font-bold transition cursor-pointer border text-center flex items-center justify-center gap-2 ${
                          isSelected
                            ? opt.val === 1 
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm' 
                              : 'bg-[#1a2b6d] text-white border-[#1a2b6d] shadow-sm'
                            : 'bg-slate-50 text-slate-700 hover:bg-sky-50 border-slate-200'
                        }`}
                      >
                        <span className="text-sm font-extrabold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 📋 SECTION 2: suicide risk screening */}
        <div className="space-y-4 pt-4">
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 flex items-center gap-2 text-[#1a2b6d] font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>คำถามคัดกรองการฆ่าตัวตาย</span>
          </div>

          {questions.slice(2, 3).map((q) => {
            const currentScore = answers[q.id];
            return (
              <div key={q.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
                <h3 className="text-sm md:text-base font-bold text-slate-800">
                  {q.text}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { val: 0, label: 'ไม่ใช่' },
                    { val: 1, label: 'ใช่' },
                  ].map((opt) => {
                    const isSelected = currentScore === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleSelect(q.id, opt.val)}
                        className={`p-3.5 rounded-xl text-xs font-bold transition cursor-pointer border text-center flex items-center justify-center gap-2 ${
                          isSelected
                            ? opt.val === 1 
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm' 
                              : 'bg-[#1a2b6d] text-white border-[#1a2b6d] shadow-sm'
                            : 'bg-slate-50 text-slate-700 hover:bg-sky-50 border-slate-200'
                        }`}
                      >
                        <span className="text-sm font-extrabold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔘 ACTION BUTTONS */}
        <div className="pt-4 flex items-center justify-between gap-4">
          <Link
            href="/mental-health/step-5"
            className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition shadow-xs"
          >
            ← ย้อนกลับ
          </Link>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer"
          >
            <span>ถัดไป</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

    </div>
  );
}