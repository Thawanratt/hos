'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [patientName, setPatientName] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // ฟอร์มบัตรเครดิต
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('novaria_cart');
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch (e) {}
    }

    const savedCheckout = localStorage.getItem('checkout_data');
    if (savedCheckout) {
      try {
        const parsed = JSON.parse(savedCheckout);
        if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
        if (parsed.patientName) setPatientName(parsed.patientName);
      } catch (e) {}
    }

    if (!patientName) {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setPatientName(parsedUser.firstName || parsedUser.name || 'ผู้ป่วยทั่วไป');
        } catch (e) {}
      } else {
        setPatientName('ผู้ป่วยทั่วไป');
      }
    }
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'credit' && (!cardNumber || !cardExpiry || !cardCvc)) {
      alert('กรุณากรอกข้อมูลบัตรเครดิตให้ครบถ้วน');
      return;
    }

    setIsCompleted(true);
    localStorage.removeItem('novaria_cart');
    localStorage.removeItem('checkout_data');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">ชำระเงินสำเร็จเรียบร้อย!</h2>
            <p className="text-xs text-slate-500">ระบบได้บันทึกคำสั่งซื้อแพ็กเกจสุขภาพและออกใบนัดหมายให้คุณแล้ว</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-left space-y-2 text-xs border border-slate-100">
            <div className="flex justify-between"><span className="text-slate-500">ผู้รับบริการ:</span><span className="font-semibold text-slate-800">{patientName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">ยอดชำระสุทธิ:</span><span className="font-bold text-[#1a2b6d]">฿{totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between">
              <span className="text-slate-500">ช่องทาง:</span>
              <span className="font-semibold text-slate-800">
                {paymentMethod === 'qr' && 'PromptPay QR Code'}
                {paymentMethod === 'credit' && 'บัตรเครดิต / เดบิต'}
                {paymentMethod === 'hospital' && 'ชำระเงินที่โรงพยาบาล'}
              </span>
            </div>
          </div>
          <Link href="/" className="block w-full bg-[#1a2b6d] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#0f1a42] transition shadow-sm">
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 pb-20 font-sans">
      
      {/* HEADER */}
      <div className="bg-[#1a2b6d] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              Secure Checkout & Payment
            </span>
            <h1 className="text-2xl font-black mt-2">ยืนยันและชำระเงินแพ็กเกจสุขภาพ</h1>
          </div>
          <Link href="/cart" className="text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition">
            ← กลับไปตะกร้า
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-6 mt-8">
        <form onSubmit={handleConfirmPayment} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* ฝั่งซ้าย: ตัวเลือกและช่องทางชำระเงิน */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
              
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-sm font-bold text-[#1a2b6d]">ช่องทางชำระเงิน</h2>
                  <p className="text-[11px] text-slate-400">เลือกเปลี่ยนช่องทางชำระเงินได้ตามต้องการ</p>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('qr')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${paymentMethod === 'qr' ? 'bg-[#1a2b6d] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    พร้อมเพย์
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('credit')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${paymentMethod === 'credit' ? 'bg-[#1a2b6d] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    บัตรเครดิต
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('hospital')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${paymentMethod === 'hospital' ? 'bg-[#1a2b6d] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    ที่ รพ.
                  </button>
                </div>
              </div>

              {/* 1. 📱 พร้อมเพย์ QR Code (ดีไซน์สลิปธนาคารพร้อม QR Code สมจริง) */}
              {paymentMethod === 'qr' && (
                <div className="space-y-4 text-center">
                  <div className="inline-block bg-sky-50 text-sky-800 text-[11px] font-bold px-3 py-1 rounded-full">
                    Scan with Mobile Banking App
                  </div>
                  
                  <div className="max-w-xs mx-auto bg-gradient-to-b from-[#1a2b6d] to-[#0f1a42] p-6 rounded-3xl text-white shadow-xl space-y-4 border border-blue-900">
                    <div className="flex justify-between items-center text-xs font-bold border-b border-white/10 pb-2">
                      <span className="text-blue-200 tracking-wide">PROMPTPAY QR</span>
                      <span className="bg-white/10 px-2.5 py-0.5 rounded text-[10px]">NOVARIA HOSPITAL</span>
                    </div>

                    {/* QR Code ของจริงแบบคมชัด */}
                    <div className="w-48 h-48 bg-white mx-auto p-3 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 2h6v6H2V2zm2 2v2h2V4H4zM2 16h6v6H2v-6zm2 2v2h2v-2H4zM16 2h6v6h-6V2zm2 2v2h2V4h-2zM12 2h2v2h-2V2zm0 4h2v2h-2V6zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM16 16h6v6h-6v-6zm2 2v2h2v-2h-2z" />
                      </svg>
                    </div>

                    <div className="space-y-0.5 pt-1">
                      <p className="text-[11px] text-blue-200">ยอดชำระเงินสุทธิ</p>
                      <p className="text-2xl font-black text-amber-300">฿{totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">ใช้แอปพลิเคชันธนาคารใดก็ได้สแกนเพื่อชำระเงิน • มีอายุ 15 นาที</p>
                </div>
              )}

              {/* 2. 💳 บัตรเครดิต / เดบิต */}
              {paymentMethod === 'credit' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700">รองรับบัตรเครดิตและเดบิต</span>
                    <div className="flex gap-1.5 font-bold text-[10px] text-blue-900">
                      <span className="bg-white px-2 py-0.5 rounded border">VISA</span>
                      <span className="bg-white px-2 py-0.5 rounded border">Mastercard</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-medium">ชื่อบนบัตร</label>
                    <input 
                      type="text" 
                      required
                      placeholder="MR. SOMCHAI JAIDEE" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1a2b6d]" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-medium">หมายเลขบัตร</label>
                    <input 
                      type="text" 
                      required
                      placeholder="4242 4242 4242 4242" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1a2b6d]" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-medium">วันหมดอายุ (MM/YY)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1a2b6d]" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-medium">CVC / CVV</label>
                      <input 
                        type="password" 
                        required
                        placeholder="123" 
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1a2b6d]" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 🏥 ชำระเงินที่โรงพยาบาล */}
              {paymentMethod === 'hospital' && (
                <div className="p-6 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs text-sky-900 space-y-3">
                  <p className="font-bold text-sm text-[#1a2b6d]">ชำระเงินสดหรือบัตรที่เคาน์เตอร์โรงพยาบาล</p>
                  <p className="text-slate-600 leading-relaxed">
                    ท่านสามารถชำระเงินได้ที่แผนกต้อนรับหรือจุดแคชเชียร์ โรงพยาบาลโนวาเลีย สำนักงานใหญ่ ในวันที่ท่านมารับบริการตามนัดหมาย
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* ฝั่งขวา: สรุปคำสั่งซื้อและปุ่มยืนยัน */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs sticky top-24">
              <h2 className="text-sm font-bold text-[#1a2b6d] border-b pb-3">สรุปคำสั่งซื้อ ({totalItemsCount} รายการ)</h2>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                    <div className="pr-2 space-y-0.5">
                      <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-slate-400">จำนวน: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs space-y-2 pt-2 border-t">
                <div className="flex justify-between"><span className="text-slate-500">ผู้เข้ารับบริการ:</span><span className="font-semibold text-slate-800">{patientName}</span></div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-bold text-slate-900 text-sm">ยอดชำระสุทธิ:</span>
                  <span className="font-extrabold text-[#1a2b6d] text-lg">฿{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a2b6d] hover:bg-[#0f1a42] text-white py-3.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer text-center"
              >
                {paymentMethod === 'hospital' ? 'ยืนยันการจองแพ็กเกจ ➔' : `ชำระเงินสุทธิ ฿${totalPrice.toLocaleString()} ➔`}
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}