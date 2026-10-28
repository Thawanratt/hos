'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

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

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function PackageDetailPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const router = useRouter();
  const pathname = usePathname();
  const resolvedParams = use(params);
  const packageId = resolvedParams.id;

  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // States สำหรับตะกร้าสินค้าและผู้ใช้งาน
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // State สำหรับควบคุม Auth Modal และ Toast
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3500);
  };

  // โหลดข้อมูลผู้ใช้และตะกร้าสินค้าจาก localStorage (ใช้คีย์กลาง 'novaria_cart')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const activeUser = JSON.parse(storedUser);
          setCurrentUser(activeUser);
        } catch (e) {
          console.error('Failed to parse user:', e);
        }
      }

      const cartKey = 'novaria_cart';
      const storedCart = localStorage.getItem(cartKey);
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
      const cartKey = 'novaria_cart';
      localStorage.setItem(cartKey, JSON.stringify(newCart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้าพร้อมระบบเช็กล็อกอินและแจ้งเตือน
  const handleAddToCart = () => {
    if (!pkg) return;

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const cartKey = 'novaria_cart';
    let currentCart: CartItem[] = [];

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(cartKey);
      if (stored) {
        try {
          currentCart = JSON.parse(stored);
        } catch {
          currentCart = cart;
        }
      } else {
        currentCart = cart;
      }
    }

    const existingIndex = currentCart.findIndex((item) => String(item.id) === String(pkg.id));
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = currentCart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updatedCart = [...currentCart, { ...pkg, quantity: 1 }];
    }

    updateCart(updatedCart);
    showToast(`เพิ่ม "${pkg.title}" ลงในตะกร้าเรียบร้อยแล้ว`, 'success');
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

  const redirectTarget = encodeURIComponent(pathname);

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 pb-20 font-sans relative">

      {/* AUTH REQUIRED MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-center space-y-5 border border-slate-100">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-14 h-14 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center mx-auto border border-slate-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">กรุณาเข้าสู่ระบบก่อนเลือกซื้อแพ็กเกจ</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                ท่านจำเป็นต้องเข้าสู่ระบบสมาชิกของโรงพยาบาลก่อนทำการเลือกซื้อหรือรับบริการแพ็กเกจสุขภาพ
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => router.push(`/register?redirect=${redirectTarget}`)}
                className="w-1/2 py-2.5 px-4 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                สร้างบัญชีใหม่
              </button>
              <button
                onClick={() => router.push(`/login?redirect=${redirectTarget}`)}
                className="w-1/2 py-2.5 px-4 bg-[#112260] text-white font-semibold rounded-xl text-xs hover:bg-[#0c1845] transition shadow-md cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-lg border text-xs font-medium flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-slate-900 text-white border-slate-800' :
            toast.type === 'error' ? 'bg-red-900 text-white border-red-800' : 'bg-slate-800 text-white border-slate-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
            }`} />
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast({ show: false, message: '', type: 'info' })} 
              className="ml-2 text-slate-400 hover:text-white cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
      )}

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
          <div className="space-y-1 text-xs md:text-sm text-slate-600 leading-relaxed">
            <p>{pkg.validDate || 'ใช้สิทธิ์ได้ถึงวันที่ 31 ธันวาคม 2026'}</p>
          </div>
        </div>

        {/* เงื่อนไขการใช้บริการ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-[#1a2b6d] flex items-center gap-2 border-b border-slate-100 pb-3">
            เงื่อนไขการใช้บริการ
          </h2>
          <ul className="space-y-2 text-xs md:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
            {termsList.map((term: string, idx: number) => (
              <li key={idx}>{term}</li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  );
}