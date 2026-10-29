'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
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

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('ข่าวประชาสัมพันธ์');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({ show: false, message: '', onConfirm: () => {} });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3500);
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/admin');
      const result = await res.json();
      if (result.success) {
        setNewsList(result.data?.news || result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return showToast('ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB', 'error');
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setNewsImageUrl(data.imageUrl);
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

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      return showToast('กรุณากรอกหัวข้อและเนื้อหาข่าวให้ครบถ้วน', 'error');
    }

    setSubmitting(true);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const bodyPayload = editingId 
        ? { newsId: editingId, title: newsTitle, category: newsCategory, content: newsContent, imageUrl: newsImageUrl }
        : { title: newsTitle, category: newsCategory, content: newsContent, imageUrl: newsImageUrl };

      const res = await fetch('/api/admin', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const result = await res.json();
      if (result.success) {
        showToast(editingId ? 'บันทึกการแก้ไขเรียบร้อย' : 'เผยแพร่ข่าวสารเรียบร้อย', 'success');
        resetForm();
        fetchNews();
      } else {
        showToast(result.message || 'ดำเนินการไม่สำเร็จ', 'error');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNews = (newsId: number) => {
    setConfirmModal({
      show: true,
      message: 'คุณต้องการลบข่าวสารนี้ออกจากระบบใช่หรือไม่?',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, show: false }));
        try {
          const res = await fetch(`/api/admin?newsId=${newsId}`, { method: 'DELETE' });
          const result = await res.json();
          if (result.success) {
            showToast('ลบข่าวสารเรียบร้อยแล้ว', 'success');
            fetchNews();
          } else {
            showToast(result.message || 'ลบไม่สำเร็จ', 'error');
          }
        } catch (err) {
          showToast('เกิดข้อผิดพลาดในการลบข่าวสาร', 'error');
        }
      },
    });
  };

  const handleEditClick = (article: NewsItem) => {
    setEditingId(article.id);
    setNewsTitle(article.title);
    setNewsCategory(article.category || 'ข่าวประชาสัมพันธ์');
    setNewsContent(article.content);
    setNewsImageUrl(article.imageUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setNewsTitle('');
    setNewsCategory('ข่าวประชาสัมพันธ์');
    setNewsContent('');
    setNewsImageUrl('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20 relative">

      {/* TOAST NOTIFICATION */}
      {Boolean(toast.show) && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-semibold shadow-xl">
          {toast.message}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {Boolean(confirmModal.show) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">ยืนยันการทำรายการ</h3>
            <p className="text-xs text-slate-600">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setConfirmModal((prev) => ({ ...prev, show: false }))} className="px-3 py-1.5 text-xs border rounded-md cursor-pointer">ยกเลิก</button>
              <button onClick={confirmModal.onConfirm} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md cursor-pointer">ยืนยันการลบ</button>
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
            <h1 className="text-sm font-bold text-slate-900">จัดการข่าวสารและบทความ (Admin Control)</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        
        {/* FORM PANEL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-[#1a2b6d] text-base">
              {editingId ? 'แก้ไขข้อมูลข่าวสาร' : 'จัดการและเพิ่มข่าวสารใหม่'}
            </h2>
            {Boolean(editingId) && (
              <button onClick={resetForm} className="text-xs text-slate-600 border px-3 py-1.5 rounded-md bg-slate-50 cursor-pointer">
                ยกเลิกการแก้ไข
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitNews} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1">
                <label htmlFor="input-newstitle" className="font-semibold text-slate-700 block">หัวข้อข่าวสาร</label>
                <input
                  id="input-newstitle"
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="หัวข้อข่าวสาร..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="select-newscategory" className="font-semibold text-slate-700 block">หมวดหมู่</label>
                <select
                  id="select-newscategory"
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="ข่าวประชาสัมพันธ์">ข่าวประชาสัมพันธ์</option>
                  <option value="วิชาการแพทย์">วิชาการแพทย์</option>
                  <option value="เกร็ดความรู้สุขภาพ">เกร็ดความรู้สุขภาพ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <div className="space-y-1">
                <label htmlFor="file-newsimage" className="font-semibold text-slate-700 block">อัปโหลดรูปภาพ</label>
                <input
                  id="file-newsimage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-[11px] text-slate-500 border border-slate-300 rounded-lg file:py-1.5 file:px-2.5 file:bg-[#1a2b6d] file:text-white"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="input-newsimageurl" className="font-semibold text-slate-700 block">หรือระบุ URL รูปภาพ</label>
                <input
                  id="input-newsimageurl"
                  type="text"
                  value={newsImageUrl}
                  onChange={(e) => setNewsImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {Boolean(newsImageUrl) && (
              <div className="flex items-center gap-3 bg-slate-50 p-2 border rounded-lg w-fit">
                <span className="text-[11px] text-slate-500">ตัวอย่าง:</span>
                <img src={newsImageUrl} alt="Preview" className="h-12 w-20 object-cover rounded border" />
              </div>
            )}

            <div className="space-y-1 border-t border-slate-100 pt-3">
              <label htmlFor="textarea-newscontent" className="font-semibold text-slate-700 block">เนื้อหาข่าวสาร</label>
              <textarea
                id="textarea-newscontent"
                rows={4}
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                placeholder="รายละเอียดข่าว..."
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="bg-[#1a2b6d] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#0f1a42] transition cursor-pointer disabled:bg-slate-400"
            >
              {submitting ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เผยแพร่ข่าวสาร'}
            </button>
          </form>
        </div>

        {/* NEWS LIST FOR ADMIN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">รายการข่าวสารทั้งหมด ({newsList.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsList.map((article) => (
              <div key={article.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="h-28 bg-slate-200 rounded-lg overflow-hidden relative">
                    {Boolean(article.imageUrl) ? (
                      <img src={article.imageUrl!} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] text-slate-400">[ ไม่มีรูป ]</div>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{article.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{article.content}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-400">{new Date(article.createdAt).toLocaleDateString('th-TH')}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleEditClick(article)} className="text-[10px] bg-white border border-slate-300 px-2 py-1 rounded font-semibold cursor-pointer">แก้ไข</button>
                    <button onClick={() => handleDeleteNews(article.id)} className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded font-semibold cursor-pointer">ลบ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}