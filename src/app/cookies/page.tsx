'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pb-20">
      
      {/* 🏥 HEADER BANNER */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-3">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">นโยบายคุกกี้</span>
          </nav>

          <div className="pl-4 border-l-4 border-[#1a2b6d]">
            <h1 className="text-xl md:text-2xl font-bold text-[#1a2b6d]">
              นโยบายคุกกี้ (Cookie Policy)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              รายละเอียดและวัตถุประสงค์การใช้งานคุกกี้บนเว็บไซต์โรงพยาบาลโนวาเลีย (novaria.com)
            </p>
          </div>
        </div>
      </section>

      {/* 📝 MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-8 space-y-8 text-xs md:text-sm text-slate-700 leading-relaxed">
        
        {/* บทนำ */}
        <section className="space-y-2">
          <p>
            ในระหว่างการท่องเว็บไซต์ <strong>novaria.com</strong> ข้อมูลที่เกี่ยวข้องกับการท่องเว็บไซต์ของท่านจะถูกเก็บเอาไว้ในรูปแบบของคุกกี้ นโยบายคุกกี้นี้จะอธิบายถึงความหมาย การทำงาน วัตถุประสงค์ รวมถึงวิธีการจัดการหรือลบคุกกี้เพื่อความเป็นส่วนตัวของท่าน โดยการเข้าใช้งานเว็บไซต์นี้ถือว่าท่านได้อนุญาตให้เราใช้คุกกี้ตามนโยบายคุกกี้ฉบับนี้
          </p>
        </section>

        {/* 1. Cookies คืออะไร */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            1. คุกกี้ (Cookies) คืออะไร?
          </h2>
          <p>
            Cookies คือไฟล์ข้อความขนาดเล็กเพื่อจัดเก็บข้อมูล โดยจะถูกบันทึกลงในอุปกรณ์คอมพิวเตอร์ หรือเครื่องมือสื่อสารที่เข้าใช้งานของท่านผ่านทางเว็บเบราว์เซอร์ในขณะที่ท่านเข้าเยี่ยมชมเว็บไซต์ของเรา
          </p>
        </section>

        {/* 2. การใช้ประโยชน์ของ Cookies */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            2. การใช้ประโยชน์ของ Cookies
          </h2>
          <p>
            โรงพยาบาลใช้ Cookies เพื่อเก็บเอกลักษณ์การเข้าเยี่ยมชมเว็บไซต์ของท่าน ซึ่งจะช่วยให้เราจำลักษณะการใช้งานและนำข้อมูลไปปรับปรุงเว็บไซต์ให้ตอบสนองความต้องการของท่านได้อย่างรวดเร็วและสะดวกยิ่งขึ้น ในบางจุดเราอาจให้บุคคลที่สามช่วยประมวลผลข้อมูล ซึ่งอาจใช้อินเทอร์เน็ตโปรโตคอลแอดเดรส (IP Address) และ Cookies เพื่อการวิเคราะห์และวัตถุประสงค์ทางการตลาด
          </p>
        </section>

        {/* 3. ประเภทและการทำงานของ Cookies */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            3. ประเภทและการทำงานของ Cookies
          </h2>
          <p>โรงพยาบาลใช้ Cookies 4 ประเภทหลัก ซึ่งไม่สามารถระบุตัวตนเฉพาะบุคคลของท่านได้:</p>

          <div className="space-y-3 pl-1">
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-1">
              <h3 className="font-bold text-[#1a2b6d]">1. Cookies ประเภทจำเป็นถาวร (Strictly Necessary Cookies)</h3>
              <p className="text-xs text-slate-600">
                มีความจำเป็นอย่างยิ่งเพื่อให้ท่านสามารถเข้าถึงข้อมูลและใช้งานทุกส่วนของเว็บไซต์ได้อย่างปลอดภัย คุกกี้ประเภทนี้จะถูกจัดเก็บและลบออกหลังจบการท่องเว็บไซต์
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-1">
              <h3 className="font-bold text-[#1a2b6d]">2. Cookies ประเภทการวิเคราะห์และวัดผล (Analytical / Performance Cookies)</h3>
              <p className="text-xs text-slate-600">
                ช่วยวัดผลการทำงานและประมวลจำนวนหน้าที่เข้าเยี่ยมชม รวมถึงรูปแบบพฤติกรรม เพื่อปรับปรุงเว็บไซต์ให้ตรงความต้องการมากยิ่งขึ้น ข้อมูลจะถูกประมวลผลในเชิงสถิติโดยไม่มีการระบุชื่อหรือระบุตัวตน
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-1">
              <h3 className="font-bold text-[#1a2b6d]">3. Cookies ประเภทการทำงาน (Functional Cookies)</h3>
              <p className="text-xs text-slate-600">
                ช่วยจดจำการตั้งค่าและคุณลักษณะต่างๆ ที่ท่านเคยเลือกไว้ (เช่น ภาษา ค่าเงิน) เพื่ออำนวยความสะดวกในการกลับมาใช้งานครั้งต่อไป โดยไม่มีการเก็บข้อมูลจำเพาะบุคคล
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-1">
              <h3 className="font-bold text-[#1a2b6d]">4. Cookies เพื่อการโฆษณา (Targeting / Advertising Cookies)</h3>
              <p className="text-xs text-slate-600">
                จดจำการเข้าชมหน้าเว็บ สื่อ หรือความสนใจของท่าน เพื่อนำไปใช้นำเสนอเนื้อหาและสิทธิประโยชน์ทางการตลาดที่เหมาะสมกับความต้องการของท่านมากที่สุด
              </p>
            </div>
          </div>
        </section>

        {/* 4. ตารางคุกกี้ที่ใช้ในเว็บไซต์ */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            4. รายการคุกกี้ที่ใช้งานบนเว็บไซต์
          </h2>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-1/3 border-r border-slate-200">ประเภทคุกกี้</th>
                  <th className="p-3">ชื่อคุกกี้ (Cookie Name)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/50">Strictly Necessary Cookies</td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">PSESSID, JSESSIONID</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/50">Analytical / Performance Cookies</td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">_ga, _gid, _gat, AMCVS_E1154AE, AMCV_E1154AE, s_cc, s_sq, s_nr, gpv</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/50">Functional Cookies</td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">COOKIE_POLICY, PG_LANGUAGE, currency, CurrentCustomerInfo, myBookingID</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/50">Targeting / Advertising Cookies</td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">fr, IDE, NID, demdex, dextp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. วิธีการปิดหรือลบคุกกี้ */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            5. การจัดการและการลบคุกกี้
          </h2>
          <p>
            ท่านสามารถตั้งค่า ปฏิเสธ หรือลบคุกกี้ได้ตลอดเวลาผ่านการตั้งค่าในเว็บเบราว์เซอร์ที่ท่านเลือกใช้งาน โดยสามารถศึกษาวิธีการจัดการของแต่ละเบราว์เซอร์ได้จากลิงก์ด้านล่างนี้:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-[#1a2b6d] font-medium hover:bg-slate-100 transition-colors text-center">Google Chrome</a>
            <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-[#1a2b6d] font-medium hover:bg-slate-100 transition-colors text-center">Mozilla Firefox</a>
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-[#1a2b6d] font-medium hover:bg-slate-100 transition-colors text-center">Safari (macOS)</a>
            <a href="https://support.apple.com/HT201265" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-[#1a2b6d] font-medium hover:bg-slate-100 transition-colors text-center">Safari (iOS)</a>
          </div>
        </section>

        {/* 6. การปรับปรุงนโยบาย */}
        <section className="space-y-2 bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
          <p className="font-bold text-slate-800">การปรับปรุงนโยบายคุกกี้</p>
          <p>
            โรงพยาบาลอาจทำการปรับปรุงแก้ไขนโยบายคุกกี้นี้ตามโอกาส เพื่อให้สอดคล้องกับกฎระเบียบและเทคโนโลยีใหม่ๆ จึงขอแนะนำให้ท่านตรวจสอบหน้านี้เป็นประจำเพื่อให้มั่นใจว่าท่านได้เข้าใจข้อกำหนดล่าสุด
          </p>
          <p className="pt-1 text-slate-400">แก้ไขล่าสุด: 20 ตุลาคม 2026</p>
        </section>

      </main>
    </div>
  );
}