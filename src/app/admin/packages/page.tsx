'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';

interface PackageItem {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  price: string;
  originalPrice?: string;
  tag?: string;
  imageUrl?: string;
  hospital?: string;
  validDate?: string;
  features?: string[];
  terms?: string[];
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmState {
  show: boolean;
  message: string;
  onConfirm: () => void;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'ตรวจสุขภาพประจำปี',
    price: '',
    originalPrice: '',
    tag: '',
    imageUrl: '',
    hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
    validDate: 'ใช้สิทธิ์ได้ถึงวันที่ 31 ธันวาคม 2026',
    featuresText: '',
    termsText: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({ show: false, message: '', onConfirm: () => {} });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3500);
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/packages');
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setPackages(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return showToast('ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB', 'error');
    }

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        showToast('อัปโหลดรูปภาพสำเร็จ', 'success');
      } else {
        showToast(data.message || 'อัปโหลดรูปภาพไม่สำเร็จ', 'error');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      return showToast('กรุณากรอกชื่อแพ็กเกจและราคาโปรโมชั่น', 'error');
    }

    const featuresArray = formData.featuresText ? formData.featuresText.split('\n').map((i) => i.trim()).filter(Boolean) : [];
    const termsArray = formData.termsText ? formData.termsText.split('\n').map((i) => i.trim()).filter(Boolean) : [];

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      category: formData.category,
      price: formData.price,
      originalPrice: formData.originalPrice,
      tag: formData.tag,
      imageUrl: formData.imageUrl,
      hospital: formData.hospital,
      validDate: formData.validDate,
      features: featuresArray,
      terms: termsArray,
    };

    setSubmitting(true);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const bodyPayload = editingId ? { packageId: editingId, ...payload } : payload;

      const res = await fetch('/api/packages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const result = await res.json();
      if (result.success) {
        showToast(editingId ? 'แก้ไขแพ็กเกจเรียบร้อยแล้ว' : 'เพิ่มแพ็กเกจใหม่เรียบร้อยแล้ว', 'success');
        resetForm();
        fetchPackages();
      } else {
        showToast(result.message || 'ดำเนินการไม่สำเร็จ', 'error');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      show: true,
      message: 'คุณต้องการลบแพ็กเกจนี้ออกจากระบบใช่หรือไม่?',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, show: false }));
        try {
          const res = await fetch(`/api/packages?packageId=${id}`, { method: 'DELETE' });
          const result = await res.json();
          if (result.success) {
            showToast('ลบแพ็กเกจเรียบร้อยแล้ว', 'success');
            fetchPackages();
          } else {
            showToast(result.message || 'ลบไม่สำเร็จ', 'error');
          }
        } catch (err) {
          showToast('เกิดข้อผิดพลาดในการลบแพ็กเกจ', 'error');
        }
      },
    });
  };

  const handleEditClick = (pkg: PackageItem) => {
    setEditingId(pkg.id);
    setFormData({
      title: pkg.title,
      subtitle: pkg.subtitle || '',
      category: pkg.category || 'ตรวจสุขภาพประจำปี',
      price: pkg.price,
      originalPrice: pkg.originalPrice || '',
      tag: pkg.tag || '',
      imageUrl: pkg.imageUrl || '',
      hospital: pkg.hospital || 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
      validDate: pkg.validDate || 'ใช้สิทธิ์ได้ถึงวันที่ 31 ธันวาคม 2026',
      featuresText: pkg.features ? pkg.features.join('\n') : '',
      termsText: pkg.terms ? pkg.terms.join('\n') : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'ตรวจสุขภาพประจำปี',
      price: '',
      originalPrice: '',
      tag: '',
      imageUrl: '',
      hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
      validDate: 'ใช้สิทธิ์ได้ถึงวันที่ 31 ธันวาคม 2026',
      featuresText: '',
      termsText: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20 relative">

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-xs">
          <span>{toast.message}</span>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">ยืนยันการทำรายการ</h3>
            <p className="text-xs text-slate-600">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setConfirmModal((prev) => ({ ...prev, show: false }))} className="px-3 py-1.5 text-xs border rounded-md">ยกเลิก</button>
              <button onClick={confirmModal.onConfirm} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md">ยืนยันการลบ</button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/main" className="text-xs font-bold text-[#1a2b6d] hover:underline">← กลับหน้าแดชบอร์ด</Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-sm font-bold text-slate-900">จัดการแพ็กเกจสุขภาพ (Admin Control)</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        
        {/* FORM PANEL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-[#1a2b6d] text-base">
              {editingId ? 'แก้ไขข้อมูลแพ็กเกจ' : 'เพิ่มแพ็กเกจใหม่'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-slate-600 border px-3 py-1.5 rounded-md bg-slate-50">
                ยกเลิกการแก้ไข
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-semibold text-slate-700">ชื่อแพ็กเกจ *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="เช่น โปรแกรมตรวจสุขภาพประจำปี" className="w-full p-2.5 rounded-md border border-slate-300 bg-white" required />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">หมวดหมู่</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 bg-white">
                  <option value="ตรวจสุขภาพประจำปี">ตรวจสุขภาพประจำปี</option>
                  <option value="วิตามิน & ชะลอวัย">วิตามิน & ชะลอวัย</option>
                  <option value="สิทธิพิเศษวันเกิด">สิทธิพิเศษวันเกิด</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">ราคาโปรโมชั่น *</label>
                <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="เช่น 3,500 ฿" className="w-full p-2.5 rounded-md border border-slate-300 bg-white" required />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">ราคาปกติ</label>
                <input type="text" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="เช่น 6,000 ฿" className="w-full p-2.5 rounded-md border border-slate-300 bg-white" />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">ป้ายกำกับ (Tag)</label>
                <input type="text" value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} placeholder="เช่น โปรแกรมยอดนิยม" className="w-full p-2.5 rounded-md border border-slate-300 bg-white" />
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <label className="font-semibold text-slate-700 block">รูปภาพแพ็กเกจ</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-[11px] text-slate-500 border border-slate-300 rounded-md file:py-2 file:px-3 file:bg-[#1a2b6d] file:text-white" />
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="หรือระบุ URL รูปภาพ" className="w-full p-2.5 rounded-md border border-slate-300 bg-white" />
              </div>
              {formData.imageUrl && (
                <div className="flex items-center gap-3 bg-white p-2 border rounded-md w-fit">
                  <span className="text-[11px] text-slate-500">ตัวอย่าง:</span>
                  <img src={formData.imageUrl} alt="Preview" className="h-12 w-20 object-cover rounded border" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <label className="font-semibold text-slate-700">คำอธิบายสั้นๆ (Subtitle)</label>
              <textarea rows={2} value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 bg-white" />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">ข้อมูลแพ็กเกจ / รายการตรวจ (แยกแต่ละข้อด้วยการขึ้นบรรทัดใหม่)</label>
              <textarea rows={3} value={formData.featuresText} onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 bg-white" />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">ระยะเวลา (Valid Date)</label>
              <input type="text" value={formData.validDate} onChange={(e) => setFormData({ ...formData, validDate: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 bg-white" />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">เงื่อนไขการใช้บริการ (แยกแต่ละข้อด้วยการขึ้นบรรทัดใหม่)</label>
              <textarea rows={3} value={formData.termsText} onChange={(e) => setFormData({ ...formData, termsText: e.target.value })} className="w-full p-2.5 rounded-md border border-slate-300 bg-white" />
            </div>

            <button type="submit" disabled={submitting || uploadingImage} className="bg-[#1a2b6d] text-white font-semibold px-5 py-2.5 rounded-md hover:bg-[#0f1a42] transition cursor-pointer">
              {submitting ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มแพ็กเกจใหม่'}
            </button>
          </form>
        </div>

        {/* PACKAGES MANAGEMENT LIST */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-sm">รายการแพ็กเกจทั้งหมดในระบบ ({packages.length})</h2>
          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400">กำลังโหลด...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="h-28 bg-slate-200 rounded-lg overflow-hidden">
                      <img src={pkg.imageUrl || '/images/default-package.jpg'} alt={pkg.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-sky-700 font-bold uppercase">{pkg.category}</span>
                    <h3 className="font-bold text-slate-800 text-xs line-clamp-1">{pkg.title}</h3>
                    <div className="text-xs font-extrabold text-[#1a2b6d]">{pkg.price}</div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button onClick={() => handleEditClick(pkg)} className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold">แก้ไข</button>
                    <button onClick={() => handleDelete(pkg.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold">ลบ</button>
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