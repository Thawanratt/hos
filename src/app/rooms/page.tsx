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
    image: '/images/default-package.jpg', // สามารถเปลี่ยนเป็น URL รูปภาพจริงได้
    roomFee: '19,900 บาท',
    nursingFee: '4,300 บาท',
    hospitalFee: '2,800 บาท',
    totalFee: '27,000 บาท',
    description: 'ห้องพักผู้ป่วยพิเศษเดี่ยวขนาดใหญ่ (Suite) ออกแบบพิเศษเพื่อความสะดวกสบายสูงสุด พร้อมพื้นที่รับรองสำหรับญาติและสิ่งอำนวยความสะดวกครบครันระดับโรงแรม 5 ดาว',
    amenities: [
      'เตียงผู้ป่วยปรับไฟฟ้า',
      'ห้องน้ำส่วนตัวพร้อมเครื่องทำน้ำอุ่น',
      'Wi-Fi อินเทอร์เน็ตความเร็วสูง',
      'ทีวีจอแบนระบบดิจิทัล',
      'ไมโครเวฟ / ตู้เย็น',
      'โซฟารับแขกสำหรับญาติ',
      'ชุดรับประทานอาหาร',
      'เครื่องกรองอากาศในห้อง'
    ],
    conditions: [
      'ไม่เกิน 12 ชั่วโมง คิดครึ่งวัน',
      '12 ชั่วโมง - 24 ชั่วโมง คิดเป็น 1 วัน',
      'กรณีเกินกว่า 24 ชั่วโมง เศษของวันถัดไปถ้าน้อยกว่า 12 ชั่วโมง คิดครึ่งวัน',
      'สามารถใช้มือถือติดต่อเข้า 2 ชั่วโมง ในอัตราอัตราค่าบริการที่กำหนด'
    ]
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    ward: 'Ward 12B',
    image: '/images/default-package.jpg',
    roomFee: '12,500 บาท',
    nursingFee: '3,200 บาท',
    hospitalFee: '1,800 บาท',
    totalFee: '17,500 บาท',
    description: 'ห้องพักเดี่ยวดีลักษ์ กว้างขวาง โปร่งสบาย ให้บรรยากาศอบอุ่นเสมือนอยู่บ้าน พร้อมการดูแลอย่างใกล้ชิดจากทีมพยาบาลวิชาชีพ',
    amenities: [
      'เตียงผู้ป่วยมาตรฐาน',
      'ห้องน้ำส่วนตัว',
      'Wi-Fi อินเทอร์เน็ต',
      'ทีวีดิจิทัล',
      'ตู้เย็นขนาดเล็ก',
      'โซฟาเบดสำหรับผู้ดูแล'
    ],
    conditions: [
      'ไม่เกิน 12 ชั่วโมง คิดครึ่งวัน',
      '12 ชั่วโมง - 24 ชั่วโมง คิดเป็น 1 วัน',
      'กรณีเกินกว่า 24 ชั่วโมง คิดตามอัตราค่าบริการรายวัน'
    ]
  },
  {
    id: 'superior',
    name: 'Superior Room',
    ward: 'Ward 10A',
    image: '/images/default-package.jpg',
    roomFee: '8,500 บาท',
    nursingFee: '2,500 บาท',
    hospitalFee: '1,200 บาท',
    totalFee: '12,200 บาท',
    description: 'ห้องพักผู้ป่วยเดี่ยวสไตล์โมเดิร์น เน้นความสะอาด ปลอดภัย และความคุ้มค่าในการพักรักษาตัว',
    amenities: [
      'เตียงผู้ป่วย',
      'ห้องน้ำส่วนตัว',
      'Wi-Fi อินเทอร์เน็ต',
      'ทีวี',
      'ตู้เย็น'
    ],
    conditions: [
      'ไม่เกิน 12 ชั่วโมง คิดครึ่งวัน',
      '12 ชั่วโมง - 24 ชั่วโมง คิดเป็น 1 วัน'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Room',
    ward: 'Ward 8C',
    image: '/images/default-package.jpg',
    roomFee: '4,500 บาท',
    nursingFee: '1,500 บาท',
    hospitalFee: '800 บาท',
    totalFee: '6,800 บาท',
    description: 'ห้องพักรวมมาตรฐาน สะอาด ปลอดภัย พร้อมอุปกรณ์การแพทย์และสิ่งอำนวยความสะดวกพื้นฐานครบครัน',
    amenities: [
      'เตียงผู้ป่วย',
      'ห้องน้ำรวม/ส่วนตัวตามโซน',
      'ระบบเรียกพยาบาลฉุกเฉิน'
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
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans pb-24">
      
      {/* HEADER SECTION */}
      <section className="bg-white border-b border-slate-200 py-12 px-6 text-center space-y-3">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-slate-600">หน้าแรก</Link> / ข้อมูลผู้เข้ารับบริการ / <span className="text-[#1a2b6d] font-semibold">ห้องพักผู้ป่วย</span>
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2b6d] tracking-tight">ห้องพักผู้ป่วย</h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            โรงพยาบาลโนวาเลีย เพียบพร้อมไปด้วยห้องพักหลากหลายระดับ ตั้งแต่แบบ Standard, Deluxe, Superior, Suite ไปจนถึง Critical Care เพื่อรองรับความต้องการและการดูแลอย่างปลอดภัย[cite: 3]
          </p>
        </div>

        {/* DROPDOWN SELECTOR (สไตล์ตามเรฟเฟอเรนซ์) */}
        <div className="max-w-md mx-auto pt-4 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-slate-300 hover:border-[#1a2b6d] rounded-2xl p-4 flex items-center justify-between shadow-2xs transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a2b6d] flex items-center justify-center font-bold">
                🛏️
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">ประเภทห้องพักที่เลือก</span>
                <span className="text-sm font-bold text-[#1a2b6d]">{currentRoom.name} ({currentRoom.ward})</span>
              </div>
            </div>
            <svg className={`w-5 h-5 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* DROPDOWN MENU[cite: 4] */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100 text-left animate-fadeIn">
              {roomData.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-5 py-3.5 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    selectedRoomId === room.id ? 'bg-blue-50/80 text-[#1a2b6d]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{room.name} <span className="text-slate-400 font-normal">({room.ward})</span></span>
                  {selectedRoomId === room.id && <span className="text-blue-600 font-bold">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ROOM DETAIL DISPLAY SECTION[cite: 3] */}
      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-10">
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT: IMAGE & DESC */}
          <div className="lg:col-span-7 p-6 md:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-[#1a2b6d] text-xs font-bold rounded-full">
                  {currentRoom.ward}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: ROOM-{currentRoom.id.toUpperCase()}</span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">{currentRoom.name}</h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {currentRoom.description}
              </p>
            </div>

            {/* ROOM IMAGE PREVIEW */}
            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={currentRoom.image}
                alt={currentRoom.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT: PRICING BREAKDOWN[cite: 3] */}
          <div className="lg:col-span-5 bg-slate-50/80 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">
                รายละเอียดค่าบริการห้องพัก
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

            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-700 uppercase">รวมราคาต่อวัน</span>
                <span className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d] font-mono">{currentRoom.totalFee}</span>
              </div>

              <button
                onClick={() => alert(`คุณเลือกจองข้อมูลห้องพัก ${currentRoom.name} เรียบร้อยแล้ว เจ้าหน้าที่ ฯ จะติดต่อกลับเพื่อยืนยันสิทธิ์`)}
                className="w-full py-3 bg-[#1a2b6d] hover:bg-[#0f1a42] text-white font-semibold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                1 ติดต่อสอบถามห้องพักนี้
              </button>
            </div>
          </div>

        </div>

        {/* AMENITIES & CONDITIONS GRID (ตามเรฟเฟอเรนซ์)[cite: 3] */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* สิ่งอำนวยความสะดวกในห้อง[cite: 3] */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
              <span>🧰</span> สิ่งอำนวยความสะดวกในห้อง
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              {currentRoom.amenities.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* หลักการคิดค่าบริการห้องพัก[cite: 3] */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
              <span>📋</span> หลักการคิดค่าบริการห้องพัก
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {currentRoom.conditions.map((cond, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
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