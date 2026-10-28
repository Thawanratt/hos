'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ⚠️ ปรับ URL ให้ตรงกับตำแหน่งไฟล์ API ส่วนกลางของคุณ (เช่น /api/admin หรือตำแหน่งเดิม)
      const res = await fetch('/api/admin'); 
      const result = await res.json();
      
      // ดึงข้อมูลจากโครงสร้าง API ส่วนกลาง (result.data.users)
      if (result.success && result.data && Array.isArray(result.data.users)) {
        setUsers(result.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ฟังก์ชันสำหรับลบผู้ใช้งาน
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/admin?userId=${userId}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok || result.success) {
        setMessage('ลบผู้ใช้งานเรียบร้อยแล้ว');
        setTimeout(() => setMessage(null), 3000);
        fetchUsers();
      } else {
        alert(result.message || 'ไม่สามารถลบผู้ใช้งานได้');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  // กรองข้อมูลตามคำค้นหา (ชื่อ, อีเมล, เบอร์โทร)
  const filteredUsers = users.filter((user) => {
    const term = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phone || '').toLowerCase();
    return fullName.includes(term) || email.includes(term) || phone.includes(term);
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/main" className="text-xs font-bold text-[#1a2b6d] hover:underline">← กลับหน้าหลักผู้ดูแลระบบ</Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-sm font-bold text-slate-900">จัดการผู้ใช้งานในระบบ (Users Management)</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {message && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs border border-emerald-200">
            {message}
          </div>
        )}

        {/* FILTER & SEARCH BAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs font-bold text-slate-700">
            รายชื่อผู้ใช้งานทั้งหมด ({filteredUsers.length} คน)
          </div>
          <div className="w-full md:w-72">
            <input 
              type="text" 
              placeholder="🔍 ค้นหาด้วยชื่อ, อีเมล, เบอร์โทร..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2b6d]"
            />
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">กำลังโหลดข้อมูลผู้ใช้งาน...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ไม่พบข้อมูลผู้ใช้งานในระบบ
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">รหัส</th>
                    <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                    <th className="py-3 px-4">อีเมล</th>
                    <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                    <th className="py-3 px-4 text-center">สิทธิ์ผู้ใช้งาน (Role)</th>
                    <th className="py-3 px-4 text-center">วันที่ลงทะเบียน</th>
                    <th className="py-3 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">#{u.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{u.firstName} {u.lastName}</td>
                      <td className="py-3 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3 px-4 text-slate-600">{u.phone || '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-semibold text-[10px] ${
                          u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          u.role === 'DOCTOR' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          ลบ
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