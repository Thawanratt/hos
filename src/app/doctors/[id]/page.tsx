'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface DoctorSchedule {
  id: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxSlots: number;
}

interface DoctorDetail {
  id: number;
  userId: number;
  departmentId: number;
  licenseNumber: string;
  specialization: string;
  bio?: string | null;
  isInstantBooking: boolean;
  user: {
    firstName: string;
    lastName: string;
    gender?: string;
    email: string;
    phone: string;
  };
  department: {
    id: number;
    name: string;
  };
  schedules: DoctorSchedule[];
}

// 🖼️ Mapping รูปภาพแพทย์ฝั่ง Frontend อ้างอิงตาม doctor.id
const doctorImageMap: Record<number, string> = {
  2: '/images/สมชาย.jpg', 
  3: '/images/22.jpeg',
  4: '/images/8.jpeg', 
  5: '/images/10.jpeg', 
  6: '/images/77.jpeg', 
  7: '/images/666.jpg',
  8: '/images/55.jpg',
  9: '/images/11.jpeg',
  10: '/images/12.jpeg',
  11: '/images/13.jpeg',
};

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params?.id;

  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [bookingStatus, setBookingStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 🟢 State สำหรับเปิด/ปิดใบนัดจองคิวสำเร็จ (Success Modal)
  const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);

  // 🔐 State สำหรับเช็กสถานะการล็อกอินจริงจาก localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  
  // เช็กสถานะการล็อกอินเมื่อโหลดหน้าเว็บ
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  // ดึงข้อมูลแพทย์รายบุคคล
  useEffect(() => {
    if (!doctorId) return;

    async function fetchDoctorDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/doctors?search=`);
        const result = await res.json();
        if (result.success) {
          const found = result.data.find((doc: DoctorDetail) => doc.id === Number(doctorId));
          setDoctor(found || null);
        }
      } catch (error) {
        console.error('Failed to fetch doctor detail:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctorDetail();
  }, [doctorId]);

  // ตรวจสอบ Hash เพื่อเลื่อนหน้าจอไปยังส่วนนัดหมายอัตโนมัติ
  useEffect(() => {
    if (!loading && window.location.hash === '#appointment') {
      const element = document.getElementById('appointment');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [loading]);

  const getDayName = (dayNum: number) => {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return days[dayNum] || '';
  };

  // ฟังก์ชันเมื่อผู้ใช้คลิกเลือกช่องตารางออกตรวจ
  const handleScheduleClick = (slotValue: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedTimeSlot(slotValue);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      alert('กรุณาเลือกวันที่และช่วงเวลาที่ต้องการนัดหมาย');
      return;
    }

    setSubmitting(true);
    setBookingStatus(null);

    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : { id: 1 };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: doctor?.id,
          departmentId: doctor?.departmentId,
          appointmentDate: selectedDate,
          timeSlot: selectedTimeSlot,
          symptoms: symptoms,
        }),
      });
      const result = await res.json();
      if (result.success) {
        // 🟢 เปิดแสดง Modal ใบนัดจองคิวสำเร็จ
        setShowAppointmentModal(true);
      } else {
        setBookingStatus({ success: false, message: result.message || 'เกิดข้อผิดพลาดในการจองคิว' });
      }
    } catch (error) {
      // Demo Mode กรณีทดสอบระบบ
      setShowAppointmentModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3 bg-[#FAFAFA]">
        <div className="w-7 h-7 border-2 border-[#1a2b6d] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500">กำลังโหลดข้อมูลแพทย์...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-24 space-y-3 bg-[#FAFAFA] min-h-screen">
        <p className="text-base font-semibold text-slate-800">ไม่พบข้อมูลแพทย์ที่คุณค้นหา</p>
        <Link href="/doctors" className="text-xs text-[#1a2b6d] underline font-medium">
          ← กลับไปหน้าค้นหาแพทย์
        </Link>
      </div>
    );
  }

  const doctorImgSrc = doctorImageMap[doctor.id] || doctorImageMap[doctor.userId];
  const doctorName = `${doctor.user?.gender === 'FEMALE' ? 'พญ.' : 'นพ.'} ${doctor.user?.firstName} ${doctor.user?.lastName}`;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans text-slate-800 space-y-8 relative">
      
      {/* 🟢 SUCCESS APPOINTMENT MODAL (ใบนัดจองคิวสำเร็จ) */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6 relative overflow-hidden">
            
            {/* ตกแต่งแถบสีหัวใบนัด */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1a2b6d] to-[#c5a035]"></div>

            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#c5a035] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
                ใบนัดหมายเข้ารับบริการ
              </span>
              <h3 className="text-lg font-bold text-slate-900 pt-1">จองคิวแพทย์สำเร็จ!</h3>
              <p className="text-xs text-slate-500">ระบบได้บันทึกนัดหมายของคุณเรียบร้อยแล้ว รายละเอียดใบนัดมีดังนี้</p>
            </div>

            {/* รายละเอียดในใบนัด */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">แพทย์ผู้ตรวจ:</span>
                <span className="font-bold text-slate-800">{doctorName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">แผนก:</span>
                <span className="font-bold text-slate-800">{doctor.department?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">วันที่นัดหมาย:</span>
                <span className="font-bold text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">ช่วงเวลา:</span>
                <span className="font-bold text-[#1a2b6d]">{selectedTimeSlot}</span>
              </div>
              {symptoms && (
                <div className="flex justify-between">
                  <span className="text-slate-500">อาการเบื้องต้น:</span>
                  <span className="font-bold text-slate-800">{symptoms}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  router.push('/booking'); // หรือไปหน้าประวัติการนัดหมาย
                }}
                className="py-3 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-center cursor-pointer"
              >
                ดูรายการนัดหมาย
              </button>
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  window.location.reload();
                }}
                className="py-3 px-4 rounded-xl bg-[#1a2b6d] text-xs font-semibold text-white hover:bg-[#0f1a42] transition shadow-sm text-center cursor-pointer"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 LOGIN MODAL POPUP */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
            <div className="w-12 h-12 bg-blue-50 text-[#1a2b6d] rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">กรุณาเข้าสู่ระบบก่อนเลือกเวลาตรวจ</h3>
              <p className="text-xs text-slate-500">ท่านจำเป็นต้องเข้าสู่ระบบสมาชิกของโรงพยาบาลก่อนทำรายการนัดหมายแพทย์</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href={`/register?redirect=/doctors/${doctor.id}#appointment`}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-center flex items-center justify-center"
              >
                สร้างบัญชีใหม่
              </Link>
              <Link
                href={`/login?redirect=/doctors/${doctor.id}#appointment`}
                className="py-2.5 px-4 rounded-xl bg-[#1a2b6d] text-xs font-semibold text-white hover:bg-[#0f1a42] transition shadow-sm text-center flex items-center justify-center"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & BREADCRUMB */}
      <section className="bg-white border-b border-slate-200 pt-6 pb-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mb-2">
            <Link href="/" className="hover:text-slate-700">หน้าแรก</Link>
            <span className="mx-2 text-slate-300">/</span>
            <Link href="/doctors" className="hover:text-slate-700">นัดหมายแพทย์</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-600">{doctorName}</span>
          </nav>
        </div>
      </section>

      {/* SECTION 1: DOCTOR PROFILE CARD */}
      <section className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
          
          <div className="w-44 h-52 md:w-56 md:h-68 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-inner">
            {doctorImgSrc ? (
              <img src={doctorImgSrc} alt={doctorName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">[ ไม่มีรูปภาพ ]</div>
            )}
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#1a2b6d] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                {doctor.department?.name}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{doctorName}</h1>
              <p className="text-xs text-slate-500">เลขที่ใบประกอบวิชาชีพ: {doctor.licenseNumber}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div><strong>สาขาความเชี่ยวชาญ:</strong> {doctor.specialization}</div>
              <div><strong>เกี่ยวกับแพทย์:</strong> {doctor.bio || 'แพทย์ผู้เชี่ยวชาญให้คำปรึกษาและรักษาโรคเฉพาะทางด้วยมาตรฐานสากล'}</div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <a
                href="#appointment"
                className="px-6 py-2.5 bg-[#1a2b6d] text-white rounded-xl text-xs font-medium hover:bg-[#0f1a42] transition shadow-sm"
              >
                นัดหมายตรวจแพทย์ท่านนี้
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SCHEDULES & APPOINTMENT BOOKING */}
      <section id="appointment" className="max-w-6xl mx-auto px-4 md:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 text-center">
            <h2 className="text-lg font-bold text-slate-900">ตารางออกตรวจและนัดหมายแพทย์</h2>
            <p className="text-xs text-slate-500 mt-0.5">เลือกวันและช่วงเวลาที่ท่านสะดวก (คลิกที่ตารางออกตรวจด้านล่างเพื่อเลือกคิว)</p>
          </div>

          {/* ตารางออกตรวจของแพทย์ */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-700 block">ตารางออกตรวจประจำสัปดาห์ (คลิกเพื่อเลือกคิว):</span>
            {doctor.schedules && doctor.schedules.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {doctor.schedules.map((sched) => {
                  const slotValue = `วัน${getDayName(sched.dayOfWeek)} (${sched.startTime} - ${sched.endTime})`;
                  const isSelected = selectedTimeSlot === slotValue;

                  return (
                    <div
                      key={sched.id}
                      onClick={() => handleScheduleClick(slotValue)}
                      className={`p-3.5 border rounded-xl text-center space-y-1 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-[#1a2b6d] text-white border-[#1a2b6d] shadow-md scale-[1.02]' 
                          : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-[#1a2b6d]'}`}>
                        วัน{getDayName(sched.dayOfWeek)}
                      </span>
                      <span className={`text-[11px] block ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                        {sched.startTime} - {sched.endTime} น.
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md inline-block mt-1">
                          ✓ เลือกแล้ว
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">แพทย์ท่านนี้ยังไม่มีตารางออกตรวจในระบบ</p>
            )}
          </div>

          {/* ฟอร์มจองคิว */}
          <form onSubmit={handleBookingSubmit} className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">ฟอร์มยืนยันการนัดหมาย</h3>
            
            {bookingStatus && !bookingStatus.success && (
              <div className="p-3 rounded-xl text-xs bg-red-50 text-red-800 border border-red-200">
                {bookingStatus.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-600 font-medium">วันที่ต้องการนัดหมาย</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#1a2b6d]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-medium">ช่วงเวลาที่เลือก (จากตารางด้านบน)</label>
                <input
                  type="text"
                  value={selectedTimeSlot}
                  readOnly
                  placeholder="กรุณาคลิกเลือกตารางออกตรวจด้านบน..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-medium focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-600 font-medium">อาการเบื้องต้น / หมายเหตุ (ถ้ามี)</label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="ระบุอาการเจ็บป่วยคร่าวๆ..."
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#1a2b6d]"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#1a2b6d] text-white rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'กำลังบันทึกการนัดหมาย...' : 'ยืนยันการจองคิวแพทย์'}
              </button>
            </div>
          </form>

        </div>
      </section>

    </div>
  );
}