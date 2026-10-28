'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Department {
  id: number;
  name: string;
  description?: string | null;
  _count?: {
    doctors: number;
    appointments: number;
  };
}

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  // State สำหรับโหมดเพิ่มหรือแก้ไข
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/departments');
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setDepartments(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('กรุณากรอกชื่อแผนก');
      return;
    }

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const payload = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch('/api/departments', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok || result.success) {
        showMessage(editingId ? 'แก้ไขข้อมูลแผนกสำเร็จ' : 'เพิ่มแผนกสำเร็จ');
        resetForm();
        fetchDepartments();
      } else {
        alert(result.message || 'ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  const handleEditClick = (dept: Department) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name,
      description: dept.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณต้องการลบแผนกนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/departments?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok || result.success) {
        showMessage('ลบแผนกสำเร็จ');
        fetchDepartments();
      } else {
        alert(result.message || 'ไม่สามารถลบแผนกได้');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/main" className="text-xs font-bold text-[#1a2b6d] hover:underline">← กลับหน้าแดชบอร์ด</Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-sm font-bold text-slate-900">จัดการแผนกการรักษา (Departments Control)</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {message && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs border border-emerald-200">
            {message}
          </div>
        )}

        {/* FORM PANEL: เพิ่มหรือแก้ไขแผนก */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-[#1a2b6d] text-base">
              {editingId ? 'แก้ไขข้อมูลแผนก' : 'เพิ่มแผนกการรักษาใหม่'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-slate-600 border px-3 py-1.5 rounded-md bg-slate-50 cursor-pointer">
                ยกเลิกการแก้ไข
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700">ชื่อแผนก *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="เช่น ศูนย์หัวใจและหลอดเลือด"
                  className="w-full p-2.5 rounded-md border border-slate-300 mt-1 bg-white" 
                  required 
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">คำอธิบายแผนก</label>
                <input 
                  type="text" 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="รายละเอียดหรือบริการย่อๆ ของแผนก"
                  className="w-full p-2.5 rounded-md border border-slate-300 mt-1 bg-white" 
                />
              </div>
            </div>

            <button type="submit" className="bg-[#1a2b6d] text-white font-semibold px-5 py-2.5 rounded-md hover:bg-[#0f1a42] transition cursor-pointer">
              {editingId ? 'บันทึกการแก้ไขแผนก' : '+ บันทึกเพิ่มแผนกใหม่'}
            </button>
          </form>
        </div>

        {/* DEPARTMENTS LIST TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-sm">รายชื่อแผนกทั้งหมดในระบบ ({departments.length})</h2>

          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400">กำลังโหลดข้อมูลแผนก...</div>
          ) : departments.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ยังไม่มีข้อมูลแผนกในระบบ
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">รหัส</th>
                    <th className="py-3 px-4">ชื่อแผนก</th>
                    <th className="py-3 px-4">คำอธิบาย</th>
                    <th className="py-3 px-4 text-center">จำนวนแพทย์สังกัด</th>
                    <th className="py-3 px-4 text-center">จำนวนคิวทั้งหมด</th>
                    <th className="py-3 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">#{dept.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{dept.name}</td>
                      <td className="py-3 px-4 text-slate-600">{dept.description || '-'}</td>
                      <td className="py-3 px-4 text-center font-semibold text-[#1a2b6d]">
                        {dept._count?.doctors || 0} ท่าน
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-700">
                        {dept._count?.appointments || 0} คิว
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button 
                          onClick={() => handleEditClick(dept)} 
                          className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          แก้ไข
                        </button>
                        <button 
                          onClick={() => handleDelete(dept.id)} 
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