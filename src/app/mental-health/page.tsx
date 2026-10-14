'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  ArrowRight, 
  Activity, 
  Flame,
  ShieldAlert,
  Frown,
  ShieldCheck,
  HeartCrack,
  Globe2,
  MapPin,
  Stethoscope,
  Info,
  CheckCircle2,
  Landmark
} from 'lucide-react';

export default function MentalHealthCheckPage() {
  const selectSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSelect = () => {
    selectSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartAssessment = () => {
    localStorage.removeItem('mentalHealthAssessment');
    window.location.href = '/mental-health/assessment';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">
      
      {/* 🏥 HEADER BANNER */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">ตรวจสุขภาพใจออนไลน์</span>
          </nav>
        </div>
      </section>

      {/* 🌟 HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/60">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 py-20 md:py-28 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-[#1a2b6d] text-xs font-bold shadow-sm">
            <HeartPulse className="w-4 h-4 text-[#1a2b6d]" />
            <span>ตรวจสุขภาพใจออนไลน์ ฟรี โดยโรงพยาบาลโนวาเลีย</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b6d] tracking-tight leading-tight">
              วันนี้... ใจเราเป็นอย่างไร?
            </h1>
            <p className="text-xl md:text-2xl font-bold text-slate-500">
              เหนื่อยไหม? ไหวหรือเปล่า?
            </p>
          </div>

          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            ระบบประเมินสุขภาพจิตเบื้องต้นใน 3-5 นาที รู้ผลทันทีพร้อมคำแนะนำ อ้างอิงเครื่องมือมาตรฐานจากกรมสุขภาพจิต เพื่อคัดกรองและดูแลจิตใจของคุณอย่างถูกต้อง
          </p>

          <div className="pt-8">
            <button
              onClick={handleStartAssessment}
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-base rounded-2xl shadow-[0_8px_30px_rgb(26,43,109,0.3)] transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <span>เริ่มทำแบบประเมิน</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 📘 ABOUT SECTION: เกี่ยวกับระบบ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-6 sticky top-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4" /> เกี่ยวกับระบบของเรา
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-[#1a2b6d] leading-tight">
                ตรวจสุขภาพใจ <br/> MENTAL HEALTH CHECK IN คือ?
              </h2>
            </div>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                เครื่องมือประเมินสุขภาพจิตเบื้องต้นและคัดกรองความเสี่ยงต่อปัญหาสุขภาพจิต พัฒนาขึ้นเพื่อให้การดูแลสุขภาพจิตเข้าถึงได้สะดวก รวดเร็ว และประเมินตัวเองได้อย่างเป็นส่วนตัว
              </p>
              <p>
                ออกแบบเพื่อคัดกรองกลุ่มเสี่ยง และนำเข้าสู่กระบวนการดูแล ช่วยเหลือ หรือส่งต่อให้คำปรึกษาได้อย่างทันท่วงที
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>คัดกรองความเครียด</strong> ภาวะหมดไฟ ความเสี่ยงต่อการฆ่าตัวตาย และภาวะซึมเศร้า</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>RQ (Resilience Quotient)</strong> ประเมินความสามารถในการฟื้นตัวทางจิตใจ</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: 'เครียด', subtitle: 'Stress', icon: <Activity className="w-8 h-8 text-indigo-500" />, bg: 'bg-indigo-50' },
              { title: 'ภาวะหมดไฟ', subtitle: 'Burnout', icon: <Flame className="w-8 h-8 text-orange-500" />, bg: 'bg-orange-50' },
              { title: 'เสี่ยงฆ่าตัวตาย', subtitle: 'Suicide', icon: <ShieldAlert className="w-8 h-8 text-rose-500" />, bg: 'bg-rose-50' },
              { title: 'ซึมเศร้า', subtitle: 'Depression', icon: <Frown className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-50' },
              { title: 'พลังใจ', subtitle: 'RQ', icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />, bg: 'bg-emerald-50' },
              { title: 'ดูแลใจเมื่อสูญเสีย', subtitle: 'Grief', icon: <HeartCrack className="w-8 h-8 text-purple-500" />, bg: 'bg-purple-50' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all flex flex-col items-center text-center space-y-4 group">
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">{item.title}</h3>
                  <p className="text-xs text-slate-400 font-medium">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 📊 STATS SECTION: สถิติโรคซึมเศร้า (ข้อมูลจริงระดับโลกและไทย) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
        <div className="text-center space-y-2 mb-10">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <HeartPulse className="w-4 h-4" /> สถิติน่ารู้
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-[#1a2b6d]">
            สถานการณ์โรคซึมเศร้าในปัจจุบัน
          </h2>
          <p className="text-sm text-slate-500">
            ปัญหาสุขภาพจิตไม่ใช่เรื่องไกลตัว อ้างอิงข้อมูลจากองค์การอนามัยโลก (WHO) และกรมสุขภาพจิต
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* ข้อมูลระดับโลก (ซ้ายใหญ่) */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#f8faff] to-[#f1f5f9] border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                <Globe2 className="w-5 h-5 text-indigo-500" />
                ผู้ป่วยโรคซึมเศร้าทั่วโลก
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl md:text-7xl font-black text-[#1a2b6d] tracking-tighter">
                  322 <span className="text-xl md:text-2xl font-bold text-slate-400 tracking-normal">ล้านคน</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-sm pt-2 leading-relaxed">
                องค์การอนามัยโลก (WHO) ระบุว่าร้อยละ 5.2 ของประชากรวัยผู้ใหญ่ทั่วโลกกำลังเผชิญกับโรคซึมเศร้า ซึ่งส่งผลกระทบต่อการใช้ชีวิต
              </p>
            </div>
            
            {/* ไอคอนคลื่นความถี่ (Activity) ที่คุณชอบ ไว้ตรงมุมขวาล่าง */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Activity className="w-64 h-64 text-[#1a2b6d]" />
            </div>
          </div>

          {/* ข้อมูลระดับประเทศ (ขวา 2 การ์ด) */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-500" /> คนไทยเสี่ยงซึมเศร้า
                </p>
                <p className="text-4xl font-black text-[#1a2b6d]">
                  1.5 <span className="text-base font-bold text-slate-400">ล้านคน</span>
                </p>
                <p className="text-[10px] text-slate-400">ประชากรอายุ 15 ปีขึ้นไป (กรมสุขภาพจิต)</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                ผู้เข้ารับการรักษา (ปี 2566)
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-[#1a2b6d]">
                  399,645 <span className="text-base font-bold text-slate-400">คน</span>
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  เพิ่มขึ้น 1.7 เท่า สะท้อนถึงความต้องการ การดูแลรักษาที่เพิ่มสูงขึ้น
                </p>
              </div>
              <div className="absolute right-4 bottom-4 opacity-10">
                <Stethoscope className="w-12 h-12 text-[#1a2b6d]" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 🏛️ PARTNERS SECTION: ใส่รูปภาพโลโก้ได้เลย */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mt-24 pb-12 text-center space-y-10">
        <div className="space-y-3">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Landmark className="w-4 h-4" /> ภาคีเครือข่าย
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-[#1a2b6d]">
            หน่วยงานที่ร่วมพัฒนาและเชื่อมโยงระบบ
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            อ้างอิงข้อมูลและการประเมินจากหน่วยงานสาธารณสุข
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
          
          <img 
            src="/images/logo-dmh.png" 
            alt="กรมสุขภาพจิต" 
            className="h-16 md:h-20 object-contain"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x80?text=DMH+Logo' }}
          />
          
          <img 
            src="/images/logo-moph.png" 
            alt="กระทรวงสาธารณสุข" 
            className="h-16 md:h-20 object-contain"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x80?text=MOPH+Logo' }}
          />

          <img 
            src="/images/logo-watjai.png" 
            alt="วัดใจ.com" 
            className="h-12 md:h-16 object-contain"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x60?text=Watjai+Logo' }}
          />
          
          <img 
            src="/images/logo-tangrut.png" 
            alt="ทางรัฐ" 
            className="h-12 md:h-16 object-contain"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x60?text=Tangrut+Logo' }}
          />
          
        </div>
      </section>

    </div>
  );
}