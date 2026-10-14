'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PackageItem {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  price: string;
  originalPrice?: string;
  tag?: string;
  imageUrl?: string;
}

export default function DiabetesPage() {
  const [recommendedPackages, setRecommendedPackages] = useState<PackageItem[]>([]);

  useEffect(() => {
    // ดึงข้อมูลแพ็กเกจจาก API และเลือกแพ็กเกจที่ตรงกับโรคเบาหวานโดยอัตโนมัติ
    fetch('/api/packages')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          // กรองทุกแพ็กเกจที่มีคำว่า "เบาหวาน" หรือ "น้ำตาล" หรือ "dm"
          const matchedPkgs = result.data.filter((pkg: PackageItem) => {
            const title = (pkg.title || '').toLowerCase();
            return (
              title.includes('เบาหวาน') || 
              title.includes('น้ำตาล') ||
              title.includes('dm')
            );
          });

          // ถ้าเจอให้แสดงทั้งหมด ถ้าไม่เจอก็ไม่ต้องแสดง
          setRecommendedPackages(matchedPkgs .length > 0 ? matchedPkgs : []);
        }
      })
      .catch((err) => console.error('Failed to fetch package:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      
      {/* 🏥 HEADER BANNER - EXECUTIVE ACCENT BAR STYLE (คงเดิมตามสั่ง ห้ามแตะต้อง) */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div className="space-y-3">
            <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
              <span className="text-slate-300">/</span>
              <Link href="/health" className="hover:text-[#1a2b6d] transition-colors">บทความสุขภาพ</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">โรคเบาหวาน (Diabetes Mellitus)</span>
            </nav>

            <div className="pl-4 border-l-4 border-[#1a2b6d] py-0.5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight leading-tight">
                  บทความ และ <span className="font-semibold text-[#1a2b6d]">สาระสุขภาพ</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
                  รวบรวมบทความสุขภาพ โรคและการรักษา การดูแลตัวเอง และคำแนะนำจากแพทย์ผู้เชี่ยวชาญโรงพยาบาลโนวาเลีย
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA ตามเรเฟอเรนซ์ */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-12 space-y-10">
        
        {/* หัวข้อโรคตรงกลางหน้า */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d] tracking-tight">
            โรคเบาหวาน (Diabetes Mellitus)
          </h2>
          <div className="h-1 w-16 bg-[#1a2b6d] mx-auto rounded-full"></div>
        </div>

        {/* รูปภาพประกอบขนาดใหญ่ตรงกลาง */}
        <div className="relative h-72 md:h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-200/65">
          <img
            src="/images/b.jpg"
            alt="โรคเบาหวาน (Diabetes Mellitus)"
            className="w-full h-full object-cover"
          />
        </div>

        {/* เนื้อหาบทความ */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-700">
          
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">ประเภทของโรคเบาหวาน</h3>
            <ul className="pl-6 space-y-1.5 list-disc">
              <li>ร่างกายไม่ผลิตอินซูลิน</li>
              <li>เกิดจากภาวะดื้ออินซูลิน</li>
              <li>เกิดเฉพาะช่วงตั้งครรภ์ เสี่ยงเป็นเบาหวานในอนาคต</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">อาการ</h3>
            <ul className="pl-6 space-y-1.5 list-disc">
              <li>ปัสสาวะบ่อย</li>
              <li>หิวน้ำบ่อย</li>
              <li>น้ำหนักลดผิดปกติ</li>
              <li>เหนื่อยง่าย แผลหายช้า</li>
              <li>ตาพร่ามัว</li>
              <li>ผู้ป่วยบางรายอาจไม่มีอาการ</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">ปัจจัยเสี่ยง</h3>
            <ul className="pl-6 space-y-1.5 list-disc">
              <li>น้ำหนักเกินหรือโรคอ้วน</li>
              <li>ขาดการออกกำลังกาย</li>
              <li>มีประวัติครอบครัวเป็นเบาหวาน</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">การป้องกันและดูแล</h3>
            <ul className="pl-6 space-y-1.5 list-disc">
              <li>ควบคุมน้ำหนัก</li>
              <li>รับประทานอาหารที่เหมาะสม งดอาหารมัน รสจัด และเครื่องดื่มน้ำตาลสูง</li>
              <li>ออกกำลังกายสม่ำเสมอ</li>
              <li>แนะนำตรวจสุขภาพประจำปี</li>
            </ul>
          </div>

          <div className="space-y-2 bg-sky-50/60 border border-sky-100 p-6 rounded-2xl">
            <h3 className="font-bold text-[#1a2b6d] text-lg">สำหรับผู้ป่วยเบาหวาน</h3>
            <ul className="pl-6 space-y-1.5 list-disc text-slate-800">
              <li>ควรปฏิบัติตามคำแนะนำแพทย์อย่างเคร่งครัด</li>
              <li>ควบคุมอาหาร</li>
              <li>ตรวจน้ำตาลปลายนิ้วสม่ำเสมอ</li>
              <li>หมั่นตรวจสุขภาพเท้า</li>
              <li>ระวังแผลเรื้อรัง</li>
              <li>อย่าหยุดยาเอง</li>
            </ul>
          </div>

        </div>

       {/* ส่วนแพ็กเกจแนะนำ (แสดงเฉพาะเมื่อมีแพ็กเกจที่ตรงกันเท่านั้น) */}
        {recommendedPackages.length > 0 && (
          <div className="pt-10 border-t border-slate-200/80 space-y-6">
            <h3 className="text-xl font-bold text-[#1a2b6d] text-center">
              แพ็กเกจแนะนำสำหรับคุณ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendedPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 w-full bg-slate-100">
                      <img
                        src={pkg.imageUrl || '/images/default-package.jpg'}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-slate-800 text-xs md:text-sm line-clamp-1">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-[#1a2b6d] font-bold">
                        ราคา {pkg.price}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="block w-full py-2 text-center bg-[#1a2b6d] text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition"
                    >
                      อ่านเพิ่ม
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ลิงก์บทความก่อนหน้า / ถัดไป ด้านล่างสุดตามเรฟ */}
        <div className="pt-8 border-t border-slate-200/80 flex justify-between items-center text-xs md:text-sm font-semibold text-[#1a2b6d]">
          <Link href="/health/dyslipidemia" className="hover:underline flex items-center gap-1">
            ← โรคไขมันในเลือดสูง (Dyslipidemia)
          </Link>
          <Link href="/health/hypertension" className="hover:underline flex items-center gap-1">
            ความดันโลหิตสูง (Hypertension) →
          </Link>
        </div>

      </main>
    </div>
  );
}