'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RoomType {
  id: string;
  name: string;
  ward: string;
  image: string;
  roomFee: string;
  nursingFee: string;
  hospitalFee: string;
  totalFee: string;
  description: string;
  amenities: string[];
  conditions: string[];
}

const roomData: RoomType[] = [
  {
    id: 'suite',
    name: 'Suite Room',
    ward: 'Ward 14D',
    image: '/images/r1.jpg',
    roomFee: '19,900 บาท',
    nursingFee: '4,300 บาท',
    hospitalFee: '2,800 บาท',
    totalFee: '27,000 บาท',
    description: 'ห้องพักผู้ป่วยพิเศษเดี่ยวขนาดใหญ่ (Suite) ออกแบบพิเศษเพื่อความสะดวกสบายสูงสุด พร้อมพื้นที่รับรองสำหรับญาติและสิ่งอำนวยความสะดวกครบครันระดับโรงแรม',
    amenities: [
      'เตียงผู้ป่วยปรับไฟฟ้าควบคุมด้วยระบบดิจิทัล',
      'ห้องน้ำส่วนตัวแยกโซนเปียกและแห้ง',
      'สัญญาณอินเทอร์เน็ตไร้สายความเร็วสูง',
      'โทรทัศน์จอแบนระบบดิจิทัล',
      'ตู้เย็นและไมโครเวฟส่วนตัว',
      'ชุดโซฟารับแขกสำหรับญาติผู้ดูแล',
      'โต๊ะรับประทานอาหารภายในห้อง',
      'เครื่องกรองอากาศบริสุทธิ์'
    ],
    conditions: [
      'การพักรักษาตัวไม่เกิน 12 ชั่วโมง คิดอัตราค่าบริการครึ่งวัน',
      'การพักรักษาตัว 12 ชั่วโมงถึง 24 ชั่วโมง คิดอัตราค่าบริการ 1 วัน',
      'กรณีเกินกว่า 24 ชั่วโมง เศษของวันถัดไปถ้าน้อยกว่า 12 ชั่วโมง คิดอัตราครึ่งวัน',
      'อัตราค่าบริการนี้ครอบคลุมการดูแลพยาบาลพื้นฐานตามมาตรฐานโรงพยาบาล'
    ]
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    ward: 'Ward 12B',
    image: '/images/r2.jpg',
    roomFee: '12,500 บาท',
    nursingFee: '3,200 บาท',
    hospitalFee: '1,800 บาท',
    totalFee: '17,500 บาท',
    description: 'ห้องพักเดี่ยวดีลักษ์ กว้างขวาง โปร่งสบาย ให้บรรยากาศอบอุ่น พร้อมการดูแลอย่างใกล้ชิดจากทีมพยาบาลวิชาชีพตลอด 24 ชั่วโมง',
    amenities: [
      'เตียงผู้ป่วยมาตรฐานทางการแพทย์',
      'ห้องน้ำส่วนตัวภายในห้องพัก',
      'สัญญาณอินเทอร์เน็ตไร้สาย',
      'โทรทัศน์ระบบดิจิทัล',
      'ตู้เย็นขนาดมาตรฐาน',
      'โซฟาเบดสำหรับผู้ดูแล'
    ],
    conditions: [
      'การพักรักษาตัวไม่เกิน 12 ชั่วโมง คิดอัตราค่าบริการครึ่งวัน',
      'การพักรักษาตัว 12 ชั่วโมงถึง 24 ชั่วโมง คิดอัตราค่าบริการ 1 วัน',
      'คิดอัตราค่าบริการตามรอบ 24 ชั่วโมง'
    ]
  },
  {
    id: 'superior',
    name: 'Superior Room',
    ward: 'Ward 10A',
    image: '/images/r3.jpg',
    roomFee: '8,500 บาท',
    nursingFee: '2,500 บาท',
    hospitalFee: '1,200 บาท',
    totalFee: '12,200 บาท',
    description: 'ห้องพักผู้ป่วยเดี่ยวสไตล์โมเดิร์น เน้นความสะอาด ปลอดภัย และความคุ้มค่าในการพักรักษาตัว',
    amenities: [
      'เตียงผู้ป่วยปรับระดับ',
      'ห้องน้ำส่วนตัว',
      'สัญญาณอินเทอร์เน็ตไร้สาย',
      'โทรทัศน์',
      'ตู้เย็น'
    ],
    conditions: [
      'การพักรักษาตัวไม่เกิน 12 ชั่วโมง คิดอัตราค่าบริการครึ่งวัน',
      'การพักรักษาตัว 12 ชั่วโมงถึง 24 ชั่วโมง คิดอัตราค่าบริการ 1 วัน'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Room',
    ward: 'Ward 8C',
    image: '/images/r4.jpg',
    roomFee: '4,500 บาท',
    nursingFee: '1,500 บาท',
    hospitalFee: '800 บาท',
    totalFee: '6,800 บาท',
    description: 'ห้องพักรวมมาตรฐาน สะอาด ปลอดภัย พร้อมอุปกรณ์การแพทย์และระบบติดตามอาการตลอดเวลา',
    amenities: [
      'เตียงผู้ป่วยมาตรฐาน',
      'ห้องน้ำรวมและส่วนตัวตามโซน',
      'ระบบเรียกพยาบาลฉุกเฉินประจำเตียง'
    ],
    conditions: [
      'คิดอัตราค่าบริการตามรอบ 24 ชั่วโมง'
    ]
  }
];

export default function RoomsPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('suite');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const currentRoom = roomData.find((r) => r.id === selectedRoomId) || roomData[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans pb-24">
      
      {/* 🏥 HEADER BANNER - EXECUTIVE ACCENT BAR STYLE */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          
          <div className="space-y-3">
            <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">ห้องพักผู้ป่วย</span>
            </nav>

            <div className="pl-4 border-l-4 border-[#1a2b6d] py-0.5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight leading-tight">
                  ข้อมูลห้องพัก <span className="font-semibold text-[#1a2b6d]">และอัตราค่าบริการ</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
                  โรงพยาบาลโนวาเลียพร้อมให้บริการห้องพักที่สะอาด ปลอดภัย และเพียบพร้อมด้วยสิ่งอำนวยความสะดวก
                </p>
              </div>

              {/* DROPDOWN SELECTOR */}
              <div className="w-full md:w-72 relative self-start md:self-auto">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  เลือกประเภทห้องพัก
                </span>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-slate-300 hover:border-[#0b192c] rounded-xl px-4 py-2.5 flex items-center justify-between transition text-left cursor-pointer shadow-2xs"
                >
                  <span className="text-xs font-bold text-[#0b192c]">{currentRoom.name} ({currentRoom.ward})</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100 text-left">
                    {roomData.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => {
                          setSelectedRoomId(room.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          selectedRoomId === room.id ? 'bg-slate-100 text-[#0b192c]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{room.name} <span className="text-slate-400 font-normal">({room.ward})</span></span>
                        {selectedRoomId === room.id && <span className="text-[#0b192c] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div> 

        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-8">
        
        {/* ROOM DETAILS CONTAINER */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT: INFORMATION & PREVIEW */}
          <div className="lg:col-span-7 p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-[#0b192c] uppercase tracking-wider">
                  {currentRoom.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Location: {currentRoom.ward}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {currentRoom.description}
              </p>
            </div>

            {/* ROOM IMAGE */}
            <div className="relative h-64 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={currentRoom.image}
                alt={currentRoom.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT: PRICING BREAKDOWN */}
          <div className="lg:col-span-5 bg-[#f8f9fa] border-t lg:border-t-0 lg:border-l border-slate-200 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">
                ค่าบริการห้องพัก / Room Charge
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>ค่าห้องพัก (Room Rate)</span>
                  <span className="font-semibold text-slate-900 font-mono">{currentRoom.roomFee}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>ค่าบริการพยาบาล (Nursing Service)</span>
                  <span className="font-semibold text-slate-900 font-mono">{currentRoom.nursingFee}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>ค่าบริการโรงพยาบาล (Hospital Service)</span>
                  <span className="font-semibold text-slate-900 font-mono">{currentRoom.hospitalFee}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-700 uppercase">รวมค่าบริการทั้งสิ้น</span>
                <span className="text-xl font-extrabold text-[#0b192c] font-mono">{currentRoom.totalFee}</span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                * อัตรานี้ยังไม่รวมค่ายา เวชภัณฑ์ และค่าแพทย์ผู้รักษา
              </p>
            </div>
          </div>

        </div>

        {/* AMENITIES & CONDITIONS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* สิ่งอำนวยความสะดวก */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#0b192c] uppercase tracking-wider border-b border-slate-100 pb-3">
              สิ่งอำนวยความสะดวกภายในห้อง / Room Facilities
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {currentRoom.amenities.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* เงื่อนไขการคิดค่าบริการ */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#0b192c] uppercase tracking-wider border-b border-slate-100 pb-3">
              หลักการคิดค่าบริการห้องพัก
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {currentRoom.conditions.map((cond, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0b192c] rounded-full mt-1.5"></span>
                  <span className="leading-relaxed">{cond}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </main>
    </div>
  );
}