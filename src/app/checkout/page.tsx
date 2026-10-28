'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Helper: แปลงราคาเป็นตัวเลข
function parsePrice(priceVal: any): number {
  if (typeof priceVal === 'number') return priceVal;
  if (!priceVal) return 0;
  const cleanNumber = String(priceVal).replace(/[^0-9.]/g, '');
  return Number.parseFloat(cleanNumber) || 0;
}

// Helper ย่อยสำหรับแกะข้อมูลจาก LocalStorage
function parseSavedCheckout() {
  const savedCheckout = localStorage.getItem('novaria_checkout_data');
  if (!savedCheckout) return null;
  try {
    return JSON.parse(savedCheckout);
  } catch {
    return null;
  }
}

function parseSavedCart() {
  const savedCart = localStorage.getItem('novaria_cart');
  if (!savedCart) return [];
  try {
    return JSON.parse(savedCart) || [];
  } catch {
    return [];
  }
}

function getPatientNameFromUser(): string {
  const user = localStorage.getItem('user');
  if (!user) return '';
  try {
    const parsed = JSON.parse(user);
    if (parsed.firstName && parsed.lastName) {
      return `${parsed.firstName} ${parsed.lastName}`;
    }
    return parsed.firstName || parsed.name || 'ผู้รับบริการ';
  } catch {
    return '';
  }
}

function getCartItemsAndTotal(checkout: any) {
  if (checkout) {
    const items = Array.isArray(checkout.items) ? checkout.items : [];
    const calculatedTotal = checkout.totalPrice ?? 0;
    return { items, calculatedTotal };
  }

  const items = parseSavedCart();
  const calculatedTotal = items.reduce(
    (sum: number, item: any) => sum + parsePrice(item.price) * (item.quantity || 1),
    0
  );
  return { items, calculatedTotal };
}

// Helper หลัก: ดึงข้อมูลและคำนวณตะกร้าสินค้า
function loadCartAndUserData() {
  const checkout = parseSavedCheckout();
  const { items, calculatedTotal } = getCartItemsAndTotal(checkout);
  const fetchedPaymentMethod = checkout?.paymentMethod || 'qr';
  const fetchedPatientName = checkout?.patientName || getPatientNameFromUser();

  return { items, calculatedTotal, fetchedPaymentMethod, fetchedPatientName };
}

// Helper สุ่มรหัสการจองอย่างปลอดภัยด้วย Web Crypto API
function generateBookingRef(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomNumber = 100000 + (array[0] % 900000);
  return `NVR-${randomNumber}`;
}

