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

export default function LungCancerPage() {
  const [recommendedPackages, setRecommendedPackages] = useState<PackageItem[]>([]);

  useEffect(() => {
    // ค้นหาแพ็กเกจที่ตรงกับโรคมะเร็งปอดหรือตรวจปอดโดยอัตโนมัติจาก API
    fetch('/api/packages')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          // กรองทุกแพ็กเกจที่มีคำว่า "ปอด" หรือ "ct"
          const matchedPkgs = result.data.filter((pkg: PackageItem) => {
            const title = (pkg.title || '').toLowerCase();
            return (
              title.includes('ปอด') || 
              title.includes('ct')
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
              <span className="text-slate-600 font-semibold">โรคมะเร็งปอด (Lung Cancer)</span>
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
            โรคมะเร็งปอด (Lung Cancer)
          </h2>
          <div className="h-1 w-16 bg-[#1a2b6d] mx-auto rounded-full"></div>
        </div>

        {/* รูปภาพประกอบขนาดใหญ่ตรงกลาง */}
        <div className="relative h-72 md:h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-200/65">
          <img
            src="/images/g.jpg"
            alt="โรคมะเร็งปอด (Lung Cancer)"
            className="w-full h-full object-cover"
          />
        </div>

        {/* เนื้อหาบทความ */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-700">
          
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">โรคร้ายที่ควรตรวจตั้งแต่ระยะแรก</h3>
            <p>
              มะเร็งปอดเป็นโรคมะเร็งที่พบมากและคร่าชีวิตผู้ป่วยสูงที่สุดโรคหนึ่งในโลก โดยเกิดจากการเจริญเติบโตผิดปกติของเซลล์ในเนื้อปอด หากพบช้า โอกาสรักษาให้หายขาดจะลดลง
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">สาเหตุและปัจจัยเสี่ยง</h3>
            <p>มะเร็งปอดเกิดจากการเปลี่ยนแปลงของเซลล์ปอดที่ผิดปกติ ปัจจัยเสี่ยงที่สำคัญ ได้แก่:</p>
            <ul className="pl-6 space-y-1.5 list-disc">
              <li>การสูบบุหรี่และบุหรี่ไฟฟ้า ทั้งผู้สูบเองและผู้ที่สูดดมควันบุหรี่มือสอง</li>
              <li>การสัมผัสสารก่อมะเร็ง เช่น แร่ใยหิน โครเมียม นิกเกิล แร่เรดอน และสารเคมีในที่ทำงาน</li>
              <li>มลพิษทางอากาศ PM2.5</li>
              <li>มีประวัติโรคปอดเรื้อรัง เช่น วัณโรค ถุงลมโป่งพอง</li>
              <li>ประวัติครอบครัวที่มีคนเป็นมะเร็งปอด</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">อาการที่ควรสังเกต</h3>
            <p>
              ในระยะแรก มะเร็งปอดอาจไม่แสดงอาการชัดเจน แต่เมื่อโรคลุกลาม อาจพบอาการไอเรื้อรังหรือไอมีเลือดปน เจ็บหน้าอกหรือแน่นหน้าอก หายใจลำบาก หายใจมีเสียงหวีด น้ำหนักลดหรืออ่อนเพลียโดยไม่ทราบสาเหตุ หากมีอาการเหล่านี้ ควรรีบพบแพทย์เพื่อวินิจฉัยตั้งแต่ระยะแรก
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">การป้องกันและตรวจคัดกรอง</h3>
            <p>การป้องกันมะเร็งปอดทำได้โดย:</p>
            <ul className="pl-6 space-y-1.5 list-disc">
              <li><strong>เลิกสูบบุหรี่</strong> และหลีกเลี่ยงควันบุหรี่มือสอง</li>
              <li>หลีกเลี่ยงการสัมผัสสารก่อมะเร็ง</li>
              <li>ตรวจสุขภาพปอดอย่างสม่ำเสมอ</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">การตรวจคัดกรองที่แนะนำ</h3>
            <p>
              <strong>Low-Dose CT Scan (LDCT):</strong> การเอกซเรย์คอมพิวเตอร์ปอดด้วยปริมาณรังสีน้อย สามารถตรวจพบก้อนหรือความผิดปกติในปอดตั้งแต่ระยะเริ่มต้น
            </p>
            <p>
              <strong>กลุ่มที่ควรตรวจ:</strong> ผู้ที่มีอายุ 50–80 ปี และมีประวัติสูบบุหรี่จัด หรือเลิกบุหรี่ไม่เกิน 15 ปี, ทำงานสัมผัสสารก่อมะเร็ง, มีประวัติมะเร็งปอดในครอบครัว
            </p>
            <p className="text-[#1a2b6d] font-semibold pt-1">
              การตรวจตั้งแต่ระยะแรกช่วยเพิ่มโอกาสรักษาให้หายขาดและลดความเสี่ยงเสียชีวิตจากโรคมะเร็งปอด
            </p>
          </div>

          <div className="space-y-2 bg-sky-50/60 border border-sky-100 p-6 rounded-2xl">
            <h3 className="font-bold text-[#1a2b6d] text-lg">บริการตรวจคัดกรองมะเร็งปอดที่โรงพยาบาล</h3>
            <ul className="pl-6 space-y-1.5 list-disc text-slate-800">
              <li>โรงพยาบาลของเรามี <strong>โปรแกรมตรวจคัดกรองมะเร็งปอด</strong> สำหรับผู้ที่มีความเสี่ยงสูงและประชาชนทั่วไป</li>
              <li>ใช้ <strong>เครื่อง Low-Dose CT Scan</strong> ที่มีความละเอียดสูงและปลอดภัย</li>
              <li>มี <strong>ทีมแพทย์ผู้เชี่ยวชาญ</strong> ด้านระบบทางเดินหายใจและรังสีวิทยา</li>
              <li>ให้คำปรึกษาและวางแผนการดูแลสุขภาพแบบครบวงจร</li>
            </ul>
            <p className="text-slate-800 pt-2 font-medium">
              หากคุณอยู่ในกลุ่มเสี่ยง หรือกังวลเกี่ยวกับสุขภาพปอด เข้ารับการตรวจคัดกรองตั้งแต่วันนี้ เพื่อสุขภาพปอดที่แข็งแรงและป้องกันโรคร้ายก่อนสายเกินไป
            </p>
          </div>

          {/* ส่วนคำถามที่พบบ่อย (FAQ) */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg text-[#1a2b6d]">คำถามที่พบบ่อย (FAQ)</h3>
            
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-800">Q: Low-Dose CT Scan ปลอดภัยหรือไม่?</p>
                <p className="text-slate-600 mt-1">A: ใช้ปริมาณรังสีน้อยมาก ปลอดภัยต่อร่างกายและสามารถตรวจได้อย่างต่อเนื่อง</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-800">Q: ใครควรเข้ารับการตรวจคัดกรอง?</p>
                <p className="text-slate-600 mt-1">A: ผู้ที่มีอายุ 50–80 ปี และมีประวัติสูบบุหรี่จัด หรือเลิกสูบบุหรี่ไม่เกิน 15 ปี</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-800">Q: ตรวจพบความผิดปกติแล้วจะทำอย่างไร?</p>
                <p className="text-slate-600 mt-1">A: แพทย์จะให้คำปรึกษาและวางแผนตรวจเพิ่มเติม เช่น การเจาะชิ้นเนื้อ หรือการรักษาตามระยะโรค</p>
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
          <Link href="/health/arrhythmia" className="hover:underline flex items-center gap-1">
            ← โรคหัวใจเต้นผิดจังหวะ (Arrhythmia)
          </Link>
          <Link href="/health/cervical-cancer" className="hover:underline flex items-center gap-1">
            โรคมะเร็งปากมดลูก (Cervical Cancer) →
          </Link>
        </div>

      </main>
    </div>
  );
}