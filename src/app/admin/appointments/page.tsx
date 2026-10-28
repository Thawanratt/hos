'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number | null;
  departmentId: number;
  appointmentDate: string;
  timeSlot: string;
  symptoms?: string;
  status: string;
  patient?: { firstName: string; lastName: string; phone: string; email: string };
  department?: { id: number; name: string };
  doctor?: { user: { firstName: string; lastName: string } };
}

interface Doctor {
  id: number;
  departmentId: number;
  specialization: string;
  user: { firstName: string; lastName: string; email: string };
  department: { name: string };
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchQueueData = async () => {
    setLoading(true);
    try {
      const resApp = await fetch('/api/appointments');
      const dataApp = await resApp.json();
      setAppointments(Array.isArray(dataApp) ? dataApp : dataApp.appointments || dataApp.data || []);

      const resDoc = await fetch('/api/doctors');
      const dataDoc = await resDoc.json();
      setDoctorsList(Array.isArray(dataDoc) ? dataDoc : dataDoc.doctors || dataDoc.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, []);

  const handleAssignDoctor = async (appointmentId: number) => {
    const doctorId = selectedDoctors[appointmentId];
    if (!doctorId) {
      alert('กรุณาเลือกแพทย์ก่อนกด Assign');
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: Number(doctorId), status: 'CONFIRMED' }),
      });
      if (res.ok) {
        setMessage('Assign แพทย์ลงคิวสำเร็จเรียบร้อย!');
        setTimeout(() => setMessage(null), 3000);
        fetchQueueData();
      } else {
        alert('ไม่สามารถ Assign แพทย์ได้');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  const pendingAppointments = appointments.filter(a => !a.doctorId);
  const assignedAppointments = appointments.filter(a => a.doctorId);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/main" className="text-xs font-bold text-[#1a2b6d] hover:underline">← กลับหน้าแดชบอร์ด</Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-sm font-bold text-slate-900">จัดการและจัดสรรคิว (Assign Doctor)</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {message && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs border border-emerald-200">{message}</div>}

        {/* ส่วนที่ 1: คิวรอการจัดสรร */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#1a2b6d]">รายการคิวรอการจัดสรรแพทย์ ({pendingAppointments.length})</h2>
            <p className="text-xs text-slate-500">เลือกแพทย์ผู้เชี่ยวชาญในแผนกเพื่อยืนยันคิวให้คนไข้</p>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">กำลังโหลดข้อมูล...</div>
          ) : pendingAppointments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ไม่มีคิวที่รอการจัดสรรแพทย์ในขณะนี้
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">รหัสคิว</th>
                    <th className="py-3 px-4">คนไข้</th>
                    <th className="py-3 px-4">แผนก</th>
                    <th className="py-3 px-4">อาการ/เวลานัด</th>
                    <th className="py-3 px-4 text-center">เลือกแพทย์ประจำแผนก</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingAppointments.map((item) => {
                    const docInDept = doctorsList.filter(d => d.departmentId === item.departmentId);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-slate-500">#{item.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {item.patient?.firstName} {item.patient?.lastName}
                          <div className="text-[10px] text-slate-400 font-normal">โทร: {item.patient?.phone}</div>
                        </td>
                        <td className="py-3 px-4 text-[#1a2b6d] font-semibold">{item.department?.name}</td>
                        <td className="py-3 px-4">
                          <div className="text-slate-600">{item.symptoms || '-'}</div>
                          <div className="text-[10px] text-slate-400">{item.appointmentDate} ({item.timeSlot})</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <select
                              className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                              value={selectedDoctors[item.id] || ''}
                              onChange={(e) => setSelectedDoctors({ ...selectedDoctors, [item.id]: e.target.value })}
                            >
                              <option value="">-- เลือกแพทย์ --</option>
                              {docInDept.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                  {doc.user.firstName} {doc.user.lastName} ({doc.specialization})
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignDoctor(item.id)}
                              className="px-3 py-1.5 bg-[#1a2b6d] text-white font-semibold rounded-lg hover:bg-[#121f52]"
                            >
                              Assign คิว
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ส่วนที่ 2: คิวที่จัดสรรแพทย์แล้ว */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-emerald-800">รายการคิวที่จัดสรรแพทย์แล้ว ({assignedAppointments.length})</h2>
            <p className="text-xs text-slate-500">ประวัติคิวที่ได้รับการยืนยันและระบุแพทย์ผู้ตรวจเรียบร้อยแล้ว</p>
          </div>

          {assignedAppointments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ยังไม่มีประวัติการจัดสรรแพทย์
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">รหัสคิว</th>
                    <th className="py-3 px-4">คนไข้</th>
                    <th className="py-3 px-4">แผนก</th>
                    <th className="py-3 px-4">แพทย์ผู้ตรวจ</th>
                    <th className="py-3 px-4">เวลานัดหมาย</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignedAppointments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">#{item.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {item.patient?.firstName} {item.patient?.lastName}
                      </td>
                      <td className="py-3 px-4 text-[#1a2b6d] font-semibold">{item.department?.name}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                         {item.doctor?.user?.firstName} {item.doctor?.user?.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.appointmentDate} ({item.timeSlot})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold text-[10px]">
                          {item.status}
                        </span>
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