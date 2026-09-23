'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  // ข้อมูลบทความหลัก (ฝั่งซ้าย)
  const articles = [
    {
      id: 1,
      title: 'หมออุ้มรัก',
      date: 'Monday 05, September 2026',
      description:
        'สื่อถึงหน้าที่ของหมอทำคลอดที่คอยประคบประคอง "ความรัก" ของพ่อแม่ตั้งแต่ในครรภ์ จนถึงวินาทีที่อุ้มเด็กออกมาลืมตาดูโลก ฟังแล้วรู้สึกปลอดภัย อบอุ่น และเต็มไปด้วยความใส่ใจ',
      imgPlaceholder: '[ รูปหมออุ้มรับรางวัล / มอบโล่ ]',
      category: 'ทางการแพทย์',
    },
    {
      id: 2,
      title: '"ไม่ต้องเสียเวลาเดินทางหลายที่ ไม่ต้องรอคอยอย่างกังวลใจ"',
      date: 'Monday 15, September 2026',
      description:
        'มาร่วมสร้างเกราะป้องกันที่แข็งแกร่งให้ร่างกายของคุณวันนี้กับโปรแกรมตรวจสุขภาพแบบครบวงจรที่ออกแบบมาเพื่อคุณโดยเฉพาะ เซ็ตรายละเอียดแม่นยำและรวดเร็วตรวจครบ...จบในจุดเดียวเพื่อให้คุณได้ใช้ชีวิตได้อย่างเต็มที่และมั่นใจ โดยไม่ต้องกังวลเรื่องปัญหาสุขภาพที่ซ่อนอยู่ เพราะการป้องกันย่อมดีกว่าการรักษาเสมอ',
      imgPlaceholder: '[ รูปแพทย์ตรวจร่างกายคนไข้ ]',
      category: 'การดูแลสุขภาพ',
    },
    {
      id: 3,
      title: 'การตรวจสุขภาพไม่ใช่เรื่องของคนป่วย แต่คือจุดเริ่มต้นของคนรักตัวเอง',
      date: 'Monday 05, September 2026',
      description:
        'อย่ารอให้ร่างกายส่งสัญญาณเตือนจนสายเกินไปให้เราได้ร่วมเป็นส่วนหนึ่งในการวางแผนสุขภาพที่ดีระยะยาวให้กับคุณด้วยบริการตรวจเช็กสุขภาพอย่างละเอียดครบครันตั้งแต่งการคัดกรองเบื้องต้นไปจนถึงการวิเคราะห์เชิงลึกตรวจครบจบที่เดียวพร้อมรับคำแนะนำตรงจากแพทย์เฉพาะทางเพื่อให้คุณมีพลังกายที่พร้อมสำหรับทุกเป้าหมายในอนาคต',
      imgPlaceholder: '[ รูปทีมแพทย์ในเคาน์เตอร์โรงพยาบาล ]',
      category: 'การดูแลสุขภาพ',
    },
  ];

  // ข้อมูลโพสต์ล่าสุด (ฝั่งขวา)
  const recentPosts = [
    { title: 'หมอสุดหล่อ', date: 'Monday 05, September 2021', img: '[ รูปหมอ 1 ]' },
    { title: 'หมอสุดสวย', date: 'Monday 15, September 2021', img: '[ รูปหมอ 2 ]' },
    { title: 'หมอสุดน่ารัก', date: 'Monday 25, September 2021', img: '[ รูปหมอ 3 ]' },
    { title: 'ทีมแพทย์จบนอก', date: 'Monday 15, September 2021', img: '[ รูปทีมแพทย์ ]' },
    { title: 'ดูแลทุกระดับประทับใจ', date: 'Monday 05, September 2021', img: '[ รูปดูแลคนไข้ ]' },
    { title: 'สะอาด บริการดี', date: 'Monday 25, September 2021', img: '[ รูปอาคาร รพ. ]' },
  ];

  // รายการหมวดหมู่พร้อมจำนวน
  const categories = [
    { name: 'การผ่าตัด', count: 3 },
    { name: 'การดูแลสุขภาพ', count: 5 },
    { name: 'ทางการแพทย์', count: 8 },
    { name: 'other', count: 10 },
  ];

  const filteredArticles =
    selectedCategory === 'ทั้งหมด'
      ? articles
      : articles.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-white pb-20 font-sans text-gray-700">
      {/* 1. TOP BANNER SECTION */}
      <section className="relative w-full h-[260px] md:h-[320px] bg-sky-50 overflow-hidden flex items-center mb-12">
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/4 bg-[#e8f1fd] flex items-center justify-center text-slate-400 font-bold text-xl">
          [ Banner รวมทีมแพทย์ Novaria ]
        </div>
        <div className="max-w-7xl mx-auto px-8 w-full z-10">
          <p className="text-xs text-gray-500 font-medium mb-1">
            <Link href="/" className="hover:underline">หน้าแรก</Link> / ข่าวสาร
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a2b6d]">
            ข่าวสาร
          </h1>
        </div>
      </section>

      {/* 2. MAIN CONTENT LAYOUT (LEFT: ARTICLES, RIGHT: SIDEBAR) */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: ARTICLES LIST */}
        <main className="lg:col-span-2 space-y-16">
          {filteredArticles.map((article) => (
            <article key={article.id} className="space-y-4">
              {/* Image Container */}
              <div className="w-full h-[320px] md:h-[380px] bg-slate-200 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 font-medium text-sm">
                {article.imgPlaceholder}
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium pt-2">
                <svg className="w-4 h-4 text-[#c5a035]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{article.date}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-[#1a2b6d] leading-snug">
                {article.title}
              </h2>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {article.description}
              </p>

              {/* Read More Button */}
              <div className="pt-2">
                <button className="bg-[#b2cdfc] hover:bg-sky-300 text-[#1a2b6d] px-5 py-2.5 rounded-full text-xs font-semibold transition flex items-center space-x-2">
                  <span>อ่านเพิ่มเติม</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </main>

        {/* RIGHT COLUMN: SIDEBAR */}
        <aside className="space-y-8">
          
          {/* RECENT POSTS WIDGET */}
          <div className="bg-[#f8fbff] p-6 rounded-2xl border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-[#1a2b6d]">โพสต์ล่าสุด</h3>
            
            <div className="space-y-4">
              {recentPosts.map((post, idx) => (
                <div key={idx} className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-14 h-14 bg-slate-200 rounded-xl flex-shrink-0 flex items-center justify-center text-[9px] text-slate-400 font-medium">
                    {post.img}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-sky-500 font-medium">{post.date}</p>
                    <h4 className="text-xs font-bold text-gray-800 group-hover:text-blue-700 transition">
                      {post.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORIES WIDGET */}
          <div className="bg-[#f8fbff] p-6 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-xl font-bold text-[#1a2b6d]">หมวดหมู่</h3>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('ทั้งหมด')}
                className={`w-full flex justify-between items-center py-2 px-3 rounded-xl text-xs font-medium transition ${
                  selectedCategory === 'ทั้งหมด'
                    ? 'bg-[#1a2b6d] text-white'
                    : 'text-gray-600 hover:bg-slate-100'
                }`}
              >
                <span>ทั้งหมด</span>
              </button>

              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex justify-between items-center py-2.5 px-3 rounded-xl text-xs font-medium transition ${
                    selectedCategory === cat.name
                      ? 'bg-[#1a2b6d] text-white'
                      : 'text-gray-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      selectedCategory === cat.name
                        ? 'bg-white text-[#1a2b6d]'
                        : 'bg-[#c5a035] text-white'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </aside>
      </div>

      {/* 3. CONTACT CARDS (ส่วนการ์ดติดต่อก่อนจบหน้า) */}
      <section className="max-w-6xl mx-auto px-6 mt-24 text-center space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2b6d]">ติดต่อเรา</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#b2cdfc]/40 p-6 rounded-2xl text-[#1a2b6d] text-center space-y-2 border border-blue-100">
            <div className="w-10 h-10 mx-auto rounded-full bg-white flex items-center justify-center text-[#1a2b6d] shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm pt-1">ฉุกเฉิน</h4>
            <p className="text-xs font-semibold">02-165-5555</p>
          </div>

          <div className="bg-[#1a2b6d] p-6 rounded-2xl text-white text-center space-y-2 shadow-md">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L12 22.343l-5.657-5.657a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm pt-1">ที่ตั้ง</h4>
            <p className="text-xs text-slate-200">225 นครปฐม กำแพงแสน</p>
          </div>

          <div className="bg-[#b2cdfc]/40 p-6 rounded-2xl text-[#1a2b6d] text-center space-y-2 border border-blue-100">
            <div className="w-10 h-10 mx-auto rounded-full bg-white flex items-center justify-center text-[#1a2b6d] shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm pt-1">Email</h4>
            <p className="text-xs font-semibold">novaria@gmail.com</p>
          </div>

          <div className="bg-[#b2cdfc]/40 p-6 rounded-2xl text-[#1a2b6d] text-center space-y-2 border border-blue-100">
            <div className="w-10 h-10 mx-auto rounded-full bg-white flex items-center justify-center text-[#1a2b6d] shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm pt-1">เวลาทำการ</h4>
            <p className="text-xs font-semibold">Mon-Sat 09:00-23:00</p>
          </div>
        </div>
      </section>


    </div>
  );
}