// Component ย่อย: แสดงบิลเมื่อเลือกชำระเงินที่โรงพยาบาล
function HospitalVoucherScreen({ bookingRef, patientName, cartItems, totalPrice, handlePrint }: {
  readonly bookingRef: string;
  readonly patientName: string;
  readonly cartItems: any[];
  readonly totalPrice: number;
  readonly handlePrint: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden">
        <div className="border-b-2 border-dashed border-slate-200 pb-6 text-center space-y-2">
          <div className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
             บิลแจ้งชำระเงิน ณ เคาน์เตอร์โรงพยาบาล
          </div>
          <h1 className="text-xl font-black text-[#1a2b6d]">โรงพยาบาลโนวาเลีย (Novaria Hospital)</h1>
          <p className="text-xs text-slate-500">กรุณายื่นใบนี้ให้เจ้าหน้าที่การเงินในวันที่เข้ารับบริการ</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">รหัสอ้างอิงการจอง (Booking No.)</span>
            <span className="font-extrabold text-[#1a2b6d] text-base tracking-wide">{bookingRef}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">ชื่อผู้เข้ารับบริการ</span>
            <span className="font-bold text-slate-800 text-sm line-clamp-1">{patientName || 'ผู้รับบริการ'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">สถานะชำระเงิน</span>
            <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded text-[10px] inline-block">รอชำระเงินที่โรงพยาบาล</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">วันที่ทำรายการ</span>
            <span className="font-medium text-slate-700">{new Date().toLocaleDateString('th-TH')}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 border-b pb-1">รายการแพ็กเกจที่จองไว้</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {cartItems.map((item, index) => {
              const priceNum = parsePrice(item.price);
              return (
                <div key={index} className="flex justify-between items-center text-xs">
                  <div className="pr-2">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-400">จำนวน: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-800">฿{(priceNum * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <div>
            <p className="text-[11px] text-slate-500">ยอดเงินที่ต้องชำระสุทธิ</p>
            <p className="text-xs text-slate-400">(รวมภาษีมูลค่าเพิ่มแล้ว)</p>
          </div>
          <span className="text-2xl font-black text-[#1a2b6d]">฿{totalPrice.toLocaleString()}</span>
        </div>

        <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-[11px] text-slate-500 font-medium">สแกนรหัสเพื่อชำระเงินที่จุดรับบริการ / แคชเชียร์</p>
          <div className="w-48 h-12 bg-white border border-slate-300 mx-auto rounded flex items-center justify-center tracking-widest font-mono text-lg font-bold text-slate-800 shadow-inner">
            |||| | ||||| ||| ||||
          </div>
          <p className="text-[10px] text-slate-400">{bookingRef}</p>
        </div>

        <div className="flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            type="button" 
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl text-xs font-bold transition shadow-xs text-center cursor-pointer"
          >
             พิมพ์ / บันทึกใบนี้ (PDF)
          </button>
          <Link 
            href="/" 
            className="flex-1 bg-[#1a2b6d] hover:bg-[#0f1a42] text-white py-3 rounded-xl text-xs font-bold transition shadow-xs text-center"
          >
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

// Component ย่อย: แสดงหน้าชำระเงินออนไลน์สำเร็จ
function OnlineSuccessScreen({ patientName, totalPrice, paymentMethod }: {
  readonly patientName: string;
  readonly totalPrice: number;
  readonly paymentMethod: string;
}) {
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
          <div className="flex justify-between"><span className="text-slate-500">ผู้รับบริการ:</span><span className="font-semibold text-slate-800">{patientName || 'ผู้รับบริการ'}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">ยอดชำระสุทธิ:</span><span className="font-bold text-[#1a2b6d]">฿{totalPrice.toLocaleString()}</span></div>
          <div className="flex justify-between">
            <span className="text-slate-500">ช่องทาง:</span>
            <span className="font-semibold text-slate-800">
              {paymentMethod === 'qr' ? 'PromptPay QR Code' : 'บัตรเครดิต / เดบิต'}
            </span>
          </div>
        </div>
        <Link href="/" className="block w-full bg-[#1a2b6d] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#0f1a42] transition shadow-xs text-center">
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  );
}

// Sub-component: PromptPay QR
function PromptPaySection({ totalPrice }: { readonly totalPrice: number }) {
  return (
    <div className="space-y-4 text-center">
      <div className="inline-block bg-sky-50 text-sky-800 text-[11px] font-bold px-3 py-1 rounded-full">
        Scan with Mobile Banking App
      </div>
      
      <div className="max-w-xs mx-auto bg-gradient-to-b from-[#1a2b6d] to-[#0f1a42] p-6 rounded-3xl text-white shadow-xl space-y-4 border border-blue-900">
        <div className="flex justify-between items-center text-xs font-bold border-b border-white/10 pb-2">
          <span className="text-blue-200 tracking-wide">PROMPTPAY QR</span>
          <span className="bg-white/10 px-2.5 py-0.5 rounded text-[10px]">NOVARIA HOSPITAL</span>
        </div>

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
  );
}

// Sub-component: Credit Card Form
function CreditCardSection({ cardName, setCardName, cardNumber, setCardNumber, cardExpiry, setCardExpiry, cardCvc, setCardCvc }: any) {
  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
        <span className="font-bold text-slate-700">รองรับบัตรเครดิตและเดบิต</span>
        <div className="flex gap-1.5 font-bold text-[10px] text-blue-900">
          <span className="bg-white px-2 py-0.5 rounded border">VISA</span>
          <span className="bg-white px-2 py-0.5 rounded border">Mastercard</span>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="card-name" className="block text-slate-500 font-medium">ชื่อบนบัตร</label>
        <input 
          id="card-name"
          type="text" 
          required
          placeholder="MR. SOMCHAI JAIDEE" 
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1a2b6d]" 
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="card-number" className="block text-slate-500 font-medium">หมายเลขบัตร (16 หลัก)</label>
        <input 
          id="card-number"
          type="text" 
          inputMode="numeric"
          required
          maxLength={19}
          placeholder="4242 4242 4242 4242" 
          value={cardNumber}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
            setCardNumber(val);
          }}
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1a2b6d]" 
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="card-expiry" className="block text-slate-500 font-medium">วันหมดอายุ (MM/YY)</label>
          <input 
            id="card-expiry"
            type="text" 
            required
            maxLength={5}
            placeholder="MM/YY" 
            value={cardExpiry}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '').slice(0, 4);
              if (val.length >= 3) {
                val = `${val.slice(0, 2)}/${val.slice(2)}`;
              }
              setCardExpiry(val);
            }}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1a2b6d]" 
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="card-cvc" className="block text-slate-500 font-medium">CVC / CVV (3-4 หลัก)</label>
          <input 
            id="card-cvc"
            type="password" 
            inputMode="numeric"
            required
            placeholder="123" 
            maxLength={4}
            value={cardCvc}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
              setCardCvc(val);
            }}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1a2b6d]" 
          />
        </div>
      </div>
    </div>
  );
}

// Sub-component: Hospital Payment Info
function HospitalInfoSection() {
  return (
    <div className="p-6 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs text-sky-900 space-y-3">
      <p className="font-bold text-sm text-[#1a2b6d]">ชำระเงินสดหรือบัตรที่เคาน์เตอร์โรงพยาบาล</p>
      <p className="text-slate-600 leading-relaxed">
        ท่านสามารถชำระเงินได้ที่แผนกต้อนรับหรือจุดแคชเชียร์ โรงพยาบาลโนวาเลีย สำนักงานใหญ่ ในวันที่ท่านมารับบริการตามนัดหมาย 
        <br /><strong className="text-slate-800">เมื่อกดปุ่มออกใบจอง ระบบจะสร้าง &quot;ใบแจ้งชำระเงิน (Invoice)&quot; สำหรับยื่นที่เคาน์เตอร์ให้คุณทันที</strong>
      </p>
    </div>
  );
}

