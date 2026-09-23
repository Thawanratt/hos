'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface DoctorSchedule {
  id: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxSlots: number;
}

interface DoctorData {
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

interface DepartmentData {
  id: number;
  name: string;
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

export default function DoctorsPage() {
  // State ตัวกรองทั้งหมด
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [selectedTime, setSelectedTime] = useState<string>('ALL');
  const [instantBookingOnly, setInstantBookingOnly] = useState<boolean>(false);
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);

  // รายชื่อแผนกตรงตามฐานข้อมูลจริง
  const [departmentsList] = useState<DepartmentData[]>([
    { id: 1, name: 'อายุรกรรมแพทย์' },
    { id: 2, name: 'กุมารแพทย์' },
    { id: 3, name: 'สูตินรีแพทย์' },
    { id: 4, name: 'ศัลยแพทย์' },
  ]);

  const [doctorsList, setDoctorsList] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States สำหรับ Pagination & News Slide
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [newsSlide, setNewsSlide] = useState(0);

  const dayOptions = [
    { label: 'ทั้งหมด', value: 'ALL' },
    { label: 'อาทิตย์', value: '0' },
    { label: 'จันทร์', value: '1' },
    { label: 'อังคาร', value: '2' },
    { label: 'พุธ', value: '3' },
    { label: 'พฤหัสบดี', value: '4' },
    { label: 'ศุกร์', value: '5' },
    { label: 'เสาร์', value: '6' },
  ];

  const timeOptions = [
    { label: 'ทั้งหมด', value: 'ALL' },
    { label: 'ช่วงเช้า (08:00 - 12:00)', value: 'morning' },
    { label: 'ช่วงบ่าย (12:00 - 16:00)', value: 'afternoon' },
    { label: 'ช่วงเย็น (16:00 - 20:00)', value: 'evening' },
  ];

  // ฟังก์ชันยิง API ดึงแพทย์ตามตัวกรอง
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedDeptId !== 'ALL') params.append('departmentId', selectedDeptId);
      if (selectedGender !== 'ALL') params.append('gender', selectedGender);
      if (selectedDay !== 'ALL') params.append('dayOfWeek', selectedDay);
      if (selectedTime !== 'ALL') params.append('timeSlot', selectedTime);
      if (instantBookingOnly) params.append('isInstantBooking', 'true');

