'use client';

import Link from 'next/link';

export default function BoneServicePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 pb-20 font-sans">
      
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-[#1a2b6d]">หน้าหลัก</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#1a2b6d]">บริการของเรา</Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">ศูนย์กระดูกและข้อ</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-8">
        
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">
            ศูนย์กระดูกและข้อ
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d]">
            คลินิกกระดูกและข้อ (Orthopedic Center)
          </h1>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-[280px] md:h-[380px] bg-slate-100">
          <img
            src="/images/bone.jpg" 
            alt="ศูนย์กระดูกและข้อ"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 text-sm md:text-base text-slate-600 leading-relaxed font-light">
          <p className="font-medium text-slate-800">
            บริการดูแลรักษาอาการบาดเจ็บและผ่าตัดข้อเทียมด้วยเทคโนโลยีหุ่นยนต์ช่วยผ่าตัดที่แม่นยำสูง
          </p>
          <p>
            เราให้บริการตรวจวินิจฉัยและรักษาอาการผิดปกติของกระดูก ข้อต่อ เส้นเอ็น และกล้ามเนื้อ ทุกกลุ่มอายุ ตั้งแต่อาการบาดเจ็บจากการเล่นกีฬา โรคข้อเสื่อม ไปจนถึงการผ่าตัดเปลี่ยนข้อเทียมโดยศัลยแพทย์ผู้เชี่ยวชาญเฉพาะทาง
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b6d]">
            การรักษาและบริการเฉพาะทาง
          </h2>
          
          <ul className="space-y-3 text-sm text-slate-600 list-disc pl-5 leading-relaxed">
            <li>
              <strong className="text-slate-800">การผ่าตัดเปลี่ยนข้อเข่าและข้อสะโพกเทียม:</strong> ด้วยเทคโนโลยีแผลเล็ก ฟื้นตัวไว
            </li>
            <li>
              <strong className="text-slate-800">เวชศาสตร์การกีฬา (Sports Medicine):</strong> รักษาอาการบาดเจ็บจากนักกีฬาและการส่องกล้องข้อไหล่ ข้อเข่า
            </li>
            <li>
              <strong className="text-slate-800">คลินิกกระดูกสันหลัง:</strong> รักษาอาการปวดหลัง หมอนรองกระดูกทับเส้นประสาท
            </li>
          </ul>
        </div>

        <div className="pt-8 flex justify-between items-center border-t border-slate-200">
          <Link href="/services" className="text-xs text-slate-500 hover:text-[#1a2b6d] font-medium">
            ⬅ กลับสู่หน้าบริการทั้งหมด
          </Link>
          <Link 
            href="/booking?service=bone" 
            className="bg-[#1a2b6d] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition"
          >
            ทำนัดหมายแพทย์สาขานี้ ➔
          </Link>
        </div>

      </main>
    </div>
  );
}