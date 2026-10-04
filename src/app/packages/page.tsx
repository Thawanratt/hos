'use client';

import { useState, useEffect, ChangeEvent } from 'react';
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
}

interface CartItem extends PackageItem {
  quantity: number;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmState {
  show: boolean;
  message: string;
  onConfirm: () => void;
}

export default function PackagesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [loading, setLoading] = useState<boolean>(true);

  // States สำหรับระบบตะกร้าสินค้า
  const [cart, setCart] = useState<CartItem[]>([]);

  // States สำหรับสิทธิ์ ADMIN และผู้ใช้
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // State สำหรับควบคุม Auth Modal
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'ตรวจสุขภาพประจำปี',
    price: '',
    originalPrice: '',
    tag: '',
    imageUrl: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Notifications UI
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({ show: false, message: '', onConfirm: () => { } });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3500);
  };

  const getCartStorageKey = (user: any) => {
    return user?.id ? `novaria_cart_${user.id}` : 'novaria_cart';
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      let activeUser = null;
      if (storedUser) {
        try {
          activeUser = JSON.parse(storedUser);
          setCurrentUser(activeUser);
          if (activeUser.role === 'ADMIN' || activeUser.email === 'admin@novalia.com') {
            setIsAdmin(true);
          }
        } catch (e) {
          setIsAdmin(false);
        }
      }

      const cartKey = getCartStorageKey(activeUser);
      const storedCart = localStorage.getItem(cartKey) || localStorage.getItem('novaria_cart');
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error('Failed to parse cart:', e);
        }
      }
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      const cartKey = getCartStorageKey(currentUser);
      localStorage.setItem(cartKey, JSON.stringify(newCart));
      localStorage.setItem('novaria_cart', JSON.stringify(newCart)); // Sync ไว้ที่คีย์หลักด้วย
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleAddToCart = (pkg: PackageItem) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    // ดึงข้อมูล Cart ล่าสุดจาก localStorage โดยตรง
    const cartKey = getCartStorageKey(currentUser);
    let currentCart: CartItem[] = [];

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(cartKey) || localStorage.getItem('novaria_cart');
      if (stored) {
        try {
          currentCart = JSON.parse(stored);
        } catch (e) {
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

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return showToast('ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB', 'error');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        showToast('เลือกรูปภาพเรียบร้อยแล้ว', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      return showToast('กรุณากรอกชื่อแพ็กเกจและราคาโปรโมชั่น', 'error');
    }

    setSubmitting(true);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const bodyPayload = editingId ? { packageId: editingId, ...formData } : formData;

      const res = await fetch('/api/packages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const result = await res.json();
      if (result.success) {
        showToast(editingId ? 'แก้ไขแพ็กเกจเรียบร้อยแล้ว' : 'เพิ่มแพ็กเกจใหม่เรียบร้อยแล้ว', 'success');
        resetForm();
        fetchPackages();
      } else {
        showToast(result.message || 'ดำเนินการไม่สำเร็จ', 'error');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      show: true,
      message: 'คุณต้องการลบแพ็กเกจนี้ออกจากระบบใช่หรือไม่?',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, show: false }));
        try {
          const res = await fetch(`/api/packages?packageId=${id}`, { method: 'DELETE' });
          const result = await res.json();
          if (result.success) {
            showToast('ลบแพ็กเกจเรียบร้อยแล้ว', 'success');
            fetchPackages();
          } else {
            showToast(result.message || 'ลบไม่สำเร็จ', 'error');
          }
        } catch (err) {
          showToast('เกิดข้อผิดพลาดในการลบแพ็กเกจ', 'error');
        }
      },
    });
  };

  const handleEditClick = (pkg: PackageItem) => {
    setEditingId(pkg.id);
    setFormData({
      title: pkg.title,
      subtitle: pkg.subtitle || '',
      category: pkg.category || 'ตรวจสุขภาพประจำปี',
      price: pkg.price,
      originalPrice: pkg.originalPrice || '',
      tag: pkg.tag || '',
      imageUrl: pkg.imageUrl || '',
    });
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'ตรวจสุขภาพประจำปี',
      price: '',
      originalPrice: '',
      tag: '',
      imageUrl: '',
    });
  };

  const categories = ['ทั้งหมด', 'ตรวจสุขภาพประจำปี', 'วิตามิน & ชะลอวัย', 'สิทธิพิเศษวันเกิด'];

  const filteredPackages = selectedCategory === 'ทั้งหมด'
    ? packages
    : packages.filter((item) => item.category === selectedCategory);

  const redirectTarget = encodeURIComponent(pathname);

  return (
    <div className="bg-white pb-20 font-sans text-slate-800 space-y-10 relative">

      {/* AUTH REQUIRED MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-center space-y-5 border border-slate-100">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
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
          <div className={`px-4 py-3 rounded-lg shadow-lg border text-xs font-medium flex items-center gap-3 ${toast.type === 'success' ? 'bg-slate-900 text-white border-slate-800' :
            toast.type === 'error' ? 'bg-red-900 text-white border-red-800' : 'bg-slate-800 text-white border-slate-700'
            }`}>
            <span className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
              }`} />
            <span>{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: '', type: 'info' })} className="ml-2 text-slate-400 hover:text-white">&times;</button>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">ยืนยันการทำรายการ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setConfirmModal((prev) => ({ ...prev, show: false }))} className="px-3.5 py-1.5 rounded-md text-xs border border-slate-300 text-slate-600 hover:bg-slate-50 transition">ยกเลิก</button>
              <button onClick={confirmModal.onConfirm} className="px-3.5 py-1.5 rounded-md text-xs bg-red-600 text-white font-medium hover:bg-red-700 transition">ยืนยันการลบ</button>
            </div>
          </div>
        </div>
      )}

  {/* BANNER STYLE 2: EXECUTIVE ACCENT BAR */}
<section className="bg-white border-b border-slate-200 py-8 md:py-12">
  <div className="max-w-7xl mx-auto px-6 md:px-8">
    {/* Breadcrumb บอกลำดับหน้า */}
    <div className="text-xs text-slate-400 font-normal mb-3">
      <Link href="/" className="hover:text-[#1a2b6d]">หน้าแรก</Link>
      <span className="mx-1.5 text-slate-300">&gt;</span>
      <span className="text-slate-700 font-medium">แพ็กเกจและโปรโมชั่น</span>
    </div>

    {/* หัวข้อฝั่งซ้าย พร้อมเส้นแนวตั้งขอบสีน้ำเงิน */}
    <div className="border-l-4 border-[#1a2b6d] pl-4 space-y-1">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
        แพ็กเกจและโปรโมชั่น
      </h1>
      <p className="text-xs md:text-sm text-slate-500 font-normal">
        เลือกสรรโปรแกรมตรวจสุขภาพและสิทธิพิเศษทางการแพทย์ตามช่วงวัย
      </p>
    </div>
  </div>
</section>

      {/* ADMIN CONTROLS PANEL */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h2 className="font-bold text-[#1a2b6d] text-base">
                  {editingId ? 'แก้ไขข้อมูลแพ็กเกจ' : 'จัดการและเพิ่มแพ็กเกจใหม่'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingId ? 'แก้ไขรายละเอียดแพ็กเกจที่เลือก' : 'กรอกข้อมูลด้านล่างเพื่อเพิ่มแพ็กเกจบนเว็บไซต์'}
                </p>
              </div>
              {editingId && (
                <button onClick={resetForm} className="text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white px-3 py-1.5 rounded-md transition">
                  ยกเลิกการแก้ไข
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-semibold text-slate-700">ชื่อแพ็กเกจ *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="เช่น โปรแกรมตรวจสุขภาพประจำปี"
                    className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#1a2b6d]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">หมวดหมู่</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#1a2b6d]"
                  >
                    <option value="ตรวจสุขภาพประจำปี">ตรวจสุขภาพประจำปี</option>
                    <option value="วิตามิน & ชะลอวัย">วิตามิน & ชะลอวัย</option>
                    <option value="สิทธิพิเศษวันเกิด">สิทธิพิเศษวันเกิด</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">ราคาโปรโมชั่น *</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="เช่น 3,500 ฿"
                    className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#1a2b6d]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">ราคาปกติ</label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="เช่น 6,000 ฿"
                    className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">ป้ายกำกับ (Tag)</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="เช่น โปรแกรมยอดนิยม"
                    className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>
              </div>

              {/* รูปภาพประกอบ */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <label className="font-semibold text-slate-700 block">รูปภาพแพ็กเกจ</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">เลือกไฟล์จากเครื่อง</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-[11px] text-slate-500 border border-slate-300 bg-white rounded-md file:mr-3 file:py-2 file:px-3 file:border-0 file:text-[11px] file:font-semibold file:bg-[#1a2b6d] file:text-white hover:file:bg-[#0f1a42]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">หรือระบุ URL รูปภาพ</span>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="เช่น /images/bd.jpeg หรือ https://..."
                      className="w-full p-2.5 rounded-md border border-slate-300 bg-white text-xs"
                    />
                  </div>
                </div>

                {formData.imageUrl && (
                  <div className="pt-1">
                    <div className="flex items-center gap-3 bg-white p-2.5 border rounded-md w-fit">
                      <span className="text-[11px] text-slate-500 font-medium">ตัวอย่างรูปภาพ:</span>
                      <img src={formData.imageUrl} alt="Preview" className="h-14 w-24 object-cover rounded border" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 border-t border-slate-200 pt-4">
                <label className="font-semibold text-slate-700">คำอธิบายสั้นๆ (Subtitle)</label>
                <textarea
                  rows={3}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="รายละเอียดหรือคำอธิบายเพิ่มเติมเกี่ยวกับแพ็กเกจ..."
                  className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#1a2b6d]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#1a2b6d] text-white font-semibold px-5 py-2.5 rounded-md hover:bg-[#0f1a42] transition disabled:bg-slate-400 cursor-pointer"
                >
                  {submitting ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มแพ็กเกจใหม่'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORIES FILTER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${selectedCategory === cat
                ? 'bg-[#1a2b6d] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PACKAGES GRID LIST */}
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-2 border-[#1a2b6d] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">กำลังโหลดแพ็กเกจ...</p>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl || '/images/default-package.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {item.tag && (
                      <span className="absolute top-3 left-3 bg-[#1a2b6d] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="font-bold text-sky-700 text-[11px] uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-[#1a2b6d] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.subtitle || 'แพ็กเกจตรวจสุขภาพราคาประหยัด พร้อมบริการดูแลใส่ใจโดยทีมแพทย์ผู้เชี่ยวชาญ'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {item.originalPrice && (
                        <span className="text-[11px] text-slate-400 line-through block">{item.originalPrice}</span>
                      )}
                      <span className="text-lg font-extrabold text-[#1a2b6d]">{item.price}</span>
                    </div>

                    <div className="flex gap-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-2.5 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            ลบ
                          </button>
                        </>
                      )}

                      <Link
                        href={`/packages/${item.id}`}
                        className="flex items-center justify-center text-center px-3 py-1.5 bg-slate-100 hover:bg-[#1a2b6d] hover:text-white text-slate-700 text-xs font-bold rounded-xl transition"
                      >
                        ดูรายละเอียด
                      </Link>

                      {!isAdmin && (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center justify-center text-center px-4 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer whitespace-nowrap"
                        >
                          เพิ่มลงตะกร้า
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
            ไม่พบแพ็กเกจในหมวดหมู่นี้
          </div>
        )}
      </main>

    </div>
  );
}