// Sub-component: Form สรุปคำสั่งซื้อ
function OrderSummary({ cartItems, patientName, totalPrice, paymentMethod, totalItemsCount }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs sticky top-24">
      <h2 className="text-sm font-bold text-[#1a2b6d] border-b pb-3">สรุปคำสั่งซื้อ ({totalItemsCount} รายการ)</h2>
      
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {cartItems.map((item: any) => {
          const priceNum = parsePrice(item.price);
          return (
            <div key={item.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
              <div className="pr-2 space-y-0.5">
                <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                <p className="text-[10px] text-slate-400">จำนวน: {item.quantity}</p>
              </div>
              <span className="font-bold text-slate-900 shrink-0">฿{(priceNum * item.quantity).toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      <div className="text-xs space-y-2 pt-2 border-t">
        <div className="flex justify-between"><span className="text-slate-500">ผู้เข้ารับบริการ:</span><span className="font-semibold text-slate-800">{patientName || 'ผู้รับบริการ'}</span></div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-bold text-slate-900 text-sm">ยอดชำระสุทธิ:</span>
          <span className="font-extrabold text-[#1a2b6d] text-lg">฿{totalPrice.toLocaleString()}</span>
        </div>
      </div>

     <button
        type="submit"
        className="w-full bg-[#1a2b6d] hover:bg-[#0f1a42] text-white py-3.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer text-center"
      >
        {paymentMethod === 'hospital' ? 'ออกใบนัดหมาย & ใบชำระเงินที่ รพ. ➔' : `ชำระเงินสุทธิ ฿${totalPrice.toLocaleString()} ➔`}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [patientName, setPatientName] = useState('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    const data = loadCartAndUserData();
    
    if (data.items.length === 0) {
      router.push('/cart');
      return;
    }

    if (data.items.length > 0) setCartItems(data.items);
    if (data.calculatedTotal > 0) setTotalPrice(data.calculatedTotal);
    if (data.fetchedPaymentMethod) setPaymentMethod(data.fetchedPaymentMethod);
    if (data.fetchedPatientName) setPatientName(data.fetchedPatientName);
  }, [router]);

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'credit' && (!cardNumber || !cardExpiry || !cardCvc)) {
      alert('กรุณากรอกข้อมูลบัตรเครดิตให้ครบถ้วน');
      return;
    }

    // 💡 ป้องกันการเบิ้ลซ้ำ: ทำการเคลียร์ตะกร้าและข้อมูล Checkout ทันทีเมื่อกดยืนยันชำระเงิน
    localStorage.removeItem('novaria_cart');
    localStorage.removeItem('novaria_checkout_data');
    window.dispatchEvent(new Event('cartUpdated'));

    setBookingRef(generateBookingRef());
    setIsCompleted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isCompleted) {
    if (paymentMethod === 'hospital') {
      return (
        <HospitalVoucherScreen 
          bookingRef={bookingRef} 
          patientName={patientName} 
          cartItems={cartItems} 
          totalPrice={totalPrice} 
          handlePrint={handlePrint} 
        />
      );
    }
    return (
      <OnlineSuccessScreen 
        patientName={patientName} 
        totalPrice={totalPrice} 
        paymentMethod={paymentMethod} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 pb-20 font-sans">
      <div className="bg-[#1a2b6d] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              Secure Checkout & Payment
            </span>
            <h1 className="text-2xl font-black mt-2">ยืนยันและชำระเงินแพ็กเกจสุขภาพ</h1>
          </div>
          <Link href="/cart" className="text-xs bg-[#1a2b6d] border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition">
            ← กลับไปตะกร้า
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        <form onSubmit={handleConfirmPayment} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
              
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-sm font-bold text-[#1a2b6d]">ช่องทางชำระเงิน</h2>
                  <p className="text-[11px] text-slate-400">ช่องทางที่เลือกไว้จากหน้าตะกร้าสินค้า</p>
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

              {paymentMethod === 'qr' && <PromptPaySection totalPrice={totalPrice} />}

              {paymentMethod === 'credit' && (
                <CreditCardSection 
                  cardName={cardName}
                  setCardName={setCardName}
                  cardNumber={cardNumber}
                  setCardNumber={setCardNumber}
                  cardExpiry={cardExpiry}
                  setCardExpiry={setCardExpiry}
                  cardCvc={cardCvc}
                  setCardCvc={setCardCvc}
                />
              )}

              {paymentMethod === 'hospital' && <HospitalInfoSection />}

            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <OrderSummary 
              cartItems={cartItems} 
              patientName={patientName} 
              totalPrice={totalPrice} 
              paymentMethod={paymentMethod} 
              totalItemsCount={totalItemsCount} 
            />
          </div>

        </form>
      </main>
    </div>
  );
}