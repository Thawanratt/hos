import { Quote } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-bold text-[#1a2b6d]">ข้อมูลโรงพยาบาล</h2>
        <div className="h-0.5 w-20 bg-[#1a2b6d] mt-2"></div>
      </div>

      <div className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed">
        <p>
          <strong>โรงพยาบาลโนวาเลีย</strong> ผู้ให้บริการทางการแพทย์และการรักษาพยาบาลชั้นนำ ด้วยความภาคภูมิใจในการดูแลสุขภาพของประชาชน ถือได้ว่าเป็นโรงพยาบาลเอกชนชั้นนำที่ได้รับการไว้วางใจทั้งจากคนไทยและชาวต่างชาติ เลือกใช้บริการตรวจวินิจฉัย รักษา และฟื้นฟูสุขภาพตลอดมา จนได้รับการรับรองมาตรฐานสากล Joint Commission International (JCI)
        </p>

        <p className="font-semibold text-slate-900 pt-2">
          ศูนย์กลางเครือข่ายทางการแพทย์ของเรา
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
          <li>โรงพยาบาลโนวาเลีย สำนักงานใหญ่</li>
          <li>ศูนย์สุขภาพจิตและการฟื้นฟูสภาวะอารมณ์</li>
          <li>ศูนย์โรคหัวใจและหลอดเลือดขั้นสูง</li>
          <li>ศูนย์ตรวจสุขภาพและคัดกรองโรคออนไลน์</li>
        </ul>

        <p className="pt-2">
          ซึ่งได้รับการออกแบบอย่างพร้อมสรรพ เพื่อตอบสนองทุกความต้องการของผู้ป่วยที่มอบความไว้วางใจให้กับเรา
        </p>

        {/* Quote Block เรียบๆ */}
        <blockquote className="bg-slate-50 border-l-4 border-[#1a2b6d] p-4 rounded-r-md my-6 text-slate-600 italic text-sm space-y-2">
          <Quote className="w-5 h-5 text-[#1a2b6d]/40" />
          <p>
            "เรามีความปรารถนาที่จะมอบบริการที่ดีที่สุดและเป็นกันเองให้แก่ผู้ป่วยและผู้รับบริการทุกท่าน คณะแพทย์และบุคลากรของเราได้รับการฝึกฝนและเพิ่มพูนความรู้อย่างต่อเนื่อง เพื่อให้แน่ใจว่าผู้ป่วยได้รับการบริบาลที่ปลอดภัยและแม่นยำที่สุด"
          </p>
        </blockquote>

        <p>
          นอกจากนี้เรายังมีทีมล่ามที่มีความชำนาญหลากหลายภาษา เพื่อให้มั่นใจว่าจะไม่มีอุปสรรคด้านการสื่อสารใดๆ เกิดขึ้นระหว่างการรักษาพยาบาล
        </p>
      </div>
    </div>
  );
}