'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [patientName, setPatientName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Toast State
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3500);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('novaria_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    }

    // ดึงข้อมูลผู้ใช้สิทธิ์สมาชิกลงชื่อเข้าใช้
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsLoggedIn(true);
        // ดึงชื่อ นามสกุล หรือชื่อผู้ใช้อัตโนมัติ
        const fullName = parsedUser.firstName && parsedUser.lastName 
          ? `${parsedUser.firstName} ${parsedUser.lastName}` 
          : parsedUser.firstName || parsedUser.name || '';
        setPatientName(fullName);
      } catch (e) {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const parsePrice = (priceVal: any): number => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const cleanNumber = String(priceVal).replace(/[^0-9.]/g, '');
    return parseFloat(cleanNumber) || 0;
  };

  const updateCartStorage = (newItems: any[]) => {
    setCartItems(newItems);
    localStorage.setItem('novaria_cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleIncrease = (id: number) => {
    const newItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCartStorage(newItems);
  };

  const handleDecrease = (id: number) => {
    const targetItem = cartItems.find(item => item.id === id);
    if (targetItem && targetItem.quantity === 1) {
      handleRemove(id);
    } else {
      const newItems = cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      updateCartStorage(newItems);
    }
  };

  const handleRemove = (id: number) => {
    const newItems = cartItems.filter(item => item.id !== id);
    updateCartStorage(newItems);
    showToast('ลบรายการออกจากตะกร้าแล้ว', 'info');
  };

  const handleCheckout = () => {
    // 1. เช็กว่าเข้าสู่ระบบหรือยัง
    if (!isLoggedIn) {
      showToast('กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อนทำการสั่งซื้อ', 'error');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    if (cartItems.length === 0) return;
    
    if (!patientName.trim()) {
      showToast('กรุณาระบุชื่อ-นามสกุล ผู้เข้ารับบริการ', 'error');
      return;
    }

    // คำนวณราคาสรุป
    const totalAmount = cartItems.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);

    // บันทึกข้อมูลที่ต้องใช้ไปยัง checkout
    const checkoutData = {
      patientName: patientName.trim(),
      paymentMethod,
      items: cartItems,
      totalPrice: totalAmount,
      totalItemsCount,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('novaria_checkout_data', JSON.stringify(checkoutData));

    // ไปหน้า /checkout
    router.push('/checkout');
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 pb-20 font-sans relative">
      
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

      {/* TOP HEADER */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">ตะกร้าของฉัน ({totalItemsCount})</h1>
          <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-[#1a2b6d] border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-6">

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
            <p className="text-sm text-slate-500">ไม่มีสินค้าในตะกร้าของคุณ</p>
            <Link 
              href="/packages" 
              className="inline-block bg-[#1a2b6d] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition"
            >
              เลือกซื้อแพ็กเกจสุขภาพ ➔
            </Link>
          </div>
        ) : (
          <>
            {/* กล่องรายการในตะกร้า */}
            {cartItems.map((item) => {
              const numericPrice = parsePrice(item.price);
              const numericOriginalPrice = parsePrice(item.originalPrice);

              return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                  
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 w-4 h-4 text-[#1a2b6d] focus:ring-0 cursor-pointer" />
                    <span>{item.hospital || 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่'}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                        <img src={item.imageUrl || '/images/default-package.jpg'} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xs md:text-sm font-semibold text-slate-900">{item.title}</h3>
                        {item.category && <span className="text-[10px] text-sky-700 font-medium">{item.category}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      <div className="text-right">
                        {numericOriginalPrice > 0 && (
                          <span className="text-[11px] text-slate-400 line-through block">฿{numericOriginalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-sm md:text-base font-extrabold text-slate-900">฿{numericPrice.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button onClick={() => handleDecrease(item.id)} className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 transition cursor-pointer">-</button>
                        <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button onClick={() => handleIncrease(item.id)} className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 transition cursor-pointer">+</button>
                      </div>

                      <button onClick={() => handleRemove(item.id)} className="text-slate-400 hover:text-red-600 transition cursor-pointer p-1" title="ลบรายการ">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ข้อมูลผู้เข้ารับบริการ */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs text-xs">
              <h3 className="font-bold text-slate-900 border-b pb-2">ข้อมูลผู้เข้ารับบริการ</h3>
              <div className="flex flex-col space-y-1">
                <label className="text-slate-500 font-medium">ชื่อ-นามสกุล ผู้ใช้สิทธิ์แพ็กเกจ *</label>
                <input 
                  type="text" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="ระบุชื่อ-นามสกุลจริง" 
                  className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a2b6d]"
                  required
                />
              </div>
            </div>

            {/* เลือกวิธีชำระเงิน */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs text-xs">
              <h3 className="font-bold text-slate-900 border-b pb-2">เลือกวิธีชำระเงิน</h3>
              <div className="space-y-2">
                <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${paymentMethod === 'qr' ? 'border-[#1a2b6d] bg-sky-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-3 font-semibold text-slate-800">
                    <input type="radio" name="payment" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="text-[#1a2b6d]" />
                    <span>พร้อมเพย์ QR Code (PromptPay)</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">ฟรีค่าธรรมเนียม</span>
                </label>

                <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${paymentMethod === 'credit' ? 'border-[#1a2b6d] bg-sky-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-3 font-semibold text-slate-800">
                    <input type="radio" name="payment" checked={paymentMethod === 'credit'} onChange={() => setPaymentMethod('credit')} className="text-[#1a2b6d]" />
                    <span>บัตรเครดิต / เดบิต (Credit / Debit Card)</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Visa / Mastercard</span>
                </label>

                <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${paymentMethod === 'hospital' ? 'border-[#1a2b6d] bg-sky-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-3 font-semibold text-slate-800">
                    <input type="radio" name="payment" checked={paymentMethod === 'hospital'} onChange={() => setPaymentMethod('hospital')} className="text-[#1a2b6d]" />
                    <span>ชำระเงินที่โรงพยาบาลในวันนัดหมาย</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">เงินสด / บัตร</span>
                </label>
              </div>
            </div>

            {/* สรุปยอดชำระ */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-2xs text-xs">
              <div className="flex justify-between text-slate-600">
                <span>ราคารวม ({totalItemsCount} ชิ้น)</span>
                <span className="font-bold text-slate-900">฿{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ส่วนลดรวม</span>
                <span className="font-bold text-slate-900">฿0</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">ยอดชำระรวมสุทธิ</span>
                <span className="text-lg font-extrabold text-[#1a2b6d]">฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              โดยการคลิก 'ดำเนินการชำระเงิน' ฉันได้อ่านและยอมรับเงื่อนไขการให้บริการ นโยบายคืนเงิน/คืนสินค้า
            </p>

            <div className="flex gap-4 pt-2">
              <Link 
                href="/packages" 
                className="w-1/2 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition text-center shadow-2xs flex items-center justify-center"
              >
                เลือกซื้อเพิ่ม
              </Link>
              <button 
                onClick={handleCheckout}
                className="w-1/2 bg-[#0f1a42] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#1a2b6d] transition text-center shadow-sm cursor-pointer flex items-center justify-center"
              >
                ดำเนินการชำระเงิน ➔
              </button>
            </div>
          </>
        )}

      </main>
    </div>
  );
}