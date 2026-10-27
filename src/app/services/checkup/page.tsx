'use client';

import Link from 'next/link';

export default function CheckupServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans">
      
      {/* Hero Header Section */}
      <div className="bg-[#1a2b6d] text-white py-12 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <Link href="/" className="hover:underline">หน้าหลัก</Link>
            <span>/</span>
            <Link href="/services" className="hover:underline">บริการของเรา</Link>
            <span>/</span>
            <span className="text-white font-semibold">ศูนย์ตรวจสุขภาพ</span>
          </div>
          
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold tracking-wider uppercase">
              Novaria Health Check-up Center
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              โปรแกรมตรวจสุขภาพเชิงลึก
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              บริการตรวจสุขภาพประจำปีและโปรแกรมตรวจคัดกรองโรคเฉพาะบุคคล ออกแบบโดยแพทย์ผู้ชำนาญการเพื่อการป้องกันโรคในระยะยาว
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 md:p-10 space-y-10">

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-[280px] md:h-[400px] bg-slate-100">
            <img
              src="/images/check.jpg" 
              alt="ศูนย์ตรวจสุขภาพ"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Introduction */}
          <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-900 text-sm md:text-base">
              เรามีเครื่องมือตรวจวินิจฉัยที่ทันสมัย พร้อมให้คำแนะนำการดูแลสุขภาพเพื่อการป้องกันโรคในระยะยาวอย่างตรงจุด
            </p>
            <p className="text-slate-500">
              ทุกโปรแกรมได้รับการออกแบบให้เหมาะสมกับช่วงวัย ไลฟ์สไตล์ และความเสี่ยงเฉพาะบุคคล เพื่อสุขภาพที่แข็งแรงอย่างยั่งยืน
            </p>
          </div>

          {/* Section 1: Checkup Programs */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-base md:text-lg font-bold text-[#1a2b6d]">
              โปรแกรมตรวจสุขภาพแนะนำ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">โปรแกรมตรวจสุขภาพเบื้องต้น (Essential Checkup)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  เหมาะสำหรับวัยทำงาน ตรวจร่างกายพื้นฐาน ตรวจเลือด เอกซเรย์ปอด และประเมินความเสี่ยงสุขภาพเบื้องต้น
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">โปรแกรมคัดกรองความเสี่ยงโรคหัวใจ</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  วิเคราะห์เชิงลึกระดับไขมันในเลือด การทำงานของหลอดเลือด และความเสี่ยงโรคระบบหัวใจและหลอดเลือด
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
            <Link 
              href="/services" 
              className="text-xs text-slate-500 hover:text-[#1a2b6d] font-semibold transition"
            >
              กลับสู่หน้าบริการทั้งหมด
            </Link>
            
            <Link 
              href="/booking?service=checkup&departmentId=10" 
              className="w-full sm:w-auto bg-[#1a2b6d] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-xs text-center"
            >
              จองคิวตรวจสุขภาพ ➔
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}