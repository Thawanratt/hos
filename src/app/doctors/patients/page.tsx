'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IBM_Plex_Sans_Thai } from 'next/font/google';

const plex = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

interface Appointment {
  id: number;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  symptoms?: string;
  patient?: { id: number; firstName: string; lastName: string; phone: string; email: string };
  department?: { name: string };
  doctorId?: number;
  doctor?: { userId: number; id: number };
}

interface StatusBanner {
  text: string;
  type: string;
}

const Icon = ({ d, className = 'w-4 h-4' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  back: 'M19 12H5M11 6l-6 6 6 6',
  refresh: 'M4 4v5h5M20 20v-5h-5M5.6 15A8 8 0 0 0 20 12M18.4 9A8 8 0 0 0 4 12',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  check: 'M5 12l5 5 9-10',
};

const LABELS: Record<string, string> = {
  CONFIRMED: 'ยืนยันนัดหมาย',
  IN_PROGRESS: 'กำลังตรวจ',
  COMPLETED: 'เสร็จสิ้นการตรวจ',
  CANCELLED: 'ยกเลิกนัดหมาย',
};

const byTime = (a: Appointment, b: Appointment) =>
  new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime() ||
  (a.timeSlot || '').localeCompare(b.timeSlot || '');

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [doctorUser, setDoctorUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<StatusBanner | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);

  // 1. ตรวจสอบสิทธิ์การล็อกอินและดึงข้อมูลเฉพาะแพทย์ท่านนั้น
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== 'DOCTOR' && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setDoctorUser(user);
    fetchDoctorData(user);
  }, [router]);

  const fetchDoctorData = async (user: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const result = await res.json();

      const list = Array.isArray(result) ? result : result.appointments || result.data || [];

      if (user.role === 'DOCTOR') {
        const filtered = list.filter(
          (item: any) =>
            item.doctorId === user.id ||
            item.doctor?.userId === user.id ||
            item.doctorId === user.doctorId
        );
        setAppointments(filtered);
      } else {
        setAppointments(list);
      }
    } catch (error) {
      console.error('Failed to fetch doctor appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. อัปเดตสถานะการรักษา พร้อมบันทึกเวชระเบียนอัตโนมัติ (ใช้ข้อมูลตามที่คนไข้กรอกจริงเป๊ะๆ)
  const handleStatusChange = async (appointment: Appointment, newStatus: string) => {
    setUpdatingId(appointment.id);
    try {
      // 1. อัปเดตสถานะนัดหมายตามปกติ
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();

      if (res.ok) {
        // 2. ถ้าเปลี่ยนสถานะเป็น COMPLETED (ตรวจเสร็จสิ้น) ให้บันทึกเวชระเบียนอัตโนมัติด้วยอาการที่คนไข้กรอกจริง
        if (newStatus === 'COMPLETED' && appointment.patient?.id && doctorUser) {
          const docId = doctorUser.id || doctorUser.doctorId;
          await fetch('/api/doctors/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              doctorId: docId,
              patientId: appointment.patient.id,
              diagnosis: appointment.symptoms || '', // ใช้ข้อความอาการที่คนไข้กรอกจริงเท่านั้น
              prescription: '', // ปล่อยว่างไว้ตามที่คนไข้ไม่ได้กรอก
            }),
          }).catch((err) => console.error('Auto save medical record error:', err));
        }

        setStatusMessage({
          text: `อัปเดตนัดหมาย #${appointment.id} เป็น "${LABELS[newStatus] || newStatus}" เรียบร้อยแล้ว`,
          type: newStatus,
        });
        if (doctorUser) fetchDoctorData(doctorUser);
      } else {
        setStatusMessage({ text: result.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ', type: 'error' });
      }
    } catch (err) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.dispatchEvent(new Event('storage'));
    router.push('/login');
  };

  const waiting = appointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED').sort(byTime);
  const inProgress = appointments.filter((a) => a.status === 'IN_PROGRESS').sort(byTime);
  const completed = appointments.filter((a) => a.status === 'COMPLETED').sort(byTime).reverse();
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED').sort(byTime);

  const columns = [
    { key: 'WAIT', title: 'รอตรวจ', hint: 'รออนุมัติ / ยืนยันแล้ว', items: waiting, emphasis: false },
    { key: 'PROGRESS', title: 'กำลังตรวจ', hint: 'ผู้ป่วยที่อยู่ในห้องตรวจ', items: inProgress, emphasis: true },
    { key: 'DONE', title: 'ตรวจเสร็จสิ้น', hint: 'เรียงจากล่าสุด', items: completed, emphasis: false },
    ...(showCancelled ? [{ key: 'CANCEL', title: 'ยกเลิก', hint: 'นัดหมายที่ถูกยกเลิก', items: cancelled, emphasis: false }] : []),
  ];

  const doctorName = doctorUser ? `${doctorUser.firstName} ${doctorUser.lastName}` : 'แพทย์ผู้เชี่ยวชาญ';

  return (
    <div className={`${plex.className} min-h-screen bg-[#f6f8fb] text-slate-800 pb-20`}>
      {/* ---------- แถบบน ---------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/doctors/main"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2f5597] hover:text-[#1e3a6e] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5597] rounded"
          >
            <Icon d={icons.back} />
            กลับหน้าหลักแพทย์
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => doctorUser && fetchDoctorData(doctorUser)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Icon d={icons.refresh} className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Icon d={icons.logout} className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* หัวเรื่อง */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a6e]">คิวตรวจผู้ป่วย</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {doctorName}
              {!loading && <span className="text-slate-400"> · คิวทั้งหมด {appointments.length} รายการ</span>}
            </p>
          </div>
          {!loading && cancelled.length > 0 && (
            <button
              onClick={() => setShowCancelled((v) => !v)}
              className="self-start sm:self-auto text-xs font-medium text-slate-500 hover:text-[#2f5597] transition-colors cursor-pointer"
            >
              {showCancelled ? 'ซ่อน' : 'แสดง'}รายการที่ยกเลิก ({cancelled.length})
            </button>
          )}
        </div>

        {/* แจ้งเตือน */}
        {statusMessage && (
          <div
            role="status"
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm border ${
              statusMessage.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-[#e9eff7] text-[#1e3a6e] border-[#d6e0ee]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusMessage.type === 'error' ? 'bg-red-500' : 'bg-[#2f5597]'}`} />
              {statusMessage.text}
            </span>
            <button
              onClick={() => setStatusMessage(null)}
              aria-label="ปิดการแจ้งเตือน"
              className="text-slate-400 hover:text-slate-600 text-lg leading-none px-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* ---------- บอร์ดคิว ---------- */}
        <div className={`grid grid-cols-1 gap-5 items-start ${showCancelled ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {columns.map((col) => (
            <section
              key={col.key}
              className={`rounded-xl bg-[#eaeff6] p-3 border-t-[3px] ${col.emphasis ? 'border-t-[#2f5597]' : 'border-t-transparent'}`}
            >
              <div className="flex items-center justify-between px-2 pt-1 pb-3">
                <div>
                  <h2 className={`text-sm font-semibold ${col.emphasis ? 'text-[#2f5597]' : 'text-[#1e3a6e]'}`}>{col.title}</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">{col.hint}</p>
                </div>
                <span
                  className={`min-w-7 text-center text-xs font-semibold tabular-nums px-2 py-1 rounded-full ${
                    col.emphasis ? 'bg-[#2f5597] text-white' : 'bg-white text-[#1e3a6e]'
                  }`}
                >
                  {loading ? '–' : col.items.length}
                </span>
              </div>

              <div className="space-y-3 lg:max-h-[calc(100vh-17rem)] overflow-y-auto pr-0.5">
                {loading ? (
                  [0, 1].map((i) => <div key={i} className="h-36 rounded-lg bg-white/70 animate-pulse" />)
                ) : col.items.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
                    ไม่มีคิวในส่วนนี้
                  </div>
                ) : (
                  col.items.map((item) => (
                    <QueueCard
                      key={item.id}
                      item={item}
                      busy={updatingId === item.id}
                      onChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

function QueueCard({
  item,
  busy,
  onChange,
}: {
  item: Appointment;
  busy: boolean;
  onChange: (item: Appointment, status: string) => void;
}) {
  const date = new Date(item.appointmentDate);
  const isToday = date.toDateString() === new Date().toDateString();
  const done = item.status === 'COMPLETED' || item.status === 'CANCELLED';

  const primary = 'px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-wait';
  const outline = 'px-3 py-2 rounded-lg text-xs font-medium border border-[#2f5597]/40 text-[#2f5597] hover:bg-[#e9eff7] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-wait';

  return (
    <article className={`bg-white rounded-lg border border-slate-200 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${done ? 'opacity-80' : ''}`}>
      {/* เวลา + สถานะ */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-semibold text-[#1e3a6e] tabular-nums leading-none">{item.timeSlot}</div>
          <div className="mt-1.5 text-xs text-slate-500">
            {isToday ? (
              <span className="font-medium text-[#2f5597]">วันนี้</span>
            ) : (
              date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge status={item.status} />
          <span className="text-[11px] text-slate-400 tabular-nums">คิว #{item.id}</span>
        </div>
      </div>

      {/* ผู้ป่วย */}
      <div className="mt-3.5 pt-3.5 border-t border-slate-100">
        <div className="text-[15px] font-semibold text-slate-900">
          {item.patient?.firstName || 'คนไข้'} {item.patient?.lastName || ''}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Icon d={icons.phone} className="w-3 h-3" />
            {item.patient?.phone || '-'}
          </span>
          {item.department?.name && <span>{item.department.name}</span>}
        </div>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">
          <span className="text-slate-400">อาการ: </span>
          {item.symptoms || 'ระบุทั่วไป'}
        </p>
      </div>

      {/* ปุ่มดำเนินการ */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {item.status === 'PENDING' && (
          <>
            <button onClick={() => onChange(item, 'CONFIRMED')} disabled={busy} className={outline}>
              ยืนยันนัด
            </button>
            <button onClick={() => onChange(item, 'IN_PROGRESS')} disabled={busy} className={`${primary} bg-[#2f5597] hover:bg-[#274a85]`}>
              เรียกเข้าตรวจ
            </button>
          </>
        )}
        {item.status === 'CONFIRMED' && (
          <button onClick={() => onChange(item, 'IN_PROGRESS')} disabled={busy} className={`${primary} bg-[#2f5597] hover:bg-[#274a85]`}>
            เรียกเข้าตรวจ
          </button>
        )}
        {item.status === 'IN_PROGRESS' && (
          <button onClick={() => onChange(item, 'COMPLETED')} disabled={busy} className={`${primary} bg-[#1e3a6e] hover:bg-[#162c55]`}>
            ตรวจเสร็จสิ้น
          </button>
        )}
        {item.status === 'COMPLETED' && (
          <>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Icon d={icons.check} className="w-3.5 h-3.5 text-emerald-600" />
              ตรวจเรียบร้อย
            </span>
            <button
              onClick={() => onChange(item, 'IN_PROGRESS')}
              disabled={busy}
              className="ml-auto text-xs text-slate-400 hover:text-[#2f5597] transition-colors cursor-pointer disabled:opacity-40"
            >
              กลับไปกำลังตรวจ
            </button>
          </>
        )}
        {item.status === 'CANCELLED' && (
          <button onClick={() => onChange(item, 'CONFIRMED')} disabled={busy} className={outline}>
            ยืนยันนัดอีกครั้ง
          </button>
        )}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border';
  switch (status) {
    case 'PENDING':
      return (
        <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          รออนุมัติ
        </span>
      );
    case 'CONFIRMED':
      return (
        <span className={`${base} bg-[#e9eff7] text-[#2f5597] border-[#d6e0ee]`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2f5597]" />
          ยืนยันแล้ว
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`${base} bg-[#2f5597] text-white border-[#2f5597]`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          กำลังตรวจ
        </span>
      );
    case 'COMPLETED':
      return (
        <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ตรวจเสร็จ
        </span>
      );
    case 'CANCELLED':
      return (
        <span className={`${base} bg-slate-100 text-slate-500 border-slate-200`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          ยกเลิก
        </span>
      );
    default:
      return <span className={`${base} bg-slate-100 text-slate-600 border-slate-200`}>{status}</span>;
  }
}