'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pb-20">
      
      {/* 🏥 HEADER BANNER */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-3">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">นโยบายความเป็นส่วนตัว</span>
          </nav>

          <div className="pl-4 border-l-4 border-[#1a2b6d]">
            <h1 className="text-xl md:text-2xl font-bold text-[#1a2b6d]">
              นโยบายความเป็นส่วนตัวของผู้รับบริการ (Patient Privacy Notice)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              โรงพยาบาลโนวาเลีย มุ่งมั่นที่จะคุ้มครองข้อมูลส่วนบุคคลและข้อมูลสุขภาพของท่านตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
            </p>
          </div>
        </div>
      </section>

      {/* 📝 MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-8 space-y-8 text-xs md:text-sm text-slate-700 leading-relaxed">
        
        {/* บทนำ */}
        <section className="space-y-2">
          <p>
            <strong>โรงพยาบาลโนวาเลีย (“โรงพยาบาล”)</strong> ในฐานะผู้ควบคุมข้อมูลส่วนบุคคล มีหน้าที่ตามกฎหมายในการแจ้งเอกสารฉบับนี้ให้ท่านทราบถึงเหตุผลและวิธีการที่โรงพยาบาลเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของท่าน รวมถึงแจ้งสิทธิตามกฎหมายในฐานะเจ้าของข้อมูลส่วนบุคคล
          </p>
        </section>

        {/* 1. วัตถุประสงค์ในการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            1. วัตถุประสงค์ในการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล
          </h2>
          <div className="space-y-2 pl-2">
            <p><strong>1.1 การตรวจรักษาโรคและการบริการทางการแพทย์:</strong> บันทึกประวัติ ให้คำปรึกษา ตรวจวินิจฉัย การรักษาพยาบาล รวมถึงการรับ-ส่งต่อผู้ป่วย (Refer) และกรณีฉุกเฉินเพื่อป้องกันอันตรายต่อชีวิตและสุขภาพ</p>
            <p><strong>1.2 การเคลมประกันและสิทธิการรักษา:</strong> เปิดเผยข้อมูลการรักษาแก่บริษัทประกันภัยหรือหน่วยงานต้นสังกัดตามที่ท่านยินยอม เพื่อประโยชน์ในการเบิกจ่ายค่ารักษาพยาบาล</p>
            <p><strong>1.3 การบริการผ่านระบบดิจิทัลและแอปพลิเคชัน:</strong> เพื่อเชื่อมโยงฐานข้อมูลเวชระเบียน อำนวยความสะดวกในการนัดหมาย และการรับบริการปรึกษาแพทย์ออนไลน์</p>
            <p><strong>1.4 การพัฒนาคุณภาพการรักษา:</strong> วิเคราะห์ข้อมูลสถิติในรูปแบบรายงานภาพรวมที่ไม่สามารถระบุตัวตน เพื่อยกระดับมาตรฐานการบริบาลทางการแพทย์</p>
            <p><strong>1.5 การแจ้งข่าวสารทางการตลาด:</strong> แจ้งข้อมูลสุขภาพ ข่าวสาร และสิทธิประโยชน์พิเศษ (ดำเนินการเฉพาะกรณีที่ได้รับความยินยอมจากท่านเท่านั้น)</p>
          </div>
        </section>

        {/* 2. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            2. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>ข้อมูลระบุตัวตน:</strong> ชื่อ-นามสกุล, เลขประจำตัวประชาชน, Passport ID, วันเดือนปีเกิด, เพศ, รูปถ่าย</li>
            <li><strong>ข้อมูลการติดต่อ:</strong> ที่อยู่, เบอร์โทรศัพท์, อีเมล, ข้อมูลผู้ติดต่อฉุกเฉิน</li>
            <li><strong>ข้อมูลการเงิน:</strong> ประวัติการชำระเงิน, ข้อมูลใบเสร็จ, ข้อมูลบัตรเครดิต/เดบิต</li>
            <li><strong>ข้อมูลสุขภาพ (ข้อมูลอ่อนไหว):</strong> ประวัติการรักษาพยาบาล, อาการป่วย, การแพ้ยา/อาหาร, ผลตรวจทางห้องปฏิบัติการ (Lab), ภาพถ่ายทางรังสี (X-Ray), รายการยาที่แพทย์สั่ง</li>
            <li><strong>ข้อมูลทางเทคนิค:</strong> หมายเลข IP Address, ข้อมูลการใช้งานเว็บไซต์และระบบประเมินสุขภาพออนไลน์</li>
          </ul>
        </section>

        {/* 3. การเปิดเผยข้อมูลส่วนบุคคล */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            3. การเปิดเผยข้อมูลส่วนบุคคลแก่บุคคลภายนอก
          </h2>
          <p>โรงพยาบาลจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอก เว้นแต่ได้รับความยินยอม หรือเป็นการปฏิบัติตามกฎหมาย ดังนี้:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>สถานพยาบาลในเครือข่าย หรือสถานพยาบาลที่รับส่งต่อผู้ป่วย</li>
            <li>บริษัทประกันภัย หรือผู้ดูแลสิทธิการเบิกจ่ายค่ารักษาพยาบาล</li>
            <li>หน่วยงานราชการหรือผู้มีอำนาจตามกฎหมาย (เช่น กระทรวงสาธารณสุข, ศาล)</li>
            <li>ผู้ประมวลผลข้อมูลส่วนบุคคลที่รับจ้างให้บริการแก่โรงพยาบาล (เช่น ระบบไอที, ห้องปฏิบัติการภายนอก)</li>
          </ul>
        </section>

        {/* 4. ระยะเวลาในการเก็บรักษาข้อมูล */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            4. ระยะเวลาในการเก็บรักษาข้อมูล
          </h2>
          <p>
            โรงพยาบาลจัดเก็บเวชระเบียนและข้อมูลส่วนบุคคลของท่านเป็นระยะเวลา<strong>อย่างน้อย 5 ปี</strong> นับแต่วันที่จัดทำ ตาม พ.ร.บ. สถานพยาบาล พ.ศ. 2541 และอาจจัดเก็บต่อเนื่องสูงสุด<strong>ไม่เกิน 10 ปี</strong> นับจากการเข้ารับบริการครั้งสุดท้ายเพื่อประโยชน์ในการรักษาพยาบาลอย่างต่อเนื่อง เมื่อพ้นกำหนดเวลาดังกล่าว โรงพยาบาลจะทำการทำลายข้อมูลฉบับจริงและข้อมูลอิเล็กทรอนิกส์ตามมาตรฐานความปลอดภัย
          </p>
        </section>

        {/* 5. สิทธิของเจ้าของข้อมูลส่วนบุคคล */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            5. สิทธิของเจ้าของข้อมูลส่วนบุคคล (PDPA Rights)
          </h2>
          <p>ท่านมีสิทธิตามกฎหมายคุ้มครองข้อมูลส่วนบุคคลในการดำเนินการดังต่อไปนี้:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">1. สิทธิในการเพิกถอนความยินยอม</div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">2. สิทธิในการเข้าถึงและขอรับสำเนาข้อมูล</div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">3. สิทธิในการแก้ไขข้อมูลให้ถูกต้อง</div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">4. สิทธิในการขอให้ลบหรือทำลายข้อมูล</div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">5. สิทธิในการระงับการใช้ข้อมูล</div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">6. สิทธิในการขอโอนย้ายข้อมูล</div>
          </div>
        </section>

        {/* 6. ช่องทางการติดต่อ */}
        <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-lg p-5">
          <h2 className="text-base font-bold text-[#1a2b6d]">
            6. ช่องทางการติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)
          </h2>
          <p>
            หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว หรือต้องการใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล สามารถติดต่อได้ที่:
          </p>
          <div className="space-y-1 font-medium text-slate-800 pt-1">
            <p><strong>เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (Data Protection Officer: DPO)</strong></p>
            <p>โรงพยาบาลโนวาเลีย (สำนักงานใหญ่)</p>
            <p>เลขที่ 999 ถนนพุทธมณฑล สาย 4 ตำบลศาลายา อำเภอพุทธมณฑล จังหวัดนครปฐม 73170</p>
            <p><strong>โทรศัพท์:</strong> 02-165-5555 (ต่อ ฝ่ายคุ้มครองข้อมูลส่วนบุคคล)</p>
            <p><strong>อีเมล:</strong> dpo@novaria.com หรือ info@novaria.com</p>
          </div>
        </section>

      </main>
    </div>
  );
}