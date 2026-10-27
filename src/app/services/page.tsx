'use client';

import Link from 'next/link';

export default function AllServicesPage() {
  // 🟢 แยก path สำหรับดูรายละเอียด (detailHref) และ path สำหรับจองคิว (bookingHref)
  const allServices = [
    { 
      title: 'ศูนย์หัวใจ', 
      desc: 'ตรวจวินิจฉัยและรักษาโรคหัวใจโดยแพทย์ผู้เชี่ยวชาญ', 
      detailHref: '/services/heart',
      bookingHref: '/booking?service=doctor&departmentId=5' 
    },
    { 
      title: 'ศูนย์มะเร็ง', 
      desc: 'เทคโนโลยีรังสีรักษาและเคมีบำบัดตรงจุด', 
      detailHref: '/services/cancer',
      bookingHref: '/booking?service=doctor&departmentId=6' 
    },
    { 
      title: 'ศูนย์กระดูกและข้อ', 
      desc: 'ดูแลรักษาอาการบาดเจ็บและผ่าตัดข้อเทียม', 
      detailHref: '/services/bone',
      bookingHref: '/booking?service=doctor&departmentId=7' 
    },
    { 
      title: 'ศูนย์สมองและระบบประสาท', 
      desc: 'ดูแลรักษาโรคทางสมองและหลอดเลือดสมอง', 
      detailHref: '/services/brain',
      bookingHref: '/booking?service=doctor&departmentId=8' 
    },
    { 
      title: 'ศูนย์อุบัติเหตุและฉุกเฉิน', 
      desc: 'บริการตลอด 24 ชั่วโมงพร้อมทีมแพทย์ฉุกเฉิน', 
      detailHref: '/services/emergency',
      bookingHref: '/booking?service=doctor&departmentId=9' 
    },
    { 
      title: 'ศูนย์ตรวจสุขภาพ', 
      desc: 'โปรแกรมตรวจสุขภาพเชิงลึกประจำปี', 
      detailHref: '/services/checkup',
      bookingHref: '/booking?service=checkup&departmentId=10' 
    },
    { 
      title: 'ศูนย์ศัลยกรรม', 
      desc: 'เทคโนโลยีการผ่าตัดแผลเล็กและหุ่นยนต์ช่วยผ่าตัด', 
      detailHref: '/services/surgery',
      bookingHref: '/booking?service=doctor&departmentId=11' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-semibold text-sky-700 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full">
            Novaria Hospital Services
          </span>
          <h1 className="text-3xl font-extrabold text-[#1a2b6d] mt-2">ศูนย์และคลินิกเฉพาะทางทั้งหมด</h1>
          <p className="text-sm text-slate-500 mt-1">เลือกศูนย์การรักษาเพื่อทำนัดหมายและดูรายละเอียดบริการทางการแพทย์</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allServices.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              {/* ส่วนบน: คลิกที่หัวข้อหรือคำอธิบาย เพื่อไปหน้าดูรายละเอียดเฉพาะศูนย์ */}
              <Link href={service.detailHref} className="space-y-2 group block">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#1a2b6d] transition">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{service.desc}</p>
              </Link>

              {/* ส่วนล่าง: ปุ่มกดเพื่อไปหน้าจองคิวพร้อมพารามิเตอร์ departmentId */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
               
                <Link
                  href={service.bookingHref}
                  className="text-xs font-bold text-[#1a2b6d] hover:underline inline-flex items-center gap-1"
                >
                  ทำนัดหมายทันที ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}