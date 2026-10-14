'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, UserCheck } from 'lucide-react';

export default function AssessmentStepOnePage() {
  const [formData, setFormData] = useState({
    gender: '',
    ageGroup: '',
    riskFactor: ''
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const existingData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    if (existingData.step1) {
      setFormData(existingData.step1);
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gender || !formData.ageGroup) {
      alert('กรุณาเลือกเพศและช่วงอายุก่อนดำเนินการต่อ');
      return;
    }

    const existingData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    const updatedData = { ...existingData, step1: formData };
    localStorage.setItem('mentalHealthAssessment', JSON.stringify(updatedData));

    window.location.href = '/mental-health/step-2';
  };

  if (!isMounted) return null;

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
            <span className="text-slate-600 font-semibold">ข้อมูลทั่วไปและปัจจัยเสี่ยง</span>
          </nav>
        </div>
      </section>

      {/* TITLE SECTION */}
      <section className="bg-gradient-to-b from-white via-sky-50/20 to-slate-50/50 py-10 border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-[#1a2b6d] text-xs font-semibold">
            <UserCheck className="w-4 h-4 text-[#1a2b6d]" />
            <span>ขั้นตอนที่ 1: ข้อมูลทั่วไปของผู้รับการประเมิน</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d]">
            แบบประเมินสุขภาพจิต (Mental Health Check-in)
          </h1>
          <p className="text-xs text-slate-500">
            ข้อมูลของท่านจะถูกเก็บเป็นความลับสูงสุดตามมาตรฐานความปลอดภัยทางการแพทย์
          </p>
        </div>
      </section>

      {/* FORM CONTENT */}
      <main className="max-w-3xl mx-auto px-4 md:px-8 mt-10">
        <form onSubmit={handleNext} className="space-y-8">
          
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="text-[#1a2b6d] font-bold">STEP 1 / 8 : ข้อมูลทั่วไป</span>
            <span>12.5% Completed</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#1a2b6d] h-full w-[12.5%] rounded-full transition-all"></div>
          </div>

          {/* Question 1: Gender */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-sm md:text-base font-bold text-slate-800">
              1. เพศสภาพของท่าน <span className="text-rose-500">*</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'male', label: 'ชาย' },
                { id: 'female', label: 'หญิง' },
                { id: 'lgbtq', label: 'LGBTQ+' },
                { id: 'prefer_not_say', label: 'ไม่ระบุ' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChange('gender', item.id)}
                  className={`p-3.5 rounded-xl text-xs font-semibold transition cursor-pointer border text-center ${
                    formData.gender === item.id
                      ? 'bg-[#1a2b6d] text-white border-[#1a2b6d] shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-sky-50 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Age Group */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-sm md:text-base font-bold text-slate-800">
              2. ช่วงอายุของท่าน <span className="text-rose-500">*</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'teen', label: 'ต่ำกว่า 20 ปี' },
                { id: 'young_adult', label: '20 - 39 ปี' },
                { id: 'middle_age', label: '40 - 59 ปี' },
                { id: 'senior', label: '60 ปีขึ้นไป' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChange('ageGroup', item.id)}
                  className={`p-3.5 rounded-xl text-xs font-semibold transition cursor-pointer border text-center ${
                    formData.ageGroup === item.id
                      ? 'bg-[#1a2b6d] text-white border-[#1a2b6d] shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-sky-50 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Risk Factor */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-sm md:text-base font-bold text-slate-800">
              3. ปัจจัยเสี่ยงหรือความกดดันหลักในปัจจุบัน (เลือกข้อที่ตรงที่สุด)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'work', label: 'ปัญหาการทำงาน / ภาระหน้าที่' },
                { id: 'finance', label: 'ปัญหาการเงิน / หนี้สิน' },
                { id: 'relationship', label: 'ปัญหาความสัมพันธ์ / ครอบครัว' },
                { id: 'health', label: 'ปัญหาส่วนตัว / สุขภาพกายใจ' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChange('riskFactor', item.id)}
                  className={`p-3.5 rounded-xl text-xs font-semibold transition cursor-pointer border text-center ${
                    formData.riskFactor === item.id
                      ? 'bg-[#1a2b6d] text-white border-[#1a2b6d] shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-sky-50 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <Link
              href="/mental-health"
              className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition shadow-xs"
            >
              ← กลับหน้าหลัก
            </Link>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer"
            >
              <span>ถัดไป (แบบประเมินความสุข)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}