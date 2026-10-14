'use client';

import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  image: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'ความดันโลหิตสูง (Hypertension)',
    slug: 'hypertension',
    image: '/images/a.jpg'
  },
  {
    id: '2',
    title: 'โรคเบาหวาน (Diabetes Mellitus)',
    slug: 'diabetes',
    image: '/images/b.jpg'
  },
  {
    id: '3',
    title: 'ไขมันในเลือดสูง (Dyslipidemia)',
    slug: 'dyslipidemia',
    image: '/images/c.jpg'
  },
  {
    id: '4',
    title: 'ข้อเข่าเสื่อม (Osteoarthritis Of The Knee)',
    slug: 'osteoarthritis',
    image: '/images/d.jpeg'
  },
  {
    id: '5',
    title: 'โรคมะเร็งตับ (Liver Cancer)',
    slug: 'liver-cancer',
    image: '/images/e.jpg'
  },
  {
    id: '6',
    title: 'โรคหัวใจเต้นผิดจังหวะ (Arrhythmia)',
    slug: 'arrhythmia',
    image: '/images/f.jpg'
  },
  {
    id: '7',
    title: 'โรคมะเร็งปอด (Lung Cancer)',
    slug: 'lung-cancer',
    image: '/images/g.jpg'
  },
  {
    id: '8',
    title: 'โรคมะเร็งปากมดลูก (Cervical Cancer)',
    slug: 'cervical-cancer',
    image: '/images/h.jpg'
  },
  {
    id: '9',
    title: 'โรคงูสวัด (Herpes Zoster)',
    slug: 'herpes-zoster',
    image: '/images/i.jpg'
  },
  {
    id: '10',
    title: 'โรคภูมิแพ้ (Allergy)',
    slug: 'allergy',
    image: '/images/j.jpg'
  },
  {
    id: '11',
    title: 'คำแนะนำการใช้อาหารอย่างปลอดภัย',
    slug: 'food-safety',
    image: '/images/k.jpg'
  },
  {
    id: '12',
    title: 'การเตรียมผู้ป่วยก่อนการผ่าตัด (Ultrasound)',
    slug: 'pre-surgery',
    image: '/images/l.jpeg'
  }
];

export default function HealthArticlesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      
      {/* 🏥 HEADER BANNER - EXECUTIVE ACCENT BAR STYLE (คงเดิมตามสั่ง ห้ามแตะต้อง) */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div className="space-y-3">
            <nav className="text-[11px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#1a2b6d] transition-colors">หน้าแรก</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold">บทความสุขภาพ</span>
            </nav>

            <div className="pl-4 border-l-4 border-[#1a2b6d] py-0.5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight leading-tight">
                  บทความ และ <span className="font-semibold text-[#1a2b6d]">สาระสุขภาพ</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
                  รวบรวมบทความสุขภาพ โรคและการรักษา การดูแลตัวเอง และคำแนะนำจากแพทย์ผู้เชี่ยวชาญโรงพยาบาลโนวาเลีย
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-12 space-y-12">
        
        {/* หัวข้อ "บทความสุขภาพ" ตรงกลางหน้า พร้อมดีไซน์ตกแต่งพรีเมียม */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400"></span>
            <span className="w-2 h-2 rounded-full bg-[#1a2b6d]"></span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2b6d] tracking-tight">
            บทความสุขภาพ
          </h2>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Health Information & Articles
          </p>
        </div>

        {/* GRID รายการบทความ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition duration-200 flex flex-col group"
            >
              {/* รูปภาพจากโฟลเดอร์ในเครื่อง */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* เนื้อหาการ์ด */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                <h3 className="font-bold text-slate-800 text-sm md:text-base line-clamp-2 group-hover:text-[#1a2b6d] transition-colors">
                  {article.title}
                </h3>

                {/* ปุ่มดูข้อมูลเพิ่มเติม */}
                <div className="pt-2">
                  <Link
                    href={`/health/${article.slug}`}
                    className="inline-block w-full text-center py-2 px-4 bg-sky-50 text-[#1a2b6d] hover:bg-[#1a2b6d] hover:text-white font-bold text-xs rounded-xl transition duration-200 shadow-2xs"
                  >
                    ดูข้อมูลเพิ่มเติม
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}