'use client';

import Link from 'next/link';

export default function EmergencyServicePage() {
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
            <span className="text-white font-semibold">ศูนย์อุบัติเหตุและฉุกเฉิน</span>
          </div>
          
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-semibold tracking-wider uppercase border border-red-500/30">
              Novaria Emergency 24 Hours
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              หน่วยแพทย์ฉุกเฉิน 24 ชั่วโมง
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              พร้อมให้ความช่วยเหลือทางการแพทย์ในภาวะวิกฤตตลอด 24 ชั่วโมง ด้วยทีมแพทย์ฉุกเฉินและรถพยาบาลพร้อมอุปกรณ์ช่วยชีวิตครบครัน
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
              src="/images/emer.jpg" 
              alt="ศูนย์อุบัติเหตุและฉุกเฉิน"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Introduction */}
          <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-900 text-sm md:text-base">
              เรามีระบบประสานงานส่งต่อผู้ป่วยวิกฤตและอุบัติเหตุอย่างรวดเร็ว ปลอดภัย ได้มาตรฐานสากล
            </p>
            <p className="text-slate-500">
              เพื่อให้ผู้ป่วยได้รับการดูแลช่วยเหลืออย่างทันท่วงทีในทุกนาทีชีวิต มั่นใจได้ด้วยศักยภาพความพร้อมในยามฉุกเฉินตลอดเวลา
            </p>
          </div>

          {/* Section 1: Services & Emergency Care */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-base md:text-lg font-bold text-[#1a2b6d]">
              บริการความช่วยเหลือฉุกเฉิน
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">หน่วยแพทย์เคลื่อนที่เร็ว (Ambulance)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  พร้อมทีมพยาบาลวิชาชีพและเวชกรฉุกเฉินออกปฏิบัติการช่วยเหลือและรับส่งผู้ป่วยตลอด 24 ชม.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <h3 className="font-bold text-xs text-slate-900">ห้องฉุกเฉินวิกฤต (ER)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  เพียบพร้อมด้วยเครื่องมือช่วยชีวิตขั้นสูง และมีแพทย์เฉพาะทางด้านเวชศาสตร์ฉุกเฉินประจำการตลอดเวลา
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
              href="/contact" 
              className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-red-700 transition shadow-xs text-center"
            >
              ติดต่อฉุกเฉินทันที ➔
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}