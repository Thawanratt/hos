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

export default function OsteoarthritisPage() {
  const [recommendedPackages, setRecommendedPackages] = useState<PackageItem[]>([]);

  useEffect(() => {
    // ค้นหาแพ็กเกจที่ตรงกับโรคข้อเข่าเสื่อมหรือกระดูกโดยอัตโนมัติจาก API
    fetch('/api/packages')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          // กรองทุกแพ็กเกจที่มีคำว่า "เข่า" หรือ "ข้อ" หรือ "กระดูก"
          const matchedPkgs = result.data.filter((pkg: PackageItem) => {
            const title = (pkg.title || '').toLowerCase();
            return (
              title.includes('เข่า') || 
              title.includes('ข้อ') ||
              title.includes('กระดูก')
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
              <span className="text-slate-600 font-semibold">ข้อเข่าเสื่อม (Osteoarthritis)</span>
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
            ข้อเข่าเสื่อม (Osteoarthritis Of The Knee)
          </h2>
          <div className="h-1 w-16 bg-[#1a2b6d] mx-auto rounded-full"></div>
        </div>

        {/* รูปภาพประกอบขนาดใหญ่ตรงกลาง */}
        <div className="relative h-72 md:h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-200/65">
          <img
            src="/images/d.jpeg"
            alt="ข้อเข่าเสื่อม (Osteoarthritis)"
            className="w-full h-full object-cover"
          />
        </div>

        {/* เนื้อหาบทความ */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-700">
          
          <div className="space-y-2">
            <p>
              <strong>ข้อเข่าเสื่อม</strong> เป็นโรคที่เกิดจากการเสื่อมสภาพของกระดูกอ่อนในข้อเข่า ทำให้เกิดอาการเจ็บ ปวด บวม หรือมีเสียงดังกรอบแกรบเมื่อเคลื่อนไหว โดยมักพบในผู้สูงอายุหรือผู้ที่มีน้ำหนักตัวมาก รวมถึงผู้ที่เคยบาดเจ็บที่เข่าหรือมีกิจกรรมที่ใช้ข้อเข่าหนักเป็นเวลานาน (Mayo Clinic, 2023) อาการที่ควรระวัง ได้แก่ ปวดเข่าเวลาขึ้น-ลงบันได นั่งนานแล้วลุกไม่สะดวก หรือข้อเข่าฝืดหลังตื่นนอน
            </p>
          </div>

          <div className="space-y-2">
            <p>
              การดูแลข้อเข่าเสื่อมเริ่มจากการปรับพฤติกรรม เช่น ควบคุมน้ำหนักตัว ออกกำลังกายเสริมสร้างกล้ามเนื้อรอบเข่า และหลีกเลี่ยงการใช้งานเข่าหนักเกินไป นอกจากนี้แพทย์อาจแนะนำการใช้ยาเพื่อบรรเทาอาการปวด หรือการฉีดสารหล่อลื่นข้อเข่าเพื่อช่วยลดแรงเสียดทานของข้อ (World Health Organization, 2022)
            </p>
          </div>

          <div className="space-y-2 bg-sky-50/60 border border-sky-100 p-6 rounded-2xl">
            <h3 className="font-bold text-[#1a2b6d] text-lg">บริการผ่าตัดเปลี่ยนข้อเข่าเทียม</h3>
            <p className="text-slate-800">
              สำหรับผู้ป่วยที่มีข้อเข่าเสื่อมขั้นรุนแรง และการรักษาแบบไม่ผ่าตัดไม่ได้ผล โรงพยาบาลของเรามีบริการ <strong>ผ่าตัดเปลี่ยนข้อเข่าเทียม (Total Knee Replacement)</strong> ซึ่งเป็นวิธีที่ช่วยฟื้นฟูการเคลื่อนไหว ลดอาการปวด และปรับปรุงคุณภาพชีวิตของผู้ป่วยให้กลับมาทำกิจวัตรประจำวันได้ใกล้เคียงปกติ ทีมศัลยแพทย์ผู้เชี่ยวชาญและอุปกรณ์ทันสมัยของโรงพยาบาลช่วยให้ผู้ป่วยได้รับการรักษาที่ปลอดภัยและมีประสิทธิภาพ
            </p>
          </div>

          <div className="space-y-2">
            <p>
              หากคุณหรือคนใกล้ชิดมีอาการปวดเข่าต่อเนื่อง หรือสงสัยว่ามีข้อเข่าเสื่อม สามารถปรึกษาแพทย์ผู้เชี่ยวชาญเพื่อรับการวินิจฉัยและวางแผนการรักษาที่เหมาะสมได้ที่โรงพยาบาลของเรา
            </p>
          </div>

          {/* ส่วนคำถามที่พบบ่อย (FAQ) */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg text-[#1a2b6d]">คำถามที่พบบ่อย</h3>
            
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-800">Q1: ใครบ้างที่ควรพิจารณาผ่าตัดข้อเข่าเทียม?</p>
                <p className="text-slate-600 mt-1">A: ผู้ที่มีข้อเข่าเสื่อมขั้นรุนแรง ปวดเข่าเรื้อรัง และการรักษาแบบไม่ผ่าตัดไม่ได้ผล หรือผู้ที่คุณภาพชีวิตลดลงจากอาการข้อเข่าเสื่อม</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-800">Q2: การผ่าตัดปลอดภัยหรือไม่?</p>
                <p className="text-slate-600 mt-1">A: การผ่าตัดเปลี่ยนข้อเข่าเทียมมีความปลอดภัยสูงเมื่อดำเนินการโดยศัลยแพทย์ผู้เชี่ยวชาญ และมีการเตรียมตัวก่อนผ่าตัด รวมถึงการฟื้นฟูหลังผ่าตัดอย่างเหมาะสม</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-800">Q3: ต้องพักฟื้นนานแค่ไหนหลังผ่าตัด?</p>
                <p className="text-slate-600 mt-1">A: โดยทั่วไปผู้ป่วยสามารถเริ่มเคลื่อนไหวและเดินด้วยไม้พยุงภายใน 1-2 วันหลังผ่าตัด และฟื้นฟูเต็มที่มักใช้เวลา 6-12 สัปดาห์ ขึ้นอยู่กับสุขภาพและการปฏิบัติตามคำแนะนำของแพทย์</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-800">Q4: ข้อเข่าเทียมสามารถใช้งานได้กี่ปี?</p>
                <p className="text-slate-600 mt-1">A: ข้อเข่าเทียมสมัยใหม่สามารถใช้งานได้นาน 15-20 ปี ขึ้นอยู่กับกิจกรรม การดูแลรักษา และน้ำหนักตัวของผู้ป่วย</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-800">Q5: มีความเสี่ยงหรือผลข้างเคียงอะไรบ้าง?</p>
                <p className="text-slate-600 mt-1">A: ความเสี่ยงอาจมี เช่น การติดเชื้อ การเลือดออก หรือปัญหาเรื่องข้อเทียม แต่โอกาสเกิดภาวะแทรกซ้อนต่ำ หากปฏิบัติตามคำแนะนำของทีมแพทย์</p>
              </div>
            </div>
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
            ← ไขมันในเลือดสูง (Dyslipidemia)
          </Link>
          <Link href="/health/liver-cancer" className="hover:underline flex items-center gap-1">
            โรคมะเร็งตับ (Liver Cancer) →
          </Link>
        </div>

      </main>
    </div>
  );
}