'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [newsSlide, setNewsSlide] = useState(0);

  const newsList = [
    { title: 'รวมตัวแพทย์สุดเก่งที่โรงพยาบาลนี้', date: 'Monday 05, September 2026' },
    { title: 'ได้รับรางวัลแพทย์ดีเด่นประจำปี2026', date: 'Friday 15, September 2026' },
    { title: 'แพทย์จบนอกป้ายแดงยินดีด้วยครับ', date: 'Friday 25, September 2026' },
    { title: 'ยินดีต้อนรับแพทย์คนใหม่', date: 'Friday 15, September 2026' },
  ];

  return (
    <div className="bg-white pb-20 font-sans text-gray-700">
      {/* 1. TOP BANNER */}
      <section className="relative w-full h-[260px] md:h-[320px] bg-slate-100 overflow-hidden flex items-center mb-12">
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/4 bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xl">
          [ Banner บรรยากาศภายในโรงพยาบาล ]
        </div>
        <div className="max-w-7xl mx-auto px-8 w-full z-10">
          <p className="text-xs text-gray-500 font-medium mb-1">
            <Link href="/" className="hover:underline">หน้าแรก</Link> / ติดต่อเรา
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a2b6d]">
            ข้อมูลการติดต่อ
          </h1>
        </div>
      </section>

      {/* 2. MAP & CONTACT FORM SECTION */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* MAP CONTAINER */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#1a2b6d]">แผนที่และการเดินทาง</h3>
            <div className="w-full h-[380px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative flex items-center justify-center text-gray-400 text-xs">
              <div className="text-center space-y-2 p-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="font-medium text-gray-600">[ ภาพแผนที่โรงพยาบาลโนวาเลีย ]</p>
                <p className="text-[11px] text-gray-400">225 นครปฐม กำแพงแสน</p>
              </div>
            </div>
            
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-[#1a2b6d] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
            >
              <svg className="w-4 h-4 text-[#1a2b6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L12 22.343l-5.657-5.657a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>นำทางด้วย Google Maps</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* SEND MESSAGE FORM */}
          <div className="bg-[#fafcff] p-8 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a2b6d]">ส่งข้อความถึงเรา</h3>
            <p className="text-xs text-gray-500">หากมีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติม สามารถกรอกข้อมูลด้านล่างได้เลยครับ</p>
            
            <form className="space-y-3 pt-2" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="ชื่อ - นามสกุล *"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1a2b6d] bg-white"
                  required
                />
                <input
                  type="tel"
                  placeholder="เบอร์โทรศัพท์ *"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1a2b6d] bg-white"
                  required
                />
              </div>

              <input
                type="email"
                placeholder="อีเมล"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1a2b6d] bg-white"
              />

              <textarea
                rows={4}
                placeholder="ข้อความที่ต้องการสอบถาม..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1a2b6d] bg-white resize-none"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-[#1a2b6d] hover:bg-blue-950 text-white font-semibold py-3 rounded-xl text-xs transition shadow-sm"
              >
                ส่งข้อความ
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 3. CONTACT CARDS */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#b2cdfc]/40 p-6 rounded-2xl text-[#1a2b6d] space-y-2 border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a2b6d] shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm pt-1">ฉุกเฉิน</h4>
            <p className="text-xs font-semibold">02-165-5555</p>
            <p className="text-[11px] text-gray-500">สายด่วน 1894</p>
          </div>

          <div className="bg-[#b2cdfc]/40 p-6 rounded-2xl text-[#1a2b6d] space-y-2 border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a2b6d] shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm pt-1">อีเมล์</h4>
            <p className="text-xs font-semibold">novaria@gmail.com</p>
          </div>

          <div className="bg-[#1a2b6d] p-6 rounded-2xl text-white space-y-2 shadow-md">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#c5a035]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L12 22.343l-5.657-5.657a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm pt-1">ที่ตั้ง</h4>
            <p className="text-xs text-slate-200">225 นครปฐม กำแพงแสน</p>
          </div>

          <div className="bg-[#b2cdfc]/40 p-6 rounded-2xl text-[#1a2b6d] space-y-2 border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a2b6d] shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-sm pt-1">เวลาทำการ</h4>
            <p className="text-xs font-semibold">09:00 - 23:00 Everyday</p>
          </div>
        </div>
      </section>

      {/* 4. LATEST NEWS SECTION */}
      <section className="max-w-6xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2b6d]">ข่าวใหม่</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsList.slice(newsSlide * 2, newsSlide * 2 + 2).map((news, idx) => (
            <div key={idx} className="bg-[#fafcff] p-4 rounded-xl border border-slate-100 shadow-sm flex space-x-4 items-center">
              <div className="w-28 h-24 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400">
                [ รูปข่าว ]
              </div>
              <div className="text-left space-y-2">
                <span className="text-[11px] text-[#c5a035] font-semibold">{news.date}</span>
                <h4 className="text-xs font-bold text-gray-800 line-clamp-2">{news.title}</h4>
                <div className="flex space-x-4 text-[11px] text-gray-400 items-center">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    68
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    86
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-2">
          <button onClick={() => setNewsSlide(0)} className={`w-3 h-3 rounded-full transition ${newsSlide === 0 ? 'bg-[#1a2b6d]' : 'bg-slate-200'}`}></button>
          <button onClick={() => setNewsSlide(1)} className={`w-3 h-3 rounded-full transition ${newsSlide === 1 ? 'bg-[#1a2b6d]' : 'bg-slate-200'}`}></button>
        </div>
      </section>
    </div>
  );
}