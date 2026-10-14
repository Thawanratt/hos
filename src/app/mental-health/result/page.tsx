'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShieldAlert, 
  HeartPulse, 
  ArrowRight, 
  Sparkles,
  AlertTriangle,
  Info,
  X,
  Smile,
  Frown,
  ShieldCheck,
  Flame,
  AlertCircle,
  Siren,
  Hourglass
} from 'lucide-react';

export default function AssessmentResultPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // เก็บข้อมูลผู้ใช้
  const [userInfo, setUserInfo] = useState({
    gender: 'ไม่ระบุ',
    ageGroup: 'ไม่ระบุ',
    province: 'ไม่ระบุ',
    refId: ''
  });

  // สถานะและคะแนนทั้งหมด (เปลี่ยนจาก emoji เป็น component ของ lucide-react)
  const [results, setResults] = useState({
    happiness: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-3.5 h-3.5" /> },
    rq: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-3.5 h-3.5" /> },
    burnout: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-3.5 h-3.5" /> },
    st5: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-3.5 h-3.5" /> },
    q2: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-3.5 h-3.5" /> },
    q9: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-3.5 h-3.5" /> },
    q8: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-3.5 h-3.5" /> },
    overall: { label: 'ปกติ', isRisk: false }
  });

  // ฟังก์ชันช่วยรวมคะแนน
  const sumScores = (stepData: any) => {
    if (!stepData) return 0;
    return Object.values(stepData).reduce((sum: any, val: any) => sum + Number(val), 0) as number;
  };

  // ฟังก์ชันคำนวณน้ำหนักคะแนน 8Q ของกรมสุขภาพจิต
  const calculate8Q = (step8Data: any) => {
    if (!step8Data) return 0;
    const weights: { [key: number]: number } = { 1: 1, 2: 2, 3: 6, 4: 8, 5: 9, 6: 4, 7: 10, 8: 4 };
    let total = 0;
    Object.keys(step8Data).forEach(key => {
      const qId = Number(key);
      if (step8Data[qId] === 1) total += (weights[qId] || 0);
    });
    return total;
  };

  useEffect(() => {
    setIsMounted(true);
    const savedData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');

    const rawHappiness = savedData.step2?.happinessScore || 0;
    const rawRq = sumScores(savedData.step3);
    const rawBurnout = sumScores(savedData.step4);
    const rawSt5 = sumScores(savedData.step5);
    const rawQ2 = sumScores(savedData.step6); 
    const rawQ9 = sumScores(savedData.step7);
    const rawQ8 = calculate8Q(savedData.step8);

    // 2. แปลผลตามเกณฑ์กรมสุขภาพจิต พร้อมใส่ Icon Lucide
    const getHappiness = (s: number) => s >= 5 
      ? { score: s, label: 'มีความสุขปกติ', color: 'emerald', icon: <Smile className="w-3.5 h-3.5" /> } 
      : { score: s, label: 'มีความสุขน้อย', color: 'amber', icon: <Frown className="w-3.5 h-3.5" /> };
      
    const getRq = (s: number) => s >= 20 
      ? { score: s, label: 'พลังใจปกติ', color: 'emerald', icon: <ShieldCheck className="w-3.5 h-3.5" /> } 
      : { score: s, label: 'พลังใจน้อย (เสี่ยง)', color: 'rose', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
      
    const getBurnout = (s: number) => s < 5 
      ? { score: s, label: 'ไม่มีภาวะหมดไฟ', color: 'emerald', icon: <CheckCircle2 className="w-3.5 h-3.5" /> } 
      : { score: s, label: 'มีภาวะหมดไฟ', color: 'amber', icon: <Flame className="w-3.5 h-3.5" /> };
      
    const getSt5 = (s: number) => {
      if(s <= 4) return { score: s, label: 'เครียดน้อย', color: 'emerald', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      if(s <= 7) return { score: s, label: 'เครียดปานกลาง', color: 'amber', icon: <AlertCircle className="w-3.5 h-3.5" /> };
      if(s <= 9) return { score: s, label: 'เครียดมาก', color: 'rose', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
      return { score: s, label: 'เครียดมากที่สุด', color: 'rose', icon: <Siren className="w-3.5 h-3.5" /> };
    };
    
    const getQ2 = (s: number) => s === 0 
      ? { score: s, label: 'ไม่มีความเสี่ยง', color: 'emerald', icon: <CheckCircle2 className="w-3.5 h-3.5" /> } 
      : { score: s, label: 'มีภาวะเสี่ยง', color: 'amber', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
      
    const getQ9 = (s: number) => {
      if(s <= 6) return { score: s, label: 'ไม่มีอาการซึมเศร้า', color: 'emerald', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      if(s <= 12) return { score: s, label: 'ซึมเศร้าระดับน้อย', color: 'amber', icon: <AlertCircle className="w-3.5 h-3.5" /> };
      if(s <= 18) return { score: s, label: 'ซึมเศร้าระดับปานกลาง', color: 'rose', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
      return { score: s, label: 'ซึมเศร้าระดับรุนแรง', color: 'rose', icon: <Siren className="w-3.5 h-3.5" /> };
    };
    
    const getQ8 = (s: number) => {
      if(s === 0) return { score: s, label: 'ไม่มีแนวโน้ม', color: 'emerald', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      if(s <= 8) return { score: s, label: 'เสี่ยงระดับน้อย', color: 'amber', icon: <AlertCircle className="w-3.5 h-3.5" /> };
      if(s <= 16) return { score: s, label: 'เสี่ยงระดับปานกลาง', color: 'rose', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
      return { score: s, label: 'เสี่ยงระดับรุนแรง', color: 'rose', icon: <Siren className="w-3.5 h-3.5" /> };
    };

    const finalResults = {
      happiness: getHappiness(rawHappiness),
      rq: getRq(rawRq),
      burnout: getBurnout(rawBurnout),
      st5: getSt5(rawSt5),
      q2: getQ2(rawQ2),
      q9: getQ9(rawQ9),
      q8: getQ8(rawQ8),
      overall: { label: 'ปกติ', isRisk: false }
    };

    // 3. ประเมินความเสี่ยงโดยรวมเพื่อโชว์ Popup
    let isRisk = false;
    let overallLabel = 'ปกติ';
    if (rawQ8 >= 17 || rawQ9 >= 19 || rawSt5 >= 10) {
      isRisk = true;
      overallLabel = 'เสี่ยงสูง / วิกฤต (ต้องพบแพทย์เร่งด่วน)';
      setShowAlertModal(true);
    } else if (rawQ8 >= 1 || rawQ9 >= 7 || rawSt5 >= 5 || rawBurnout >= 5 || rawHappiness < 5) {
      isRisk = true;
      overallLabel = 'มีความเสี่ยงด้านสุขภาพจิต';
      setShowAlertModal(true);
    }

    finalResults.overall = { label: overallLabel, isRisk };
    setResults(finalResults);
    
    // อัปเดตข้อมูลผู้ใช้
    setUserInfo({
      gender: savedData.step1?.gender || 'ไม่ระบุ',
      ageGroup: savedData.step1?.ageGroup || 'ไม่ระบุ',
      province: savedData.step1?.province || 'ไม่ระบุ',
      refId: Math.floor(10000000 + Math.random() * 90000000).toString()
    });

    // 4. API Submit (เอาคอมเมนต์ออกเมื่อพร้อม)
    /*
    fetch('/api/mental-health/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...savedData.step1,
        happiness: rawHappiness,
        rqScore: rawRq,
        burnoutScore: rawBurnout,
        st5Score: rawSt5,
        q2Score: rawQ2,
        q9Score: rawQ9,
        suicideScore: rawQ8,
        isConsent: true
      })
    }).catch(err => console.error("API Submit Error:", err));
    */

  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'rose': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getBgIconClasses = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-600';
      case 'amber': return 'bg-amber-50 text-amber-600';
      case 'rose': return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans pb-24 relative">
      
      {/* 🚨 POPUP ALERT MODAL */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 text-center relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowAlertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-extrabold text-rose-600">
                ท่านมีความเสี่ยงต่อปัญหาสุขภาพจิต
              </h3>
              
              <div className="text-xs text-slate-600 space-y-1.5 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p>พลังใจ (RQ) : <span className={`font-semibold text-${results.rq.color}-600 flex items-center gap-1 inline-flex`}>{results.rq.icon} {results.rq.label}</span></p>
                <p>ภาวะหมดไฟ (Burnout) : <span className={`font-semibold text-${results.burnout.color}-600 flex items-center gap-1 inline-flex`}>{results.burnout.icon} {results.burnout.label}</span></p>
                <p>ความเครียด (ST-5) : <span className={`font-semibold text-${results.st5.color}-600 flex items-center gap-1 inline-flex`}>{results.st5.icon} {results.st5.label}</span></p>
                <p>ภาวะซึมเศร้า (2Q+) : <span className={`font-semibold text-${results.q2.color}-600 flex items-center gap-1 inline-flex`}>{results.q2.icon} {results.q2.label}</span></p>
                <p>โรคซึมเศร้า (9Q) : <span className={`font-semibold text-${results.q9.color}-600 flex items-center gap-1 inline-flex`}>{results.q9.icon} {results.q9.label}</span></p>
                <p>แนวโน้มฆ่าตัวตาย (8Q) : <span className={`font-semibold text-${results.q8.color}-600 flex items-center gap-1 inline-flex`}>{results.q8.icon} {results.q8.label}</span></p>
                <p>ความสุข (Happiness) : <span className={`font-semibold text-${results.happiness.color}-600 flex items-center gap-1 inline-flex`}>{results.happiness.icon} {results.happiness.label}</span></p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                ควรได้รับคำแนะนำและการดูแลช่วยเหลือเพิ่มเติมจากเจ้าหน้าที่สาธารณสุข ซึ่งต้องขอทราบข้อมูลเพิ่มเติมจากท่าน
              </p>
            </div>

            <button
              onClick={() => setShowAlertModal(false)}
              className="w-full py-3 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-xs md:text-sm rounded-xl transition shadow-md cursor-pointer"
            >
              รับทราบผลประเมิน
            </button>
          </div>
        </div>
      )}

      {/* 🏥 HEADER BANNER */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <Link href="/mental-health" className="hover:text-[#1a2b6d] transition-colors">ตรวจสุขภาพใจออนไลน์</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">ผลตรวจเช็คสุขภาพใจ</span>
          </nav>
        </div>
      </section>

      {/* 🌟 TITLE SECTION */}
      <section className="bg-gradient-to-b from-white via-sky-50/20 to-slate-50/50 py-10 border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-[#1a2b6d] text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#1a2b6d]" />
            <span>ผลตรวจเช็คสุขภาพใจ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d]">
            ผลการประเมินสุขภาพจิต (Evaluation Summary)
          </h1>
        </div>
      </section>

      {/* 📝 MAIN CONTENT GRID */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 mt-10 space-y-8">
        
        {/* Top Summary Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* User Profile / Ref Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-50 text-[#1a2b6d] rounded-xl flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ref. ID : {userInfo.refId}</h3>
                <p className="text-sm font-bold text-slate-800">การประเมิน : ประเมินตนเอง</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
              <p>เพศ / ช่วงอายุ : <span className="font-semibold text-slate-800">{userInfo.gender} | {userInfo.ageGroup}</span></p>
              <p>ประเภท : <span className="font-semibold text-slate-800">ประชาชน</span></p>
              <p>จังหวัดที่พักอาศัย : <span className="font-semibold text-slate-800">{userInfo.province}</span></p>
              <p>ยินยอมเปิดเผยข้อมูล : <span className="font-semibold text-emerald-600">ยินยอมตาม PDPA</span></p>
            </div>

            {results.overall.isRisk && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-800 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>เนื่องจากท่านมีความเสี่ยงด้านสุขภาพจิต กรุณากรอกแบบฟอร์มด้านล่างเพื่อรับการช่วยเหลือ</span>
              </div>
            )}
          </div>

          {/* Overall Status Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner ${results.overall.isRisk ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {results.overall.isRisk ? <ShieldAlert className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">สุขภาพจิตโดยรวม</h4>
              <h2 className={`text-xl font-extrabold ${results.overall.isRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
                {results.overall.label}
              </h2>
            </div>
          </div>

        </div>

        {/* 📊 SCORE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {[
            { key: 'happiness', title: 'ความสุข (Happiness)' },
            { key: 'rq', title: 'พลังใจ (RQ)' },
            { key: 'burnout', title: 'ภาวะหมดไฟ (Burnout)' },
            { key: 'st5', title: 'ความเครียด (ST-5)' },
            { key: 'q2', title: 'ภาวะซึมเศร้า (2Q+)' },
            { key: 'q9', title: 'โรคซึมเศร้า (9Q)' }
          ].map((item) => {
            const data = results[item.key as keyof typeof results] as any;
            return (
              <div key={item.key} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs text-center space-y-3">
                <p className="text-xs font-bold text-slate-500">{item.title}</p>
                <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center font-extrabold text-2xl ${getBgIconClasses(data.color)}`}>
                  {data.score}
                </div>
                <p className="text-[11px] text-slate-400">คะแนนรวม</p>
                <div className="pt-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getColorClasses(data.color)}`}>
                    {data.icon} <span>{data.label}</span>
                  </span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Card 7: Suicide Risk (8Q) Centered */}
        <div className="max-w-md mx-auto bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs text-center space-y-3">
          <p className="text-xs font-bold text-slate-500">แนวโน้มฆ่าตัวตาย (8Q)</p>
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center font-extrabold text-2xl ${getBgIconClasses(results.q8.color)}`}>
            {results.q8.score}
          </div>
          <p className="text-[11px] text-slate-400">คะแนนประเมิน</p>
          <div className="pt-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getColorClasses(results.q8.color)}`}>
              {results.q8.icon} <span>{results.q8.label}</span>
            </span>
          </div>
        </div>

        {/* 📋 CONTACT FORM SECTION */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-base md:text-lg font-bold text-[#1a2b6d]">
              รับความช่วยเหลือและคำปรึกษาเพิ่มเติม
            </h3>
            <p className="text-xs text-slate-500">กรอกข้อมูลเพื่อให้เจ้าหน้าที่โรงพยาบาลโนวาเลียติดต่อกลับเพื่อประเมินและดูแลเพิ่มเติมอย่างปลอดภัย</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ชื่อ</label>
              <input type="text" placeholder="ระบุชื่อของคุณ" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a2b6d]/30" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">เบอร์โทรศัพท์ติดต่อ</label>
              <input type="tel" placeholder="ระบุเบอร์โทรศัพท์" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a2b6d]/30" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center">
            <button 
              type="button" 
              onClick={() => {
                setIsSubmitting(true);
                setTimeout(() => {
                  alert('บันทึกข้อมูลและส่งเรื่องให้เจ้าหน้าที่เรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด');
                  setIsSubmitting(false);
                }, 1000);
              }}
              className="px-8 py-3 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลติดต่อกลับ'}
            </button>
          </div>
        </div>

        {/* 🔘 BOTTOM ACTION BUTTONS */}
        <div className="pt-4 flex items-center justify-between gap-4">
  <button
    onClick={() => {
      localStorage.removeItem('mentalHealthAssessment');
      window.location.href = '/mental-health'; // ไปหน้าแรกของการประเมิน
    }}
    className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition shadow-xs cursor-pointer"
  >
    ทำแบบประเมินใหม่
  </button>
  
  {/* เปลี่ยน Link เป็น button เพื่อล้างข้อมูลก่อนกลับหน้าแรกโรงพยาบาล */}
  <button
    onClick={() => {
      localStorage.removeItem('mentalHealthAssessment');
      window.location.href = '/'; // กลับหน้าแรกหลัก
    }}
    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer"
  >
    <span>กลับสู่หน้าแรก</span>
    <ArrowRight className="w-4 h-4" />
  </button>
</div>

      </main>

    </div>
  );
}