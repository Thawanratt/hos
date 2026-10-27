'use client';

import Link from 'next/link';

export default function BrainServicePage() {
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
            <span className="text-white font-semibold">ศูนย์สมองและระบบประสาท</span>
          </div>
          
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold tracking-wider uppercase">
              Novaria Neuroscience Center
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              คลินิกสมองและระบบประสาท
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              ให้บริการดูแลรักษาโรคทางสมอง ไขสันหลัง และระบบประสาทส่วนกลาง ด้วยทีมแพทย์เฉพาะทางและเทคโนโลยีวินิจฉัยขั้นสูง
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
              src="/images/brain.jpeg" 
              alt="ศูนย์สมองและระบบประสาท"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Introduction */}
          <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-900 text-sm md:text-base">
              เราพร้อมให้การดูแลผู้ป่วยโรคหลอดเลือดสมอง (Stroke) โรคลมชัก โรคพาร์กินสัน และอาการปวดศีรษะเรื้อรัง
            </p>
            <p className="text-slate-500">
              ด้วยมาตรฐานการรักษาที่รวดเร็ว แม่นยำ และปลอดภัยตลอด 24 ชั่วโมง โดยทีมแพทย์ผู้ชำนาญการด้านระบบประสาทและสมองโดยเฉพาะ
            </p>
          </div>

          {/* Section 1: Services & Treatments */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-base md:text-lg font-bold text-[#1a2b6d]">
              การรักษาและบริการเฉพาะทาง
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">ศูนย์โรคหลอดเลือดสมอง (Stroke Center)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ดูแลผู้ป่วยฉุกเฉินด้วยกระบวนการรักษาที่รวดเร็วตามมาตรฐานสากล เพื่อช่วยชีวิตและลดความเสี่ยงภาวะความพิการ
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">การตรวจวินิจฉัยโรคทางระบบประสาท</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ตรวจคลื่นไฟฟ้าสมอง (EEG), ตรวจหลอดเลือดสมอง และการตรวจวินิจฉัยเชิงลึกด้วยเครื่องมือที่ทันสมัยแม่นยำสูง
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Specialized Clinic */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-base md:text-lg font-bold text-[#1a2b6d]">
              คลินิกเฉพาะทางเพิ่มเติม
            </h2>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="p-4 rounded-xl border border-slate-100 bg-blue-50/30 text-xs text-slate-700 font-medium">
                คลินิกโรคความจำเสื่อมและพาร์กินสัน (ดูแลผู้สูงอายุและวางแผนฟื้นฟูระยะยาว)
              </li>
              <li className="p-4 rounded-xl border border-slate-100 bg-blue-50/30 text-xs text-slate-700 font-medium">
                คลินิกดูแลรักษาอาการปวดศีรษะและไมเกรนเรื้อรัง
              </li>
            </ul>
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
              href="/booking?service=doctor&departmentId=8" 
              className="w-full sm:w-auto bg-[#1a2b6d] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-xs text-center"
            >
              ทำนัดหมายแพทย์สาขานี้ ➔
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}