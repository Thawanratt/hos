'use client';

import { use, useState } from 'react';
import Link from 'next/link';

export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const packageId = resolvedParams.id;

  // จำลองฐานข้อมูลแพ็กเกจ
  const packagesData: Record<string, any> = {
    '1': {
      title: 'Birthday Privilege Program',
      category: 'สิทธิพิเศษวันเกิด',
      subtitle: 'ส่วนลดพิเศษสิทธิประโยชน์ตรวจสุขภาพประจำปีสำหรับท่านที่เกิดในเดือนนี้',
      price: '3,500 ฿',
      originalPrice: '6,000 ฿',
      tag: 'Special Offer',
      imageUrl: '/images/bd.jpeg',
      hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
      validDate: 'ใช้ได้ถึงวันที่ 31 ต.ค. 2026',
      releaseDate: 'จากการเปิดตัวเมื่อ 25 ก.ย. 2026',
      features: [
        'ตรวจคัดกรองความสมบูรณ์ของเม็ดเลือด (CBC)',
        'ตรวจระดับไขมันในเลือด (Cholesterol, Triglyceride, HDL, LDL)',
        'ตรวจระดับน้ำตาลในเลือด (FBS, HbA1c)',
        'ตรวจการทำงานของตับ (SGOT, SGPT, Alkaline Phosphatase)',
        'ตรวจการทำงานของไต (BUN, Creatinine)'
      ],
      terms: [
        'ขอสงวนสิทธิ์สำหรับผู้ซื้อแพ็กเกจผ่านช่องทาง E-Coupon ผ่านระบบเท่านั้น',
        'E-Coupon นี้ไม่สามารถแลกเปลี่ยนเป็นเงินสดได้',
        'E-Coupon นี้ส่งเสริมการขายรายการรักษาทุกคอร์สโน้น ไม่สามารถเปลี่ยน1แปลงได้',
        'สงวนสิทธิ์เฉพาะผู้รับบริการผู้มีบัตรประชาชนและผู้รับบริการที่ช่วยเหลือตัวเองได้เท่านั้น',
        'ชุดตรวจสุขภาพนี้โปรดเข้ารับบริการที่โรงพยาบาลโนวาเลีย (แผนกตรวจสุขภาพ)',
        'กรุณานัดหมายล่วงหน้าอย่างน้อย 1 วัน ก่อนเข้ารับบริการ'
      ]
    },
    '2': {
      title: 'ชุดตรวจ Vita - Beauty Checkup',
      category: 'วิตามิน & ชะลอวัย',
      subtitle: 'ตรวจวิเคราะห์ระดับวิตามิน แร่ธาตุ และสารต้านอนุมูลอิสระในร่างกายเชิงลึก',
      price: '5,200 ฿',
      originalPrice: '8,500 ฿',
      tag: 'โปรแกรมยอดนิยม',
      imageUrl: '/images/check.jpg',
      hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
      validDate: 'ใช้ได้ถึงวันที่ 31 ธ.ค. 2026',
      releaseDate: 'จากการเปิดตัวเมื่อ 1 ก.ย. 2026',
      features: [
        'ตรวจระดับวิตามิน A, B, C, D, E เชิงลึก',
        'ตรวจระดับแร่ธาตุและโลหะหนักในร่างกาย',
        'วิเคราะห์ความเสื่อมของเซลล์ผิวพรรณและอนุมูลอิสระ'
      ],
      terms: [
        'ขอสงวนสิทธิ์สำหรับผู้ซื้อแพ็กเกจผ่านช่องทางออนไลน์เท่านั้น',
        'กรุณางดน้ำและอาหารอย่างน้อย 8-12 ชั่วโมงก่อนเข้ารับบริการ',
        'กรุณานัดหมายล่วงหน้าก่อนเข้าใช้บริการ'
      ]
    },
    '3': {
      title: 'ชุดตรวจ Mineral & Antioxidant',
      category: 'วิตามิน & ชะลอวัย',
      subtitle: 'ตรวจความสมดุลแร่ธาตุและศักยภาพการต้านอนุมูลอิสระเพื่อการชะลอวัยอย่างยั่งยืน',
      price: '6,800 ฿',
      originalPrice: '11,000 ฿',
      tag: 'แนะนำสำหรับผู้ใหญ่',
      imageUrl: '/images/am.png',
      hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
      validDate: 'ใช้ได้ถึงวันที่ 30 พ.ย. 2026',
      releaseDate: 'จากการเปิดตัวเมื่อ 15 ส.ค. 2026',
      features: [
        'ตรวจสมดุลแร่ธาตุในร่างกาย (Mineral Balance)',
        'ประเมินประสิทธิภาพระบบภูมิคุ้มกันและสารต้านอนุมูลอิสระ',
        'ให้คำปรึกษาโดยแพทย์เฉพาะทางด้านเวชศาสตร์ชะลอวัย'
      ],
      terms: [
        'ขอสงวนสิทธิ์สำหรับผู้ซื้อแพ็กเกจผ่านช่องทางออนไลน์เท่านั้น',
        'กรุณางดน้ำและอาหารอย่างน้อย 8-12 ชั่วโมงก่อนเข้ารับบริการ',
        'กรุณานัดหมายล่วงหน้าก่อนเข้าใช้บริการ'
      ]
    },
    '4': {
        title: 'โปรแกรมตรวจสุขภาพหัวใจขั้นสูง (Advanced Heart Check)',
        category: 'ตรวจสุขภาพประจำปี',
        subtitle: 'ตรวจคัดกรองความเสี่ยงโรคหัวใจและหลอดเลือดด้วยเทคโนโลยีความแม่นยำสูง',
        price: '9,900 ฿',
        originalPrice: '15,000 ฿',
        tag: 'แนะนำ',
        imageUrl: '/images/h.jpeg',
        hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
        validDate: 'ใช้ได้ถึงวันที่ 31 ธ.ค. 2026',
        releaseDate: 'จากการเปิดตัวเมื่อ 1 ต.ค. 2026',
        features: [
            'ตรวจคลื่นไฟฟ้าหัวใจ (EKG)',
            'ตรวจอัลตราซาวด์หัวใจ (Echocardiogram)',
            'ตรวจวัดระดับไขมันหลอดเลือดหัวใจเชิงลึก (Lipid Profile & Advanced Lipid Testing)'
        ],
        terms: [
            'ขอสงวนสิทธิ์สำหรับผู้ซื้อแพ็กเกจผ่านช่องทางออนไลน์เท่านั้น',
            'กรุณางดน้ำและอาหารอย่างน้อย 8-12 ชั่วโมงก่อนเข้ารับบริการ',
            'กรุณานัดหมายล่วงหน้าก่อนเข้าใช้บริการ'
        ]
    },
    '5': {
        title: 'โปรแกรมตรวจสุขภาพทั่วไป (General Health Check)',
        category: 'ตรวจสุขภาพประจำปี',
        subtitle: 'ตรวจสุขภาพโดยรวมเพื่อประเมินสุขภาพโดยรวมของคุณ',
        price: '4,500 ฿',
        originalPrice: '7,000 ฿',
        tag: 'แนะนำสำหรับทุกคน',
        imageUrl: '/images/cu.jpg',
        hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
        validDate: 'ใช้ได้ถึงวันที่ 31 ธ.ค. 2026',
        releaseDate: 'จากการเปิดตัวเมื่อ 1 ต.ค. 2026',
        features: [
            'ตรวจความดันโลหิต',
            'ตรวจระดับน้ำตาลในเลือด',
            'ตรวจการทำงานของตับและไต'
        ],
        terms: [
            'ขอสงวนสิทธิ์สำหรับผู้ซื้อแพ็กเกจผ่านช่องทางออนไลน์เท่านั้น',
            'กรุณางดน้ำและอาหารอย่างน้อย 8-12 ชั่วโมงก่อนเข้ารับบริการ',
            'กรุณานัดหมายล่วงหน้าก่อนเข้าใช้บริการ'
        ]
    }
  };

  // ดึงข้อมูลตาม ID (ถ้าไม่มีให้แสดงตัวอย่างแรก)
  const pkg = packagesData[packageId] || packagesData['1'];

  const handleAddToCart = () => {
    alert(`เพิ่ม "${pkg.title}" ลงในตะกร้าเรียบร้อยแล้ว!`);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 pb-20 font-sans">
      
      {/* TOP NAVIGATION / BREADCRUMB */}
      <div className="bg-white border-b border-slate-200 py-3 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Link href="/" className="hover:text-[#1a2b6d]">หน้าหลัก</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-[#1a2b6d]">แพ็กเกจและโปรโมชั่น</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{pkg.title}</span>
          </div>
          <Link href="/packages" className="border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            กลับหน้าโปรโมชั่น
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-6 mt-6 space-y-6">
        
        {/* ส่วนแสดงข้อมูลหลักด้านบน (ภาพ + ข้อมูลย่อ + ปุ่มซื้อ) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 shadow-2xs">
          
          {/* รูปภาพแพ็กเกจ */}
          <div className="md:col-span-5 h-72 md:h-80 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 relative">
            <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
            <span className="absolute top-3 left-3 bg-[#1a2b6d] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {pkg.tag}
            </span>
          </div>

          {/* รายละเอียดสรุปด้านข้าง */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">{pkg.category}</span>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">{pkg.title}</h1>
              <p className="text-xs text-slate-500 leading-relaxed">{pkg.subtitle}</p>
              
              <div className="text-xs text-slate-400 pt-1">
                สถานที่รับบริการ: <span className="text-slate-700 font-semibold">{pkg.hospital}</span>
              </div>
            </div>

            {/* ราคาและปุ่มสั่งซื้อ */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 line-through block">{pkg.originalPrice}</span>
                <span className="text-xl font-extrabold text-[#1a2b6d]">{pkg.price}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  ซื้อแพ็กเกจนี้
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ข้อมูลแพ็กเกจ (รายการตรวจ) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-3 shadow-2xs">
          <h2 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
            ข้อมูลแพ็กเกจ
          </h2>
          <ul className="space-y-2 text-xs md:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
            {pkg.features.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ระยะเวลา */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-3 shadow-2xs">
          <h2 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
            ระยะเวลา
          </h2>
          <div className="space-y-1 text-xs text-slate-600">
            <p>• {pkg.validDate}</p>
            <p>• {pkg.releaseDate}</p>
          </div>
        </div>

        {/* เงื่อนไขการใช้บริการ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-3 shadow-2xs">
          <h2 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
            เงื่อนไขการใช้บริการ
          </h2>
          <ol className="space-y-2 text-xs text-slate-600 list-decimal pl-5 leading-relaxed">
            {pkg.terms.map((term: string, idx: number) => (
              <li key={idx}>{term}</li>
            ))}
          </ol>
        </div>

      </main>
    </div>
  );
}