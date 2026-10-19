'use client';

import Link from 'next/link';

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      
      {/* 🏥 HEADER BANNER - EXECUTIVE ACCENT BAR STYLE (คงเดิมตามสั่ง ห้ามแตะต้อง) */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div className="space-y-3">
            <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">ประกัน และสิทธิการรักษา</span>
            </nav>

            <div className="pl-4 border-l-4 border-[#1a2b6d] py-0.5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight leading-tight">
                  ประกัน และ <span className="font-semibold text-[#1a2b6d]">สิทธิการรักษาพยาบาล</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
                  ตรวจสอบสิทธิการรักษาพยาบาลภาครัฐ ประกันสุขภาพเอกชน และรายชื่อบริษัทคู่สัญญาของโรงพยาบาลโนวาเลีย
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-12 space-y-12 text-sm leading-relaxed text-slate-800">
        
        {/* หัวข้อ "ประกัน และสิทธิการรักษา" */}
        <div className="text-center space-y-3 pt-2 pb-2">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400"></span>
            <span className="w-2 h-2 rounded-full bg-[#1a2b6d]"></span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2b6d] tracking-tight drop-shadow-2xs">
            ประกัน และสิทธิการรักษา
          </h2>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Hospital Insurance & Coverage Guidelines
          </p>
        </div>

        {/* 4 หัวข้อหลักด้านบน (Anchor Links) */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-6 shadow-2xs space-y-2.5">
          <p>
            - <Link href="#universal-coverage-section" className="text-[#1a2b6d] font-semibold hover:underline">สิทธิหลักประกันสุขภาพแห่งชาติ (สิทธิ 30 บาท / บัตรทอง)</Link>
          </p>
          <p>
            - <Link href="#emergency-section" className="text-[#1a2b6d] font-semibold hover:underline">บริการอุบัติเหตุฉุกเฉินผู้ป่วยในสิทธิสวัสดิการข้าราชการ/รัฐวิสาหกิจ</Link>
          </p>
          <p>
            - <Link href="#life-insurance-section" className="text-[#1a2b6d] font-semibold hover:underline">รายชื่อสิทธิประกันชีวิต</Link>
          </p>
          <p>
            - <Link href="#partners-section" className="text-[#1a2b6d] font-semibold hover:underline">รายชื่อบริษัทประกันภัย</Link>
          </p>
        </div>

        {/* 🩺 ส่วนเพิ่มใหม่: สิทธิหลักประกันสุขภาพแห่งชาติ (สิทธิ 30 บาท / บัตรทอง) */}
        <div id="universal-coverage-section" className="space-y-6 pt-4 border-b border-slate-200 pb-10">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1a2b6d] shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1a2b6d]">
                สิทธิหลักประกันสุขภาพแห่งชาติ (สิทธิ 30 บาท / บัตรทอง)
              </h3>
              <p className="text-xs text-slate-500">
                การเข้ารับบริการภายใต้กองทุนหลักประกันสุขภาพแห่งชาติ (สปสช.) ณ โรงพยาบาลโนวาเลีย
              </p>
            </div>
          </div>

          {/* รายละเอียดสิทธิประโยชน์ */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-6 space-y-4">
            <p className="font-bold text-[#1a2b6d] text-base">ขอบเขตความคุ้มครองและสิทธิประโยชน์</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-[#1a2b6d] font-bold">✓</span>
                <span>การตรวจ วินิจฉัย และรักษาโรคทั่วไป ตลอดจนโรคเรื้อรัง</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1a2b6d] font-bold">✓</span>
                <span>บริการผู้ป่วยนอก (OPD) และผู้ป่วยใน (IPD) ตามข้อกำหนด สปสช.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1a2b6d] font-bold">✓</span>
                <span>ค่ายา เวชภัณฑ์ และอุปกรณ์ทางการแพทย์ตาม บัญชียาหลักแห่งชาติ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1a2b6d] font-bold">✓</span>
                <span>บริการตรวจคัดกรองสุขภาพ และการส่งเสริมสุขภาพป้องกันโรค</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1a2b6d] font-bold">✓</span>
                <span>สิทธิเจ็บป่วยฉุกเฉินวิกฤต มีสิทธิทุกที่ (USEP) เข้ารักษาได้ทันทีภายใน 72 ชม. แรก</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1a2b6d] font-bold">✓</span>
                <span>การย้ายหน่วยบริการและการนัดหมายผ่านระบบ สปสช. / 30 บาทรักษาทุกที่</span>
              </li>
            </ul>
          </div>

          {/* เอกสารและเงื่อนไขการใช้สิทธิ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200/80 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-[#1a2b6d]">
                <svg className="w-5 h-5 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-6 7.5c0-1.657 1.343-3 3-3h3c1.657 0 3 1.343 3 3v.75H4.5v-.75z" />
                </svg>
                <span>เอกสารที่ต้องนำมาแสดง</span>
              </div>
              <ul className="pl-5 space-y-1.5 list-disc text-xs text-slate-700">
                <li>บัตรประจำตัวประชาชนตัวจริง (หรือสูติบัตรกรณีผู้ป่วยเด็ก)</li>
                <li>หนังสือส่งตัวจากสถานพยาบาลต้นสังกัดสิทธิ (กรณีรับการส่งต่อ)</li>
                <li>แอปพลิเคชัน "ทางรัฐ" หรือ "สปสช." บนมือถือสำหรับแสดงสิทธิดิจิทัล</li>
              </ul>
            </div>

            <div className="border border-slate-200/80 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-[#1a2b6d]">
                <svg className="w-5 h-5 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <span>ข้อควรทราบและการรับบริการ</span>
              </div>
              <ul className="pl-5 space-y-1.5 list-disc text-xs text-slate-700">
                <li>กรณีผู้ป่วยนอกทั่วไป กรุณาติดต่อยื่นสิทธิ ณ แผนกเวชระเบียน ชั้น 1</li>
                <li>กรณีมีค่าบริการนอกเหนือขอบเขตสิทธิ (เช่น ห้องพักพิเศษ/ยานอกบัญชี) เจ้าหน้าที่จะแจ้งให้ทราบล่วงหน้า</li>
                <li>สอบถามข้อมูลสิทธิ สปสช. เพิ่มเติมได้ที่ สายด่วน สปสช. 1330 หรือ ศูนย์บริการลูกค้าโนวาเลีย</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ส่วนที่ 1: ขั้นตอนการบริการ */}
        <div id="emergency-section" className="space-y-6 pt-4">
          <p className="font-semibold text-slate-900 text-base">
            บริการผู้ป่วยพักฟื้นโรงพยาบาลโนวาเลีย (กรณีผู้ป่วยใน)
          </p>

          <div className="space-y-2 pl-2">
            <p className="font-bold text-[#1a2b6d]">ขั้นตอนที่ 1</p>
            <p className="text-slate-700 leading-relaxed">
              สำหรับผู้ที่มีประกันสุขภาพประเภทค่ารักษาพยาบาลและค่ารักษาพยาบาลกรณีผู้ป่วยในมีความคุ้มครองในการรักษาพยาบาลชีวิตตัวแทนของบริษัทประกันภัยหรือตัวแทนประกันภัยที่มีการติดต่อกับโรงพยาบาลผ่านช่องทางสิทธิ์ค่ารักษาพยาบาลตามต้องการของบริษัทประกันภัยหรือตัวแทนบริษัทประกันภัย
            </p>
            <div className="text-slate-600 text-xs pt-1 space-y-0.5 font-medium">
              <p>Contact Center 1719 หรือ โทร. 02-165-5555</p>
              <p>อีเมล: info@novaria.com</p>
            </div>
          </div>

          <div className="space-y-3 pl-2 pt-2">
            <p className="font-bold text-[#1a2b6d]">ขั้นตอนที่ 2</p>
            <p className="text-slate-700">
              เมื่อตรวจสอบเรียบร้อยให้บัตรประกันชีวิต/ บัตรแสดงสิทธิ์การรักษาใช้บริการในโรงพยาบาล
            </p>
            <p className="text-slate-700 font-medium">
              1. ในกรณีที่เข้าพักออกทรัพย์ กรุณาแสดงบัตรประจำตัวประชาชนดังนี้ ดังนี้
            </p>
          </div>
        </div>

        {/* ไอคอนชุดที่ 1: บัตรประชาชน (ขนาดใหญ่ขึ้น สะดุดตา) */}
        <div className="space-y-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
          <div className="flex justify-center py-2">
            <svg className="w-20 h-20 text-[#1a2b6d] stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-6 7.5c0-1.657 1.343-3 3-3h3c1.657 0 3 1.343 3 3v.75H4.5v-.75z" />
            </svg>
          </div>
          <ul className="pl-6 space-y-2 list-disc text-slate-700 max-w-lg mx-auto">
            <li>บัตรประจำตัวประชาชน หรือ</li>
            <li>บัตรที่ทางราชการออกให้ หรือ</li>
            <li>บัตรประกัน หรือเลขกรมธรรม์</li>
          </ul>
        </div>

        {/* ขั้นตอนบริการผู้ป่วยนอก */}
        <div className="space-y-4 pt-4">
          <p className="font-bold text-[#1a2b6d] text-base">2. บริการผู้ป่วยนอก</p>
        </div>

        {/* ไอคอนชุดที่ 2: เอกสาร/ปากกา (ขนาดใหญ่ขึ้น) */}
        <div className="space-y-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
          <div className="flex justify-center py-2">
            <svg className="w-20 h-20 text-[#1a2b6d] stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <ul className="pl-6 space-y-2 list-disc text-slate-700 max-w-lg mx-auto">
            <li>ผู้ป่วยลงนามในเอกสารใบยินยอมก่อนเข้ารับบริการที่เวชระเบียน</li>
            <li>กรณีมีส่วนเกินผู้ป่วยจะต้องทำการชำระเงิน</li>
          </ul>
        </div>

        {/* ขั้นตอนผู้ป่วยในวางแผนไว้ก่อน */}
        <div className="space-y-4 pt-4">
          <p className="font-bold text-[#1a2b6d] text-base">3. บริการผู้ป่วยในที่ได้มีการวางแผนไว้ก่อน</p>
        </div>

        {/* ไอคอนชุดที่ 3: มือถือ */}
        <div className="space-y-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
          <div className="flex justify-center py-2">
            <svg className="w-20 h-20 text-[#1a2b6d] stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <ul className="pl-6 space-y-2 list-disc text-slate-700 max-w-lg mx-auto">
            <li>ติดต่อห้องพยาบาลเพื่อแจ้งข้อมูลสุขภาพสำหรับการรักษาพยาบาล</li>
            <li>บริษัทประกันจะจัดส่งประกันภัยที่เกี่ยวข้องกับสิทธิประโยชน์</li>
            <li>ทางบริษัทประกันจะทำการตรวจสอบสิทธิและวงเงินความคุ้มครอง</li>
          </ul>
          <p className="text-xs text-red-600 font-medium text-center pt-2">
            หมายเหตุ : กรณีที่มีโรคภัยไข้เจ็บ โปรดแจ้งข้อมูลก่อนเข้ารับบริการ
          </p>
        </div>

        {/* ส่วนที่ 2: รายชื่อสิทธิประกันชีวิต (Anchor Target) */}
        <div id="life-insurance-section" className="pt-4"></div>

        {/* ส่วนที่ 3: รายชื่อบริษัทประกันชีวิต & บริษัทประกันภัย */}
        <div className="space-y-6 pt-8 border-t border-slate-200" id="partners-section">
          
          {/* หมวดที่ 1 */}
          <div className="space-y-3">
            <p className="font-bold text-slate-900 text-base" id="life-insurance">
              รายชื่อบริษัทประกันชีวิต
            </p>
            <ul className="pl-6 space-y-1.5 list-disc text-slate-700">
              <li>บมจ. กรุงเทพประกันชีวิต</li>
              <li>บมจ. กรุงไทย-แอกซ่า ประกันชีวิต</li>
              <li>บมจ. เอไอเอ (AIA)</li>
              <li>บมจ. โตเกียวมารีนประกันชีวิต (ประเทศไทย)</li>
              <li>บมจ. ฟิลลิปประกันชีวิต</li>
              <li>บมจ. เมืองไทยประกันชีวิต</li>
              <li>บมจ. ไทยสมุทรประกันชีวิต</li>
              <li>บมจ. เอ็ม บี เค ประกันชีวิต</li>
              <li>บริษัท ไทยวิวัฒน์ ประกันชีวิต จำกัด</li>
              <li>บริษัท โตเกียวมารีน ประกันชีวิต (ประเทศไทย)</li>
              <li>บมจ. อลิอันซ์ อยุธยา ประกันชีวิต</li>
              <li>บมจ. เมืองไทยประกันภัย</li>
              <li>บมจ. ซิกน่าประกันภัย</li>
              <li>บมจ. ชับบ์ สามัคคีประกันภัย</li>
              <li>บมจ. ทิพยประกันชีวิต</li>
              <li>บมจ. อาคเนย์ประกันชีวิต</li>
            </ul>
          </div>

          {/* หมวดที่ 2 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <p className="font-bold text-slate-900 text-base">
              รายชื่อบริษัทประกันภัย
            </p>
            <ul className="pl-6 space-y-1.5 list-disc text-slate-700">
              <li>บมจ. กรุงเทพประกันภัย</li>
              <li>บมจ. ทิพยประกันภัย</li>
              <li>บมจ. วิริยะประกันภัย</li>
              <li>บมจ. สินมั่นคงประกันภัย</li>
              <li>บมจ. แอลเอ็มจีประกันภัย</li>
              <li>บมจ. เทเวศประกันภัย</li>
              <li>บมจ. อาคเนย์ประกันภัย</li>
              <li>บมจ. เมืองไทยประกันภัย</li>
              <li>บมจ. ประกันภัยไทยวิวัฒน์</li>
              <li>บมจ. เคเอสไอ ประกันภัย</li>
            </ul>
          </div>

        </div>

      </main>
    </div>
  );
}