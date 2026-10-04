'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params ตามมาตรฐาน Next.js App Router
  const { id } = use(params);

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        // ดึงข้อมูลข่าวสารทั้งหมด แล้วกรองเฉพาะ ID ที่ตรงกัน
        const res = await fetch('/api/admin');
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data?.news)) {
            const found = result.data.news.find((item: any) => String(item.id) === id);
            if (found) {
              setArticle(found);
            } else {
              setError(true);
            }
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Fetch detail error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        กำลังโหลดข้อมูลบทความ...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 space-y-4">
        <h1 className="text-xl font-bold text-slate-800">ไม่พบบทความที่ต้องการ</h1>
        <Link href="/news" className="text-sky-600 hover:underline text-sm font-semibold">
          ➔ กลับไปหน้าข่าวสารทั้งหมด
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* ปุ่มย้อนกลับ */}
        <div className="mb-6">
          <Link href="/news" className="text-xs font-bold text-slate-500 hover:text-[#1a2b6d] inline-flex items-center gap-1 transition-colors">
            ❮ กลับไปหน้าข่าวสารทั้งหมด
          </Link>
        </div>

        {/* การ์ดเนื้อหาข่าวสาร */}
        <article className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* รูปภาพปก (ถ้ามี) */}
          {article.imageUrl && (
            <div className="w-full h-64 sm:h-96 bg-slate-100 relative overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            
            {/* หมวดหมู่ & วันที่ */}
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-full uppercase">
                {article.category || 'ข่าวสาร'}
              </span>
              <span className="text-slate-400">
                {article.createdAt ? new Date(article.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ''}
              </span>
            </div>

            {/* หัวข้อข่าวสาร */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>

            <hr className="border-slate-100" />

            {/* เนื้อหาข่าวสาร */}
            <div className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
              {article.content}
            </div>

          </div>
        </article>

      </div>
    </main>
  );
}