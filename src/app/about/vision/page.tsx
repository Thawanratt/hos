export default function VisionPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-bold text-[#1a2b6d]">วิสัยทัศน์และพันธกิจ</h2>
        <div className="h-0.5 w-20 bg-[#1a2b6d] mt-2"></div>
      </div>

      <div className="space-y-6 text-sm md:text-base text-slate-700">
        {/* วิสัยทัศน์ */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">วิสัยทัศน์ (Vision)</h3>
          <p className="bg-slate-50 p-4 rounded-md border border-slate-200 text-slate-800">
            "เป็นโรงพยาบาลชั้นนำที่ให้บริการทางการแพทย์และการดูแลสุขภาพแบบองค์รวม ด้วยมาตรฐานสากล นวัตกรรมที่ทันสมัย และความเอื้ออาทรเพื่อสุขภาวะที่ยั่งยืนของทุกคน"
          </p>
        </div>

        {/* พันธกิจ */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900">พันธกิจ (Mission)</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>ยกระดับมาตรฐานการวินิจฉัยและรักษาพยาบาลด้วยนวัตกรรมเทคโนโลยีการแพทย์ระดับสูง</li>
            <li>ส่งเสริมการดูแลสุขภาพกายและสุขภาพจิตเชิงป้องกันอย่างยั่งยืน</li>
            <li>พัฒนาศักยภาพบุคลากรทางการแพทย์อย่างต่อเนื่อง เพื่อการบริบาลที่เป็นเลิศและมีจริยธรรมวิชาชีพ</li>
            <li>สร้างความร่วมมือกับภาคีเครือข่ายสาธารณสุขในการยกระดับคุณภาพชีวิตของชุมชน</li>
          </ul>
        </div>

        {/* ค่านิยม */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">ค่านิยมองค์กร (Core Values)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>Quality & Safety:</strong> คุณภาพและความปลอดภัยของผู้ป่วยเป็นอันดับแรก
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>Compassion:</strong> การดูแลด้วยความเข้าใจและเอื้ออาทร
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>Integrity:</strong> ยึดมั่นในคุณธรรมและจริยธรรมวิชาชีพ
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <strong>Innovation:</strong> พัฒนานวัตกรรมการรักษาอย่างไม่หยุดยั้ง
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}