'use client';

import Link from 'next/link';

export default function BoneServicePage() {
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
            <span className="text-white font-semibold">ศูนย์กระดูกและข้อ</span>
          </div>
          
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold tracking-wider uppercase">
              Novaria Orthopedic Center
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              คลินิกกระดูกและข้อ
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              บริการดูแลรักษาอาการบาดเจ็บและผ่าตัดข้อเทียมด้วยเทคโนโลยีหุ่นยนต์ช่วยผ่าตัดที่แม่นยำสูง พร้อมทีมศัลยแพทย์ผู้เชี่ยวชาญเฉพาะทาง
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
              src="/images/bone.jpg" 
              alt="ศูนย์กระดูกและข้อ"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Introduction */}
          <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-900 text-sm md:text-base">
              เราให้บริการตรวจวินิจฉัยและรักษาอาการผิดปกติของกระดูก ข้อต่อ เส้นเอ็น และกล้ามเนื้อ ครบวงจรทุกกลุ่มอายุ
            </p>
            <p className="text-slate-500">
              ตั้งแต่การรักษาอาการบาดเจ็บจากการเล่นกีฬา โรคข้อเสื่อม ไปจนถึงการผ่าตัดเปลี่ยนข้อเทียมด้วยเทคโนโลยีขั้นสูง มั่นใจได้ในมาตรฐานความปลอดภัยและการดูแลอย่างใกล้ชิด
            </p>
          </div>

          {/* Section 1: Services & Treatments */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-base md:text-lg font-bold text-[#1a2b6d]">
              การรักษาและบริการเฉพาะทาง
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">การผ่าตัดข้อเข่าและข้อสะโพกเทียม</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  บริการผ่าตัดเปลี่ยนข้อเทียมด้วยเทคโนโลยีแผลเล็ก เจ็บน้อย และฟื้นตัวไว สามารถกลับมาใช้ชีวิตประจำวันได้รวดเร็ว
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">เวชศาสตร์การกีฬา (Sports Medicine)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  รักษาอาการบาดเจ็บของนักกีฬาและการส่องกล้องข้อไหล่ ข้อเข่า พร้อมฟื้นฟูสมรรถภาพร่างกายอย่างเต็มรูปแบบ
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
                คลินิกกระดูกสันหลัง (รักษาอาการปวดหลังและหมอนรองกระดูกทับเส้นประสาท)
              </li>
              <li className="p-4 rounded-xl border border-slate-100 bg-blue-50/30 text-xs text-slate-700 font-medium">
                ศูนย์อุบัติเหตุและกระดูกหักเฉียบพลันตลอด 24 ชั่วโมง
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
              href="/booking?service=doctor&departmentId=7" 
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