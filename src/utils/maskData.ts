// src/utils/maskData.ts

// ฟังก์ชันซ่อนเลขบัตรประชาชน (แสดงแค่ 2 ตัวท้าย เพื่อความปลอดภัยสูงสุด)
export function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 13) return 'x-xxxx-xxxxx-xx-x';
  return `x-xxxx-xxxxx-${idCard.substring(11, 13)}`;
}

// ฟังก์ชันซ่อนเบอร์โทรศัพท์ (แสดงเฉพาะ 4 ตัวท้าย เช่น xxx-xxx-6651)
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 10) return 'xxx-xxx-xxxx';
  return `xxx-xxx-${phone.substring(phone.length - 4)}`;
}