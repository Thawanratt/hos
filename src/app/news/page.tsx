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

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [loading, setLoading] = useState<boolean>(true);

  // ดึงข้อมูลข่าวสารสำหรับหน้าบ้าน
  useEffect(() => {
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
    fetchNews();
  }, []);

  const categoriesList = ['ทั้งหมด', 'ข่าวประชาสัมพันธ์', 'วิชาการแพทย์', 'เกร็ดความรู้สุขภาพ'];

  const filteredNews =
    selectedCategory === 'ทั้งหมด'
      ? newsList
      : newsList.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans text-slate-800 space-y-8 relative">
      
      {/* HEADER BANNER */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div className="space-y-3">
            <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">ข่าวสารและบทความ</span>
            </nav>

            <div className="pl-4 border-l-4 border-[#1a2b6d] py-0.5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight leading-tight">
                  ข่าวสารและ <span className="font-semibold text-[#1a2b6d]">บทความทางการแพทย์</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
                  ติดตามอัปเดตความเคลื่อนไหว และความรู้สุขภาพจากโรงพยาบาลโนวาเลีย
                </p>
              </div>

              {/* FILTER BUTTONS */}
              <div className="flex flex-wrap gap-1.5">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
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

      {/* MAIN CONTENT GRID */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredNews.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition duration-300 flex flex-col justify-between group"
              >
                <div>
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

                <div className="p-3.5 pt-0 border-t border-slate-50 mt-2 flex items-center justify-between">
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