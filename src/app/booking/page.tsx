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

interface Appointment {
  id: number;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  symptoms?: string;
  department?: { name: string };
  doctor?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedDoctorId = searchParams.get('doctorId');
  const serviceType = searchParams.get('service') || 'doctor';
  const branchId = searchParams.get('branch') || 'novaria-main';

  // ค้นหาชื่อสาขาจาก BRANCHES_DATA
  const currentBranch = BRANCHES_DATA.find((b) => b.id === branchId) || BRANCHES_DATA[0];

  const [activeTab, setActiveTab] = useState<'booking' | 'my-appointments'>('booking');
  const [step, setStep] = useState(1);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      router.push('/login');
    }
  }, [router]);

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

  useEffect(() => {
    if (activeTab === 'my-appointments') {
      fetchMyAppointments();
    }
  }, [activeTab]);

  const fetchMyAppointments = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const user = JSON.parse(storedUser);

    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?patientId=${user.id}`);
      const result = await res.json();
      if (result.success) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
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
          doctorId: serviceType === 'doctor' ? (bookingData.doctorId || null) : null,
          departmentId: bookingData.departmentId,
          branch: branchId,
          appointmentDate: bookingData.date,
          timeSlot: bookingData.time,
          // 🟢 แก้ไข: บันทึกเฉพาะอาการ/แพ็กเกจ/วัคซีน โดยไม่นำชื่อสาขามาปน
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
    setActiveTab('my-appointments');
    setStep(1);
  };

  const handleCancelAppointment = async (id: number) => {
    if (!confirm('คุณต้องการยกเลิกการนัดหมายนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      const result = await res.json();
      if (result.success) {
        fetchMyAppointments();
      } else {
        alert(result.message || 'ไม่สามารถยกเลิกได้');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการยกเลิก');
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) => Number(doc.departmentId) === Number(bookingData.departmentId)
  );

  const getServiceTitle = () => {
    if (serviceType === 'checkup') return 'ตรวจสุขภาพ';
    if (serviceType === 'vaccine') return 'ฉีดวัคซีนไข้หวัดใหญ่';
    return 'นัดหมายแพทย์';
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 text-slate-800">
      
      {/* HEADER BANNER */}
      <div className="bg-[#1a2b6d] text-white py-10 px-6 border-b border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              {currentBranch.name}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight pt-1">ระบบลงทะเบียนเข้ารับบริการ ({getServiceTitle()})</h1>
            <p className="text-xs text-slate-300">จัดการนัดหมายและตรวจสอบตารางการเข้ารับบริการทางการแพทย์ด้วยมาตรฐานสากล</p>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="flex border-b border-slate-200 space-x-8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('booking')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'booking'
                ? 'border-[#1a2b6d] text-[#1a2b6d]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            ทำรายการนัดหมาย
          </button>
          <button
            onClick={() => setActiveTab('my-appointments')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'my-appointments'
                ? 'border-[#1a2b6d] text-[#1a2b6d]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            รายการนัดหมายของฉัน
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-6 mt-8">
        
        {activeTab === 'booking' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-10 space-y-8">
            
            {/* STEP PROGRESS BAR */}
            <div className="flex items-center justify-between max-w-lg mx-auto mb-6 text-xs font-semibold">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#1a2b6d]' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-[#1a2b6d] text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
                <span>{serviceType === 'doctor' ? 'เลือกแผนก/แพทย์' : serviceType === 'checkup' ? 'เลือกแพ็กเกจตรวจ' : 'เลือกประเภทวัคซีน'}</span>
              </div>
              <div className="h-px w-12 bg-slate-200" />
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#1a2b6d]' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-[#1a2b6d] text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
                <span>วันและเวลา</span>
              </div>
              <div className="h-px w-12 bg-slate-200" />
              <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#1a2b6d]' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-[#1a2b6d] text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
                <span>ยืนยันข้อมูล</span>
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                {serviceType === 'doctor' && (
                  <>
                    <h2 className="text-sm font-bold text-slate-900 border-b pb-2">1. เลือกแผนกที่ต้องการรับบริการ</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 1, name: 'อายุรแพทย์' },
                        { id: 2, name: 'กุมารแพทย์' },
                        { id: 3, name: 'สูตินรีแพทย์' },
                        { id: 4, name: 'ศัลยแพทย์' },
                      ].map((dept) => (
                        <button
                          key={dept.id}
                          onClick={() => 
                            setBookingData((prev) => ({ 
                              ...prev, 
                              departmentId: dept.id, 
                              departmentName: dept.name,
                              doctorId: 0, 
                              doctorName: '' 
                            }))
                          }
                          className={`p-3.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                            bookingData.departmentId === dept.id
                              ? 'border-[#1a2b6d] bg-blue-50/50 text-[#1a2b6d] shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                          }`}
                        >
                          {dept.name}
                        </button>
                      ))}
                    </div>

                    <div className="pt-4 space-y-3">
                      <h3 className="text-xs font-bold text-slate-900">เลือกแพทย์ผู้ตรวจ (ไม่ระบุก็ได้)</h3>
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
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#1a2b6d]"
                      >
                        <option value={0}>-- แพทย์ท่านใดก็ได้ --</option>
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            นพ./พญ. {doc.user.firstName} {doc.user.lastName} ({doc.specialization})
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {serviceType === 'checkup' && (
                  <>
                    <h2 className="text-sm font-bold text-slate-900 border-b pb-2">1. เลือกโปรแกรมตรวจสุขภาพ</h2>
                    <div className="space-y-3">
                      {[
                        { title: 'โปรแกรมตรวจสุขภาพประจำปี (Standard Checkup)', price: '3,500 บาท' },
                        { title: 'ชุดตรวจวิตามินและสารอาหาร (Vita-Beauty Checkup)', price: '5,200 บาท' },
                        { title: 'ชุดตรวจสมดุลแร่ธาตุและสารต้านอนุมูลอิสระ', price: '6,800 บาท' },
                      ].map((pkg, idx) => (
                        <div
                          key={idx}
                          onClick={() => setBookingData({ ...bookingData, packageType: pkg.title })}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                            bookingData.packageType === pkg.title
                              ? 'border-[#1a2b6d] bg-blue-50/50 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <h3 className="font-bold text-xs text-slate-900">{pkg.title}</h3>
                          </div>
                          <span className="text-xs font-semibold text-[#1a2b6d]">{pkg.price}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {serviceType === 'vaccine' && (
                  <>
                    <h2 className="text-sm font-bold text-slate-900 border-b pb-2">1. เลือกประเภทวัคซีน</h2>
                    <div className="p-4 rounded-xl border border-[#1a2b6d] bg-blue-50/50 space-y-1">
                      <h3 className="font-bold text-xs text-[#1a2b6d]">วัคซีนป้องกันไข้หวัดใหญ่ 4 สายพันธุ์ (Influenza Vaccine)</h3>
                      <p className="text-[11px] text-slate-500">เหมาะสำหรับผู้ที่มีอายุ 15 ปีขึ้นไป สร้างภูมิคุ้มกันโรคไข้หวัดใหญ่สายพันธุ์ใหม่</p>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-[#1a2b6d] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-2xs cursor-pointer"
                  >
                    ถัดไป: เลือกวันและเวลา ➔
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <h2 className="text-sm font-bold text-slate-900 border-b pb-2">2. เลือกวันที่และรอบเวลานัดหมาย</h2>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">วันที่ต้องการเข้ารับบริการ</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">รอบเวลา</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['09:00 - 10:00', '10:30 - 11:30', '13:00 - 14:00', '14:30 - 15:30'].map((time) => (
                      <button
                        key={time}
                        onClick={() => setBookingData({ ...bookingData, time })}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                          bookingData.time === time
                            ? 'border-[#1a2b6d] bg-blue-50/50 text-[#1a2b6d] shadow-2xs'
                            : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                        }`}
                      >
                        {time} น.
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">หมายเหตุเพิ่มเติม (ถ้ามี)</label>
                  <textarea
                    rows={3}
                    placeholder="ระบุข้อมูลเพิ่มเติม..."
                    value={bookingData.symptoms}
                    onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-800 font-medium">
                     ย้อนกลับ
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!bookingData.date || !bookingData.time}
                    className="bg-[#1a2b6d] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    ถัดไป: ตรวจสอบข้อมูล ➔
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: แสดงข้อมูลสาขาในหน้าสรุป */}
            {step === 3 && (
              <div className="space-y-6 max-w-xl mx-auto text-left">
                <h2 className="text-sm font-bold text-slate-900 border-b pb-2 text-center">3. ตรวจสอบข้อมูลการนัดหมาย</h2>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">สาขาโรงพยาบาล:</span>
                    <span className="font-bold text-[#1a2b6d]">{currentBranch.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">ประเภทบริการ:</span>
                    <span className="font-bold text-slate-800">{getServiceTitle()}</span>
                  </div>

                  {serviceType === 'doctor' && (
                    <>
                      <div className="flex justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-500">แผนก:</span>
                        <span className="font-bold text-slate-800">{bookingData.departmentName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-500">แพทย์ผู้ตรวจ:</span>
                        <span className="font-bold text-slate-800">{bookingData.doctorName || 'แพทย์ท่านใดก็ได้'}</span>
                      </div>
                    </>
                  )}

                  {serviceType === 'checkup' && (
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500">โปรแกรมตรวจ:</span>
                      <span className="font-bold text-slate-800">{bookingData.packageType}</span>
                    </div>
                  )}

                  {serviceType === 'vaccine' && (
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500">รายการ:</span>
                      <span className="font-bold text-slate-800">วัคซีนป้องกันไข้หวัดใหญ่ 4 สายพันธุ์</span>
                    </div>
                  )}

                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">วันที่:</span>
                    <span className="font-bold text-slate-800">{bookingData.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">ช่วงเวลา:</span>
                    <span className="font-bold text-[#1a2b6d]">{bookingData.time} น.</span>
                  </div>
                  {bookingData.symptoms && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">หมายเหตุ:</span>
                      <span className="font-bold text-slate-800">{bookingData.symptoms}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-slate-800 font-medium">
                    ⬅ แก้ไขข้อมูล
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={submitting}
                    className="bg-[#1a2b6d] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#0f1a42] transition shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการนัดหมาย'}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: MY APPOINTMENTS */}
        {activeTab === 'my-appointments' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 space-y-6">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">ประวัติและรายการนัดหมายของคุณ</h2>
            
            {loading ? (
              <p className="text-xs text-slate-400 text-center py-8">กำลังโหลดรายการนัดหมาย...</p>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200 bg-slate-50/50 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white ${
                          item.status === 'CANCELLED'
                            ? 'bg-rose-500'
                            : item.status === 'COMPLETED'
                            ? 'bg-emerald-600'
                            : 'bg-[#1a2b6d]'
                        }`}
                      >
                        {item.status === 'PENDING' ? 'รอยืนยัน' : item.status}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 pt-1">
                        บริการ: {item.department?.name || 'ทั่วไป'}
                      </h3>
                      <p className="text-slate-600">
                        {item.doctor ? `แพทย์: นพ./พญ. ${item.doctor.user.firstName} ${item.doctor.user.lastName}` : `รายละเอียด: ${item.symptoms || '-'}`}
                      </p>
                      <p className="text-slate-500">
                        วันที่ {new Date(item.appointmentDate).toLocaleDateString('th-TH')} | เวลา {item.timeSlot} น.
                      </p>
                    </div>

                    {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleCancelAppointment(item.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        ยกเลิกนัดหมาย
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">ยังไม่มีรายการนัดหมายในระบบ</p>
            )}
          </div>
        )}

      </main>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full text-center space-y-6 relative border border-slate-100">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">บันทึกนัดหมายสำเร็จ</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                ระบบได้บันทึกคำขอจองคิวของคุณเรียบร้อยแล้ว สามารถตรวจสอบสถานะได้ในหน้ารายการนัดหมาย
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