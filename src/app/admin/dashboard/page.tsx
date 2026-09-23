'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Appointment {
  id: number;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  symptoms?: string;
  patient?: { firstName: string; lastName: string; phone: string; email: string };
  department?: { name: string };
  doctor?: { user: { firstName: string; lastName: string } };
}

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลนัดหมายทั้งหมด
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const result = await res.json();
      if (result.success) setAppointments(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // แอดมินเปลี่ยนสถานะคิว
  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        alert(`อัปเดตสถานะเป็น ${newStatus} เรียบร้อยแล้ว`);
        fetchAppointments(); // รีโหลดข้อมูลตารางใหม่
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-16">
      
      {/* NAVBAR ฝั่ง ADMIN */}
      <nav className="bg-[#1a2b6d] text-white py-4 px-6 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-wide">ระบบแอดมิน - โรงพยาบาลโนวาเลีย</span>
          </div>

          <div className="flex items-center space-x-5">
            <div className="text-right text-xs border-r border-blue-800/80 pr-5 hidden sm:block">
              <div className="font-bold text-[#c5a035]">ผู้ดูแลระบบ (Admin)</div>
              <div className="text-[10px] text-blue-200">admin@novalia.com</div>
            </div>
            
            <Link 
              href="/booking" 
              className="inline-flex items-center gap-1.5 bg-[#c5a035] text-blue-950 font-bold px-3.5 py-1.5 rounded-lg text-xs hover:bg-amber-400 transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>สลับไปหน้าคนไข้</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ADMIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h1 className="text-xl font-bold text-[#1a2b6d]">ตารางจัดการคิวคนไข้ทั้งหมด</h1>
              </div>
              <p className="text-xs text-gray-500">สามารถอนุมัติ เปลี่ยนสถานะ หรือยกเลิกคิวนัดหมายของคนไข้ทุกคนในระบบได้</p>
            </div>
            <span className="bg-blue-50 text-[#1a2b6d] border border-blue-200 font-semibold text-xs px-3.5 py-1.5 rounded-full">
              คิวทั้งหมด {appointments.length} รายการ
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <div className="w-6 h-6 border-2 border-[#1a2b6d] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500">กำลังโหลดข้อมูลคิว...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b text-gray-600">
                    <th className="p-3">ID</th>
                    <th className="p-3">ชื่อคนไข้ / เบอร์โทร</th>
                    <th className="p-3">แผนก / แพทย์</th>
                    <th className="p-3">วัน-เวลานัด</th>
                    <th className="p-3">สถานะปัจจุบัน</th>
                    <th className="p-3 text-center">จัดการสถานะ (Status Lifecycle)</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50/80 transition">
                      <td className="p-3 font-semibold text-gray-700">#{item.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-gray-800">{item.patient?.firstName || 'คนไข้ทั่วไป'} {item.patient?.lastName || ''}</div>
                        <div className="text-gray-400 text-[10px] mt-0.5">{item.patient?.phone || '-'}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-800">{item.department?.name || 'ทั่วไป'}</div>
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          {item.doctor ? `นพ./พญ. ${item.doctor.user.firstName}` : 'ไม่ระบุแพทย์'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-800">{new Date(item.appointmentDate).toLocaleDateString('th-TH')}</div>
                        <div className="text-gray-500 mt-0.5">{item.timeSlot} น.</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${
                          item.status === 'PENDING' ? 'bg-amber-500' :
                          item.status === 'CONFIRMED' ? 'bg-blue-600' :
                          item.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-red-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleStatusChange(item.id, 'CONFIRMED')}
                            className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-2.5 py-1 rounded text-[10px] transition font-semibold"
                          >
                            ยืนยัน
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'COMPLETED')}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 px-2.5 py-1 rounded text-[10px] transition font-semibold"
                          >
                            ตรวจเสร็จ
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'CANCELLED')}
                            className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 px-2.5 py-1 rounded text-[10px] transition font-semibold"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}