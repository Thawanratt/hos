'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface PackageItem {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  price: string;
  originalPrice?: string;
  tag?: string;
  imageUrl?: string;
  hospital?: string;
  validDate?: string;
  features?: string[];
  terms?: string[];
}

interface CartItem extends PackageItem {
  quantity: number;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function PackagesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [loading, setLoading] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3500);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/packages');
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setPackages(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleAddToCart = (pkg: PackageItem) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    // 💡 ใช้คีย์กลาง 'novaria_cart' ร่วมกัน เพื่อป้องกันการบันทึกข้อมูลซ้ำซ้อนหลายที่
    const cartKey = 'novaria_cart';
    let currentCart: CartItem[] = [];

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(cartKey);
      if (stored) {
        try {
          currentCart = JSON.parse(stored);
        } catch (e) {
          currentCart = [];
        }
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

    if (typeof window !== 'undefined') {
      // 💡 บันทึกลง 'novaria_cart' เพียงที่เดียวเพื่อให้หน้าร้านและหน้า Checkout ลบข้อมูลง่ายและเคลียร์เกลี้ยง
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
    }

    showToast(`เพิ่ม "${pkg.title}" ลงในตะกร้าเรียบร้อยแล้ว`, 'success');
  };

  const categories = ['ทั้งหมด', 'ตรวจสุขภาพประจำปี', 'วิตามิน & ชะลอวัย', 'สิทธิพิเศษวันเกิด'];
  const filteredPackages = selectedCategory === 'ทั้งหมด' ? packages : packages.filter((item) => item.category === selectedCategory);
  const redirectTarget = encodeURIComponent(pathname);

  return (
    <div className="bg-white pb-20 font-sans text-slate-800 space-y-10 relative">

      {/* AUTH REQUIRED MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-center space-y-5 border border-slate-100">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">✕</button>
            <h3 className="text-lg font-bold text-slate-900">กรุณาเข้าสู่ระบบก่อนเลือกซื้อแพ็กเกจ</h3>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => router.push(`/register?redirect=${redirectTarget}`)} className="w-1/2 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs">สร้างบัญชีใหม่</button>
              <button onClick={() => router.push(`/login?redirect=${redirectTarget}`)} className="w-1/2 py-2.5 bg-[#112260] text-white font-semibold rounded-xl text-xs">เข้าสู่ระบบ</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-xs flex items-center gap-3">
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d]">หน้าแรก</Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">แพ็กเกจและโปรโมชั่น</span>
          </nav>
          <div className="pl-4 border-l-4 border-[#1a2b6d]">
            <h1 className="text-2xl md:text-3xl font-light text-slate-900">แพ็กเกจและ <span className="font-semibold text-[#1a2b6d]">โปรโมชั่นสุขภาพ</span></h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">รวมโปรแกรมตรวจสุขภาพและสิทธิพิเศษเพื่อการดูแลสุขภาพอย่างครอบคลุม</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES FILTER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat ? 'bg-[#1a2b6d] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PACKAGES GRID */}
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">กำลังโหลดแพ็กเกจ...</div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between group">
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img src={item.imageUrl || '/images/default-package.jpg'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    {item.tag && <span className="absolute top-3 left-3 bg-[#1a2b6d] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">{item.tag}</span>}
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="font-bold text-sky-700 text-[11px] uppercase">{item.category}</span>
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.subtitle || 'แพ็กเกจตรวจสุขภาพราคาประหยัด'}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {item.originalPrice && <span className="text-[11px] text-slate-400 line-through block">{item.originalPrice}</span>}
                      <span className="text-lg font-extrabold text-[#1a2b6d]">{item.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/packages/${item.id}`} className="px-3 py-1.5 bg-slate-100 hover:bg-[#1a2b6d] hover:text-white text-slate-700 text-xs font-bold rounded-xl transition">
                        ดูรายละเอียด
                      </Link>
                      <button onClick={() => handleAddToCart(item)} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer">
                        เพิ่มลงตะกร้า
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-xs text-slate-400">ไม่พบแพ็กเกจในหมวดหมู่นี้</div>
        )}
      </main>
    </div>
  );
}