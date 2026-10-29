'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IBM_Plex_Sans_Thai } from 'next/font/google';

const plex = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

interface DoctorScheduleItem {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxSlots: number;
  isAvailable: boolean;
  roomNumber?: string;
}

const DAYS_MAP = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<DoctorScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

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
    fetchSchedules(user);
  }, [router]);

  const fetchSchedules = async (user: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/schedule?doctorId=${user.id || user.doctorId}`);
      const result = await res.json();
      if (result.success) {
        // 🟢 กำหนดห้องตรวจประจำตัว (เช่น NR-290) ให้เป็นห้องเดียวกันทุกวันตาม ID ของแพทย์
        const docId = user.id || user.doctorId || 1;
        const fixedRoom = `NR-${280 + (docId % 20)}`; // จะได้เลขห้องประจำคงที่ เช่น NR-290, NR-291 ตามหมอแต่ละคน

        const dataWithFixedRoom = (result.data || []).map((item: any) => ({
          ...item,
          roomNumber: fixedRoom, 
        }));
        setSchedules(dataWithFixedRoom);
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (scheduleId: number, currentStatus: boolean) => {
    setTogglingId(scheduleId);
    try {
      const res = await fetch('/api/doctors/schedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId, isAvailable: !currentStatus }),
      });
      const result = await res.json();

      if (res.ok || result.success) {
        showMessage('อัปเดตสถานะความพร้อมเรียบร้อยแล้ว');
        setSchedules((prev) =>
          prev.map((s) => (s.id === scheduleId ? { ...s, isAvailable: !currentStatus } : s))
        );
      } else {
        showMessage(result.message || 'ไม่สามารถอัปเดตสถานะได้', 'error');
      }
    } catch (err) {
      showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className={`${plex.className} min-h-screen bg-[#f5f7fa] text-slate-800 pb-20`}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/doctors/main"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2f5597] hover:text-[#1e3a6e] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            กลับหน้าหลักแพทย์
          </Link>
          <div className="text-xs text-slate-500 font-medium hidden sm:block">ระบบสารสนเทศโรงพยาบาล</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-6">
        {message && (
          <div
            role="status"
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm border ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {message.text}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">ตารางออกตรวจและห้องตรวจประจำ</h2>
            <p className="text-xs text-slate-500 mt-1">
              แสดงห้องตรวจประจำ (เช่น NR-290) และเวลาปฏิบัติงานของท่าน สามารถสลับสถานะเปิด/ปิดรับคิวได้ทันที
            </p>
          </div>

          {loading ? (
            <div className="text-center py-14 text-sm text-slate-400">กำลังโหลดตารางออกตรวจ...</div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-14 px-6 text-sm text-slate-400">
              ยังไม่มีข้อมูลตารางออกตรวจในระบบ
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-semibold">
                    <th className="py-3 px-5">วันประจำสัปดาห์</th>
                    <th className="py-3 px-5">เวลาปฏิบัติงาน</th>
                    <th className="py-3 px-5">ห้องตรวจประจำ</th>
                    <th className="py-3 px-5">จำนวนคิวสูงสุด</th>
                    <th className="py-3 px-5">สถานะปัจจุบัน</th>
                    <th className="py-3 px-5 text-center">เปิด / ปิดรับคิว</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((item) => (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-slate-50 ${item.isAvailable ? '' : 'bg-slate-50/60'}`}
                    >
                      <td className="py-4 px-5 font-semibold text-slate-900 whitespace-nowrap">
                        {DAYS_MAP[item.dayOfWeek]}
                      </td>
                      <td className="py-4 px-5 text-slate-700 tabular-nums whitespace-nowrap">
                        {item.startTime} – {item.endTime} น.
                      </td>
                      {/* 🟢 แสดงห้องตรวจประจำแบบฟอร์แมตสมจริง เช่น NR-290 */}
                      <td className="py-4 px-5 font-medium text-[#14235a] whitespace-nowrap">
                        <span className="bg-blue-50 text-[#14235a] px-3 py-1 rounded-md text-xs font-bold border border-blue-100 shadow-2xs">
                          {item.roomNumber}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-700 tabular-nums whitespace-nowrap">{item.maxSlots} คิว</td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {item.isAvailable ? 'เปิดให้บริการปกติ' : 'งดออกตรวจ / ไม่ว่าง'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.isAvailable}
                          aria-label={`${item.isAvailable ? 'งดออกตรวจ' : 'เปิดให้บริการ'} ${DAYS_MAP[item.dayOfWeek]}`}
                          disabled={togglingId === item.id}
                          onClick={() => handleToggleStatus(item.id, item.isAvailable)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 focus:outline-none ${
                            item.isAvailable ? 'bg-[#14235a]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${
                              item.isAvailable ? 'translate-x-[23px]' : 'translate-x-[3px]'
                            }`}
                          />
                        </button>
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