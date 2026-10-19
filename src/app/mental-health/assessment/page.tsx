'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export default function AssessmentStepOnePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    gender: string;
    ageGroup: string;
    riskFactors: string[];
  }>({
    gender: '',
    ageGroup: '',
    riskFactors: []
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const existingData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    if (existingData.step1) {
      const loadedData = existingData.step1;
      setFormData({
        gender: loadedData.gender || '',
        ageGroup: loadedData.ageGroup || '',
        riskFactors: Array.isArray(loadedData.riskFactors) 
          ? loadedData.riskFactors 
          : (loadedData.riskFactor ? [loadedData.riskFactor] : [])
      });
    }
  }, []);

  const handleChange = (field: 'gender' | 'ageGroup', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRiskToggle = (factor: string) => {
    setFormData(prev => {
      const currentFactors = prev.riskFactors;
      
      // กรณีเลือก "ไม่อยู่ในกลุ่มข้างต้น" ให้ล้างค่าอื่นทั้งหมด
      if (factor === 'ไม่อยู่ในกลุ่มข้างต้น') {
        return { ...prev, riskFactors: ['ไม่อยู่ในกลุ่มข้างต้น'] };
      }

      // กรณีเลือกข้ออื่น ให้เอา "ไม่อยู่ในกลุ่มข้างต้น" ออก (ถ้ามี)
      const filtered = currentFactors.filter(f => f !== 'ไม่อยู่ในกลุ่มข้างต้น');
      const exists = filtered.includes(factor);
      
      const newFactors = exists
        ? filtered.filter(f => f !== factor)
        : [...filtered, factor];
      
      return { ...prev, riskFactors: newFactors };
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gender || !formData.ageGroup) {
      alert('กรุณาเลือกเพศและช่วงอายุก่อนดำเนินการต่อ');
      return;
    }
    if (formData.riskFactors.length === 0) {
      alert('กรุณาระบุข้อมูลปัจจัยเสี่ยง (หากไม่มีให้เลือก "ไม่อยู่ในกลุ่มข้างต้น")');
      return;
    }

    const existingData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');
    const updatedData = { ...existingData, step1: formData };
    localStorage.setItem('mentalHealthAssessment', JSON.stringify(updatedData));

    router.push('/mental-health/step-2');
  };

  // รายการปัจจัยเสี่ยง
  const riskOptions = [
    'ว่างงาน', 'ธุรกิจมีปัญหา', 'รายได้น้อย', 'พิการทางกาย',
    'ครอบครัวมีผู้สูงอายุ/เด็กแรกเกิด', 'ผู้ป่วยติดเตียง',
    'ผู้ป่วยเรื้อรังต้องรับยาต่อเนื่อง', 'เคยป่วยจิตเวชหรือรับยาทางจิต', 'โรคจิตเภท',
    'โรคซึมเศร้า', 'โรคไบโพลาร์', 'ผู้ที่มีปัญหาการใช้แอลกอฮอล์/สารเสพติด',
    'ครอบครัวมีผู้พิการทางกาย/ทางจิต', 'ผู้ป่วยโควิด', 'HomeQuarantine',
    'ครอบครัวมีผู้ติดเชื้อ'
  ];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">
      {/* HEADER BANNER */}
      <section className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <nav className="text-[11px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <Link href="/mental-health" className="hover:text-[#1a2b6d] transition-colors">ตรวจสุขภาพใจออนไลน์</Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#1a2b6d] font-bold">ข้อมูลทั่วไปและปัจจัยเสี่ยง</span>
          </nav>
        </div>
      </section>

      {/* TITLE SECTION */}
      <section className="bg-white py-12 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-100 border border-slate-200 text-[#1a2b6d] text-xs font-bold uppercase tracking-widest">
            <UserCheck className="w-4 h-4 text-[#1a2b6d]" />
            <span>ขั้นตอนที่ 1: ข้อมูลทั่วไป</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#1a2b6d] tracking-tight">
            แบบประเมินสุขภาพจิต (Mental Health Check-in)
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            ข้อมูลของท่านจะถูกประมวลผลเป็นสถิติภาพรวม และถูกเก็บรักษาเป็นความลับสูงสุดตามมาตรฐานความปลอดภัย
          </p>
        </div>
      </section>

      {/* FORM CONTENT */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-10">
        <form onSubmit={handleNext} className="space-y-6">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            <span className="text-[#1a2b6d]">Step 1 of 8</span>
            <span>12.5% Completed</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-8">
            <div className="bg-[#1a2b6d] h-full w-[12.5%] transition-all"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question 1: Gender */}
            <div className="bg-white border border-slate-300 rounded-lg p-6 md:p-8 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                1. เพศสภาพ <span className="text-rose-600">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ชาย', label: 'ชาย' },
                  { id: 'หญิง', label: 'หญิง' },
                  { id: 'LGBTQ+', label: 'LGBTQ+' },
                  { id: 'ไม่ระบุ', label: 'ไม่ระบุ' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleChange('gender', item.id)}
                    className={`p-3 rounded-md text-sm font-semibold transition border text-center cursor-pointer ${
                      formData.gender === item.id
                        ? 'bg-[#1a2b6d] text-white border-[#1a2b6d] shadow-inner'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Age Group */}
            <div className="bg-white border border-slate-300 rounded-lg p-6 md:p-8 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                2. ช่วงอายุ <span className="text-rose-600">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ต่ำกว่า 20 ปี', label: 'ต่ำกว่า 20 ปี' },
                  { id: '20 - 39 ปี', label: '20 - 39 ปี' },
                  { id: '40 - 59 ปี', label: '40 - 59 ปี' },
                  { id: '60 ปีขึ้นไป', label: '60 ปีขึ้นไป' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleChange('ageGroup', item.id)}
                    className={`p-3 rounded-md text-sm font-semibold transition border text-center cursor-pointer ${
                      formData.ageGroup === item.id
                        ? 'bg-[#1a2b6d] text-white border-[#1a2b6d] shadow-inner'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question 3: Risk Factors */}
          <div className="bg-white border border-slate-300 rounded-lg p-6 md:p-8 shadow-xs space-y-5">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">
                3. ข้อมูลปัจจัยเสี่ยงในปัจจุบัน
              </h3>
              <p className="text-sm font-medium text-sky-700 bg-sky-50 inline-block px-3 py-1 rounded-md">
                (เลือกได้มากกว่า 1 ข้อ)
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 pt-2">
              {riskOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleRiskToggle(tag)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition border cursor-pointer ${
                    formData.riskFactors.includes(tag)
                      ? 'bg-sky-100 text-sky-800 border-sky-300 shadow-xs font-semibold'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400 border-slate-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* ปุ่ม "ไม่อยู่ในกลุ่มข้างต้น" */}
            <div className="pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleRiskToggle('ไม่อยู่ในกลุ่มข้างต้น')}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-lg text-base font-bold transition border cursor-pointer ${
                  formData.riskFactors.includes('ไม่อยู่ในกลุ่มข้างต้น')
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                }`}
              >
                ไม่อยู่ในกลุ่มข้างต้น
              </button>
              <p className="text-xs text-rose-600 font-medium mt-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>*หากไม่อยู่ในกลุ่มไหน กรุณาเลือก &quot;ไม่อยู่ในกลุ่มข้างต้น&quot;</span>
              </p>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            <Link
              href="/mental-health"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-lg transition shadow-xs text-center"
            >
              ย้อนกลับ
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-sm rounded-lg shadow-md transition cursor-pointer"
            >
              <span>ถัดไป (ประเมินความสุข)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}