'use client';

import { useState, useEffect } from 'react';

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

interface StatusBanner {
  text: string;
  type: string;
}

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<StatusBanner | null>(null);

  // ดึงข้อมูลนัดหมายทั้งหมด
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const result = await res.json();
      if (result.success) {
        if (result.data?.appointments) {
          setAppointments(result.data.appointments);
        } else if (Array.isArray(result.data)) {
          setAppointments(result.data);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ปรับเปลี่ยนสถานะ
  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        const labelMap: Record<string, string> = {
          CONFIRMED: 'ยืนยันนัดหมาย',
          COMPLETED: 'เสร็จสิ้นการตรวจ',
          CANCELLED: 'ยกเลิกนัดหมาย',
        };
        setStatusMessage({
          text: `อัปเดตนัดหมาย #${appointmentId} เป็น "${labelMap[newStatus] || newStatus}" เรียบร้อยแล้ว`,
          type: newStatus,
        });
        fetchData();
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  // คำนวณสถิติ
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'PENDING').length,
    confirmed: appointments.filter((a) => a.status === 'CONFIRMED').length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] p-4 sm:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header - สไตล์โรงพยาบาลพรีเมียม */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">ระบบจัดการนัดหมาย</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">รายการคิวนัดหมายคนไข้</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                A
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-800">ผู้ดูแลระบบ</div>
                <div className="text-slate-400 text-[11px] font-mono">admin@hospital.com</div>
              </div>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2.5 bg-[#be123c] hover:bg-[#9f1239] text-white text-xs font-semibold rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>

        {/* Banner แจ้งเตือนเมื่ออัปเดตสถานะ */}
        {statusMessage && (
          <div className={`px-4 py-2.5 rounded-xl text-xs flex justify-between items-center transition-colors shadow-xs ${ 
            statusMessage.type === 'CONFIRMED' ? 'bg-blue-50 text-blue-900 border border-blue-200' : 
            statusMessage.type === 'COMPLETED' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 
            statusMessage.type === 'CANCELLED' ? 'bg-red-50 text-red-900 border border-red-200' : 
            'bg-red-50 text-red-800 border border-red-200' 
          }`}> 
            <span className="font-medium">{statusMessage.text}</span> 
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold px-1 cursor-pointer">×</button> 
          </div> 
        )}

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">คิวทั้งหมด</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total} <span className="text-xs font-normal text-slate-400">รายการ</span></p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">รอการยืนยัน</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">{stats.pending} <span className="text-xs font-normal text-slate-400">รายการ</span></p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">ยืนยันแล้ว</p>
            <p className="text-2xl font-bold text-sky-600 mt-2">{stats.confirmed} <span className="text-xs font-normal text-slate-400">รายการ</span></p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">เข้าตรวจเรียบร้อย</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{stats.completed} <span className="text-xs font-normal text-slate-400">รายการ</span></p>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-2">
              <div className="w-6 h-6 border-2 border-[#be123c] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              ไม่พบข้อมูลการนัดหมาย
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-[11px]">
                    <th className="py-4 px-5">รหัสคิว</th>
                    <th className="py-4 px-5">ชื่อ-นามสกุล คนไข้</th>
                    <th className="py-4 px-5">แผนก / แพทย์ผู้ตรวจ</th>
                    <th className="py-4 px-5">วัน-เวลานัดหมาย</th>
                    <th className="py-4 px-5">สถานะ</th>
                    <th className="py-4 px-5 text-center">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5 font-mono text-slate-400 font-medium">
                        #{item.id}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-800 text-sm">
                          {item.patient?.firstName || 'คนไข้ทั่วไป'} {item.patient?.lastName || ''}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.patient?.phone || '-'}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-medium text-slate-700">
                          {item.department?.name || 'แผนกทั่วไป'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {item.doctor ? `นพ./พญ. ${item.doctor.user.firstName}` : 'ไม่ระบุแพทย์'}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-medium text-slate-700">
                          {new Date(item.appointmentDate).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.timeSlot} น.
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 px-5">
                        {/* ปุ่มไร้ขอบ สีเข้มทึบ ชัดเจน */}
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStatusChange(item.id, 'CONFIRMED')}
                            disabled={item.status === 'CONFIRMED'}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shadow-2xs"
                          >
                            ยืนยัน
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'COMPLETED')}
                            disabled={item.status === 'COMPLETED'}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shadow-2xs"
                          >
                            ตรวจเสร็จ
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'CANCELLED')}
                            disabled={item.status === 'CANCELLED'}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shadow-2xs"
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

      </div>
    </div>
  );
}

// Status Badges
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          รออนุมัติ
        </span>
      );
    case 'CONFIRMED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          ยืนยันแล้ว
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          ตรวจเสร็จ
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          ยกเลิก
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {status}
        </span>
      );
  }
}