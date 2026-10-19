'use client';

import { useState } from 'react';
import { User } from 'lucide-react';

interface Executive {
  id: string;
  name: string;
  imageSrc?: string;
  positions: string[];
  messageTitle: string;
  shortMessage: string;
  fullMessage: {
    paragraphs: string[];
    closing: string;
    signName: string;
    signPosition: string;
  };
}

const executivesData: Executive[] = [
  {
    id: '1',
    name: 'นพ. วชิรวิทย์ อมรชัยยาพิทักษ์',
    imageSrc: '/images/ko.png',
    positions: ['ผู้อำนวยการโรงพยาบาล', 'ประธานคณะผู้บริหาร'],
    messageTitle: 'สารจากประธานคณะผู้บริหาร',
    shortMessage:
      'การมีสุขภาพที่ดีนำมาซึ่งความสุขและความสำเร็จในชีวิต เราจึงให้ความสำคัญและมุ่งมั่นในการรักษาดูแลสุขภาพของทุกคนด้วยมาตรฐานระดับสากล พร้อมเทคโนโลยีทางการแพทย์ที่เป็นเลิศเสมอมา...',
    fullMessage: {
      paragraphs: [
        'การมีสุขภาพที่ดีนำมาซึ่งความสุขและความสำเร็จในชีวิต เราจึงให้ความสำคัญและมุ่งมั่นในการรักษาดูแลสุขภาพของทุกคนด้วยมาตรฐานระดับสากล พร้อมเทคโนโลยีทางการแพทย์ที่เป็นเลิศเสมอมา เรามีความพร้อมในการให้บริการทางการแพทย์ครอบคลุมทุกความต้องการ กับความเป็นเลิศทางการแพทย์ ได้แก่ โรงพยาบาลโนวาเลีย สำนักงานใหญ่, ศูนย์สุขภาพจิต และศูนย์เฉพาะทางหลากหลายสาขา ที่พร้อมดูแลรักษาทุกท่าน',
        'ด้วยความก้าวหน้าของเทคโนโลยีที่พัฒนาอย่างไม่หยุดยั้ง รวมทั้งการอำนวยความสะดวกให้กับทุกท่านได้ครบทุกมิติ เราขอต้อนรับทุกท่านเข้าสู่เว็บไซต์ของโรงพยาบาลโนวาเลีย ซึ่งได้รับการปรับปรุงและพัฒนาอยู่เสมอ ในเว็บไซต์นี้ท่านสามารถค้นหาข้อมูลสุขภาพเกี่ยวกับโรค เทคนิคการรักษา เครื่องมือการรักษาที่ทันสมัย วิธีการดูแลและป้องกัน ตลอดจนข้อมูลข่าวสารสำคัญต่างๆ ของโรงพยาบาลโนวาเลีย',
        'ในนามของคณะแพทย์ พยาบาล และเจ้าหน้าที่โรงพยาบาลโนวาเลีย ขอขอบพระคุณที่ท่านกรุณาให้การสนับสนุนโรงพยาบาลตลอดมา ทีมผู้บริหารพร้อมด้วยคณะแพทย์ พยาบาล และเจ้าหน้าที่โรงพยาบาลมีความตั้งใจและมุ่งมั่นอย่างยิ่งที่จะพัฒนาคุณภาพการให้บริการทางการแพทย์เพื่อความพึงพอใจสูงสุดของท่านตลอดไป',
      ],
      closing: 'ด้วยความเคารพ',
      signName: 'นพ.วชิรวิทย์ อมรชัยยาพิทักษ์',
      signPosition: 'ผู้อำนวยการโรงพยาบาล และประธานคณะผู้บริหาร',
    },
  },
  {
    id: '2',
    name: 'พญ. พิมลวรรณ กองเกิดทอง',
    imageSrc: '/images/preaw.png', 
    positions: ['รองผู้อำนวยการฝ่ายการแพทย์', 'ประธานคณะผู้บริหาร กลุ่ม 1'],
    messageTitle: 'สารจากผู้บริหาร',
    shortMessage:
      'เป็นความภาคภูมิใจอย่างสูงที่โรงพยาบาลโนวาเลียได้รับการไว้วางใจให้ดูแลสุขภาพและรักษาพยาบาลชาวไทยและชาวต่างชาติตลอดระยะเวลาอันยาวนาน บุคลากรทุกคนทุ่มเทและใส่ใจในการบริการ...',
    fullMessage: {
      paragraphs: [
        'เป็นความภาคภูมิใจอย่างสูงที่โรงพยาบาลโนวาเลียได้รับการไว้วางใจให้ดูแลสุขภาพและรักษาพยาบาลชาวไทยและชาวต่างชาติตลอดระยะเวลาอันยาวนาน บุคลากรทุกคนทุ่มเทและใส่ใจในการบริการเพื่อผลการรักษาที่ดีที่สุด',
        'มุ่งเน้นการพัฒนามาตรฐานเวชปฏิบัติอย่างต่อเนื่อง นำเทคโนโลยีทางการแพทย์ระดับสากลมาประยุกต์ใช้เพื่อการวินิจฉัยและรักษาที่แม่นยำ พร้อมทั้งส่งเสริมการดูแลสุขภาพเชิงป้องกันและสุขภาพจิตเพื่อสุขภาวะที่สมบูรณ์ของผู้รับบริการทุกท่าน',
      ],
      closing: 'ด้วยความเคารพ',
      signName: 'พญ.พิมลวรรณ กองเกิดทอง',
      signPosition: 'รองผู้อำนวยการฝ่ายการแพทย์',
    },
  },
  {
    id: '3',
    name: 'ดร. ธวัลรัตน์ พันธุ์เขียน',
    imageSrc: '/images/aim.png', 
    positions: ['ผู้อำนวยการฝ่ายบริหาร'],
    messageTitle: 'สารจากผู้บริหาร',
    shortMessage:
      'มุ่งมั่นพัฒนานวัตกรรมการบริการและระบบบริหารจัดการโรงพยาบาล เพื่ออำนวยความสะดวกสบาย ความรวดเร็ว และความพึงพอใจสูงสุดให้แก่ผู้ป่วยและครอบครัว...',
    fullMessage: {
      paragraphs: [
        'มุ่งมั่นพัฒนานวัตกรรมการบริการและระบบบริหารจัดการโรงพยาบาล เพื่ออำนวยความสะดวกสบาย ความรวดเร็ว และความพึงพอใจสูงสุดให้แก่ผู้ป่วยและครอบครัว',
        'ยกระดับระบบบริการดิจิทัลทางการแพทย์ (Digital Healthcare) เชื่อมโยงการรับบริการตั้งแต่การนัดหมาย การประเมินสุขภาพออนไลน์ จนถึงการดูแลต่อเนื่องหลังการรักษา เพื่อมอบประสบการณ์การรับบริการที่ราบรื่นและมีประสิทธิภาพสูงสุด',
      ],
      closing: 'ด้วยความเคารพ',
      signName: 'ดร. ธวัลรัตน์ พันธุ์เขียน',
      signPosition: 'ผู้อำนวยการฝ่ายบริหาร',
    },
  },
];

