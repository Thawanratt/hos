import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. สร้างแผนกทั้ง 11 แผนกลงในฐานข้อมูลก่อน
  const departments = [
    { id: 1, name: 'อายุรกรรมแพทย์' },
    { id: 2, name: 'กุมารแพทย์' },
    { id: 3, name: 'สูตินรีแพทย์' },
    { id: 4, name: 'ศัลยแพทย์' },
    { id: 5, name: 'ศูนย์หัวใจ' },
    { id: 6, name: 'ศูนย์มะเร็ง' },
    { id: 7, name: 'ศูนย์กระดูกและข้อ' },
    { id: 8, name: 'ศูนย์สมองและระบบประสาท' },
    { id: 9, name: 'ศูนย์อุบัติเหตุและฉุกเฉิน' },
    { id: 10, name: 'ศูนย์ตรวจสุขภาพ' },
    { id: 11, name: 'ศูนย์ศัลยกรรม' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { id: dept.id },
      update: { name: dept.name },
      create: { id: dept.id, name: dept.name },
    });
  }

  // คลังรายชื่อแพทย์พร้อมระบุคำนำหน้าและเพศที่ถูกต้องตรงกัน
  const doctorProfiles: { [key: number]: Array<{ prefix: 'นพ.' | 'พญ.'; firstName: string; lastName: string; spec: string }> } = {
    1: [
      { prefix: 'นพ.', firstName: 'ภัทรพล', lastName: 'วัฒนกุล', spec: 'อายุรศาสตร์โรคหัวใจและหลอดเลือด' },
      { prefix: 'พญ.', firstName: 'ณัฏฐนิช', lastName: 'กิจเจริญ', spec: 'อายุรศาสตร์ทั่วไปและต่อมไร้ท่อ' }
    ],
    2: [
      { prefix: 'นพ.', firstName: 'ธนภัทร', lastName: 'อุดมศิริ', spec: 'กุมารเวชศาสตร์พัฒนาการและพฤติกรรม' },
      { prefix: 'พญ.', firstName: 'ภริมา', lastName: 'สุวรรณโชติ', spec: 'กุมารเวชศาสตร์โรคระบบทางเดินหายใจ' }
    ],
    3: [
      { prefix: 'พญ.', firstName: 'กุลณัฐ', lastName: 'พิสิษฐ์บรรณกร', spec: 'สูติศาสตร์และนรีเวชวิทยา (เวชศาสตร์มารดาและทารกในครรภ์)' },
      { prefix: 'นพ.', firstName: 'ธีรภัทร', lastName: 'วงศ์วานิช', spec: 'นรีเวชวิทยาผ่าตัดผ่านกล้อง' }
    ],
    4: [
      { prefix: 'นพ.', firstName: 'จักรพงษ์', lastName: 'นันทาภิวัฒน์', spec: 'ศัลยศาสตร์ทั่วไปและอุบัติเหตุ' },
      { prefix: 'พญ.', firstName: 'ธัญญรัตน์', lastName: 'บวรเลิศสุธี', spec: 'ศัลยศาสตร์ตกแต่งและเสริมสร้าง' }
    ],
    5: [
      { prefix: 'นพ.', firstName: 'กรวิชญ์', lastName: 'สิริธรังศรี', spec: 'อายุรศาสตร์โรคหัวใจเชิงรุกและสวนหัวใจ' },
      { prefix: 'พญ.', firstName: 'พิชญธิดา', lastName: 'อภิรมย์รักษ์', spec: 'ศัลยศาสตร์ทรวงอกและหัวใจ' }
    ],
    6: [
      { prefix: 'นพ.', firstName: 'สรวิชญ์', lastName: 'รัตนพงศ์', spec: 'อายุรศาสตร์มะเร็งวิทยา' },
      { prefix: 'พญ.', firstName: 'ปวีณา', lastName: 'จรัสแสง', spec: 'รังสีรักษาและมะเร็งวิทยา' }
    ],
    7: [
      { prefix: 'นพ.', firstName: 'อภิสิทธิ์', lastName: 'โชติช่วง', spec: 'ศัลยศาสตร์ออร์โปิดิกส์ (ข้อเข่าและข้อสะโพก)' },
      { prefix: 'นพ.', firstName: 'นภัทร', lastName: 'ชัยประเสริฐ', spec: 'ศัลยศาสตร์ออร์โปิดิกส์ (เวชศาสตร์การกีฬา)' }
    ],
    8: [
      { prefix: 'พญ.', firstName: 'พิมพ์มาดา', lastName: 'ธรรมกุล', spec: 'ประสาทวิทยาและหลอดเลือดสมอง' },
      { prefix: 'นพ.', firstName: 'ชยพล', lastName: 'อัศวเมฆิน', spec: 'ประสาทศัลยศาสตร์' }
    ],
    9: [
      { prefix: 'นพ.', firstName: 'ปกรณ์', lastName: 'ฉัตรชัยพงศ์', spec: 'เวชศาสตร์ฉุกเฉินและวิสัญญีวิทยา' },
      { prefix: 'พญ.', firstName: 'ชญานี', lastName: 'กิตติขจร', spec: 'เวชศาสตร์ฉุกเฉินวิกฤต' }
    ],
    10: [
      { prefix: 'พญ.', firstName: 'ศุภานัน', lastName: 'วงศ์สวัสดิ์', spec: 'เวชศาสตร์ป้องกันและเวชศาสตร์วิถีชีวิต' },
      { prefix: 'นพ.', firstName: 'เมธาสิทธิ์', lastName: 'เรืองรอง', spec: 'เวชศาสตร์ครอบครัวและตรวจสุขภาพ' }
    ],
    11: [
      { prefix: 'นพ.', firstName: 'อชิระ', lastName: 'เดชะวงศ์', spec: 'ศัลยศาสตร์ตกแต่งและผ่าตัดแผลเล็ก' },
      { prefix: 'พญ.', firstName: 'ลลิตา', lastName: 'ภัทรวณิชย์', spec: 'ศัลยศาสตร์ผิวหนังและเลเซอร์' }
    ]
  };

  const timeSlots = [
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:30', endTime: '11:30' },
    { startTime: '13:00', endTime: '14:00' },
    { startTime: '14:30', endTime: '15:30' },
  ];

  for (const dept of departments) {
    const docsInDept = doctorProfiles[dept.id] || [];
    
    for (let idx = 0; idx < docsInDept.length; idx++) {
      const doc = docsInDept[idx];
      const i = idx + 1;
      const email = `doctor.dept${dept.id}_${i}@novaria.com`;

      const gender = doc.prefix === 'นพ.' ? 'MALE' : 'FEMALE';
      const fullName = `${doc.prefix} ${doc.firstName}`;

      const user = await prisma.user.upsert({
        where: { email },
        update: { firstName: fullName, lastName: doc.lastName, gender },
        create: {
          firstName: fullName,
          lastName: doc.lastName,
          idCard: `3100100${dept.id < 10 ? '0' + dept.id : dept.id}${i}99`,
          phone: `082222${dept.id < 10 ? '0' + dept.id : dept.id}${i}00`,
          email: email,
          password: hashedPassword,
          gender: gender,
          role: 'DOCTOR',
        },
      });

      const doctor = await prisma.doctor.create({
        data: {
          userId: user.id,
          departmentId: dept.id,
          licenseNumber: `LIC-TH-${dept.id}00${i}`,
          specialization: doc.spec,
          isInstantBooking: true,
        },
      });

      const possibleDays = [1, 2, 3, 4, 5];
      const assignedDays = possibleDays.sort(() => 0.5 - Math.random()).slice(0, 3);

      for (const dayOfWeek of assignedDays) {
        const randomSlots = timeSlots.sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random() * 2));

        for (const slot of randomSlots) {
          await prisma.doctorSchedule.create({
            data: {
              doctorId: doctor.id,
              dayOfWeek: dayOfWeek, 
              startTime: slot.startTime,
              endTime: slot.endTime,
              maxSlots: 5,
              isAvailable: true,
            },
          });
        }
      }
    }
  }

  console.log('Seed departments, doctors, and randomized schedules completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });