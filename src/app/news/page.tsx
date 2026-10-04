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

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [loading, setLoading] = useState<boolean>(true);

  // States สำหรับสิทธิ์ ADMIN และฟอร์มจัดการข่าวสาร
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('ข่าวประชาสัมพันธ์');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Custom UI Notifications
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({ show: false, message: '', onConfirm: () => {} });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3500);
  };

  // 1. เช็กสิทธิ์ Admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.role === 'ADMIN' || user.email === 'admin@novalia.com') {
            setIsAdmin(true);
          }
        } catch (e) {
          setIsAdmin(false);
        }
      }
    }
  }, []);

  // 2. ดึงข้อมูลข่าวสาร
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const result = await res.json();
      if (result.success) {
        const fetchedNews = result.data?.news || result.data || [];
        setNewsList(fetchedNews);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // 3. ฟังก์ชันอัปโหลดรูปภาพ
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
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

  // 4. บันทึกข้อมูล
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

  // 5. ลบข่าวสาร
  const handleDeleteNews = (newsId: number) => {
    setConfirmModal({
      show: true,
      message: 'คุณต้องการลบข่าวสารนี้ออกจากระบบใช่หรือไม่?',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, show: false }));
        try {
          const res = await fetch(`/api/admin?newsId=${newsId}`, {
            method: 'DELETE',
          });
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

  // 6. กดปุ่มแก้ไขข่าว
  const handleEditClick = (article: NewsItem) => {
    setEditingId(article.id);
    setNewsTitle(article.title);
    setNewsCategory(article.category || 'ข่าวประชาสัมพันธ์');
    setNewsContent(article.content);
    setNewsImageUrl(article.imageUrl || '');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setNewsTitle('');
    setNewsCategory('ข่าวประชาสัมพันธ์');
    setNewsContent('');
    setNewsImageUrl('');
  };

  const categoriesList = ['ทั้งหมด', 'ข่าวประชาสัมพันธ์', 'วิชาการแพทย์', 'เกร็ดความรู้สุขภาพ'];

  const filteredNews =
    selectedCategory === 'ทั้งหมด'
      ? newsList
      : newsList.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans text-slate-800 space-y-8 relative">
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : toast.type === 'error'
                ? 'bg-red-900 text-white border-red-800'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span>{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: '', type: 'info' })} className="ml-2 text-slate-400 hover:text-white">&times;</button>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">ยืนยันการทำรายการ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setConfirmModal((prev) => ({ ...prev, show: false }))} className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-50">ยกเลิก</button>
              <button onClick={confirmModal.onConfirm} className="px-3.5 py-1.5 rounded-lg text-xs bg-red-600 text-white font-semibold hover:bg-red-700">ยืนยันการลบ</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER BANNER */}
      <section className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="space-y-2">
            <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">ข่าวสารและบทความ</span>
            </nav>

            <div className="pl-3.5 border-l-4 border-[#1a2b6d] py-0.5 flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-light text-slate-900 tracking-tight">
                  ข่าวสารและ <span className="font-semibold text-[#1a2b6d]">บทความทางการแพทย์</span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  ติดตามอัปเดตความเคลื่อนไหว และความรู้สุขภาพจากโรงพยาบาลโนวาเลีย
                </p>
              </div>

              {/* FILTER BUTTONS (แนวนอน ให้เลือกหมวดหมู่ได้เร็ว) */}
              <div className="flex flex-wrap gap-1.5 pt-2 md:pt-0">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#1a2b6d] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADMIN CONTROLS PANEL */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h2 className="font-bold text-[#1a2b6d] text-sm">
                {editingId ? 'แก้ไขข้อมูลข่าวสาร' : 'จัดการและเพิ่มข่าวสารใหม่'}
              </h2>
              {editingId && (
                <button onClick={resetForm} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                  ยกเลิกการแก้ไข
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitNews} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700">หัวข้อข่าวสาร</label>
                  <input
                    type="text"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="หัวข้อข่าวสาร..."
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">หมวดหมู่</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#1a2b6d]"
                  >
                    <option value="ข่าวประชาสัมพันธ์">ข่าวประชาสัมพันธ์</option>
                    <option value="วิชาการแพทย์">วิชาการแพทย์</option>
                    <option value="เกร็ดความรู้สุขภาพ">เกร็ดความรู้สุขภาพ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">1. อัปโหลดรูปภาพ</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-[11px] text-slate-500 border border-slate-300 rounded-lg file:mr-2 file:py-1.5 file:px-2.5 file:border-0 file:text-[11px] file:bg-[#1a2b6d] file:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">2. หรือระบุ URL รูปภาพ</label>
                  <input
                    type="text"
                    value={newsImageUrl}
                    onChange={(e) => setNewsImageUrl(e.target.value)}
                    placeholder="/images/5.jpg หรือ https://..."
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#1a2b6d]"
                  />
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-100 pt-3">
                <label className="font-semibold text-slate-700">เนื้อหาข่าวสาร</label>
                <textarea
                  rows={3}
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="รายละเอียด..."
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#1a2b6d]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="bg-[#1a2b6d] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#0f1a42] transition text-xs"
                >
                  {submitting ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เผยแพร่ข่าวสาร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTENT GRID (GRID 3-4 COLS แบบการ์ดขนาดกลางลงมา) */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-4">
        
        <div className="flex justify-between items-center text-xs text-slate-500 font-medium px-1">
          <span>หมวดหมู่: <strong className="text-slate-800">{selectedCategory}</strong></span>
          <span>พบ <strong className="text-[#1a2b6d]">{filteredNews.length}</strong> รายการ</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80">
            <div className="w-7 h-7 border-2 border-[#1a2b6d] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 mt-2">กำลังโหลดข่าวสาร...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          /* GRID LAYOUT: 1 Col (Mobile), 2 Cols (Tablet), 3-4 Cols (Desktop) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredNews.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Compact Image Container (อัตราส่วน 16:9 ขนาดพอดี) */}
                  <div className="w-full h-40 bg-slate-100 overflow-hidden relative">
                    {article.imageUrl ? (
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-[11px]">
                        [ ไม่มีรูปภาพ ]
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                      {article.category || 'ข่าวทั่วไป'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2">
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(article.createdAt).toLocaleDateString('th-TH')}
                    </p>

                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#1a2b6d] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 font-normal">
                      {article.content}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3.5 pt-0 border-t border-slate-50 mt-2 flex items-center justify-between">
                  {isAdmin && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEditClick(article)}
                        className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteNews(article.id)}
                        className="text-[10px] font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-2 py-1 rounded transition"
                      >
                        ลบ
                      </button>
                    </div>
                  )}

                  <Link href={`/news/${article.id}`} className="ml-auto">
                    <span className="text-[11px] font-semibold text-[#1a2b6d] group-hover:underline flex items-center gap-1">
                      อ่านต่อ
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80 text-slate-400 text-xs">
            ไม่พบข่าวสารในหมวดหมู่นี้
          </div>
        )}
      </main>

    </div>
  );
}