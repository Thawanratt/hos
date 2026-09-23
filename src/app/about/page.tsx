// หน้าเกี่ยวกับเรา

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [doctorSlide, setDoctorSlide] = useState(0);
  const [newsSlide, setNewsSlide] = useState(0);

  // ข้อมูลคณะแพทย์
  const doctors = [
    { name: 'นพ.วชิรวิทย์ อมรชัยยาพิทักษ์', role: 'กุมารแพทย์' },
    { name: 'นพ.พิมลวรรณ กองเกิดทอง', role: 'อายุรแพทย์' },
    { name: 'นพ.ธวัลรัตน์ พันธุ์เชียน', role: 'สูตินรีแพทย์' },
    { name: 'นพ.สมชาย ใจดี', role: 'ศัลยแพทย์' },
  ];

  // ข้อมูลข่าวสาร
  const newsList = [
    { title: 'รวมตัวแพทย์สุดเก่งที่โรงพยาบาลนี้', date: 'Monday 05, September 2026' },
    { title: 'ได้รับรางวัลแพทย์ดีเด่นประจำปี2026', date: 'Friday 15, September 2026' },
    { title: 'แพทย์จบนอกป้ายแดงยินดีด้วยครับ', date: 'Friday 25, September 2026' },
    { title: 'ยินดีต้อนรับแพทย์คนใหม่', date: 'Friday 15, September 2026' },
  ];

  return (
    <div className="space-y-16 bg-white pb-16 font-sans">
      {/* 1. PAGE BANNER (HEADER WITH BUILDING BACKGROUND) */}
      <section className="relative w-full h-[260px] md:h-[320px] bg-slate-200 overflow-hidden flex items-center">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-300/80 to-transparent z-10 flex items-center justify-center text-slate-400 font-bold text-2xl">
          [ รูปตึกโรงพยาบาลโนวาเลีย NOVARIA HOSPITAL ]
        </div>

        {/* Content Banner Overlay */}
        <div className="max-w-7xl mx-auto px-8 w-full z-20">
          <div className="space-y-1">
            <p className="text-xs text-gray-600 font-medium">
              <Link href="/" className="hover:underline">หน้าแรก</Link> / เกี่ยวกับเรา
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#1a2b6d]">
              เกี่ยวกับเรา
            </h1>
          </div>
        </div>
      </section>

      {/* 2. OUR CARE & PHILOSOPHY SECTION */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Top Subsection: Feature Points */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 h-72 bg-slate-200 rounded-2xl overflow-hidden flex items-center justify-center text-gray-400 font-medium">
            [ รูปแพทย์ผู้หญิงกำลังตรวจคนไข้สูงอายุ ]
          </div>

          <div className="md:col-span-7 space-y-6">
            <h2 className="text-3xl font-bold text-[#1a2b6d] leading-snug">
              การดูแลที่ดีที่สุดเพื่อสุขภาพ <br />
              ที่ดีของคุณ
            </h2>

            {/* Bullet Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-gray-700">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 bg-[#c5a035] rounded-full inline-block"></span>
                <span>ความมุ่งมั่นในการช่วยเหลือ</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 bg-[#c5a035] rounded-full inline-block"></span>
                <span>การดูแลระดับ 5 ดาว</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 bg-[#c5a035] rounded-full inline-block"></span>
                <span>ทำด้วยใจ</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 bg-[#c5a035] rounded-full inline-block"></span>
                <span>เครื่องมือทันสมัย</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 bg-[#c5a035] rounded-full inline-block"></span>
                <span>ใส่ใจทุกรายละเอียด</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 bg-[#c5a035] rounded-full inline-block"></span>
                <span>ห่วงใยเสมอ</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 italic pt-2 leading-relaxed">
              "เพราะรอยยิ้มและสุขภาพที่ดีของคนไข้คือรางวัลที่แท้จริงของคนเป็นหมอ ขอบคุณทุกความไว้วางใจ และขอบคุณทีมงานทุกคนที่ร่วมสู้ไปด้วยกัน"
            </p>
          </div>
        </div>

        {/* Bottom Subsection: Doctor Quote Note */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 h-48 bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-400 text-xs">
            [ รูปแพทย์เขียนเอกสาร ]
          </div>
          <div className="md:col-span-8 space-y-2">
            <p className="text-xs text-gray-600 leading-relaxed italic">
              "เพราะรอยยิ้มและสุขภาพที่ดีของคนไข้คือรางวัลที่แท้จริงของคนเป็นหมอ ขอบคุณทุกความไว้วางใจ และขอบคุณทีมงานทุกคนที่ร่วมสู้ไปด้วยกัน รางวัลนี้เป็นของทุกคนคะ#รางวัลแพทย์ดีเด่น #หมอพร้อมดูแล"
            </p>
          </div>
        </div>
      </section>

      {/* 3. HERO QUOTE SLIDER (INSPIRATIONAL BLUE BANNER) */}
      <section className="w-full bg-[#1a2b6d] text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="text-4xl font-serif text-[#c5a035]">“</div>
          <p className="text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto text-slate-200">
            "เบื้องหลังชุดกาวน์และชุดสครับ คือมนุษย์ธรรมดาที่เหนื่อยล้าไม่ต่างจากเรา แต่ยอมแบกรับความหวังของชีวิตคนอื่นไว้บนบ่า
            โรงพยาบาลไม่ได้ขับเคลื่อนด้วยตึกคอนกรีต แต่ขับเคลื่อนด้วยหัวใจของหมอ พยาบาล และเจ้าหน้าที่ทุกคนที่ยอมเสียสละแรงกายและหยาดเหงื่อ
            เพื่อแลกกับรอยยิ้มและการได้กลับบ้านอย่างปลอดภัยของผู้ป่วย"
          </p>
          <div className="text-xs font-semibold text-[#c5a035]">
            นพ.พิมลวรรณ กองเกิดทอง
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 pt-4">
            <span className="w-2.5 h-2.5 bg-white/30 rounded-full"></span>
            <span className="w-2.5 h-2.5 bg-[#c5a035] rounded-full"></span>
            <span className="w-2.5 h-2.5 bg-white/30 rounded-full"></span>
          </div>
        </div>
      </section>

      {/* 4. DOCTORS SECTION (คณะแพทย์) */}
      <section className="max-w-6xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2b6d]">คณะแพทย์</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.slice(doctorSlide, doctorSlide + 3).map((doc, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="h-72 bg-slate-200 flex items-center justify-center text-gray-400 text-xs">
                [ รูป{doc.name} ]
              </div>
              <div className="bg-[#b2cdfc]/30 py-4 px-2 text-center">
                <h4 className="font-bold text-xs text-[#1a2b6d]">{doc.name}</h4>
                <p className="text-[11px] text-gray-600 mt-0.5">{doc.role}</p>
              </div>
              <button className="w-full bg-[#1a2b6d] text-white py-2.5 text-xs font-semibold hover:bg-blue-950 transition">
                ดูประวัติแพทย์
              </button>
            </div>
          ))}
        </div>

        {/* Doctor Slider Dots */}
        <div className="flex justify-center space-x-2">
          <button onClick={() => setDoctorSlide(0)} className={`w-3 h-3 rounded-full transition ${doctorSlide === 0 ? 'bg-[#1a2b6d]' : 'bg-slate-200'}`}></button>
          <button onClick={() => setDoctorSlide(1)} className={`w-3 h-3 rounded-full transition ${doctorSlide === 1 ? 'bg-[#1a2b6d]' : 'bg-slate-200'}`}></button>
        </div>
      </section>

      {/* 5. NEWS SECTION (ข่าวใหม่) */}
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

        {/* News Slider Dots */}
        <div className="flex justify-center space-x-2">
          <button onClick={() => setNewsSlide(0)} className={`w-3 h-3 rounded-full transition ${newsSlide === 0 ? 'bg-[#1a2b6d]' : 'bg-slate-200'}`}></button>
          <button onClick={() => setNewsSlide(1)} className={`w-3 h-3 rounded-full transition ${newsSlide === 1 ? 'bg-[#1a2b6d]' : 'bg-slate-200'}`}></button>
        </div>
      </section>

      {/* 6. CONTACT CARDS */}
      <section className="max-w-6xl mx-auto px-6 text-center space-y-8">
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