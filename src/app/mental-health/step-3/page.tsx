'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, HelpCircle } from 'lucide-react';

export default function AssessmentStepThreePage() {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isMounted, setIsMounted] = useState(false);

  const questions = [
    { id: 1, text: '1. ความยากลำบากทำให้ฉันแกร่งขึ้น' },
    { id: 2, text: '2. ฉันมีกำลังใจและการสนับสนุนจากคนรอบข้าง' },
    { id: 3, text: '3. การแก้ไขปัญหาทำให้ฉันมีประสบการณ์มากขึ้น' }
   
  ];

  useEffect(() => {
    setIsMounted(true);
    const savedData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    if (savedData.step3) {
      setAnswers(savedData.step3);
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

    // บันทึกคำตอบ Step 3 ลงใน localStorage
    const existingData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    const updatedData = { ...existingData, step3: answers };
    localStorage.setItem('mentalHealthAssessment', JSON.stringify(updatedData));

    // ไปยัง Step 4
    window.location.href = '/mental-health/step-4';
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
            <span className="text-slate-600 font-semibold">แบบประเมินพลังใจ (RQ)</span>
          </nav>
        </div>
      </section>

      {/* 🌟 TITLE SECTION */}
      <section className="bg-gradient-to-b from-white via-sky-50/20 to-slate-50/50 py-10 border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-[#1a2b6d] text-xs font-semibold">
            <Zap className="w-4 h-4 text-[#1a2b6d]" />
            <span>แบบประเมินพลังใจ (Resilience Quotient: RQ)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d]">
            วัดพลังใจและความสามารถในการฟื้นตัว
          </h1>
          <p className="text-xs text-slate-500">
            ขั้นตอนที่ 3 จาก 8 ขั้นตอนการประเมินสุขภาพจิตมาตรฐานกรมสุขภาพจิต
          </p>
        </div>
      </section>

      {/* 📝 MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 md:px-8 mt-10 space-y-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="text-[#1a2b6d] font-bold">STEP 3 / 8 : แบบประเมินพลังใจ (RQ)</span>
          <span>37.5% Completed</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-[#1a2b6d] h-full w-[37.5%] rounded-full transition-all"></div>
        </div>

        {/* 💡 INSTRUCTION BANNER (ตามสไตล์ในภาพตัวอย่าง) */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 md:p-6 text-center space-y-2">
          <h3 className="text-sm font-bold text-[#1a2b6d]">
            แบบประเมินพลังใจ (RQ)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
            <span>ในช่วง 2 สัปดาห์ที่ผ่านมา ท่านมีความเชื่อมั่นในประเด็นต่างๆ ต่อไปนี้เพียงใด? โดย <strong className="text-[#1a2b6d]">1 หมายถึง น้อย และ 10 หมายถึง มาก</strong></span>
          </p>
        </div>

        {/* 📋 QUESTIONS CONTAINER */}
        <div className="space-y-6">
          {questions.map((q) => {
            const currentScore = answers[q.id];
            return (
              <div key={q.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
                
                {/* Question Header & Selected Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <h3 className="text-sm md:text-base font-bold text-slate-800">
                    {q.text}
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-2 shrink-0">
                    <span>คะแนนที่เลือก:</span>
                    <span className={`font-extrabold ${currentScore ? 'text-[#1a2b6d]' : 'text-slate-400'}`}>
                      {currentScore ? `${currentScore} / 10` : 'ยังไม่ได้เลือก'}
                    </span>
                  </div>
                </div>
                
                {/* Options: 1 ถึง 10 */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isSelected = currentScore === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSelect(q.id, num)}
                        className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl font-bold text-sm md:text-base transition cursor-pointer shadow-xs flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#1a2b6d] text-white shadow-md scale-105 ring-2 ring-blue-300'
                            : 'bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-[#1a2b6d] border border-slate-200'
                        }`}
                      >
                        {num}
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
            href="/mental-health/step-2"
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