      const res = await fetch(`/api/doctors?${params.toString()}`);
      const result = await res.json();
      if (result.success) {
        setDoctorsList(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDeptId, selectedGender, selectedDay, selectedTime, instantBookingOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDeptId('ALL');
    setSelectedGender('ALL');
    setSelectedDay('ALL');
    setSelectedTime('ALL');
    setInstantBookingOnly(false);
    setCurrentPage(1);
  };

  const getDayName = (dayNum: number) => {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return days[dayNum] || '';
  };

  // Pagination Calculation
  const totalPages = Math.ceil(doctorsList.length / itemsPerPage) || 1;
  const displayedDoctors = doctorsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ข่าวสารทางการแพทย์พร้อมรูปภาพ
  const newsList = [
    { 
      title: 'การประชุมวิชาการความก้าวหน้าทางการแพทย์ระดับนานาชาติ ประจำปี 2026', 
      date: '5 กันยายน 2026',
      imageUrl: '/images/1.jpg'
    },
    { 
      title: 'ศูนย์หลอดเลือดสมองได้รับรองมาตรฐานการรักษาระดับสากล', 
      date: '15 กันยายน 2026',
      imageUrl: '/images/2.jpg'
    },
    { 
      title: 'ความร่วมมือทางการแพทย์ในการพัฒนาเทคโนโลยีการผ่าตัดแผลเล็ก', 
      date: '25 กันยายน 2026',
      imageUrl: '/images/3.jpg'
    },
    { 
      title: 'ต้อนรับคณะแพทย์ผู้เชี่ยวชาญประจำศูนย์หัวใจและหลอดเลือด', 
      date: '15 กันยายน 2026',
      imageUrl: '/images/5.jpg'
    },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans text-slate-800 space-y-10">
      
      {/* HEADER BAR & SEARCH */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          
          {/* Navigation Breadcrumb & Title */}
          <div className="space-y-1">
            <nav className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
              <Link href="/" className="hover:text-slate-700 transition-colors">หน้าแรก</Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-600">นัดหมายแพทย์</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight">
                  ค้นหาและนัดหมาย<span className="font-semibold text-[#1a2b6d]">แพทย์ผู้เชี่ยวชาญ</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  บริการนัดหมายแพทย์ออนไลน์ โรงพยาบาลโนวาเลีย
                </p>
              </div>
              <div className="text-xs text-slate-400 tracking-wider uppercase font-medium hidden md:block">
                NOVARIA HOSPITAL MEDICAL CENTER
              </div>
            </div>
          </div>

          {/* Search Box & Filter Controls */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
              
              {/* Search Input */}
              <div className="w-full lg:flex-1 relative">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อแพทย์, สาขาความเชี่ยวชาญ หรืออาการ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1a2b6d] focus:ring-1 focus:ring-[#1a2b6d] transition"
                />
                <span className="absolute left-3 top-3 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>

              {/* Filter Button */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 border transition cursor-pointer ${
                    showFilterPanel 
                      ? 'bg-[#1a2b6d] text-white border-[#1a2b6d]' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5M3.75 12h16.5" />
                  </svg>
                  <span>ตัวกรองค้นหา</span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilterPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Collapsible Filter Panel */}
            {showFilterPanel && (
              <div className="pt-4 border-t border-slate-100 space-y-5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  
                  {/* 1. แผนกการรักษา */}
                  <div className="space-y-1">
                    <label className="text-slate-600 font-medium">แผนกการรักษา</label>
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#1a2b6d]"
                    >
                      <option value="ALL">ทั้งหมดทุกแผนก</option>
                      {departmentsList.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. เพศแพทย์ */}
                  <div className="space-y-1">
                    <label className="text-slate-600 font-medium">เพศแพทย์</label>
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#1a2b6d]"
                    >
                      <option value="ALL">ทั้งหมด</option>
                      <option value="MALE">ชาย</option>
                      <option value="FEMALE">หญิง</option>
                    </select>
                  </div>

                  {/* 3. วันออกตรวจ */}
                  <div className="space-y-1">
                    <label className="text-slate-600 font-medium">วันออกตรวจ</label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#1a2b6d]"
                    >
                      {dayOptions.map((day) => (
                        <option key={day.value} value={day.value}>{day.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. ช่วงเวลา */}
                  <div className="space-y-1">
                    <label className="text-slate-600 font-medium">ช่วงเวลาตรวจ</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#1a2b6d]"
                    >
                      {timeOptions.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={instantBookingOnly}
                      onChange={(e) => setInstantBookingOnly(e.target.checked)}
                      className="rounded border-slate-300 text-[#1a2b6d] focus:ring-[#1a2b6d]"
                    />
                    <span>แสดงเฉพาะแพทย์ที่พร้อมนัดหมายทันที (Instant Booking)</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium transition underline cursor-pointer"
                    >
                      ล้างตัวกรอง
                    </button>
                    <button
                      onClick={() => setShowFilterPanel(false)}
                      className="px-5 py-2 bg-[#1a2b6d] text-white rounded-lg text-xs font-medium hover:bg-[#0f1a42] transition cursor-pointer"
                    >
                      ซ่อนตัวกรอง
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </section>

      {/* DOCTORS LIST GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <div className="flex justify-between items-baseline border-b border-slate-200 pb-3">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            รายชื่อแพทย์ผู้เชี่ยวชาญ
          </h2>
          <span className="text-xs text-slate-500 font-normal">
            ผลการค้นหา <strong className="text-slate-800 font-semibold">{doctorsList.length}</strong> ท่าน
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-7 h-7 border-2 border-[#1a2b6d] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500">กำลังโหลดข้อมูลแพทย์จากระบบ...</p>
          </div>
        ) : displayedDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDoctors.map((doc) => {
              const doctorImgSrc = doctorImageMap[doc.id] || doctorImageMap[doc.userId];

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition duration-200 flex flex-col justify-between relative group overflow-hidden"
                >
                  {/* Instant Booking Badge */}
                  {doc.isInstantBooking && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-[#1a2b6d] text-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 tracking-wider uppercase">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.57l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.57l7-10a1 1 0 011.12-.384z" clipRule="evenodd" />
                        </svg>
                        Instant Booking
                      </span>
                    </div>
                  )}

                  {/* กรอบแสดงรูปภาพแพทย์ */}
                  <Link 
                    href={`/doctors/${doc.id}`} 
                    className="block h-56 bg-slate-100 relative overflow-hidden border-b border-slate-100 group-hover:bg-slate-200/50 transition-colors"
                  >
                    {doctorImgSrc ? (
                      <img
                        src={doctorImgSrc}
                        alt={`${doc.user?.firstName} ${doc.user?.lastName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span className="font-normal text-slate-400 text-[11px]">
                          [ รูป {doc.user?.gender === 'FEMALE' ? 'พญ.' : 'นพ.'} {doc.user?.firstName} ]
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Doctor Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[11px] font-medium text-[#1a2b6d] uppercase tracking-wider block mb-1">
                        {doc.department?.name || 'ทั่วไป'}
                      </span>
                      <Link href={`/doctors/${doc.id}`}>
                        <h3 className="font-semibold text-base text-slate-900 group-hover:text-[#1a2b6d] transition-colors leading-snug">
                          {doc.user?.gender === 'FEMALE' ? 'พญ.' : 'นพ.'} {doc.user?.firstName} {doc.user?.lastName}
                        </h3>
                      </Link>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      สาขาความเชี่ยวชาญ: {doc.specialization}
                    </p>

                    {/* Doctor Schedules */}
                    <div className="pt-3 border-t border-slate-100 space-y-1">
                      <span className="text-[11px] font-medium text-slate-500 block">ตารางออกตรวจ:</span>
                      {doc.schedules && doc.schedules.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {doc.schedules.map((sched) => (
                            <span key={sched.id} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              วัน{getDayName(sched.dayOfWeek)} ({sched.startTime}-{sched.endTime})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">ไม่มีข้อมูลตารางตรวจ</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 border-t border-slate-200 text-xs font-medium">
                    <Link
                      href={`/doctors/${doc.id}`}
                      className="bg-white text-slate-700 py-2.5 text-center hover:bg-slate-50 transition border-r border-slate-200"
                    >
                      ดูประวัติแพทย์
                    </Link>
                    <Link
                      href={`/doctors/${doc.id}#appointment`}
                      className="bg-[#1a2b6d] text-white py-2.5 text-center hover:bg-[#0f1a42] transition"
                    >
                      นัดหมายตรวจ
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-500 text-xs space-y-2">
            <p className="font-medium text-slate-700 text-sm">ไม่พบข้อมูลแพทย์ตามเงื่อนไขที่ระบุ</p>
            <p className="text-slate-400">กรุณาลองปรับเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อเริ่มค้นหาใหม่</p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              ย้อนกลับ
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#1a2b6d] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              ถัดไป
            </button>
          </div>
        )}
      </section>

      {/* NEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        <div className="flex justify-between items-baseline border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">ข่าวสารทางการแพทย์และบทความ</h2>
          </div>
          <Link href="/news" className="text-xs font-medium text-[#1a2b6d] hover:underline">
            ดูข่าวสารทั้งหมด ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsList.slice(newsSlide * 2, newsSlide * 2 + 2).map((news, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex space-x-4 items-center group">
              <div className="w-28 h-20 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden border border-slate-100 relative">
                {news.imageUrl ? (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                    [ ไม่มีรูปภาพ ]
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#1a2b6d] font-medium uppercase tracking-wider block">{news.date}</span>
                <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover:text-[#1a2b6d] cursor-pointer leading-snug transition-colors">
                  {news.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-1.5 pt-1">
          <button onClick={() => setNewsSlide(0)} className={`w-2 h-2 rounded-full transition cursor-pointer ${newsSlide === 0 ? 'bg-[#1a2b6d]' : 'bg-slate-300'}`}></button>
          <button onClick={() => setNewsSlide(1)} className={`w-2 h-2 rounded-full transition cursor-pointer ${newsSlide === 1 ? 'bg-[#1a2b6d]' : 'bg-slate-300'}`}></button>
        </div>
      </section>

    </div>
  );
}