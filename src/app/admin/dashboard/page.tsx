'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const COLORS = ['#1a2b6d', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalNews: 0,
    totalPackages: 0,
    totalUsers: 0,
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const result = await res.json();

      if (result.success && result.data) {
        const { appointments = [], news = [], packages = [], users = [] } = result.data;
        setAppointments(appointments);
        setStats({
          totalAppointments: appointments.length,
          totalNews: news.length,
          totalPackages: packages.length,
          totalUsers: users.length,
        });

        const deptCountMap: { [key: string]: number } = {};
        appointments.forEach((app: any) => {
          const deptName = app.department?.name || 'อื่นๆ';
          deptCountMap[deptName] = (deptCountMap[deptName] || 0) + 1;
        });

        const formattedDeptData = Object.keys(deptCountMap).map((name) => ({
          name,
          value: deptCountMap[name],
        }));
        setDepartmentData(formattedDeptData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20">
      {/* HEADER ปรับให้มีปุ่มย้อนกลับไปหน้าหลักแอดมินเหมือนหน้าอื่นๆ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/main" className="text-xs font-bold text-[#1a2b6d] hover:underline">← กลับหน้าหลักผู้ดูแลระบบ</Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-sm font-bold text-slate-900">สถิติและแดชบอร์ดภาพรวม (Analytics Dashboard)</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* BANNER SECTION */}
        <div className="bg-[#1a2b6d] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold">สถิติภาพรวมระบบโรงพยาบาล</h2>
            <p className="text-xs text-slate-200 mt-1">แสดงข้อมูลสถิติการดำเนินงานและการวิเคราะห์ข้อมูลภายในระบบ</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer border border-white/20"
          >
            อัปเดตข้อมูล
          </button>
        </div>

        {/* STATS CARDS (KPIs) */}
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">กำลังโหลดข้อมูลสถิติ...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-1">
              <div className="text-xs font-medium text-slate-500">การนัดหมายทั้งหมด</div>
              <div className="text-2xl font-bold text-[#1a2b6d]">{stats.totalAppointments} <span className="text-xs font-normal text-slate-400">รายการ</span></div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-1">
              <div className="text-xs font-medium text-slate-500">ผู้ใช้งานในระบบ</div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalUsers} <span className="text-xs font-normal text-slate-400">บัญชี</span></div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-1">
              <div className="text-xs font-medium text-slate-500">ข่าวสารและประกาศ</div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalNews} <span className="text-xs font-normal text-slate-400">บทความ</span></div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-1">
              <div className="text-xs font-medium text-slate-500">แพ็กเกจตรวจสุขภาพ</div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalPackages} <span className="text-xs font-normal text-slate-400">รายการ</span></div>
            </div>
          </div>
        )}

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">สัดส่วนการจองคิวจำแนกตามแผนก</h3>
            {departmentData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                ไม่มีข้อมูลสถิติในขณะนี้
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">สถิติทรัพยากรภายในระบบ</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'นัดหมาย', count: stats.totalAppointments },
                  { name: 'ผู้ใช้งาน', count: stats.totalUsers },
                  { name: 'ข่าวสาร', count: stats.totalNews },
                  { name: 'แพ็กเกจ', count: stats.totalPackages },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1a2b6d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT APPOINTMENTS TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">รายการนัดหมายล่าสุด</h3>
            <Link href="/admin/appointments" className="text-xs text-[#1a2b6d] font-semibold hover:underline">ดูทั้งหมด</Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">กำลังโหลด...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ไม่มีรายการนัดหมายในระบบ
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-3 px-4">รหัส</th>
                    <th className="py-3 px-4">ชื่อผู้ป่วย</th>
                    <th className="py-3 px-4">แผนก</th>
                    <th className="py-3 px-4">แพทย์ผู้ตรวจ</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.slice(0, 5).map((app: any) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">#{app.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {app.patient ? `${app.patient.firstName} ${app.patient.lastName}` : 'ไม่ระบุ'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{app.department?.name || '-'}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {app.doctor?.user ? `นพ. ${app.doctor.user.firstName} ${app.doctor.user.lastName}` : 'รอดำเนินการ'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-medium text-[10px] ${
                          app.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          app.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {app.status || 'PENDING'}
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