function ExecutiveCard({ person }: { person: Executive }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-2xs hover:shadow-sm transition-shadow flex flex-col md:flex-row items-start gap-6">
      
      {/* 🖼️ รูปโปรไฟล์วงกลมด้านซ้าย (รองรับทั้งรูปภาพ และ Fallback Icon) */}
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400 overflow-hidden mx-auto md:mx-0 relative">
        {person.imageSrc && !imgError ? (
          <img
            src={person.imageSrc}
            alt={person.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <User className="w-14 h-14" />
        )}
      </div>

      {/* ข้อมูลผู้บริหารด้านขวา */}
      <div className="space-y-3 flex-1 text-left w-full">
        <h3 className="font-bold text-slate-900 text-lg md:text-xl">
          {person.name}
        </h3>

        {/* ป้ายตำแหน่ง (Badges) */}
        <div className="flex flex-wrap gap-2">
          {person.positions.map((pos, idx) => (
            <span
              key={idx}
              className="inline-block bg-sky-50 text-[#1a2b6d] text-xs font-semibold px-3 py-1 rounded-full border border-sky-100"
            >
              {pos}
            </span>
          ))}
        </div>

        {/* สารจากผู้บริหาร */}
        <div className="pt-2 space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            {person.messageTitle}
          </p>

          {!isExpanded ? (
            /* สภาพย่อ (Short View) */
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {person.shortMessage}
            </p>
          ) : (
            /* สภาพขยายเต็ม (Expanded View) */
            <div className="space-y-3 text-xs md:text-sm text-slate-600 leading-relaxed pt-1">
              {person.fullMessage.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              <div className="pt-3 space-y-1 text-slate-700">
                <p>{person.fullMessage.closing}</p>
                <p className="font-semibold">{person.fullMessage.signName}</p>
                <p className="text-xs text-slate-500">
                  {person.fullMessage.signPosition}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ปุ่ม อ่านเพิ่มเติม / ปิด */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer transition-colors"
          >
            <span className="w-3 h-0.5 bg-rose-600 inline-block"></span>
            <span>{isExpanded ? 'ปิด' : 'อ่านเพิ่มเติม'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExecutivesPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-bold text-[#1a2b6d]">ทีมบริหาร</h2>
        <div className="h-0.5 w-16 bg-[#1a2b6d] mt-2"></div>
      </div>

      {/* List การ์ดผู้บริหารแนวดิ่ง */}
      <div className="space-y-4 pt-2">
        {executivesData.map((person) => (
          <ExecutiveCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}