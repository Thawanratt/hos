'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShieldAlert, 
  HeartPulse, 
  ArrowRight, 
  AlertTriangle,
  X,
  Smile,
  Frown,
  ShieldCheck,
  Flame,
  AlertCircle,
  Siren,
  Hourglass,
  FileText
} from 'lucide-react';

export default function AssessmentResultPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const hasSubmittedRef = useRef(false);
  
  const [contactForm, setContactForm] = useState({ name: '', phone: '' });

  const [userInfo, setUserInfo] = useState({
    gender: 'ไม่ระบุ',
    ageGroup: 'ไม่ระบุ',
    province: 'ไม่ระบุ',
    refId: 'กำลังประมวลผล...'
  });

  const [results, setResults] = useState({
    happiness: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-4 h-4" /> },
    rq: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-4 h-4" /> },
    burnout: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-4 h-4" /> },
    st5: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-4 h-4" /> },
    q2: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-4 h-4" /> },
    q9: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-4 h-4" /> },
    q8: { score: 0, label: 'รอประมวลผล', color: 'slate', icon: <Hourglass className="w-4 h-4" /> },
    overall: { label: 'ปกติ', isRisk: false }
  });

  const sumScores = (stepData: any) => {
    if (!stepData) return 0;
    return Object.values(stepData).reduce((sum: any, val: any) => sum + Number(val), 0) as number;
  };

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
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    const savedData = JSON.parse(localStorage.getItem('mentalHealthAssessment') || '{}');

    const rawHappiness = savedData.step2?.happinessScore || 0;
    const rawRq = sumScores(savedData.step3);
    const rawBurnout = sumScores(savedData.step4);
    const rawSt5 = sumScores(savedData.step5);
    const rawQ2 = sumScores(savedData.step6); 
    const rawQ9 = sumScores(savedData.step7);
    const rawQ8 = calculate8Q(savedData.step8);

    const getHappiness = (s: number) => s >= 5 ? { score: s, label: 'มีความสุขปกติ', color: 'emerald', icon: <Smile className="w-4 h-4" /> } : { score: s, label: 'มีความสุขน้อย', color: 'amber', icon: <Frown className="w-4 h-4" /> };
    const getRq = (s: number) => s >= 20 ? { score: s, label: 'พลังใจปกติ', color: 'emerald', icon: <ShieldCheck className="w-4 h-4" /> } : { score: s, label: 'พลังใจน้อย (เสี่ยง)', color: 'rose', icon: <AlertTriangle className="w-4 h-4" /> };
    const getBurnout = (s: number) => s < 5 ? { score: s, label: 'ไม่มีภาวะหมดไฟ', color: 'emerald', icon: <CheckCircle2 className="w-4 h-4" /> } : { score: s, label: 'มีภาวะหมดไฟ', color: 'amber', icon: <Flame className="w-4 h-4" /> };
    const getSt5 = (s: number) => {
      if(s <= 4) return { score: s, label: 'เครียดน้อย', color: 'emerald', icon: <CheckCircle2 className="w-4 h-4" /> };
      if(s <= 7) return { score: s, label: 'เครียดปานกลาง', color: 'amber', icon: <AlertCircle className="w-4 h-4" /> };
      if(s <= 9) return { score: s, label: 'เครียดมาก', color: 'rose', icon: <AlertTriangle className="w-4 h-4" /> };
      return { score: s, label: 'เครียดมากที่สุด', color: 'rose', icon: <Siren className="w-4 h-4" /> };
    };
    const getQ2 = (s: number) => s === 0 ? { score: s, label: 'ไม่มีความเสี่ยง', color: 'emerald', icon: <CheckCircle2 className="w-4 h-4" /> } : { score: s, label: 'มีภาวะเสี่ยง', color: 'amber', icon: <AlertTriangle className="w-4 h-4" /> };
    const getQ9 = (s: number) => {
      if(s <= 6) return { score: s, label: 'ไม่มีอาการซึมเศร้า', color: 'emerald', icon: <CheckCircle2 className="w-4 h-4" /> };
      if(s <= 12) return { score: s, label: 'ซึมเศร้าระดับน้อย', color: 'amber', icon: <AlertCircle className="w-4 h-4" /> };
      if(s <= 18) return { score: s, label: 'ซึมเศร้าระดับปานกลาง', color: 'rose', icon: <AlertTriangle className="w-4 h-4" /> };
      return { score: s, label: 'ซึมเศร้าระดับรุนแรง', color: 'rose', icon: <Siren className="w-4 h-4" /> };
    };
    const getQ8 = (s: number) => {
      if(s === 0) return { score: s, label: 'ไม่มีแนวโน้ม', color: 'emerald', icon: <CheckCircle2 className="w-4 h-4" /> };
      if(s <= 8) return { score: s, label: 'เสี่ยงระดับน้อย', color: 'amber', icon: <AlertCircle className="w-4 h-4" /> };
      if(s <= 16) return { score: s, label: 'เสี่ยงระดับปานกลาง', color: 'rose', icon: <AlertTriangle className="w-4 h-4" /> };
      return { score: s, label: 'เสี่ยงระดับรุนแรง', color: 'rose', icon: <Siren className="w-4 h-4" /> };
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

    let isRisk = false;
    let overallLabel = 'ปกติ';
    if (rawQ8 >= 17 || rawQ9 >= 19 || rawSt5 >= 10) {
      isRisk = true;
      overallLabel = 'เสี่ยงสูง / วิกฤต (ควรพบแพทย์เร่งด่วน)';
      setShowAlertModal(true);
    } else if (rawQ8 >= 1 || rawQ9 >= 7 || rawSt5 >= 5 || rawBurnout >= 5 || rawHappiness < 5) {
      isRisk = true;
      overallLabel = 'มีความเสี่ยงด้านสุขภาพจิต';
      setShowAlertModal(true);
    }

    finalResults.overall = { label: overallLabel, isRisk };
    setResults(finalResults);
    
    // บันทึกสถิติแบบนิรนาม
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
        suicideScore: rawQ8
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success && data.data) {
        setUserInfo({
          gender: savedData.step1?.gender || 'ไม่ระบุ',
          ageGroup: savedData.step1?.ageGroup || 'ไม่ระบุ',
          province: savedData.step1?.province || 'ไม่ระบุ',
          refId: data.data.refId
        });
      }
    })
    .catch(err => console.error("API Submit Error:", err));

  }, []);

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.phone) {
      alert("กรุณากรอกชื่อและเบอร์โทรศัพท์ให้ครบถ้วน");
      return;
    }
    
    setIsSubmittingContact(true);
    setTimeout(() => {
      alert(`บันทึกข้อมูลเรียบร้อยแล้ว\nหมายเลขอ้างอิงของคุณ: ${userInfo.refId}\nเจ้าหน้าที่โรงพยาบาลจะติดต่อกลับโดยเร็วที่สุด`);
      setIsSubmittingContact(false);
      setContactForm({ name: '', phone: '' });
    }, 1000);
  };

  const getStatusBadge = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'amber': return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'rose': return 'bg-rose-50 text-rose-800 border-rose-300';
      default: return 'bg-slate-50 text-slate-800 border-slate-300';
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">
      
      {/* 🚨 POPUP ALERT MODAL (สรุปผลแบบเป็นทางการ) */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-lg max-w-lg w-full p-6 shadow-xl space-y-5 relative">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5 text-rose-700">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold">
                  แจ้งเตือน: พบความเสี่ยงด้านสุขภาพจิต
                </h3>
              </div>
              <button 
                onClick={() => setShowAlertModal(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              จากการประเมินเบื้องต้น ระบบพบว่าท่านมีสภาวะความเสี่ยงในหัวข้อดังต่อไปนี้ ควรได้รับคำแนะนำเพิ่มเติมจากบุคลากรทางการแพทย์:
            </p>

            {/* รายละเอียดสรุปผล 7 ด้าน สไตล์ตารางทางการ */}
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-md text-xs bg-slate-50">
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-600 font-medium">1. ความสุข (Happiness)</span>
                <span className={`font-bold flex items-center gap-1 ${results.happiness.color === 'emerald' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {results.happiness.icon} {results.happiness.label}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-600 font-medium">2. พลังใจ (RQ)</span>
                <span className={`font-bold flex items-center gap-1 ${results.rq.color === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {results.rq.icon} {results.rq.label}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-600 font-medium">3. ภาวะหมดไฟ (Burnout)</span>
                <span className={`font-bold flex items-center gap-1 ${results.burnout.color === 'emerald' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {results.burnout.icon} {results.burnout.label}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-600 font-medium">4. ความเครียด (ST-5)</span>
                <span className={`font-bold flex items-center gap-1 ${results.st5.color === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {results.st5.icon} {results.st5.label}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-600 font-medium">5. ภาวะเสี่ยงซึมเศร้า (2Q)</span>
                <span className={`font-bold flex items-center gap-1 ${results.q2.color === 'emerald' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {results.q2.icon} {results.q2.label}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-600 font-medium">6. โรคซึมเศร้า (9Q)</span>
                <span className={`font-bold flex items-center gap-1 ${results.q9.color === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {results.q9.icon} {results.q9.label}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-slate-600 font-medium">7. แนวโน้มการทำร้ายตนเอง (8Q)</span>
                <span className={`font-bold flex items-center gap-1 ${results.q8.color === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {results.q8.icon} {results.q8.label}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setShowAlertModal(false)} 
                className="w-full py-3 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-xs rounded-md transition shadow-sm cursor-pointer"
              >
                รับทราบ และรับคำปรึกษา
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HEADER BANNER */}
      <section className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <nav className="text-[11px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <Link href="/mental-health" className="hover:text-[#1a2b6d] transition-colors">ตรวจสุขภาพใจออนไลน์</Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#1a2b6d] font-bold">สรุปผลการประเมิน</span>
          </nav>
        </div>
      </section>

      {/* TITLE SECTION */}
      <section className="bg-white py-10 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-[#1a2b6d] text-xs font-bold uppercase tracking-widest">
            <FileText className="w-4 h-4 text-[#1a2b6d]" />
            <span>รายงานผลการประเมินสุขภาพจิต</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b6d] tracking-tight">
            สรุปผลการประเมินสุขภาพจิต (Evaluation Report)
          </h1>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 md:px-8 mt-8 space-y-6">
        
        {/* SUMMARY TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Ref ID & Demographics Box */}
          <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 bg-slate-100 text-[#1a2b6d] rounded-md flex items-center justify-center border border-slate-200">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">หมายเลขอ้างอิง: {userInfo.refId}</h3>
                <p className="text-sm font-bold text-slate-800">การประเมินตนเอง (Anonymous Assessment)</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">เพศ / ช่วงอายุ:</span>
                <span className="font-semibold text-slate-800">{userInfo.gender} | {userInfo.ageGroup}</span>
              </div>
             
              <div className="flex justify-between py-1">
                <span className="text-slate-500">นโยบายความเป็นส่วนตัว:</span>
                <span className="font-semibold text-emerald-700">จัดเก็บข้อมูลเป็นสถิติภาพรวม</span>
              </div>
            </div>
          </div>

          {/* Overall Health Status Card */}
          <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${results.overall.isRisk ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              {results.overall.isRisk ? <ShieldAlert className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ผลการประเมินภาพรวม</span>
              <h2 className={`text-xl font-extrabold ${results.overall.isRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
                {results.overall.label}
              </h2>
            </div>
          </div>
        </div>

        {/* DETAILED SCORE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'happiness', title: 'ความสุข (Happiness)' },
            { key: 'rq', title: 'พลังใจ (RQ)' },
            { key: 'burnout', title: 'ภาวะหมดไฟ (Burnout)' },
            { key: 'st5', title: 'ความเครียด (ST-5)' },
            { key: 'q2', title: 'ภาวะซึมเศร้า (2Q)' },
            { key: 'q9', title: 'โรคซึมเศร้า (9Q)' }
          ].map((item) => {
            const data = results[item.key as keyof typeof results] as any;
            return (
              <div key={item.key} className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm text-center space-y-3">
                <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">{item.title}</h4>
                <div className="text-2xl font-black text-slate-800">
                  {data.score} <span className="text-xs font-normal text-slate-400">คะแนน</span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${getStatusBadge(data.color)}`}>
                    {data.icon} <span>{data.label}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 8Q Card (Center Aligned) */}
        <div className="max-w-md mx-auto bg-white border border-slate-300 rounded-lg p-5 shadow-sm text-center space-y-3">
          <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">แนวโน้มการทำร้ายตนเอง (8Q)</h4>
          <div className="text-2xl font-black text-slate-800">
            {results.q8.score} <span className="text-xs font-normal text-slate-400">คะแนน</span>
          </div>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${getStatusBadge(results.q8.color)}`}>
              {results.q8.icon} <span>{results.q8.label}</span>
            </span>
          </div>
        </div>

        {/* CONTACT FORM SECTION (แสดงเมื่อพบความเสี่ยง) */}
        {results.overall.isRisk && (
          <div className="bg-rose-50/60 border border-rose-300 rounded-lg p-6 md:p-8 shadow-sm space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-rose-800">
                ฟอร์มขอรับคำปรึกษาจากบุคลากรทางการแพทย์
              </h3>
              <p className="text-xs text-rose-700">
                เนื่องจากท่านมีความเสี่ยง สามารถกรอกข้อมูลเพื่อให้เจ้าหน้าที่โรงพยาบาลติดต่อกลับเพื่อดูแลอย่างปลอดภัย
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-2xl mx-auto">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">ชื่อ - นามสกุล <span className="text-rose-600">*</span></label>
                <input 
                  type="text" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  placeholder="ระบุชื่อ-นามสกุล" 
                  className="w-full p-3 bg-white border border-slate-300 rounded-md outline-none focus:border-[#1a2b6d]" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">เบอร์โทรศัพท์ติดต่อ <span className="text-rose-600">*</span></label>
                <input 
                  type="tel" 
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  placeholder="ระบุเบอร์โทรศัพท์ 10 หลัก" 
                  className="w-full p-3 bg-white border border-slate-300 rounded-md outline-none focus:border-[#1a2b6d]" 
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <button 
                type="button" 
                onClick={handleContactSubmit}
                className="px-8 py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-md shadow-sm transition cursor-pointer disabled:opacity-50"
                disabled={isSubmittingContact}
              >
                {isSubmittingContact ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลเพื่อขอรับการติดต่อกลับ'}
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <button
            onClick={() => {
              localStorage.removeItem('mentalHealthAssessment');
              window.location.href = '/mental-health'; 
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-md transition shadow-sm cursor-pointer"
          >
            ทำแบบประเมินใหม่
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('mentalHealthAssessment');
              window.location.href = '/';
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1a2b6d] hover:bg-blue-900 text-white font-bold text-sm rounded-md shadow-md transition cursor-pointer"
          >
            <span>กลับสู่หน้าแรกโรงพยาบาล</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

    </div>
  );
}