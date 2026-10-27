'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  Car, 
  Bus, 
  MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
    consent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // 🟢 เพิ่ม State สำหรับแจ้งเตือนข้อผิดพลาด

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.phone.length !== 10) {
      setErrorMessage('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
      return;
    }
    if (!formData.consent) {
      setErrorMessage('กรุณากดยอมรับนโยบายความเป็นส่วนตัว (PDPA)');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          category: 'general',
          subject: '',
          message: '',
          consent: false,
        });
      } else {
        setErrorMessage(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20">
      
      {/* HEADER BANNER */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-4">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">ติดต่อสอบถาม</span>
          </nav>

          <div className="pl-4 border-l-4 border-[#1a2b6d]">
            <h1 className="text-2xl md:text-3xl font-light text-slate-900">
              ติดต่อ และ <span className="font-semibold text-[#1a2b6d]">สอบถามข้อมูล</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              สอบถามข้อมูลการรับบริการ นัดหมายแพทย์ สิทธิประกัน หรือติดต่อศูนย์ฉุกเฉินตลอด 24 ชั่วโมง
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-8">
        
        {/* CONTACT INFO CARDS - แบบเรียบง่าย */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
            <div className="flex items-center gap-2 text-[#1a2b6d] text-xs font-bold uppercase">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>ฉุกเฉิน 24 ชั่วโมง</span>
            </div>
            <p className="text-xl font-bold text-[#1a2b6d]">02-165-5555</p>
            <p className="text-xs text-slate-500">ศูนย์อุบัติเหตุและรถพยาบาล</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
            <div className="flex items-center gap-2 text-[#1a2b6d] text-xs font-bold uppercase">
              <Building2 className="w-4 h-4" />
              <span>ศูนย์บริการลูกค้า</span>
            </div>
            <p className="text-xl font-bold text-[#1a2b6d]">1719</p>
            <p className="text-xs text-slate-500">สอบถามนัดหมายและตารางแพทย์</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
            <div className="flex items-center gap-2 text-[#1a2b6d] text-xs font-bold uppercase">
              <Mail className="w-4 h-4" />
              <span>อีเมล / ช่องทางออนไลน์</span>
            </div>
            <p className="text-sm font-bold text-slate-800 truncate">info@novaria.com</p>
            <p className="text-xs text-slate-500">Line: @novariahospital</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
            <div className="flex items-center gap-2 text-[#1a2b6d] text-xs font-bold uppercase">
              <Clock className="w-4 h-4" />
              <span>เวลาเปิดทำการ</span>
            </div>
            <p className="text-sm font-bold text-slate-800">OPD: 08:00 - 20:00 น.</p>
            <p className="text-xs text-slate-500">IPD / ฉุกเฉิน: เปิดบริการ 24 ชม.</p>
          </div>

        </div>

        {/* FORM + LOCATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-6">
            
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[#1a2b6d] flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> แบบฟอร์มติดต่อสอบถาม
              </h2>
              <div className="h-0.5 w-16 bg-[#1a2b6d] mt-2"></div>
            </div>

            {/* 🔴 ข้อความแจ้งเตือน Error เมื่อกรอกข้อมูลไม่ถูกต้อง */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-xs font-bold flex items-center justify-between">
                <span>{errorMessage}</span>
                <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-700">✕</button>
              </div>
            )}

            {isSubmitted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 flex items-start gap-3 text-emerald-800 text-xs md:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">ส่งข้อความเรียบร้อยแล้ว</p>
                  <p className="text-emerald-700 mt-0.5">
                    เจ้าหน้าที่ได้รับการแจ้งเตือนแล้ว และจะติดต่อกลับโดยเร็วที่สุด
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
              
              <div className="space-y-1">
                <label htmlFor="fullName" className="font-semibold text-slate-700">
                  ชื่อ - นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="เช่น นายสมชาย ใจดี"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-[#1a2b6d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ช่องเบอร์โทรศัพท์: กรอกได้เฉพาะตัวเลข และจำกัดความยาวไม่เกิน 10 หลัก */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="font-semibold text-slate-700">
                    เบอร์โทรศัพท์ติดต่อ (10 หลัก) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    placeholder="08XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: val });
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="font-semibold text-slate-700">อีเมล</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="category" className="font-semibold text-slate-700">
                  เรื่องที่ต้องการติดต่อ <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-800 bg-white focus:outline-none focus:border-[#1a2b6d]"
                >
                  <option value="general">สอบถามข้อมูลทั่วไป</option>
                  <option value="appointment">นัดหมายแพทย์ / ตรวจสุขภาพ</option>
                  <option value="insurance">สิทธิประกันชีวิตและค่ารักษาพยาบาล</option>
                  <option value="mental-health">สอบถามบริการตรวจสุขภาพใจออนไลน์</option>
                  <option value="feedback">ข้อเสนอแนะการบริการ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="font-semibold text-slate-700">
                  หัวข้อข้อความ <span className="text-rose-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  placeholder="ระบุหัวข้อสั้นๆ"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-[#1a2b6d]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="font-semibold text-slate-700">
                  รายละเอียดข้อความ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="พิมพ์รายละเอียดที่ต้องการสอบถาม..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-[#1a2b6d] resize-none"
                />
              </div>

              <div className="pt-1 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="pdpa-consent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1a2b6d] focus:ring-[#1a2b6d]"
                />
                <label htmlFor="pdpa-consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                  ยินยอมให้โรงพยาบาลโนวาเลียใช้ข้อมูลเพื่อการติดต่อกลับตามนโยบายความเป็นส่วนตัว (PDPA)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.consent}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a2b6d] hover:bg-blue-900 disabled:bg-slate-300 text-white font-semibold rounded-md transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* LOCATION & MAP */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1a2b6d]" /> ที่ตั้งโรงพยาบาล
                </h3>
              </div>

              <div className="space-y-1 text-xs md:text-sm text-slate-700">
                <p className="font-bold text-slate-900">โรงพยาบาลโนวาเลีย (สำนักงานใหญ่)</p>
                <p className="text-slate-600 leading-relaxed">
                  999 ถนนพุทธมณฑล สาย 4 ตำบลศาลายา อำเภอพุทธมณฑล จังหวัดนครปฐม 73170
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p><strong className="text-slate-800">โทรศัพท์:</strong> 02-165-5555</p>
                <p><strong className="text-slate-800">แฟกซ์:</strong> 02-165-5556</p>
                <p><strong className="text-slate-800">อีเมล:</strong> info@novaria.com</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3 text-xs md:text-sm">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                การเดินทาง
              </h4>

              <div className="space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-[#1a2b6d] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">รถยนต์ส่วนบุคคล:</strong>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ถนนบรมราชชนนี มุ่งหน้าศาลายา เลี้ยวเข้าถนนพุทธมณฑล สาย 4 (มีอาคารจอดรถรองรับ)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Bus className="w-4 h-4 text-[#1a2b6d] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">รถประจำทาง:</strong>
                    <p className="text-xs text-slate-500 mt-0.5">
                      สาย 84ก, 547, 539 ลงป้ายหน้าโรงพยาบาล
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2">
              <iframe
                title="Novaria Hospital Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.526315582236!2d100.3241088!3d13.7925827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ3JzMzLjMiTiAxMDDCsDE5JzI2LjgnRQ!52e0!3m2!1sth!2sth!4v1680000000000!5m2!1sth!2sth"
                className="w-full h-52 rounded-md border-0"
                loading="lazy"
              ></iframe>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}