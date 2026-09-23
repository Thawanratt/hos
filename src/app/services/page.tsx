'use client';

import Link from 'next/link';

export default function AllServicesPage() {
  const allServices = [
    { title: 'ศูนย์หัวใจ', desc: 'ตรวจวินิจฉัยและรักษาโรคหัวใจโดยแพทย์ผู้เชี่ยวชาญ', href: '/services/heart' },
    { title: 'ศูนย์มะเร็ง', desc: 'เทคโนโลยีรังสีรักษาและเคมีบำบัดตรงจุด', href: '/services/cancer' },
    { title: 'ศูนย์กระดูกและข้อ', desc: 'ดูแลรักษาอาการบาดเจ็บและผ่าตัดข้อเทียม', href: '/services/bone' },
    { title: 'ศูนย์สมองและระบบประสาท', desc: 'ดูแลรักษาโรคทางสมองและหลอดเลือดสมอง', href: '/services/brain' },
    { title: 'ศูนย์อุบัติเหตุและฉุกเฉิน', desc: 'บริการตลอด 24 ชั่วโมงพร้อมทีมแพทย์ฉุกเฉิน', href: '/services/emergency' },
    { title: 'ศูนย์ตรวจสุขภาพ', desc: 'โปรแกรมตรวจสุขภาพเชิงลึกประจำปี', href: '/services/checkup' },
    { title: 'ศูนย์ศัลยกรรม', desc: 'เทคโนโลยีการผ่าตัดแผลเล็กและหุ่นยนต์ช่วยผ่าตัด', href: '/services/surgery' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-semibold text-sky-700 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full">
            Novaria Hospital Services
          </span>
          <h1 className="text-3xl font-extrabold text-[#1a2b6d] mt-2">ศูนย์และคลินิกเฉพาะทางทั้งหมด</h1>
          <p className="text-sm text-slate-500 mt-1">เลือกศูนย์การรักษาเพื่อดูรายละเอียดคลินิกย่อยและบริการทางการแพทย์</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allServices.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-[#1a2b6d] hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-slate-900">{service.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{service.desc}</p>
              </div>
              <span className="text-xs font-bold text-[#1a2b6d] inline-flex items-center gap-1">
                ดูรายละเอียด ➔
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}