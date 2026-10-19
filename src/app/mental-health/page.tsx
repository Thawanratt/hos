'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const selectSectionRef = useRef<HTMLDivElement>(null);

  // 🚀 ฟังก์ชันเริ่มทำแบบประเมิน: ล้างข้อมูลเก่าแล้วนำทางไป Step 1
  const handleStartAssessment = () => {
    localStorage.removeItem('mentalHealthAssessment');
    router.push('/mental-health/assessment');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">
      
      {/* 🏥 HEADER BANNER */}
      <section className="bg-white border-b border-slate-200 shadow-xs relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <nav className="text-[11px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#1a2b6d] font-bold">ตรวจสุขภาพใจออนไลน์</span>
          </nav>
        </div>
      </section>

      {/* 🌟 HERO SECTION (Background Image banner1 - Increased Opacity) */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-20 md:py-28 text-center">
        
        {/* 🖼️ ภาพพื้นหลัง banner1 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none"
          style={{ backgroundImage: "url('/images/banner1.jpg')" }} 
        />

        {/* 🌫️ Overlay สีขาว */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/70 to-[#f8fafc] pointer-events-none" />

        {/* 📝 ข้อความบนแบนเนอร์ */}
        <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200 text-[#1a2b6d] text-xs font-bold shadow-sm backdrop-blur-md">
            <HeartPulse className="w-4 h-4 text-[#1a2b6d]" />
            <span>ตรวจสุขภาพใจออนไลน์ ฟรี โดยโรงพยาบาลโนวาเลีย</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b6d] tracking-tight leading-tight drop-shadow-xs">
              วันนี้... ใจเราเป็นอย่างไร?
            </h1>
            <p className="text-xl md:text-2xl font-bold text-slate-700">
              เหนื่อยไหม? ไหวหรือเปล่า?
            </p>
          </div>

          <p className="text-sm md:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed font-semibold bg-white/60 p-3 rounded-xl backdrop-blur-xs border border-white/80 shadow-2xs">
            ระบบประเมินสุขภาพจิตเบื้องต้นใน 3-5 นาที รู้ผลทันทีพร้อมคำแนะนำ อ้างอิงเครื่องมือมาตรฐานจากกรมสุขภาพจิต เพื่อคัดกรองและดูแลจิตใจของคุณอย่างถูกต้อง
          </p>

          <div className="pt-4">
            <button
              onClick={handleStartAssessment}
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer active:scale-95"
            >
              <span>เริ่มทำแบบประเมิน</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 📘 ABOUT SECTION: เกี่ยวกับระบบ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-6 sticky top-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4" /> เกี่ยวกับระบบของเรา
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-[#1a2b6d] leading-tight">
                ตรวจสุขภาพใจ <br/> MENTAL HEALTH CHECK IN คืออะไร?
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
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>คัดกรองความเครียด</strong> ภาวะหมดไฟ ความเสี่ยงต่อการฆ่าตัวตาย และภาวะซึมเศร้า</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>RQ (Resilience Quotient)</strong> ประเมินความสามารถในการฟื้นตัวทางจิตใจ</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'เครียด', subtitle: 'Stress', icon: <Activity className="w-7 h-7 text-indigo-600" />, bg: 'bg-indigo-50' },
              { title: 'ภาวะหมดไฟ', subtitle: 'Burnout', icon: <Flame className="w-7 h-7 text-orange-600" />, bg: 'bg-orange-50' },
              { title: 'เสี่ยงฆ่าตัวตาย', subtitle: 'Suicide', icon: <ShieldAlert className="w-7 h-7 text-rose-600" />, bg: 'bg-rose-50' },
              { title: 'ซึมเศร้า', subtitle: 'Depression', icon: <Frown className="w-7 h-7 text-blue-600" />, bg: 'bg-blue-50' },
              { title: 'พลังใจ', subtitle: 'RQ', icon: <ShieldCheck className="w-7 h-7 text-emerald-600" />, bg: 'bg-emerald-50' },
              { title: 'ดูแลใจเมื่อสูญเสีย', subtitle: 'Grief', icon: <HeartCrack className="w-7 h-7 text-purple-600" />, bg: 'bg-purple-50' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-300 rounded-lg p-5 shadow-xs hover:border-slate-400 transition-all flex flex-col items-center text-center space-y-3">
                <div className={`w-14 h-14 ${item.bg} rounded-md flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-400 font-medium">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 📊 STATS SECTION: สถิติโรคซึมเศร้า */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-20">
        <div className="text-center space-y-2 mb-8">
          <p className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center justify-center gap-1.5">
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
          <div className="md:col-span-2 bg-white border border-slate-300 rounded-lg p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                <Globe2 className="w-5 h-5 text-indigo-600" />
                ผู้ป่วยโรคซึมเศร้าทั่วโลก
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl md:text-6xl font-black text-[#1a2b6d] tracking-tight">
                  322 <span className="text-xl font-bold text-slate-400">ล้านคน</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-sm pt-2 leading-relaxed">
                องค์การอนามัยโลก (WHO) ระบุว่าร้อยละ 5.2 ของประชากรวัยผู้ใหญ่ทั่วโลกกำลังเผชิญกับโรคซึมเศร้า ซึ่งส่งผลกระทบต่อการใช้ชีวิต
              </p>
            </div>
            
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
              <Activity className="w-64 h-64 text-[#1a2b6d]" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-600" /> คนไทยเสี่ยงซึมเศร้า
                </p>
                <p className="text-3xl font-black text-[#1a2b6d]">
                  1.5 <span className="text-base font-bold text-slate-400">ล้านคน</span>
                </p>
                <p className="text-[10px] text-slate-400">ประชากรอายุ 15 ปีขึ้นไป (กรมสุขภาพจิต)</p>
              </div>
            </div>

            <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-xs flex flex-col justify-center relative overflow-hidden">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
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
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ PARTNERS SECTION */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mt-20 pb-12 text-center space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Landmark className="w-4 h-4" /> ภาคีเครือข่าย
          </p>
          <h2 className="text-2xl font-black text-[#1a2b6d]">
            หน่วยงานที่ร่วมพัฒนาและเชื่อมโยงระบบ
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
          <img 
            src="/images/j1.jpeg" 
            alt="กรมสุขภาพจิต" 
            className="h-14 object-contain"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x80?text=DMH+Logo' }}
          />
          <img 
            src="/images/j2.jpg" 
            alt="กระทรวงสาธารณสุข" 
            className="h-14 object-contain"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x80?text=MOPH+Logo' }}
          />
          <img 
            src="/images/j3.png" 
            alt="วัดใจ.com" 
            className="h-10 object-contain"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x60?text=Watjai+Logo' }}
          />
        </div>
      </section>

    </div>
  );
}