'use client';

import Link from 'next/link';

export default function SurgeryServicePage() {
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
            <span className="text-white font-semibold">ศูนย์ศัลยกรรม</span>
          </div>
          
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold tracking-wider uppercase">
              Novaria Surgery Center
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              ศูนย์ศัลยกรรมเทคโนโลยีชั้นสูง
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              ให้บริการผ่าตัดรักษาโดยศัลยแพทย์ผู้เชี่ยวชาญเฉพาะทาง พร้อมเทคโนโลยีการผ่าตัดแผลเล็กที่ได้มาตรฐานสากล
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
              src="/images/sur.jpeg" 
              alt="ศูนย์ศัลยกรรม"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Introduction */}
          <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-900 text-sm md:text-base">
              มุ่งเน้นความปลอดภัยสูงสุด ลดอาการเจ็บปวด ฟื้นตัวได้เร็ว และลดภาวะแทรกซ้อนหลังการผ่าตัดตามมาตรฐานระดับสากล
            </p>
            <p className="text-slate-500">
              ด้วยห้องผ่าตัดอัจฉริยะที่เพียบพร้อมด้วยเครื่องมือปลอดเชื้อทันสมัย และทีมแพทย์ศัลยกรรมผู้ทรงคุณวุฒิที่พร้อมดูแลอย่างใกล้ชิด 
            </p>
          </div>

          {/* Section 1: Services & Treatments */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-base md:text-lg font-bold text-[#1a2b6d]">
              ประเภทการผ่าตัดและการบริการ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">การผ่าตัดผ่านกล้อง (Laparoscopic Surgery)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  เทคโนโลยีแผลเล็ก เจ็บน้อย เสียเลือดน้อย และใช้เวลาพักฟื้นร่างกายสั้น สามารถกลับไปใช้ชีวิตประจำวันได้ไวขึ้น
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">ศัลยกรรมทั่วไปและเฉพาะทาง</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  บริการผ่าตัดรักษาโรคทั่วไปและโรคเฉพาะทางซับซ้อน โดยทีมแพทย์ผู้ทรงคุณวุฒิและทีมพยาบาลวิชาชีพเฉพาะทาง
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
              href="/booking?service=doctor&departmentId=11" 
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