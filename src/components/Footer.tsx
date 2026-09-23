'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a2b6d] text-white text-xs pt-12 pb-8 mt-auto font-sans border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        
        {/* เมนูลิงก์แบ่งหมวดหมู่ 5 คอลัมน์ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* คอลัมน์ 1: บริการ */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-sky-400">บริการ</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/services" className="hover:text-white transition-colors">ศูนย์และคลินิกเฉพาะทาง</Link></li>
              <li><Link href="/doctors" className="hover:text-white transition-colors">ค้นหาแพทย์</Link></li>
              <li><Link href="/booking" className="hover:text-white transition-colors">ทำนัดหมายออนไลน์</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">แพ็กเกจและโปรโมชั่น</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">เทคโนโลยีการรักษา</Link></li>
            </ul>
          </div>

          {/* คอลัมน์ 2: ข้อมูลเพื่อเข้ารับบริการ */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-sky-400">ข้อมูลผู้เข้ารับบริการ</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/rooms" className="hover:text-white transition-colors">ห้องพักผู้ป่วย</Link></li>
              <li><Link href="/branches" className="hover:text-white transition-colors">แผนที่และการเดินทาง</Link></li>
              <li><Link href="/insurance" className="hover:text-white transition-colors">ประกัน และสิทธิการรักษา</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">สิ่งอำนวยความสะดวก</Link></li>
            </ul>
          </div>

          {/* คอลัมน์ 3: ข้อมูลสุขภาพ */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-sky-400">ข้อมูลสุขภาพ</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/news" className="hover:text-white transition-colors">โรคและการรักษา</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">บทความทางการแพทย์</Link></li>
              <li><Link href="/health-check" className="hover:text-white transition-colors">แบบประเมินสุขภาพเบื้องต้น</Link></li>
            </ul>
          </div>

          {/* คอลัมน์ 4: เกี่ยวกับเรา */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-sky-400">เกี่ยวกับเรา</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/about" className="hover:text-white transition-colors">ประวัติโรงพยาบาล</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">ข่าวสารและกิจกรรม</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">รางวัลและการรับรองมาตรฐาน</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">ติดต่อสอบถาม</Link></li>
            </ul>
          </div>

          {/* คอลัมน์ 5: ที่อยู่และติดต่อ */}
          <div className="col-span-2 md:col-span-1 space-y-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-700/60">
            <h4 className="font-bold text-sm text-sky-400">
              โรงพยาบาลโนวาเลีย
            </h4>
            <p className="text-slate-300 leading-relaxed">
              225 นครปฐม กำแพงแสน ประเทศไทย
            </p>
            <div className="space-y-1 text-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">โทร :</span> 
                <a href="tel:02165555" className="hover:text-sky-300 transition-colors font-bold">02-165-5555</a>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">อีเมล :</span> novaria@gmail.com
              </div>
            </div>
            <div className="pt-1">
              <Link href="/branches" className="text-xs text-sky-300 hover:underline inline-flex items-center gap-1 font-semibold">
                ดูแผนที่ Google Maps ➔
              </Link>
            </div>
          </div>

        </div>

        {/* แถบลิขสิทธิ์ล่างสุด */}
        <div className="pt-6 border-t border-slate-700/80 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 gap-4">
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-slate-200 transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <span className="text-slate-600">|</span>
            <Link href="/cookies" className="hover:text-slate-200 transition-colors">นโยบายคุกกี้ (Cookie Policy)</Link>
          </div>
          <div>
            © 2026 Novaria Hospital. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}