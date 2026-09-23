'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('qr'); // ค่าเริ่มต้นพร้อมเพย์/QR
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('novaria_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    }
    // ดึงชื่อผู้ใช้ถ้ามีล็อกอินไว้
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setPatientName(parsedUser.firstName || parsedUser.name || '');
      } catch (e) {}
    }
  }, []);

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
    const newItems = cartItems.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    updateCartStorage(newItems);
  };

  const handleRemove = (id: number) => {
    const newItems = cartItems.filter(item => item.id !== id);
    updateCartStorage(newItems);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // บันทึกข้อมูลคำสั่งซื้อจำลอง หรือเคลียร์ตะกร้า
    alert(`ชำระเงินสำเร็จด้วยช่องทาง ${paymentMethod === 'qr' ? 'PromptPay QR Code' : paymentMethod === 'credit' ? 'บัตรเครดิต/เดบิต' : 'ชำระเงินที่โรงพยาบาล'}! ระบบได้บันทึกนัดหมายให้คุณเรียบร้อยแล้ว`);
    
    localStorage.removeItem('novaria_cart');
    window.dispatchEvent(new Event('cartUpdated'));
    router.push('/');
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 pb-20 font-sans">
      
      {/* TOP HEADER */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">ตะกร้าของฉัน ({totalItemsCount})</h1>
          <a href="/" className="text-xs font-semibold text-slate-600 hover:text-[#1a2b6d] border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition">
            กลับหน้าหลัก
          </a>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-6">

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
            <p className="text-sm text-slate-500">ไม่มีสินค้าในตะกร้าของคุณ</p>
            <a 
              href="/packages" 
              className="inline-block bg-[#1a2b6d] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition"
            >
              เลือกซื้อแพ็กเกจสุขภาพ ➔
            </a>
          </div>
        ) : (
          <>
            {/* กล่องรายการในตะกร้า */}
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 w-4 h-4 text-[#1a2b6d] focus:ring-0 cursor-pointer" />
                  <span>{item.hospital || 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่'}</span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.imageUrl || '/images/1.jpg'} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xs md:text-sm font-semibold text-slate-900">{item.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 line-through block">฿{item.originalPrice?.toLocaleString()}</span>
                      <span className="text-sm md:text-base font-extrabold text-slate-900">฿{item.price?.toLocaleString()}</span>
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
            ))}

            {/* 🟢 เพิ่มส่วนระบุผู้เข้ารับบริการ */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs text-xs">
              <h3 className="font-bold text-slate-900 border-b pb-2">ข้อมูลผู้เข้ารับบริการ</h3>
              <div className="flex flex-col space-y-1">
                <label className="text-slate-500 font-medium">ชื่อ-นามสกุล ผู้ใช้สิทธิ์แพ็กเกจ</label>
                <input 
                  type="text" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="ระบุชื่อ-นามสกุลจริง" 
                  className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a2b6d]"
                />
              </div>
            </div>

            {/* 🟢 เพิ่มส่วนเลือกวิธีชำระเงิน */}
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

            {/* หมายเหตุเงื่อนไข */}
            <p className="text-[11px] text-center text-slate-400">
              โดยการคลิก 'ยืนยันการชำระเงิน' ฉันได้อ่านและยอมรับเงื่อนไขการให้บริการ นโยบายคืนเงิน/คืนสินค้า
            </p>

            {/* ปุ่มด้านล่างสุด */}
            <div className="flex gap-4 pt-2">
              <Link 
                href="/packages" 
                className="w-1/2 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition text-center shadow-2xs flex items-center justify-center"
              >
                เลือกซื้อเพิ่ม
              </Link>
              <Link 
                href="/checkout"
                className="w-1/2 bg-[#0f1a42] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#1a2b6d] transition text-center shadow-sm cursor-pointer flex items-center justify-center"
              >
                ทำรายการต่อ ➔
              </Link>
            </div>
          </>
        )}

      </main>
    </div>
  );
}