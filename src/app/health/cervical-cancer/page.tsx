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

export default function CervicalCancerPage() {
  const [recommendedPackages, setRecommendedPackages] = useState<PackageItem[]>([]);

  useEffect(() => {
    // ค้นหาแพ็กเกจที่ตรงกับโรคมะเร็งปากมดลูกหรือวัคซีน HPV โดยอัตโนมัติจาก API
    fetch('/api/packages')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          const matchedPkgs = result.data.filter((pkg: PackageItem) => {
            const title = (pkg.title || '').toLowerCase();
            return (
              title.includes('ปากมดลูก') || 
              title.includes('hpv') ||
              title.includes('มะเร็ง')
            );
          });

          // ถ้าเจอให้แสดงทั้งหมด ถ้าไม่เจอค่อยเอาตัวแรกมากันเหนียว
          setRecommendedPackages(matchedPkgs.length > 0 ? matchedPkgs : [result.data[0]]);
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
              <span className="text-slate-600 font-semibold">โรคมะเร็งปากมดลูก (Cervical Cancer)</span>
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
            โรคมะเร็งปากมดลูก (Cervical Cancer)
          </h2>
          <div className="h-1 w-16 bg-[#1a2b6d] mx-auto rounded-full"></div>
        </div>

        {/* รูปภาพประกอบขนาดใหญ่ตรงกลาง */}
        <div className="relative h-72 md:h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-200/65">
          <img
            src="/images/h.jpg"
            alt="โรคมะเร็งปากมดลูก (Cervical Cancer)"
            className="w-full h-full object-cover"
          />
        </div>

        {/* เนื้อหาบทความ */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-700">
          
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">ป้องกัน เฝ้าระวัง ห่างไกลโรค</h3>
            <p>
              มะเร็งปากมดลูกเป็นโรคมะเร็งที่พบมากในสตรี โดยเกิดจากการเจริญเติบโตของเซลล์ผิดปกติบริเวณปากมดลูก ซึ่งเป็นส่วนเชื่อมระหว่างมดลูกและช่องคลอด สาเหตุสำคัญที่พบมากที่สุดคือการติดเชื้อไวรัส <strong>HPV (Human Papillomavirus)</strong> ซึ่งติดต่อได้ผ่านการมีเพศสัมพันธ์ เชื้อ HPV บางสายพันธุ์ โดยเฉพาะสายพันธุ์ 16 และ 18 มีความเสี่ยงสูงในการก่อให้เกิดมะเร็งปากมดลูก
            </p>
            <p>
              ในระยะแรกของโรคมะเร็งปากมดลูก อาจไม่มีอาการชัดเจน จึงทำให้หลายคนตรวจพบโรคเมื่ออยู่ในระยะลุกลาม อาการที่ควรเฝ้าระวัง ได้แก่
            </p>
            <ul className="pl-6 space-y-1.5 list-disc">
              <li>เลือดออกจากช่องคลอดผิดปกติ (โดยเฉพาะหลังมีเพศสัมพันธ์)</li>
              <li>ตกขาวผิดปกติ มีกลิ่นหรือมีเลือดปน</li>
              <li>ปวดท้องน้อยหรือปวดหลังเรื้อรัง</li>
              <li>น้ำหนักลดโดยไม่ทราบสาเหตุ</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">การป้องกันและการตรวจคัดกรอง</h3>
            <p>การป้องกันมะเร็งปากมดลูกสามารถทำได้โดย</p>
            <ol className="pl-6 space-y-2 list-decimal">
              <li><strong>ฉีดวัคซีนป้องกันเชื้อ HPV</strong> ซึ่งช่วยป้องกันสายพันธุ์ที่มีความเสี่ยงสูง</li>
              <li><strong>ตรวจคัดกรองสม่ำเสมอ</strong> เช่น การตรวจคัดกรองมะเร็งปากมดลูก (Thin prep &reg;) และ/หรือการตรวจ HPV DNA เพื่อค้นหาความผิดปกติตั้งแต่ระยะก่อนเกิดมะเร็ง</li>
              <li><strong>ส่องกล้องตรวจปากมดลูก (Colposcopy)</strong> ในกรณีพบผลตรวจผิดปกติ เพื่อดูรายละเอียดของเซลล์และเนื้อเยื่อ</li>
            </ol>
            <p className="pt-2">
              องค์การอนามัยโลก (WHO) แนะนำให้ผู้หญิงที่มีอายุ 30 ปีขึ้นไปตรวจคัดกรองมะเร็งปากมดลูกเป็นประจำ เนื่องจากการตรวจพบตั้งแต่ระยะแรกสามารถรักษาให้หายขาดได้ และเพิ่มโอกาสรอดชีวิตสูงถึงกว่า 90%
            </p>
          </div>

          <div className="space-y-2 bg-sky-50/60 border border-sky-100 p-6 rounded-2xl">
            <h3 className="font-bold text-[#1a2b6d] text-lg">บริการตรวจและป้องกันมะเร็งปากมดลูกที่โรงพยาบาลของเรา</h3>
            <p className="text-slate-800">โรงพยาบาลของเราพร้อมให้บริการแบบครบวงจรเพื่อดูแลสุขภาพสตรี ได้แก่</p>
            <ul className="pl-6 space-y-1.5 list-disc text-slate-800">
              <li><strong>ตรวจคัดกรองมะเร็งปากมดลูก (Thin prep &reg; / HPV DNA Test)</strong> ด้วยเทคโนโลยีมาตรฐานสากล</li>
              <li><strong>การส่องกล้องตรวจปากมดลูก (Colposcopy)</strong> โดยทีมแพทย์ผู้เชี่ยวชาญ เพื่อประเมินความผิดปกติอย่างละเอียด</li>
              <li><strong>ฉีดวัคซีนป้องกันมะเร็งปากมดลูก</strong> สำหรับสตรีและเยาวชนหญิง เพื่อป้องกันเชื้อ HPV สายพันธุ์เสี่ยงสูง</li>
            </ul>
            <p className="text-slate-800 pt-3 font-medium">
              เพราะการป้องกันที่ดีที่สุดคือการตรวจพบตั้งแต่ระยะแรก โรงพยาบาลขอเชิญชวนสตรีทุกท่านให้เข้ารับการตรวจคัดกรองและป้องกันมะเร็งปากมดลูกอย่างต่อเนื่อง เพื่อสุขภาพที่แข็งแรงและห่างไกลจากโรคร้ายนี้
            </p>
          </div>

        </div>

        {/* ส่วนแพ็กเกจแนะนำ (แสดงหลายอันแบบ Grid) */}
        <div className="pt-10 border-t border-slate-200/80 space-y-6">
          <h3 className="text-xl font-bold text-[#1a2b6d] text-center">
            แพ็กเกจแนะนำสำหรับคุณ
          </h3>

          {recommendedPackages.length > 0 ? (
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
          ) : (
            <div className="text-center text-xs text-slate-400 py-6">
              กำลังโหลดแพ็กเกจแนะนำ...
            </div>
          )}
        </div>

        {/* ลิงก์บทความก่อนหน้า / ถัดไป ด้านล่างสุดตามเรฟ */}
        <div className="pt-8 border-t border-slate-200/80 flex justify-between items-center text-xs md:text-sm font-semibold text-[#1a2b6d]">
          <Link href="/health/lung-cancer" className="hover:underline flex items-center gap-1">
            ← โรคมะเร็งปอด (Lung Cancer)
          </Link>
          <Link href="/health/herpes-zoster" className="hover:underline flex items-center gap-1">
            โรคงูสวัด (Herpes Zoster) →
          </Link>
        </div>

      </main>
    </div>
  );
}