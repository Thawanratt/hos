'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BRANCHES_DATA } from '@/app/api/branches/branches';

interface Doctor {
  id: number;
  specialization: string;
  departmentId: number;
  user: {
    firstName: string;
    lastName: string;
  };
  department: {
    id: number;
    name: string;
  };
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedDoctorId = searchParams.get('doctorId');
  const serviceType = searchParams.get('service') || 'doctor';
  const branchId = searchParams.get('branch') || 'novaria-main';

  const currentBranch = BRANCHES_DATA.find((b) => b.id === branchId) || BRANCHES_DATA[0];

  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [doctorSelectionType, setDoctorSelectionType] = useState<'auto' | 'manual'>('auto');

  const [bookingData, setBookingData] = useState({
    patientId: 0,
    departmentId: 1,
    departmentName: serviceType === 'checkup' ? 'ตรวจสุขภาพ' : serviceType === 'vaccine' ? 'ฉีดวัคซีน' : 'อายุรแพทย์',
    doctorId: preSelectedDoctorId ? Number(preSelectedDoctorId) : 0,
    doctorName: '',
    packageType: serviceType === 'checkup' ? 'โปรแกรมตรวจสุขภาพประจำปี' : serviceType === 'vaccine' ? 'วัคซีนป้องกันไข้หวัดใหญ่ 4 สายพันธุ์' : '',
    date: '',
    time: '',
    symptoms: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setBookingData((prev) => ({ ...prev, patientId: user.id }));
    } else {
      const currentQuery = searchParams.toString();
      const currentPath = `/booking${currentQuery ? `?${currentQuery}` : ''}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (serviceType !== 'doctor') return;
    async function fetchDoctors() {
      try {
        const res = await fetch(`/api/doctors?departmentId=${bookingData.departmentId}`);
        const result = await res.json();
        if (result.success) {
          setDoctors(result.data);

          if (preSelectedDoctorId) {
            const foundDoc = result.data.find((d: Doctor) => d.id === Number(preSelectedDoctorId));
            if (foundDoc) {
              setDoctorSelectionType('manual');
              setBookingData((prev) => ({
                ...prev,
                doctorId: foundDoc.id,
                doctorName: `นพ./พญ. ${foundDoc.user.firstName} ${foundDoc.user.lastName}`,
                departmentId: foundDoc.departmentId,
                departmentName: foundDoc.department.name
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    }
    fetchDoctors();
  }, [bookingData.departmentId, preSelectedDoctorId, serviceType]);

  const handleConfirmBooking = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      const currentQuery = searchParams.toString();
      const currentPath = `/booking${currentQuery ? `?${currentQuery}` : ''}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    const user = JSON.parse(storedUser);

    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: serviceType === 'doctor' && doctorSelectionType === 'manual' ? (bookingData.doctorId || null) : null,
          departmentId: bookingData.departmentId,
          branch: branchId,
          appointmentDate: bookingData.date,
          timeSlot: bookingData.time,
          symptoms: serviceType === 'doctor'
            ? (bookingData.symptoms || null)
            : `[${serviceType.toUpperCase()}] ${bookingData.packageType}`,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการจอง');
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อระบบจองคิวได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push('/appointments');
  };

  const filteredDoctors = doctors.filter(
    (doc) => Number(doc.departmentId) === Number(bookingData.departmentId)
  );

  const getServiceTitle = () => {
    if (serviceType === 'checkup') return 'ตรวจสุขภาพ';
    if (serviceType === 'vaccine') return 'ฉีดวัคซีนไข้หวัดใหญ่';
    return 'ทำนัดหมายแพทย์';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 text-slate-800">

      {/* HEADER BANNER */}
      <div className="bg-[#1a2b6d] text-white py-12 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-medium tracking-wide">
            {currentBranch.name}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getServiceTitle()}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto">
            เลือกรายการและนัดหมายบริการทางการแพทย์ได้อย่างสะดวกรวดเร็ว
          </p>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-12 space-y-10">

          {/* STEP PROGRESS INDICATOR */}
          <div className="flex items-center justify-center max-w-md mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            <div className="flex justify-between w-full z-10">
              {[
                { num: 1, label: 'เริ่มต้น' },
                { num: 2, label: 'วันและเวลา' },
                { num: 3, label: 'ยืนยันข้อมูล' },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center space-y-1.5 bg-white px-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s.num
                        ? 'bg-[#1a2b6d] text-white ring-4 ring-blue-50'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className={`text-[11px] font-medium ${step >= s.num ? 'text-[#1a2b6d]' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: SELECT OPTIONS */}
          {step === 1 && (
            <div className="space-y-8 max-w-2xl mx-auto">
              {serviceType === 'doctor' && (
                <div className="space-y-6">
                  {/* รูปแบบการเลือกแพทย์ */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                      รูปแบบการเลือกแพทย์
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => {
                          setDoctorSelectionType('auto');
                          setBookingData((prev) => ({ ...prev, doctorId: 0, doctorName: 'จัดสรรแพทย์ให้อัตโนมัติ' }));
                        }}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          doctorSelectionType === 'auto'
                            ? 'border-[#1a2b6d] bg-blue-50/30 shadow-sm ring-1 ring-[#1a2b6d]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${doctorSelectionType === 'auto' ? 'border-[#1a2b6d] bg-[#1a2b6d]' : 'border-slate-300'}`}>
                            {doctorSelectionType === 'auto' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs font-semibold text-slate-800">เลือกแพทย์ให้ฉัน</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setDoctorSelectionType('manual')}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          doctorSelectionType === 'manual'
                            ? 'border-[#1a2b6d] bg-blue-50/30 shadow-sm ring-1 ring-[#1a2b6d]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${doctorSelectionType === 'manual' ? 'border-[#1a2b6d] bg-[#1a2b6d]' : 'border-slate-300'}`}>
                            {doctorSelectionType === 'manual' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs font-semibold text-slate-800">ฉันต้องการเลือกแพทย์เอง</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* แผนก */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                      เลือกแผนกรักษา
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 1, name: 'อายุรแพทย์' },
                        { id: 2, name: 'กุมารแพทย์' },
                        { id: 3, name: 'สูตินรีแพทย์' },
                        { id: 4, name: 'ศัลยแพทย์' },
                      ].map((dept) => (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() =>
                            setBookingData((prev) => ({
                              ...prev,
                              departmentId: dept.id,
                              departmentName: dept.name,
                              doctorId: 0,
                              doctorName: ''
                            }))
                          }
                          className={`p-4 rounded-2xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                            bookingData.departmentId === dept.id
                              ? 'border-[#1a2b6d] bg-[#1a2b6d] text-white shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          {dept.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {doctorSelectionType === 'manual' && (
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                        เลือกแพทย์เฉพาะทาง
                      </label>
                      <select
                        value={bookingData.doctorId}
                        onChange={(e) => {
                          const selectedId = Number(e.target.value);
                          const doc = doctors.find((d) => d.id === selectedId);
                          setBookingData({
                            ...bookingData,
                            doctorId: selectedId,
                            doctorName: doc ? `นพ./พญ. ${doc.user.firstName} ${doc.user.lastName}` : 'แพทย์ท่านใดก็ได้'
                          });
                        }}
                        className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 bg-white outline-none focus:border-[#1a2b6d]"
                      >
                        <option value={0}>-- โปรดเลือกแพทย์ผู้ตรวจ --</option>
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            นพ./พญ. {doc.user.firstName} {doc.user.lastName} ({doc.specialization})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* โปรแกรมตรวจสุขภาพ */}
              {serviceType === 'checkup' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    เลือกโปรแกรมตรวจสุขภาพ
                  </label>
                  <div className="space-y-3">
                    {[
                      { title: 'โปรแกรมตรวจสุขภาพประจำปี (Standard Checkup)', price: '3,500 บาท', desc: 'ตรวจร่างกายพื้นฐาน ตรวจเลือด เอกซเรย์ปอด' },
                      { title: 'ชุดตรวจวิตามินและสารอาหาร (Vita-Beauty Checkup)', price: '5,200 บาท', desc: 'วิเคราะห์ระดับวิตามิน และสารต้านอนุมูลอิสระ' },
                      { title: 'ชุดตรวจสมดุลแร่ธาตุและสารต้านอนุมูลอิสระ', price: '6,800 บาท', desc: 'ตรวจเชิงลึกสำหรับผู้ที่ต้องการดูแลสุขภาพพิเศษ' },
                    ].map((pkg, idx) => (
                      <div
                        key={idx}
                        onClick={() => setBookingData({ ...bookingData, packageType: pkg.title })}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                          bookingData.packageType === pkg.title
                            ? 'border-[#1a2b6d] bg-blue-50/30 shadow-xs ring-1 ring-[#1a2b6d]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <h3 className="font-bold text-xs text-slate-900">{pkg.title}</h3>
                          <p className="text-[11px] text-slate-500">{pkg.desc}</p>
                        </div>
                        <span className="text-xs font-bold text-[#1a2b6d] whitespace-nowrap ml-4">{pkg.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* วัคซีน */}
              {serviceType === 'vaccine' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    รายการวัคซีน
                  </label>
                  <div className="p-5 rounded-2xl border border-[#1a2b6d] bg-blue-50/30 space-y-1">
                    <h3 className="font-bold text-xs text-[#1a2b6d]">วัคซีนป้องกันไข้หวัดใหญ่ 4 สายพันธุ์ (Influenza Vaccine)</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      เหมาะสำหรับผู้ที่มีอายุ 15 ปีขึ้นไป ช่วยสร้างภูมิคุ้มกันป้องกันเชื้อไข้หวัดใหญ่สายพันธุ์ล่าสุด
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="bg-[#1a2b6d] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition-all shadow-xs cursor-pointer flex items-center space-x-2"
                >
                  <span>ต่อไป</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900">กำหนดวันและเวลานัดหมาย</h2>
                <p className="text-xs text-slate-500">เลือกช่วงเวลาที่คุณสะดวกเข้ารับบริการ</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">วันที่เข้ารับบริการ</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">เลือกรอบเวลา</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['09:00 - 10:00', '10:30 - 11:30', '13:00 - 14:00', '14:30 - 15:30'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, time })}
                        className={`p-3.5 rounded-2xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                          bookingData.time === time
                            ? 'border-[#1a2b6d] bg-[#1a2b6d] text-white shadow-xs'
                            : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                        }`}
                      >
                        {time} น.
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-700">อาการเบื้องต้น / หมายเหตุ (ถ้ามี)</label>
                  <textarea
                    rows={3}
                    placeholder="ระบุอาการเบื้องต้น หรือประวัติการแพ้ยา..."
                    value={bookingData.symptoms}
                    onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  เริ่มใหม่ / ย้อนกลับ
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!bookingData.date || !bookingData.time}
                  className="bg-[#1a2b6d] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  ต่อไป
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION SUMMARY */}
          {step === 3 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="text-center space-y-1">
                <h2 className="text-base font-bold text-slate-900">สรุปข้อมูลการทำนัดหมาย</h2>
                <p className="text-xs text-slate-500">กรุณาตรวจสอบรายละเอียดก่อนยืนยันการจองคิว</p>
              </div>

              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                  <span className="text-slate-500">สาขา:</span>
                  <span className="font-bold text-[#1a2b6d]">{currentBranch.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                  <span className="text-slate-500">บริการ:</span>
                  <span className="font-bold text-slate-800">{getServiceTitle()}</span>
                </div>

                {serviceType === 'doctor' && (
                  <>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                      <span className="text-slate-500">แผนก:</span>
                      <span className="font-bold text-slate-800">{bookingData.departmentName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                      <span className="text-slate-500">แพทย์:</span>
                      <span className="font-bold text-slate-800">{bookingData.doctorName || 'จัดสรรแพทย์ให้อัตโนมัติ'}</span>
                    </div>
                  </>
                )}

                {serviceType === 'checkup' && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                    <span className="text-slate-500">แพ็กเกจ:</span>
                    <span className="font-bold text-slate-800">{bookingData.packageType}</span>
                  </div>
                )}

                {serviceType === 'vaccine' && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                    <span className="text-slate-500">รายการ:</span>
                    <span className="font-bold text-slate-800">วัคซีนป้องกันไข้หวัดใหญ่ 4 สายพันธุ์</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                  <span className="text-slate-500">วันที่นัดหมาย:</span>
                  <span className="font-bold text-slate-800">{bookingData.date}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                  <span className="text-slate-500">เวลานัดหมาย:</span>
                  <span className="font-bold text-[#1a2b6d]">{bookingData.time} น.</span>
                </div>
                {bookingData.symptoms && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">หมายเหตุ:</span>
                    <span className="font-bold text-slate-800">{bookingData.symptoms}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  ย้อนกลับ
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                  className="bg-[#1a2b6d] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการทำนัดหมาย'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-6 relative border border-slate-100">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">นัดหมายสำเร็จ</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                ระบบได้บันทึกคำขอทำนัดหมายเรียบร้อยแล้ว คุณสามารถตรวจสอบรายละเอียดได้ในหน้ารายการนัดหมาย
              </p>
            </div>

            <button
              onClick={handleCloseSuccessModal}
              className="w-full py-3 bg-[#1a2b6d] text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-[#0f1a42] transition cursor-pointer"
            >
              ดูรายการนัดหมายของฉัน
            </button>
          </div>
        </div>
      )}

    </div>
  );
}