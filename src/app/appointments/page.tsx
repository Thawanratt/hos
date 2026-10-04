'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login?redirect=/appointments');
      return;
    }
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

  // ตัวแปลงสถานะเป็นภาษาไทยล้วน
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">รอยืนยัน</span>;
      case 'CONFIRMED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#1a2b6d]">ยืนยันแล้ว</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">เสร็จสิ้น</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">ยกเลิกแล้ว</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <nav className="flex items-center text-xs font-medium text-slate-500 space-x-2">
            <Link href="/" className="hover:text-[#1a2b6d] transition">หน้าหลัก</Link>
            <span>/</span>
            <Link href="/profile" className="hover:text-[#1a2b6d] transition">โปรไฟล์</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">ประวัติการนัดหมาย</span>
          </nav>

          <Link
            href="/booking"
            className="bg-[#1a2b6d] hover:bg-[#121e4d] text-white text-xs font-semibold px-4 py-2.5 rounded-lg text-center transition shadow-xs"
          >
            ทํานัดหมายบริการทางการแพทย์
          </Link>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-xl font-bold text-[#1a2b6d]">
              ประวัติและรายการนัดหมาย
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              ตรวจสอบสถานะการนัดหมายแพทย์และประวัติบริการทางการแพทย์ของคุณ
            </p>
          </div>

          {/* List Section */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-xs text-slate-400">
                กำลังโหลดข้อมูลรายการนัดหมาย...
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 text-xs">
                      <div>{getStatusBadge(item.status)}</div>

                      <h3 className="font-bold text-sm text-slate-900 pt-1">
                        บริการ: {item.department?.name || 'ทั่วไป'}
                      </h3>

                      <p className="text-slate-600">
                        {item.doctor
                          ? `แพทย์: นพ./พญ. ${item.doctor.user.firstName} ${item.doctor.user.lastName}`
                          : `อาการ/รายละเอียด: ${item.symptoms || '-'}`}
                      </p>

                      <p className="text-slate-500 font-medium">
                        วันที่ {new Date(item.appointmentDate).toLocaleDateString('th-TH')} | เวลา {item.timeSlot} น.
                      </p>
                    </div>

                    {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleCancelAppointment(item.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition self-end md:self-center cursor-pointer shadow-xs"
                      >
                        ยกเลิกนัดหมาย
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <p className="text-xs text-slate-400">ยังไม่มีรายการนัดหมายในระบบ</p>
                <Link
                  href="/booking"
                  className="inline-block text-xs font-bold text-[#1a2b6d] hover:underline"
                >
                  สร้างรายการนัดหมายบริการทางการแพทย์
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}