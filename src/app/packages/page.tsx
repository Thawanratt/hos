'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PackagesPage() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  // 🟢 State สำหรับจัดการ Popup แจ้งเตือนสวยๆ
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // ฟังก์ชันเรียกแสดง Popup
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500); // ซ่อนอัตโนมัติใน 2.5 วินาที
  };

  const categories = ['ทั้งหมด', 'ตรวจสุขภาพประจำปี', 'วิตามิน & ชะลอวัย', 'สิทธิพิเศษวันเกิด'];

  const packagesList = [
    {
      id: 1,
      title: 'Birthday Privilege Program',
      category: 'สิทธิพิเศษวันเกิด',
      subtitle: 'ส่วนลดพิเศษสิทธิประโยชน์ตรวจสุขภาพประจำปีสำหรับท่านที่เกิดในเดือนนี้',
      price: '3,500 ฿',
      originalPrice: '6,000 ฿',
      tag: 'Special Offer',
      imageUrl: '/images/bd.jpeg',
      features: ['ตรวจคัดกรองความสมบูรณ์ของเม็ดเลือด', 'ตรวจระดับไขมันและน้ำตาลในเลือด', 'ตรวจการทำงานของตับและไต'],
    },
    {
      id: 2,
      title: 'ชุดตรวจ Vita - Beauty Checkup',
      category: 'วิตามิน & ชะลอวัย',
      subtitle: 'ตรวจวิเคราะห์ระดับวิตามิน แร่ธาตุ และสารต้านอนุมูลอิสระในร่างกายเชิงลึก',
      price: '5,200 ฿',
      originalPrice: '8,500 ฿',
      tag: 'โปรแกรมยอดนิยม',
      imageUrl: '/images/check.jpg',
      features: ['ตรวจระดับวิตามิน A, B, C, D, E', 'ตรวจระดับแร่ธาตุและโลหะหนัก', 'วิเคราะห์ความเสื่อมของเซลล์ผิวพรรณ'],
    },
    {
      id: 3,
      title: 'ชุดตรวจ Mineral & Antioxidant',
      category: 'วิตามิน & ชะลอวัย',
      subtitle: 'ตรวจความสมดุลแร่ธาตุและศักยภาพการต้านอนุมูลอิสระเพื่อการชะลอวัยอย่างยั่งยืน',
      price: '6,800 ฿',
      originalPrice: '11,000 ฿',
      tag: 'แนะนำสำหรับผู้ใหญ่',
      imageUrl: '/images/am.png',
      features: ['ตรวจสมดุลแร่ธาตุในร่างกาย', 'ประเมินประสิทธิภาพระบบภูมิคุ้มกัน', 'ให้คำปรึกษาโดยแพทย์เฉพาะทางด้านเวชศาสตร์ชะลอวัย'],
    },
    {
      id: 4,
      title: 'โปรแกรมตรวจสุขภาพหัวใจขั้นสูง (Advanced Heart Check)',
      category: 'ตรวจสุขภาพประจำปี',
      subtitle: 'ตรวจคัดกรองความเสี่ยงโรคหัวใจและหลอดเลือดด้วยเทคโนโลยีความแม่นยำสูง',
      price: '9,900 ฿',
      originalPrice: '15,000 ฿',
      tag: 'แนะนำ',
      imageUrl: '/images/h.jpeg',
      features: ['ตรวจคลื่นไฟฟ้าหัวใจ (EKG)', 'ตรวจอัลตราซาวด์หัวใจ (Echocardiogram)', 'ตรวจวัดระดับไขมันหลอดเลือดหัวใจเชิงลึก'],
    },
    {
      id: 5,
      title: 'โปรแกรมตรวจสุขภาพทั่วไป (General Health Check)',
      category: 'ตรวจสุขภาพประจำปี',
      subtitle: 'ตรวจสุขภาพโดยรวมเพื่อประเมินสุขภาพโดยรวมของคุณ',
      price: '4,500 ฿',
      originalPrice: '7,000 ฿',
      tag: 'แนะนำสำหรับทุกคน',
      imageUrl: '/images/cu.jpg',
      features: ['ตรวจความดันโลหิต', 'ตรวจระดับน้ำตาลในเลือด', 'ตรวจการทำงานของตับและไต'],
    }
  ];

  const filteredPackages = selectedCategory === 'ทั้งหมด' 
    ? packagesList 
    : packagesList.filter(pkg => pkg.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 pb-20 font-sans relative">
      
      {/* 🟢 TOAST POPUP แจ้งเตือนมุมขวาบนสุดพรีเมียม */}
      <div className={`fixed top-20 right-6 z-50 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold">สำเร็จ</p>
            <p className="text-xs text-slate-300">{toastMessage}</p>
          </div>
        </div>
      </div>

      {/* HEADER BANNER */}
      <div className="bg-[#1a2b6d] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
            Novaria Hospital Promotions
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">แพ็กเกจและโปรโมชั่นสุขภาพ</h1>
          <p className="text-sm text-slate-300 max-w-xl">
            เลือกโปรแกรมตรวจสุขภาพและสิทธิประโยชน์ที่ออกแบบมาเพื่อการดูแลสุขภาพคุณและคนที่คุณรักในราคาพิเศษ
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* FILTER TABS */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1a2b6d] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PACKAGES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                {/* รูปภาพการ์ดด้านบน */}
                <div className="h-44 w-full bg-slate-100 overflow-hidden relative border-b border-slate-100">
                  <img 
                    src={pkg.imageUrl} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <span className="absolute top-3 left-3 bg-[#1a2b6d]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
                    {pkg.tag}
                  </span>
                </div>

                {/* รายละเอียดเนื้อหา */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">{pkg.category}</span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1a2b6d] transition-colors leading-snug line-clamp-2">
                      {pkg.title}
                    </h3>
                  </div>

                  {/* ราคา */}
                  <div className="flex items-baseline space-x-2 pt-1">
                    <span className="text-sm font-extrabold text-red-600">{pkg.price}</span>
                    <span className="text-[11px] text-slate-400 line-through">{pkg.originalPrice}</span>
                  </div>
                </div>
              </div>

              {/* ปุ่มด้านล่างการ์ด */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2 border-t border-slate-100 mt-2 bg-slate-50/50">
                <Link 
                  href={`/packages/${pkg.id}`}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-center block"
                >
                  รายละเอียด
                </Link>

                <button
                  onClick={() => {
                    const existingCart = JSON.parse(localStorage.getItem('novaria_cart') || '[]');
                    const index = existingCart.findIndex((item: any) => item.id === pkg.id);
                    if (index > -1) {
                      existingCart[index].quantity = (existingCart[index].quantity || 1) + 1;
                    } else {
                      existingCart.push({
                        id: pkg.id,
                        title: pkg.title,
                        price: parseInt(pkg.price.replace(/[^0-9]/g, '')),
                        originalPrice: parseInt(pkg.originalPrice.replace(/[^0-9]/g, '')),
                        quantity: 1,
                        hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
                        imageUrl: pkg.imageUrl,
                      });
                    }
                    localStorage.setItem('novaria_cart', JSON.stringify(existingCart));
                    window.dispatchEvent(new Event('cartUpdated'));
                    
                    // 🟢 เรียกใช้งาน Toast Popup สวยๆ แทน alert() แบบเก่า
                    triggerToast(`เพิ่ม "${pkg.title}" ลงตะกร้าแล้ว`);
                  }}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer text-center"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}