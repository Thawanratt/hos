'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';

interface PackageDetail {
  id: number;
  title: string;
  category: string;
  subtitle?: string;
  price: string;
  originalPrice?: string;
  tag?: string;
  imageUrl?: string;
  hospital?: string;
  validDate?: string;
  releaseDate?: string;
  features?: string[];
  terms?: string[];
}

interface CartItem extends PackageDetail {
  quantity: number;
}

export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const packageId = resolvedParams.id;

  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // State สำหรับตะกร้าสินค้า
  const [cart, setCart] = useState<CartItem[]>([]);

  // โหลดข้อมูลตะกร้าจาก localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('novaria_cart');
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error('Failed to parse cart:', e);
        }
      }
    }
  }, []);

  // ดึงข้อมูลแพ็กเกจจริงจาก API ตาม ID
  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/packages');
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const found = result.data.find(
            (item: any) => String(item.id) === String(packageId)
          );
          
          if (found) {
            setPkg(found);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching package detail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetail();
    }
  }, [packageId]);

  // ฟังก์ชันอัปเดต Cart ใน localStorage และแจ้ง Event
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('novaria_cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้าแบบตรงไปตรงมา (ไม่มี Pop-up/Alert)
  const handleAddToCart = () => {
    if (!pkg) return;

    const existingIndex = cart.findIndex((item) => item.id === pkg.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...pkg, quantity: 1 }];
    }

    updateCart(updatedCart);
  };

  // แสดง Loading ระหว่างดึงข้อมูล
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100/60 flex items-center justify-center p-6">
        <p className="text-slate-500 font-medium text-xs">กำลังโหลดข้อมูลแพ็กเกจ...</p>
      </div>
    );
  }

  // กรณีหาแพ็กเกจไม่เจอ
  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-slate-100/60 flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-slate-600 font-bold text-sm">ไม่พบข้อมูลแพ็กเกจที่คุณต้องการ</p>
        <Link href="/packages" className="px-4 py-2 bg-[#1a2b6d] text-white rounded-xl text-xs">
          กลับไปหน้าแพ็กเกจทั้งหมด
        </Link>
      </div>
    );
  }

  // กำหนด Default Fallback กรณีที่ไม่ได้กรอกข้อมูลบางช่องลงใน Database
  const featuresList = pkg.features && pkg.features.length > 0 ? pkg.features : [
    'ตรวจวิเคราะห์สุขภาพเบื้องต้นโดยแพทย์ผู้เชี่ยวชาญ',
    'ตรวจวัดสัญญาณชีพ ความดันโลหิต และดัชนีมวลกาย',
    'ใบรายงานผลสุขภาพแบบละเอียด'
  ];

  const termsList = pkg.terms && pkg.terms.length > 0 ? pkg.terms : [
    'ขอสงวนสิทธิ์สำหรับผู้ซื้อแพ็กเกจผ่านระบบออนไลน์เท่านั้น',
    'ไม่สามารถแลกเปลี่ยนหรือทอนเป็นเงินสดได้',
    'กรุณานัดหมายล่วงหน้าอย่างน้อย 1 วัน ก่อนเข้ารับบริการ'
  ];

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
        
        {/* ส่วนแสดงข้อมูลหลักด้านบน */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 shadow-xs">
          
          {/* รูปภาพแพ็กเกจ */}
          <div className="md:col-span-5 h-72 md:h-80 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 relative">
            <img 
              src={pkg.imageUrl || '/images/default-package.jpg'} 
              alt={pkg.title} 
              className="w-full h-full object-cover" 
            />
            {pkg.tag && (
              <span className="absolute top-3 left-3 bg-[#1a2b6d] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                {pkg.tag}
              </span>
            )}
          </div>

          {/* รายละเอียดสรุปด้านข้าง */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">{pkg.category}</span>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">{pkg.title}</h1>
              {pkg.subtitle && <p className="text-xs text-slate-500 leading-relaxed">{pkg.subtitle}</p>}
              
              <div className="text-xs text-slate-400 pt-1">
                สถานที่รับบริการ: <span className="text-slate-700 font-semibold">{pkg.hospital || 'สำนักงานใหญ่'}</span>
              </div>
            </div>

            {/* ราคาและปุ่มสั่งซื้อ */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                {pkg.originalPrice && (
                  <span className="text-[11px] text-slate-400 line-through block">{pkg.originalPrice}</span>
                )}
                <span className="text-xl font-extrabold text-[#1a2b6d]">{pkg.price}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  ซื้อแพ็กเกจนี้
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* รายการตรวจ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
            ข้อมูลแพ็กเกจ
          </h2>
          <ul className="space-y-2 text-xs md:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
            {featuresList.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ระยะเวลา */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
            ระยะเวลา
          </h2>
          <div className="space-y-1 text-xs text-slate-600">
            <p>{pkg.validDate || 'ใช้สิทธิ์ได้ถึงวันที่ 31 ธันวาคม 2026'}</p>
            {pkg.releaseDate && <p>{pkg.releaseDate}</p>}
          </div>
        </div>

        {/* เงื่อนไขการใช้บริการ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
            เงื่อนไขการใช้บริการ
          </h2>
          <ol className="space-y-2 text-xs text-slate-600 list-decimal pl-5 leading-relaxed">
            {termsList.map((term: string, idx: number) => (
              <li key={idx}>{term}</li>
            ))}
          </ol>
        </div>

      </main>
    </div>
  );
}