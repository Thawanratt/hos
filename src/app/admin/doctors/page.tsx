'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';

interface DoctorSchedule {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxSlots: number;
}

interface DoctorItem {
  id: number;
  userId: number;
  departmentId: number;
  licenseNumber: string;
  specialization: string;
  bio?: string | null;
  imageUrl?: string | null;
  isInstantBooking: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  department: {
    id: number;
    name: string;
  };
  schedules: DoctorSchedule[];
}

const DAYS_OF_WEEK = [
  { label: 'วันอาทิตย์', value: 0 },
  { label: 'วันจันทร์', value: 1 },
  { label: 'วันอังคาร', value: 2 },
  { label: 'วันพุธ', value: 3 },
  { label: 'วันพฤหัสบดี', value: 4 },
  { label: 'วันศุกร์', value: 5 },
  { label: 'วันเสาร์', value: 6 },
];

export default function AdminDoctorsPage() {
  const [doctorsList, setDoctorsList] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // ฟอร์มสำหรับแอดมิน (เพิ่ม / แก้ไขแพทย์)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    idCard: '',
    departmentId: '1',
    licenseNumber: '',
    specialization: '',
    bio: '',
    imageUrl: '',
    isInstantBooking: false,
    schedules: [] as DoctorSchedule[], // 🟢 เพิ่ม State สำหรับเก็บตารางออกตรวจ
  });

  // State สำหรับเพิ่มตารางออกตรวจชั่วคราวก่อนกดบันทึกหลัก
  const [tempSchedule, setTempSchedule] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '12:00',
    maxSlots: 10,
  });

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctors');
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setDoctorsList(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ฟังก์ชันอัปโหลดรูปภาพยิงเข้า /api/upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB');
      return;
    }

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        showMessage('อัปโหลดรูปภาพสำเร็จ');
      } else {
        alert(data.message || 'อัปโหลดรูปภาพไม่สำเร็จ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setUploadingImage(false);
    }
  };

  // 🟢 เพิ่มตารางออกตรวจลงในฟอร์มชั่วคราว
  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { ...tempSchedule }],
    }));
  };

  // 🟢 ลบตารางออกตรวจออกจากฟอร์มชั่วคราว
  const handleRemoveSchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.licenseNumber) {
      alert('กรุณากรอกข้อมูลส่วนตัวและเลขใบประกอบวิชาชีพให้ครบถ้วน');
      return;
    }

    if (!editingId) {
      if (!formData.idCard || formData.idCard.length !== 13 || !/^\d+$/.test(formData.idCard)) {
        alert('กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง เป็นตัวเลข 13 หลักครับ');
        return;
      }

      if (!formData.password || formData.password.length < 8) {
        alert('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรขึ้นไปครับ');
        return;
      }
    }

    if (formData.phone && (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone))) {
      alert('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักครับ');
      return;
    }

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const payload = editingId ? { doctorId: editingId, ...formData } : formData;

      const res = await fetch('/api/doctors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok || result.success) {
        showMessage(editingId ? 'แก้ไขข้อมูลแพทย์สำเร็จ' : 'เพิ่มแพทย์คนใหม่สำเร็จ');
        resetForm();
        fetchDoctors();
      } else {
        alert(result.message || 'บันทึกข้อมูลไม่สำเร็จ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  const handleDelete = async (doctorId: number) => {
    if (!confirm('คุณต้องการลบแพทย์ท่านนี้ออกจากระบบใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/doctors?doctorId=${doctorId}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('ลบข้อมูลแพทย์สำเร็จ');
        fetchDoctors();
      } else {
        alert('ลบข้อมูลไม่สำเร็จ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleEditClick = (doc: DoctorItem) => {
    setEditingId(doc.id);
    setFormData({
      firstName: doc.user.firstName,
      lastName: doc.user.lastName,
      email: doc.user.email,
      password: '',
      phone: doc.user.phone || '',
      idCard: '',
      departmentId: String(doc.departmentId),
      licenseNumber: doc.licenseNumber,
      specialization: doc.specialization,
      bio: doc.bio || '',
      imageUrl: doc.imageUrl || '',
      isInstantBooking: doc.isInstantBooking,
      schedules: doc.schedules ? doc.schedules.map(s => ({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, maxSlots: s.maxSlots })) : [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      idCard: '',
      departmentId: '1',
      licenseNumber: '',
      specialization: '',
      bio: '',
      imageUrl: '',
      isInstantBooking: false,
      schedules: [],
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20 relative">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/main" className="text-xs font-bold text-[#1a2b6d] hover:underline">← กลับหน้าแดชบอร์ด</Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-sm font-bold text-slate-900">จัดการข้อมูลแพทย์และตารางออกตรวจ (Admin Control)</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">

        {message && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs border border-emerald-200">
            {message}
          </div>
        )}

        {/* FORM PANEL: เพิ่มหรือแก้ไขแพทย์ */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-[#1a2b6d] text-base">
              {editingId ? 'แก้ไขข้อมูลแพทย์' : 'เพิ่มแพทย์คนใหม่เข้าสู่ระบบ'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-slate-600 border px-3 py-1.5 rounded-md bg-slate-50">
                ยกเลิกการแก้ไข
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700">ชื่อจริง *</label>
                <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 mt-1" required />
              </div>
              <div>
                <label className="font-semibold text-slate-700">นามสกุล *</label>
                <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 mt-1" required />
              </div>
              <div>
                <label className="font-semibold text-slate-700">อีเมลสำหรับเข้าสู่ระบบ *</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 mt-1" required />
              </div>
              {!editingId && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700">รหัสผ่าน (อย่างน้อย 8 ตัว) *</label>
                    <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 mt-1" required />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">เลขบัตรประชาชน (13 หลัก) *</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      maxLength={13}
                      value={formData.idCard} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 13) setFormData({ ...formData, idCard: val });
                      }} 
                      placeholder="กรอกตัวเลข 13 หลัก"
                      className="w-full p-2.5 rounded-md border border-slate-300 mt-1" 
                      required 
                    />
                  </div>
                </>
              )}
              <div>
                <label className="font-semibold text-slate-700">เบอร์โทรศัพท์ (10 หลัก)</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setFormData({ ...formData, phone: val });
                  }} 
                  placeholder="เช่น 0812345678"
                  className="w-full p-2.5 rounded-md border border-slate-300 mt-1" 
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">แผนกการรักษา *</label>
                <select value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 mt-1 bg-white">
                  <option value="1">อายุรกรรมแพทย์</option>
                  <option value="2">กุมารแพทย์</option>
                  <option value="3">สูตินรีแพทย์</option>
                  <option value="4">ศัลยแพทย์</option>
                  <option value="5">ศูนย์หัวใจ</option>
                  <option value="6">ศูนย์มะเร็ง</option>
                  <option value="7">ศูนย์กระดูกและข้อ</option>
                  <option value="8">ศูนย์สมองและระบบประสาท</option>
                  <option value="9">ศูนย์อุบัติเหตุและฉุกเฉิน</option>
                  <option value="10">ศูนย์ตรวจสุขภาพ</option>
                  <option value="11">ศูนย์ศัลยกรรม</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">เลขที่ใบประกอบวิชาชีพ *</label>
                <input type="text" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 mt-1" required />
              </div>
              <div>
                <label className="font-semibold text-slate-700">ความเชี่ยวชาญเฉพาะทาง</label>
                <input type="text" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} placeholder="เช่น อายุรศาสตร์โรคหัวใจ" className="w-full p-2.5 rounded-md border border-slate-300 mt-1" />
              </div>
            </div>

            {/* 🟢 ส่วนจัดการตารางออกตรวจ (Schedules Builder) */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <label className="font-semibold text-slate-700 block text-sm">จัดการตารางออกตรวจประจำสัปดาห์</label>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">วันออกตรวจ</label>
                    <select 
                      value={tempSchedule.dayOfWeek} 
                      onChange={e => setTempSchedule({ ...tempSchedule, dayOfWeek: Number(e.target.value) })}
                      className="w-full p-2 rounded-md border border-slate-300 mt-1 bg-white"
                    >
                      {DAYS_OF_WEEK.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">เวลาเริ่ม</label>
                    <input 
                      type="time" 
                      value={tempSchedule.startTime} 
                      onChange={e => setTempSchedule({ ...tempSchedule, startTime: e.target.value })}
                      className="w-full p-2 rounded-md border border-slate-300 mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">เวลาสิ้นสุด</label>
                    <input 
                      type="time" 
                      value={tempSchedule.endTime} 
                      onChange={e => setTempSchedule({ ...tempSchedule, endTime: e.target.value })}
                      className="w-full p-2 rounded-md border border-slate-300 mt-1 bg-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="button" 
                      onClick={handleAddSchedule}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-md transition cursor-pointer"
                    >
                      + เพิ่มช่วงเวลานี้
                    </button>
                  </div>
                </div>

                {/* แสดงรายการตารางที่เพิ่มเข้ามา */}
                {formData.schedules.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.schedules.map((sch, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                        <span className="font-semibold text-slate-700">
                          {DAYS_OF_WEEK.find(d => d.value === sch.dayOfWeek)?.label} ({sch.startTime} - {sch.endTime})
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSchedule(idx)}
                          className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">ยังไม่มีตารางออกตรวจ (หากไม่เพิ่ม จะแสดงเป็นแพทย์ที่ยังไม่มีตารางออกตรวจ)</p>
                )}
              </div>
            </div>

            {/* ส่วนจัดการรูปภาพแพทย์ */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="font-semibold text-slate-700 block">รูปภาพประจำตัวแพทย์</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">อัปโหลดไฟล์รูปภาพจากเครื่อง</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-[11px] text-slate-500 border border-slate-300 rounded-md file:py-2 file:px-3 file:bg-[#1a2b6d] file:text-white" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">หรือระบุ URL รูปภาพ</span>
                  <input type="text" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="/images/doctor.jpg หรือ https://..." className="w-full p-2.5 rounded-md border border-slate-300 bg-white" />
                </div>
              </div>
              {formData.imageUrl && (
                <div className="flex items-center gap-3 bg-slate-50 p-2 border rounded-md w-fit">
                  <span className="text-[11px] text-slate-500">ตัวอย่างรูป:</span>
                  <img src={formData.imageUrl} alt="Preview" className="h-12 w-12 object-cover rounded-full border" />
                </div>
              )}
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-4">
              <label className="font-semibold text-slate-700">ประวัติโดยย่อ / Bio</label>
              <textarea rows={2} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 mt-1" />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="instant" checked={formData.isInstantBooking} onChange={e => setFormData({ ...formData, isInstantBooking: e.target.checked })} className="w-4 h-4 rounded text-[#1a2b6d]" />
              <label htmlFor="instant" className="font-semibold text-slate-700 cursor-pointer">เปิดใช้งานนัดหมายทันที (Instant Booking)</label>
            </div>

            <button type="submit" disabled={uploadingImage} className="bg-[#1a2b6d] text-white font-semibold px-5 py-2.5 rounded-md hover:bg-[#0f1a42] transition cursor-pointer disabled:bg-slate-400">
              {uploadingImage ? 'กำลังอัปโหลดรูป...' : editingId ? 'บันทึกการแก้ไขข้อมูลแพทย์' : 'เพิ่มแพทย์ใหม่'}
            </button>
          </form>
        </div>

        {/* DOCTORS LIST TABLE/GRID */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-sm">รายชื่อแพทย์ทั้งหมดในระบบ ({doctorsList.length})</h2>

          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400">กำลังโหลดข้อมูลแพทย์...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorsList.map((doc) => (
                <div key={doc.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="h-28 bg-slate-200 rounded-lg overflow-hidden relative">
                      {doc.imageUrl ? (
                        <img src={doc.imageUrl} alt={doc.user.firstName} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[10px] text-slate-400">[ ไม่มีรูปภาพ ]</div>
                      )}
                    </div>
                    <span className="text-[10px] bg-[#1a2b6d]/10 text-[#1a2b6d] font-bold px-2 py-0.5 rounded uppercase">
                      {doc.department?.name}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs">{doc.user.firstName} {doc.user.lastName}</h3>
                    <p className="text-[11px] text-slate-500">ความเชี่ยวชาญ: {doc.specialization || '-'}</p>
                    <p className="text-[10px] text-slate-400 font-mono">อีเมล: {doc.user.email}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button onClick={() => handleEditClick(doc)} className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold">แก้ไข</button>
                    <button onClick={() => handleDelete(doc.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold">ลบ</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}