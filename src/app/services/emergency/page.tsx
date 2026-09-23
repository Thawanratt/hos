'use client';

import Link from 'next/link';

export default function EmergencyServicePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 pb-20 font-sans">
      
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-[#1a2b6d]">หน้าหลัก</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#1a2b6d]">บริการของเรา</Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">ศูนย์อุบัติเหตุและฉุกเฉิน</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-8">
        
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">
            ศูนย์อุบัติเหตุและฉุกเฉิน
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d]">
            หน่วยแพทย์ฉุกเฉิน 24 ชั่วโมง (Emergency Center)
          </h1>
        </div>

       
     <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-[280px] md:h-[380px] bg-slate-100">
          <img
            src="/images/emer.jpg" 
            alt="ศูนย์อุบัติเหตุและฉุกเฉิน"
            className="w-full h-full object-cover"
          />
        </div>
        

        <div className="space-y-4 text-sm md:text-base text-slate-600 leading-relaxed font-light">
          <p className="font-medium text-slate-800">
            พร้อมให้ความช่วยเหลือทางการแพทย์ในภาวะวิกฤตตลอด 24 ชั่วโมง ด้วยทีมแพทย์ฉุกเฉินและรถพยาบาลพร้อมอุปกรณ์ช่วยชีวิตครบครัน
          </p>
          <p>
            เรามีระบบประสานงานส่งต่อผู้ป่วยวิกฤตและอุบัติเหตุอย่างรวดเร็ว ปลอดภัย ได้มาตรฐานสากล เพื่อให้ผู้ป่วยได้รับการดูแลช่วยเหลืออย่างทันท่วงทีในทุกนาทีชีวิต
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b6d]">
            บริการความช่วยเหลือฉุกเฉิน
          </h2>
          
          <ul className="space-y-3 text-sm text-slate-600 list-disc pl-5 leading-relaxed">
            <li>
              <strong className="text-slate-800">หน่วยแพทย์เคลื่อนที่เร็ว (Ambulance):</strong> พร้อมทีมพยาบาลวิชาชีพออกปฏิบัติการตลอด 24 ชม.
            </li>
            <li>
              <strong className="text-slate-800">ห้องฉุกเฉินวิกฤต (ER):</strong> เพียบพร้อมด้วยเครื่องมือช่วยชีวิตและแพทย์เฉพาะทางประจำการ
            </li>
          </ul>
        </div>

        <div className="pt-8 flex justify-between items-center border-t border-slate-200">
          <Link href="/services" className="text-xs text-slate-500 hover:text-[#1a2b6d] font-medium">
            ⬅ กลับสู่หน้าบริการทั้งหมด
          </Link>
          <Link 
            href="/contact" 
            className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-700 transition"
          >
            ติดต่อฉุกเฉินทันที ➔
          </Link>
        </div>

      </main>
    </div>
  );
}