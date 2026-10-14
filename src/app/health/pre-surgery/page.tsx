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

export default function PreSurgeryPage() {
  const [recommendedPackages, setRecommendedPackages] = useState<PackageItem[]>([]);

  useEffect(() => {
    // ค้นหาแพ็กเกจที่ตรงกับการผ่าตัดหรือตรวจสุขภาพก่อนผ่าตัดโดยอัตโนมัติจาก API
    fetch('/api/packages')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          // กรองทุกแพ็กเกจที่มีคำว่า "ผ่าตัด" หรือ "ศัลยกรรม" หรือ "เตรียม"
          const matchedPkgs = result.data.filter((pkg: PackageItem) => {
            const title = (pkg.title || '').toLowerCase();
            return (
              title.includes('ผ่าตัด') || 
              title.includes('ศัลยกรรม') ||
              title.includes('เตรียม')
            );
          });

          // ถ้าเจอให้แสดงทั้งหมด ถ้าไม่เจอก็ไม่ต้องแสดงอะไรเลย
          setRecommendedPackages(matchedPkgs.length > 0 ? matchedPkgs : []);
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
              <span className="text-slate-600 font-semibold">การเตรียมตัวก่อนการผ่าตัด</span>
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
            การเตรียมตัวก่อนการผ่าตัด (Pre-Surgery Preparation)
          </h2>
          <div className="h-1 w-16 bg-[#1a2b6d] mx-auto rounded-full"></div>
        </div>

        {/* รูปภาพประกอบขนาดใหญ่ตรงกลาง */}
        <div className="relative h-72 md:h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-200/65">
          <img
            src="/images/l.jpeg"
            alt="การเตรียมตัวก่อนการผ่าตัด"
            className="w-full h-full object-cover"
          />
        </div>

        {/* เนื้อหาบทความ */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-700">
          
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">ความสำคัญของการเตรียมตัวก่อนผ่าตัด</h3>
            <p>
              การเตรียมความพร้อมทั้งทางร่างกายและจิตใจก่อนเข้ารับการผ่าตัดถือเป็นขั้นตอนสำคัญอย่างยิ่งที่จะช่วยให้การผ่าตัดดำเนินไปอย่างราบรื่น ลดความเสี่ยงในการเกิดภาวะแทรกซ้อนระหว่างการระงับความรู้สึกและการผ่าตัด พร้อมทั้งช่วยให้ร่างกายฟื้นตัวได้อย่างรวดเร็วหลังการรักษา
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">1. การเตรียมตัวด้านร่างกาย</h3>
            <ul className="pl-6 space-y-2 list-disc">
              <li><strong>การงดน้ำและอาหาร:</strong> โดยทั่วไปผู้ป่วยจะต้องงดน้ำและอาหารอย่างน้อย 6-8 ชั่วโมงก่อนเวลาผ่าตัด (ตามคำแนะนำของแพทย์หรือวิสัญญีแพทย์อย่างเคร่งครัด) เพื่อป้องกันภาวะสำลักเศษอาหารเข้าสู่ปอดขณะดมยาสลบ</li>
              <li><strong>การจัดการเรื่องยาและอาหารเสริม:</strong> หากท่านมีโรคประจำตัวและต้องรับประทานยาละลายหัวใจ ยาต้านการแข็งตัวของเลือด หรืออาหารเสริมสมุนไพรบางชนิด จะต้องแจ้งแพทย์ให้ทราบล่วงหน้า เนื่องจากอาจจำเป็นต้องหยุดยาก่อนผ่าตัด</li>
              <li><strong>การทำความสะอาดร่างกาย:</strong> อาบน้ำสระผมให้สะอาดในวันผ่าตัด งดการแต่งหน้า ทาเล็บ หรือใช้งานเครื่องสำอาง เพื่อให้ทีมแพทย์สามารถสังเกตสีผิวและเล็บได้อย่างชัดเจน</li>
              <li><strong>การถอดสิ่งแปลกปลอม:</strong> ควรถอดเครื่องประดับ ฟันปลอม คอนแทคเลนส์ หรือวิกผมออกให้เรียบร้อยก่อนเข้าห้องผ่าตัด</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">2. การเตรียมตัวด้านจิตใจ</h3>
            <p>
              ความกังวลเป็นเรื่องปกติที่เกิดขึ้นได้ก่อนผ่าตัด การทำความเข้าใจขั้นตอนการรักษาพูดคุยซักถามข้อสงสัยกับศัลยแพทย์และวิสัญญีแพทย์ล่วงหน้า จะช่วยลดความวิตกกังวลและสร้างความมั่นใจให้แก่ผู้ป่วยและญาติได้มากยิ่งขึ้น
            </p>
          </div>

          <div className="space-y-3 bg-sky-50/60 border border-sky-100 p-6 rounded-2xl">
            <h3 className="font-bold text-[#1a2b6d] text-lg">คำแนะนำสำหรับญาติและผู้ดูแล</h3>
            <p className="text-slate-800">
              ญาติควรเตรียมเอกสารสำคัญ เช่น บัตรประชาชน ประกันสุขภาพ หรือประวัติการแพ้ยาให้พร้อม อยู่รอฟังคำชี้แจงจากแพทย์ทันทีหลังการผ่าตัดเสร็จสิ้น และจัดเตรียมห้องพักฟื้นหรือที่พักอาศัยให้เหมาะสมกับการดูแลผู้ป่วยหลังกลับบ้าน
            </p>
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
          <Link href="/health/food-safety" className="hover:underline flex items-center gap-1">
            ← คำแนะนำการใช้ยาอย่างปลอดภัย
          </Link>
          <Link href="/health" className="hover:underline flex items-center gap-1">
            กลับหน้าบทความทั้งหมด →
          </Link>
        </div>

      </main>
    </div>
  );
}