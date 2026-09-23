'use client';

import Link from 'next/link';

export default function ServiceDetailPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 pb-20 font-sans">
      
      {/* Breadcrumb / Navbar เล็กๆ ด้านบน */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-[#1a2b6d]">หน้าหลัก</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#1a2b6d]">บริการของเรา</Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">คลินิกอายุรกรรมโรคหัวใจ</span>
        </div>
      </div>

      {/* MAIN ARTICLE CONTAINER */}
      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-8">
        
        {/* หัวข้อหน้า และหมวดหมู่ศูนย์ */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">
            ศูนย์โรคหัวใจ
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d]">
            คลินิกอายุรกรรมโรคหัวใจ
          </h1>
        </div>

        {/* รูปภาพประกอบบทความ */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-[280px] md:h-[380px] bg-slate-100">
          <img
            src="/images/1.jpg" 
            alt="คลินิกอายุรกรรมโรคหัวใจ"
            className="w-full h-full object-cover"
          />
        </div>

        {/* ย่อหน้าเกริ่นนำ (Paragraph) */}
        <div className="space-y-4 text-sm md:text-base text-slate-600 leading-relaxed font-light">
          <p className="font-medium text-slate-800">
            คลินิกอายุรกรรมโรคหัวใจให้บริการรักษาผู้ป่วยโรคหัวใจตามมาตรฐานทัดเทียมกับต่างประเทศ
          </p>
          <p>
            โรงพยาบาลหัวใจของเราก่อตั้งขึ้นเพื่อบริการรักษาผู้ป่วยโรคหัวใจตามมาตรฐานทัดเทียมกับต่างประเทศและเพื่อเผยแพร่ความรู้ให้คนไทยรู้จักการป้องกันและดูแลรักษาสุขภาพหัวใจให้แข็งแรง บุคลากรทางการแพทย์ประกอบด้วยแพทย์ผู้ชำนาญการในการตรวจวินิจฉัย รักษา และผ่าตัด รวมถึงให้บริการบำบัดรักษาและฟื้นฟูหัวใจครบทุกสาชาทั้งผู้ใหญ่และเด็ก
          </p>
        </div>

        {/* หัวข้อย่อยบริการที่ 1: บริการตรวจวินิจฉัยโรคหัวใจ */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b6d]">
            บริการตรวจวินิจฉัยโรคหัวใจ
          </h2>
          
          <ul className="space-y-3 text-sm text-slate-600 list-disc pl-5 leading-relaxed">
            <li>
              <strong className="text-slate-800">การตรวจด้วยอุปกรณ์พิเศษภายนอกร่างกาย:</strong> การตรวจคลื่นไฟฟ้าหัวใจ, การตรวจหัวใจด้วยคลื่นเสียงสะท้อนความถี่สูง, การตรวจสมรรถภาพหัวใจขณะออกกำลังกาย, การบันทึกคลื่นหัวใจ 24 ชั่วโมง รวมถึงการเฝ้าระวังความผิดปกติ
            </li>
            <li>
              <strong className="text-slate-800">การทำหัตถการแบบ Invasive:</strong> เป็นการตรวจวินิจฉัยโดยการใส่สายสวนหัวใจ
            </li>
            <li>
              <strong className="text-slate-800">การตรวจรังสีวินิจฉัย</strong>
            </li>
            <li>
              <span className="text-slate-700 font-semibold block pt-1">การรักษาโรคหัวใจ:</span>
              <ul className="list-[circle] pl-5 pt-1 space-y-1.5 text-slate-600">
                <li>การทำหัตถการรักษารักษาโรคกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน</li>
                <li>การทำหัตถการรักษาโรคหัวใจ (Interventional Cardiology)</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* หัวข้อย่อยบริการที่ 2: บริการด้านโรคหัวใจ */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b6d]">
            บริการด้านโรคหัวใจ
          </h2>
          
          <ul className="space-y-2.5 text-sm text-slate-600 list-disc pl-5 leading-relaxed">
            <li>การตรวจรักษาโรคของหลอดเลือดที่ไม่ใช่หลอดเลือดหัวใจ (Peripheral Vascular Disease)</li>
            <li>ภาวะหัวใจอ่อนกำลัง</li>
            <li>คลินิกป้องกันโรคหัวใจและลดไขมัน</li>
          </ul>
        </div>

        {/* ปุ่มกลับหรือปุ่มทำนัดหมายท้ายบทความ */}
        <div className="pt-8 flex justify-between items-center border-t border-slate-200">
          <Link href="/services" className="text-xs text-slate-500 hover:text-[#1a2b6d] font-medium">
            ⬅ กลับสู่หน้าบริการทั้งหมด
          </Link>
          <Link 
            href="/booking?service=doctor" 
            className="bg-[#1a2b6d] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-2xs"
          >
            ทำนัดหมายแพทย์สาขานี้ ➔
          </Link>
        </div>

      </main>
    </div>
  );
}