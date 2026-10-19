import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim().toLowerCase() || '';

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  // 1. หน้าทั่วไป (Static Pages)
  const staticPages = [
    {
      title: 'เกี่ยวกับเรา / ประวัติโรงพยาบาล',
      subtitle: 'ประวัติ วิสัยทัศน์ และทีมผู้บริหารโรงพยาบาลโนวาเลีย',
      url: '/about',
      content: 'โรงพยาบาลโนวาเลีย ประวัติ วิสัยทัศน์ พันธกิจ ผู้บริหาร หมอวชิรวิทย์',
    },
    {
      title: 'ประกัน และสิทธิการรักษา',
      subtitle: 'สิทธิประกันชีวิต ประกันสังคม 30 บาท และการเบิกจ่ายค่ารักษา',
      url: '/insurance',
      content: 'ประกันชีวิต ประกันสังคม สิทธิ 30 บาท สิทธิการรักษา คุ้มครอง แฟกซ์เคลม',
    },
    {
      title: 'แบบประเมินสุขภาพจิตออนไลน์',
      subtitle: 'แบบทดสอบประเมินความเครียด ภาวะซึมเศร้า และความวิตกกังวล',
      url: '/mental-health',
      content: 'สุขภาพจิต ซึมเศร้า เครียด นอนไม่หลับ ประเมินสุขภาพใจ คลินิกจิตเวช',
    },
    {
      title: 'ติดต่อสอบถาม และการเดินทาง',
      subtitle: 'ที่ตั้งโรงพยาบาล แผนที่ เบอร์โทรศัพท์ฉุกเฉิน 24 ชั่วโมง',
      url: '/contact',
      content: 'ติดต่อ แผนที่ พุทธมณฑลสาย 4 รถพยาบาล ฉุกเฉิน เบอร์โทร 02-165-5555',
    },
  ];

  // 2. บทความสุขภาพ (Articles/Health)
  const healthArticles = [
    {
      title: '5 สัญญาณเตือนโรคมะเร็งที่ไม่ควรมองข้าม',
      subtitle: 'บทความสุขภาพ • ศูนย์มะเร็ง',
      url: '/health/cancer-warning-signs',
      content: 'โรคมะเร็ง มะเร็งลำไส้ มะเร็งเต้านม มะเร็งปอด ก้อนเนื้อ ตรวจคัดกรองมะเร็ง อาการเตือน เคมีบำบัด รังสีรักษา',
    },
    {
      title: 'การดูแลสุขภาพใจเมื่อต้องเผชิญกับโรคร้ายแรง',
      subtitle: 'บทความสุขภาพ • ศูนย์สุขภาพจิต',
      url: '/health/mental-care-chronic-illness',
      content: 'ความเครียด ผู้ป่วยมะเร็ง สุขภาพจิต กำลังใจ การดูแลผู้ป่วย จิตแพทย์ ให้คำปรึกษา',
    },
    {
      title: 'ตรวจสุขภาพประจำปี สำคัญอย่างไร?',
      subtitle: 'บทความสุขภาพ • ศูนย์ตรวจสุขภาพ',
      url: '/health/annual-checkup-guide',
      content: 'ตรวจสุขภาพประจำปี ความดัน เบาหวาน ไขมัน มะเร็งคัดกรอง ตรวจเลือด X-Ray',
    },
  ];

  // 3. ศูนย์การแพทย์และบริการ (Services)
  const services = [
    {
      title: 'ศูนย์มะเร็งและชีวรังสีรักษา',
      subtitle: 'บริการตรวจวินิจฉัยและรักษาโรคมะเร็งครบวงจร',
      url: '/services/cancer',
      content: 'ศูนย์มะเร็ง มะเร็งเต้านม มะเร็งปากมดลูก มะเร็งปอด คีโม เคมีบำบัด ฉายรังสี ตรวจคัดกรองเนื้อร้าย',
    },
    {
      title: 'ศูนย์หัวใจและหลอดเลือด',
      subtitle: 'ดูแลและรักษาโรคหัวใจตลอด 24 ชั่วโมง',
      url: '/services/heart',
      content: 'ศูนย์หัวใจ เจ็บหน้าอก ฉีดสีหัวใจ สวนหัวใจ หัวใจล้มเหลว หลอดเลือดหัวใจ',
    },
    {
      title: 'ศูนย์กระดูกและข้อ',
      subtitle: 'รักษาโรคข้อเสื่อม กระดูกหัก และผ่าตัดผ่านกล้อง',
      url: '/services/bone',
      content: 'ศูนย์กระดูก ข้อเข่าเสื่อม ปวดหลัง หมอนรองกระดูก ผ่าตัดข้อ กระดูกหัก',
    },
  ];

  // 4. แพ็กเกจสุขภาพ (Packages)
  const packages = [
    {
      title: 'แพ็กเกจตรวจคัดกรองมะเร็งระยะเริ่มต้น',
      subtitle: 'แพ็กเกจและโปรโมชั่น • เริ่มต้น 3,500 บาท',
      url: '/packages/cancer-screening',
      content: 'แพ็กเกจคัดกรองมะเร็ง มะเร็งตับ มะเร็งลำไส้ มะเร็งเต้านม ตรวจเลือดหาค่ามะเร็ง CEA AFP CA125',
    },
    {
      title: 'โปรแกรมตรวจสุขภาพหัวใจแข็งแรง',
      subtitle: 'แพ็กเกจและโปรโมชั่น • เริ่มต้น 4,900 บาท',
      url: '/packages/heart-checkup',
      content: 'ตรวจหัวใจ เดินสายพาน EST อัลตราซาวด์หัวใจ Echo คลื่นไฟฟ้าหัวใจ EKG',
    },
  ];

  const results: any[] = [];

  // ค้นหาในหน้าทั่วไป
  staticPages.forEach((item) => {
    if (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)
    ) {
      results.push({ type: 'page', title: item.title, subtitle: item.subtitle, url: item.url });
    }
  });

  // ค้นหาในบทความ
  healthArticles.forEach((item) => {
    if (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)
    ) {
      results.push({ type: 'page', title: item.title, subtitle: item.subtitle, url: item.url });
    }
  });

  // ค้นหาในศูนย์บริการ
  services.forEach((item) => {
    if (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)
    ) {
      results.push({ type: 'service', title: item.title, subtitle: item.subtitle, url: item.url });
    }
  });

  // ค้นหาในแพ็กเกจ
  packages.forEach((item) => {
    if (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)
    ) {
      results.push({ type: 'package', title: item.title, subtitle: item.subtitle, url: item.url });
    }
  });

  return NextResponse.json({ results });
}