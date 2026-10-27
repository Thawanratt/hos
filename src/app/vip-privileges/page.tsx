'use client';

import { useState } from 'react';
import Link from 'next/link';

// ไอคอน SVG ตัวช่วย
const Icon = ({ d, className = 'w-5 h-5', stroke = 1.6 }: { d: string; className?: string; stroke?: number }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={stroke} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const Chevron = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <Icon d="M9 5l7 7-7 7" className={className} stroke={2} />
);

export default function VipPrivilegesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'medical' | 'lifestyle'>('all');

  const privileges = [
    {
      id: 1,
      category: 'medical',
      title: 'Personal Medical Concierge',
      subtitle: 'ผู้ดูแลส่วนตัวประสานงานทางการแพทย์',
      desc: 'มีเจ้าหน้าที่พยาบาลวิชาชีพดูแลและอำนวยความสะดวกตลอดการเข้ารับบริการ พร้อมลัดคิวตรวจและพบแพทย์แบบเร่งด่วน',
      policyNote: 'นโยบายการให้บริการ: มุ่งเน้นความรวดเร็วและลดขั้นตอนการรอคอย โดยมีผู้ดูแลส่วนตัวคอยประสานงานให้ตั้งแต่จุดลงทะเบียนจนถึงรับยา',
      icon: 'M11.42 15.17L17.25 21A2.25 2.25 0 0119.5 21v-2.25m-6.75-9.75l-4.5 4.5m0-4.5l4.5 4.5M3 13.5h18m-9-9v18',
    },
    {
      id: 2,
      category: 'lifestyle',
      title: 'Executive Limousine Service',
      subtitle: 'บริการรถรับ-ส่งผู้ป่วยระดับลักชูรี',
      desc: 'บริการรถยนต์รับ-ส่งถึงที่พัก สำหรับสมาชิก Elite เมื่อมารับการนัดหมายตรวจสุขภาพหรือรักษาตัวที่โรงพยาบาล (ในเขตพื้นที่กำหนด)',
      policyNote: 'นโยบายการเดินทาง: บริการรับ-ส่งตามรอบนัดหมายล่วงหน้า เพื่อความสะดวกสบายและความปลอดภัยสูงสุดของสมาชิก',
      icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25v11.25',
    },
    {
      id: 3,
      category: 'medical',
      title: 'Novaria Elite VIP Lounge',
      subtitle: 'ห้องรับรองพิเศษส่วนตัว',
      desc: 'เพลิดเพลินกับเครื่องดื่ม อาหารว่างเพื่อสุขภาพ และบริการอินเทอร์เน็ตความเร็วสูงในระหว่างรอพบแพทย์หรือรอผลตรวจในบรรยากาศเป็นส่วนตัว',
      policyNote: 'นโยบายความเป็นส่วนตัว: สงวนสิทธิ์เฉพาะสมาชิก Elite และผู้ติดตาม เพื่อรักษาบรรยากาศอันเงียบสงบและเป็นส่วนตัว',
      icon: 'M2.25 12h19.5m-18 6h16.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-16.5a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 003.75 18z',
    },
    {
      id: 4,
      category: 'medical',
      title: 'Annual Health Check-up Privilege',
      subtitle: 'สิทธิพิเศษโปรแกรมตรวจสุขภาพประจำปี',
      desc: 'รับสิทธิ์อัปเกรดรายการตรวจเชิงลึกเพิ่มเติม หรือส่วนลดพิเศษสำหรับแพ็กเกจตรวจสุขภาพเฉพาะทางสำหรับสมาชิกและครอบครัว',
      policyNote: 'นโยบายการดูแลเชิงป้องกัน: สนับสนุนการตรวจคัดกรองโรคเบื้องต้นและตรวจเชิงลึกเพื่อให้สมาชิกวางแผนสุขภาพได้อย่างแม่นยำ',
      icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      id: 5,
      category: 'lifestyle',
      title: 'Priority Room Upgrades',
      subtitle: 'สิทธิ์อัปเกรดห้องพักผู้ป่วยใน (IPD)',
      desc: 'รับสิทธิ์ในการอัปเกรดห้องพักฟื้นผู้ป่วยในเป็นระดับพรีเมียม (ขึ้นอยู่กับจำนวนห้องว่างในขณะนั้น) พร้อมส่วนลดค่าห้องพิเศษ',
      policyNote: 'นโยบายการเข้าพัก: จัดสรรห้องพักพรีเมียมเพื่อการพักฟื้นที่สะดวกสบาย พร้อมสิ่งอำนวยความสะดวกครบครัน',
      icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
    },
    {
      id: 6,
      category: 'lifestyle',
      title: 'Special Medical Discount',
      subtitle: 'ส่วนลดค่ายาและค่าแพทย์ผู้เชี่ยวชาญ',
      desc: 'รับส่วนลดพิเศษสูงสุด 15% สำหรับค่ายากลับบ้าน และส่วนลดค่าแพทย์เฉพาะทางตามเงื่อนไขของระดับสมาชิก',
      policyNote: 'นโยบายสิทธิประโยชน์ทาง <b>การเงิน:</b> มอบความคุ้มค่าในการรักษาพยาบาลระยะยาวสำหรับสมาชิกและครอบครัว',
      icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];

  const filteredPrivileges = activeTab === 'all' 
    ? privileges 
    : privileges.filter(p => p.category === activeTab);

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">

      {/* HEADER SECTION */}
      <section className="bg-gradient-to-r from-[#1a2b6d] via-[#20347e] to-[#0f172a] text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-semibold text-sky-200">
            <span>NOVARIA ELITE CARE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">สิทธิพิเศษและนโยบายการดูแล (VIP Privileges)</h1>
          <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
            รายละเอียดนโยบายและสิทธิประโยชน์แต่ละส่วน ออกแบบมาเพื่อมอบความสะดวกสบาย ความเป็นส่วนตัว และมาตรฐานการดูแลระดับสูงสุดอย่างไร้รอยต่อ
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link 
              href="/contact" 
              className="bg-white text-[#1a2b6d] hover:bg-sky-50 font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>ติดต่อสอบถามสิทธิ์</span>
              <Chevron className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex-1 w-full space-y-8">
        
        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#1a2b6d]">รายละเอียดนโยบายและสิทธิประโยชน์</h2>
            <p className="text-xs text-slate-500">ตรวจสอบรายละเอียดการให้บริการในแต่ละหมวดหมู่</p>
          </div>

          <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'all' ? 'bg-[#1a2b6d] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'medical' ? 'bg-[#1a2b6d] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              การแพทย์ & สุขภาพ
            </button>
            <button
              onClick={() => setActiveTab('lifestyle')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'lifestyle' ? 'bg-[#1a2b6d] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              ไลฟ์สไตล์ & บริการ
            </button>
          </div>
        </div>

        {/* Privileges & Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrivileges.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#1a2b6d] group-hover:bg-[#1a2b6d] group-hover:text-white flex items-center justify-center transition-colors duration-200">
                  <Icon className="w-6 h-6" stroke={1.7} d={item.icon} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md inline-block">
                    {item.category === 'medical' ? 'Medical Privilege' : 'Lifestyle Privilege'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1a2b6d] transition-colors pt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">{item.subtitle}</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                {/* ส่วนกล่องนโยบายเพิ่มเติม */}
                <div className="bg-slate-50 border-l-2 border-[#1a2b6d] p-3 rounded-r-lg text-xs text-slate-500 leading-relaxed">
                  <span className="font-semibold text-[#1a2b6d] block mb-0.5">นโยบายการให้บริการ:</span>
                  {item.policyNote}
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

    </div>
  );
}