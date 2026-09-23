'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import { BRANCHES_DATA, Branch } from '@/app/api/branches/branches';

export default function HomePage() {
  const router = useRouter();

  //  State สำหรับควบคุมการเปิด-ปิด และเก็บสาขาที่เลือก
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES_DATA[0]);

  //  State สำหรับ Toast Popup แจ้งเตือน
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500); // ซ่อนอัตโนมัติใน 2.5 วินาที
  };

  // ฟังก์ชันเมื่อผู้ใช้เลือกสาขาจาก Popup แล้ว ให้พาไปหน้าเลือกประเภทบริการ (/branches) ทันที
  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsBranchModalOpen(false);
    router.push(`/branches?branch=${branch.id}`);
  };

  // 1. ระบบแบนเนอร์สไลด์
  const heroBanners = [
    {
      id: 1,
      title: 'ไม่ใช่แค่ผ่าซ่อม แต่ลดโอกาส "ผ่าซ้ำ"',
      subtitle: 'Revision Services',
      desc: 'ด้วยทีมแพทย์ผู้เชี่ยวชาญเฉพาะทางและเทคโนโลยีหุ่นยนต์ช่วยผ่าตัด ยกระดับความปลอดภัย แม่นยำ และฟื้นตัวได้อย่างมั่นใจ',
      imageUrl: '/images/2.jpg', 
      tag: 'ศูนย์ความเป็นเลิศทางการแพทย์',
      bgGradient: 'from-[#1a2b6d] to-[#0f1a42]',
    },
    {
      id: 2,
      title: 'ศูนย์หัวใจและหลอดเลือดครบวงจร',
      subtitle: 'Heart & Vascular Center',
      desc: 'พร้อมดูแลตลอด 24 ชั่วโมง ด้วยทีมแพทย์เฉพาะทางและเทคโนโลยีการรักษาทันสมัยระดับสากล',
      imageUrl: '/images/1.jpg',
      tag: 'ศูนย์การรักษาเฉพาะทาง',
      bgGradient: 'from-[#003B71] via-[#005596] to-[#0080B8]',
    },
    {
      id: 3,
      title: 'ศูนย์มะเร็งแห่งความเลิศทางการรักษา',
      subtitle: 'Comprehensive Cancer Center',
      desc: 'การวินิจฉัยและวางแผนการรักษาเฉพาะบุคคลด้วยเทคโนโลยีรังสีรักษาและเคมีบำบัดตรงจุด',
      imageUrl: '/images/3.jpg',
      tag: 'การรักษาระดับสากล',
      bgGradient: 'from-[#064E3B] via-[#047857] to-[#0D9488]',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  // 2. บริการของเรา
  const mainServices = [
    {
      title: 'หัวใจ',
      href: '/services#heart',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      title: 'มะเร็ง',
      href: '/services#cancer',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 9v4m0 4h.01" />
        </svg>
      ),
    },
    {
      title: 'กระดูก',
      href: '/services#bone',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662s.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
        </svg>
      ),
    },
    {
      title: 'สมอง',
      href: '/services#brain',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 13.5M14.25 3.104v5.714c0 .597.237 1.17.659 1.591L19 13.5M9.75 3.104a11.2 11.2 0 014.5 0M12 10.5h.008v.008H12V10.5zm0 3h.008v.008H12V13.5zm0 3h.008v.008H12V16.5z" />
        </svg>
      ),
    },
    {
      title: 'อุบัติเหตุ',
      href: '/services#emergency',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25v11.25" />
        </svg>
      ),
    },
    {
      title: 'ตรวจสุขภาพ',
      href: '/services#checkup',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'การผ่าตัด',
      href: '/services#surgery',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5M3.75 12h16.5" />
        </svg>
      ),
    },
  ];

  // 3. แพ็กเกจและโปรโมชั่น (มีรูปภาพ ราคาเดิม และราคาลดสมจริง)
  const packages = [
    {
      id: 1,
      title: 'Birthday Privilege Program',
      subtitle: 'ส่วนลดพิเศษสิทธิประโยชน์ตรวจสุขภาพประจำปีสำหรับท่านที่เกิดในเดือนนี้',
      price: '3,500 ฿',
      originalPrice: '6,000 ฿',
      tag: 'Special Offer',
      imageUrl: '/images/bd.jpeg',
    },
    {
      id: 2,
      title: 'ชุดตรวจ Vita - Beauty Checkup',
      subtitle: 'ตรวจวิเคราะห์ระดับวิตามิน แร่ธาตุ และสารต้านอนุมูลอิสระในร่างกายเชิงลึก',
      price: '5,200 ฿',
      originalPrice: '8,500 ฿',
      tag: 'โปรแกรมยอดนิยม',
      imageUrl: '/images/check.jpg',
    },
    {
      id: 3,
      title: 'โปรแกรมตรวจสุขภาพหัวใจขั้นสูง (Advanced Heart Check)',
      subtitle: 'ตรวจคัดกรองความเสี่ยงโรคหัวใจและหลอดเลือดด้วยเทคโนโลยีความแม่นยำสูง',
      price: '9,900 ฿',
      originalPrice: '15,000 ฿',
      tag: 'แนะนำ',
      imageUrl: '/images/h.jpeg',
    },
  ];

  // 4. บทความสุขภาพ
  const healthArticles = [
    {
      title: 'การป้องกันและรับมือกับปัญหา Cyberbullying ในปัจจุบัน',
      desc: 'ทำความเข้าใจผลกระทบทางจิตใจและแนวทางการดูแลสุขภาวะทางจิตอย่างถูกวิธี...',
      category: 'สุขภาพจิต',
      date: '20 ก.ย. 2026',
      imageUrl: '/images/5.jpg',
    },
    {
      title: 'สัญญาณเตือนและแนวทางรักษาโรคผื่นภูมิแพ้ผิวหนัง',
      desc: 'สังเกตอาการเบื้องต้น พร้อมเทคโนโลยีการรักษาที่จะช่วยลดการอักเสบอย่างตรงจุด...',
      category: 'โรคผิวหนัง',
      date: '18 ก.ย. 2026',
      imageUrl: '/images/66.jpg',
    },
    {
      title: 'นวัตกรรมสลายไขมันด้วยความเย็น (CoolSculpting)',
      desc: 'ปรับรูปร่างอย่างปลอดภัยด้วยเทคโนโลยีทางการแพทย์ที่ผ่านการรับรองมาตรฐาน...',
      category: 'เวชศาสตร์ชะลอวัย',
      date: '15 ก.ย. 2026',
      imageUrl: '/images/7.jpg',
    },
  ];

  return (
    <div className="bg-white font-sans text-slate-800 min-h-screen flex flex-col relative">

      {/* 🟢 TOAST POPUP แจ้งเตือนมุมขวาบนสุดพรีเมียม */}
      <div className={`fixed top-20 right-6 z-50 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold">สำเร็จ</p>
            <p className="text-xs text-slate-300">{toastMessage}</p>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION & QUICK MENU */}
      <section className="border-b border-slate-200 bg-slate-50/50 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Quick Actions */}
            <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              
              <div className="space-y-4">
                
                {/* ชื่อโรงพยาบาล & ที่ตั้ง */}
                <div 
                  onClick={() => setIsBranchModalOpen(true)}
                  className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-lg border border-slate-200 transition group cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-sky-700 uppercase tracking-wider">สาขาปัจจุบัน</span>
                    <span className="text-xs text-[#1a2b6d] font-bold group-hover:underline">เปลี่ยนสาขา </span>
                  </div>
                  <h2 className="text-base font-bold text-[#1a2b6d] mt-1">
                    {selectedBranch.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-normal line-clamp-1">
                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {selectedBranch.address}
                  </p>
                </div>

                {/* แถบลงทะเบียน / เข้าสู่ระบบ */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3">
                  <span className="text-[11px] text-slate-400 block font-medium">เข้าร่วมสิทธิพิเศษวันนี้</span>
                  <Link href="/login" className="text-xs font-bold text-[#1a2b6d] hover:underline inline-flex items-center gap-1 mt-0.5">
                    ลงทะเบียน / เข้าสู่ระบบ ➔
                  </Link>
                </div>
                
                {/* 4 ปุ่มบริการด่วน */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  
                  <Link 
                    href="/doctors" 
                    className="group bg-slate-50/60 hover:bg-slate-100/80 p-3.5 rounded-lg transition text-center space-y-1.5 flex flex-col items-center justify-center"
                  >
                    <div className="text-red-500 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div className="font-bold text-xs text-slate-700 group-hover:text-[#1a2b6d]">ค้นหาแพทย์</div>
                  </Link>

                  <button 
                    onClick={() => setIsBranchModalOpen(true)}
                    className="group bg-slate-50/60 hover:bg-slate-100/80 p-3.5 rounded-lg transition text-center space-y-1.5 flex flex-col items-center justify-center cursor-pointer w-full"
                  >
                    <div className="text-[#1a2b6d] group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                    <div className="font-bold text-xs text-slate-700 group-hover:text-[#1a2b6d]">ทำนัดหมาย</div>
                  </button>

                  <Link 
                    href="/packages" 
                    className="group bg-slate-50/60 hover:bg-slate-100/80 p-3.5 rounded-lg transition text-center space-y-1.5 flex flex-col items-center justify-center"
                  >
                    <div className="text-[#1a2b6d] group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25" />
                      </svg>
                    </div>
                    <div className="font-bold text-xs text-slate-700 group-hover:text-[#1a2b6d]">แพ็กเกจสุขภาพ</div>
                  </Link>

                  <Link 
                    href="/contact" 
                    className="group bg-slate-50/60 hover:bg-slate-100/80 p-3.5 rounded-lg transition text-center space-y-1.5 flex flex-col items-center justify-center"
                  >
                    <div className="text-[#1a2b6d] group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.012-.85a5.952 5.952 0 011.59-3.1A8.25 8.25 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                    </div>
                    <div className="font-bold text-xs text-slate-700 group-hover:text-[#1a2b6d]">ติดต่อเรา</div>
                  </Link>

                </div>
              </div>

              {/* เบอร์ฉุกเฉิน */}
              <div className="bg-[#1a2b6d] text-white p-3.5 rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-[11px] uppercase text-sky-200 tracking-wider font-semibold">ศูนย์ฉุกเฉิน 24 ชั่วโมง</div>
                  <a href={`tel:${selectedBranch.phone}`} className="text-lg md:text-xl font-extrabold tracking-wide hover:underline block">
                    {selectedBranch.phone}
                  </a>
                </div>
                <div className="p-2 bg-red-600 rounded">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
              </div>

            </div>
            
            {/* Banner หลัก */}
            <div className="lg:col-span-8 rounded-lg overflow-hidden relative shadow-sm min-h-[440px] md:min-h-[480px] group flex flex-col justify-between">
              
              {heroBanners.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col justify-between p-8 md:p-12 text-white bg-gradient-to-r ${slide.bgGradient} ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  style={
                    slide.imageUrl
                      ? {
                          backgroundImage: `linear-gradient(to right, rgba(26, 43, 109, 0.85), rgba(15, 26, 66, 0.4)), url(${slide.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                >
                  <div className="max-w-2xl space-y-4 z-10 my-auto">
                    <span className="inline-block bg-sky-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
                      {slide.tag}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                      {slide.title} <br />
                      <span className="text-sky-300">{slide.subtitle}</span>
                    </h1>
                    <p className="text-sm md:text-base text-slate-200 leading-relaxed font-light max-w-xl">
                      {slide.desc}
                    </p>
                    <div className="pt-3">
                      <Link
                        href="/services"
                        className="bg-white text-[#1a2b6d] px-7 py-3 rounded-sm text-xs md:text-sm font-bold hover:bg-slate-100 transition inline-block uppercase tracking-wider shadow-md"
                      >
                        รายละเอียดเพิ่มเติม
                      </Link>
                    </div>
                  </div>

                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                </div>
              ))}

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 text-lg"
              >
                ❮
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 text-lg"
              >
                ❯
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-3 space-y-2">
            <h2 className="text-3xl font-extrabold text-[#1a2b6d]">บริการของเรา</h2>
            <div>
              <Link 
                href="/services" 
                className="text-base font-semibold text-slate-600 hover:text-[#1a2b6d] hover:underline inline-flex items-center gap-1 transition-colors mt-1"
              >
                ดูทั้งหมด ➔
              </Link>
            </div>
          </div>

          <div className="lg:col-span-9 grid grid-cols-4 sm:grid-cols-7 gap-y-8 gap-x-4">
            {mainServices.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group flex flex-col items-center justify-center text-center space-y-3 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="text-[#1a2b6d] group-hover:scale-110 group-hover:text-sky-600 transition-all duration-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                <span className="text-base md:text-lg font-bold text-slate-800 group-hover:text-[#1a2b6d] transition-colors leading-tight">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. PACKAGES & PROMOTIONS (ปรับดีไซน์เป็นการ์ดพรีเมียมพร้อมรูปภาพและปุ่มซื้อ) */}
      <section className="bg-slate-50 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1a2b6d]">แพ็กเกจและโปรโมชั่น</h2>
              <p className="text-sm text-slate-500 mt-1">โปรแกรมตรวจสุขภาพและแพ็กเกจการรักษาเฉพาะทาง</p>
            </div>
            <Link href="/packages" className="text-sm font-bold text-[#1a2b6d] hover:underline">
              ดูแพ็กเกจทั้งหมด ➔
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative border-b border-slate-100">
                    <img 
                      src={pkg.imageUrl} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                    <span className="absolute top-3 left-3 bg-[#1a2b6d]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
                      {pkg.tag}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1a2b6d] transition-colors leading-snug line-clamp-2">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{pkg.subtitle}</p>
                    </div>

                    <div className="flex items-baseline space-x-2 pt-1">
                      <span className="text-sm font-extrabold text-red-600">{pkg.price}</span>
                      <span className="text-[11px] text-slate-400 line-through">{pkg.originalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2 border-t border-slate-100 mt-2 bg-slate-50/50">
                  <Link 
                    href={`/packages/${pkg.id}`}
                    className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-center block"
                  >
                    รายละเอียด
                  </Link>

                  <button
                    onClick={() => {
                      const existingCart = JSON.parse(localStorage.getItem('novaria_cart') || '[]');
                      const index = existingCart.findIndex((item: any) => item.id === pkg.id);
                      if (index > -1) {
                        existingCart[index].quantity = (existingCart[index].quantity || 1) + 1;
                      } else {
                        existingCart.push({
                          id: pkg.id,
                          title: pkg.title,
                          price: parseInt(pkg.price.replace(/[^0-9]/g, '')),
                          originalPrice: parseInt(pkg.originalPrice.replace(/[^0-9]/g, '')),
                          quantity: 1,
                          hospital: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่',
                          imageUrl: pkg.imageUrl,
                        });
                      }
                      localStorage.setItem('novaria_cart', JSON.stringify(existingCart));
                      window.dispatchEvent(new Event('cartUpdated'));
                      triggerToast(`เพิ่ม "${pkg.title}" ลงตะกร้าแล้ว`);
                    }}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer text-center"
                  >
                    เพิ่มลงตะกร้า
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 4. ARTICLES & KNOWLEDGE */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2b6d]">ข้อมูลสุขภาพ</h2>
            <p className="text-sm text-slate-500 mt-1">บทความทางการแพทย์และแนวทางการดูแลสุขภาพโดยผู้เชี่ยวชาญ</p>
          </div>
          <Link href="/news" className="text-sm font-bold text-[#1a2b6d] hover:underline">
            ดูทั้งหมด ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {healthArticles.map((article, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="h-48 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      [ ไม่มีรูปภาพ ]
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-sky-700 uppercase">{article.category}</span>
                    <span className="text-slate-400">{article.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#1a2b6d] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{article.desc}</p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <Link href="/news" className="text-sm font-bold text-[#1a2b6d] hover:underline flex items-center gap-1">
                  อ่านต่อ ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BASIC INFO GRID */}
      <section className="bg-slate-50/70 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <h2 className="text-2xl font-bold text-[#1a2b6d]">ข้อมูลเบื้องต้น</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <Link href="/about" className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md hover:border-[#1a2b6d] transition text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-lg bg-sky-50 text-[#1a2b6d] flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m-6-18v18m6-18h.008v.008H12V3zm0 3h.008v.008H12V6zm0 3h.008v.008H12V9zm0 3h.008v.008H12v-1.5zm0 3h.008v.008H12v-1.5zm0 3h.008v.008H12v-1.5z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-slate-800">ข้อมูลโรงพยาบาล</span>
              </Link>

              <Link href="/news" className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md hover:border-[#1a2b6d] transition text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-lg bg-sky-50 text-[#1a2b6d] flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.75M16.5 10.5h3.75m-3.75 3h3.75m-3.75 3h3.75M3 19.5h18a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6v12a1.5 1.5 0 001.5 1.5z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-slate-800">ข่าวสารและกิจกรรม</span>
              </Link>

              <Link href="/rooms" className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md hover:border-[#1a2b6d] transition text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-lg bg-sky-50 text-[#1a2b6d] flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-slate-800">ห้องพักผู้ป่วย</span>
              </Link>

              <Link href="/branches" className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md hover:border-[#1a2b6d] transition text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-lg bg-sky-50 text-[#1a2b6d] flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-slate-800">แผนที่</span>
              </Link>

            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
              <div className="text-red-600 font-extrabold text-2xl tracking-tighter flex items-center gap-2">
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-lg">+</span> NOVARIA HEART HOSPITAL
              </div>
              <p className="text-xs text-slate-500 font-medium">เครือข่ายโรงพยาบาลโนวาเลีย {selectedBranch.name}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. AWARDS & ACCREDITATIONS */}
      <section className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <h2 className="text-2xl font-bold text-[#1a2b6d]">รางวัลและการรับรอง</h2>

          <div className="flex flex-wrap justify-around items-center gap-8 py-4 opacity-80 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-3 font-extrabold text-slate-700 text-lg tracking-wider">
              <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center text-white font-bold text-xs">JCI</div>
              GOLD SEAL OF APPROVAL
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700 text-base">
              <span className="text-blue-900 font-black italic text-xl">camts</span>
              <span className="text-xs text-slate-500">GLOBAL</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700 text-base">
              <span className="text-blue-900 font-black italic text-xl">camts</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">HA</div>
              GLOBAL HA ACCREDITED
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEEDBACK & COMPLAINT ACTION CARDS */}
      <section className="py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Link href="/contact" className="bg-sky-50/60 hover:bg-sky-100/60 p-5 rounded-lg border border-sky-100 flex items-center justify-between group transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#1a2b6d] text-white rounded-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3h7.5M6 20.25h12A2.25 2.25 0 0020.25 18V6.75A2.25 2.25 0 0018 4.5H6A2.25 2.25 0 003.75 6.75v11.25A2.25 2.25 0 006 20.25z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-[#1a2b6d] group-hover:underline">
                  แจ้งข้อกังวลเกี่ยวกับคุณภาพการดูแลผู้ป่วยต่อฝ่ายบริหารโรงพยาบาล
                </span>
              </div>
              <span className="text-slate-400 group-hover:text-[#1a2b6d] font-bold">➔</span>
            </Link>

            <Link href="/contact" className="bg-sky-50/60 hover:bg-sky-100/60 p-5 rounded-lg border border-sky-100 flex items-center justify-between group transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#1a2b6d] text-white rounded-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-[#1a2b6d] group-hover:underline">
                  แจ้งเกี่ยวกับคุณภาพการดูแลผู้ป่วยตามมาตรฐาน JCI
                </span>
              </div>
              <span className="text-slate-400 group-hover:text-[#1a2b6d] font-bold">➔</span>
            </Link>

          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER & SOCIAL LINKS */}
      <section className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="space-y-2 w-full md:w-auto">
            <h3 className="font-bold text-sm text-slate-800">ติดตามข่าวสาร</h3>
            <div className="flex gap-3">
              <button className="bg-[#1a2b6d] text-white text-xs font-bold px-6 py-2.5 rounded-sm hover:bg-blue-900 transition">
                รับข่าวสาร
              </button>
              <button className="bg-[#1a2b6d] text-white text-xs font-bold px-6 py-2.5 rounded-sm hover:bg-blue-900 transition">
                ข้อเสนอแนะ
              </button>
            </div>
          </div>

          <div className="space-y-2 w-full md:w-auto text-left md:text-right">
            <h3 className="font-bold text-sm text-slate-800">ติดตามเรา</h3>
            <div className="flex gap-4 text-slate-600 justify-start md:justify-end">
              <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm hover:bg-[#1a2b6d] hover:text-white transition cursor-pointer">f</span>
              <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs hover:bg-[#1a2b6d] hover:text-white transition cursor-pointer">LINE</span>
              <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs hover:bg-[#1a2b6d] hover:text-white transition cursor-pointer">TT</span>
              <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs hover:bg-[#1a2b6d] hover:text-white transition cursor-pointer">YT</span>
              <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs hover:bg-[#1a2b6d] hover:text-white transition cursor-pointer">IG</span>
            </div>
          </div>

        </div>
      </section>

      {/* BranchSelectorModal */}
      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSelectBranch={handleSelectBranch}
      />

    </div>
  );
}