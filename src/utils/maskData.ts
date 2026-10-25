// src/utils/maskData.ts

// แสดงเลขบัตรประชาชนแบบเต็ม
export function maskIdCard(idCard: string): string {
  if (!idCard) return '';
  return idCard; // คืนค่าเลขเต็มตรงๆ ไม่ต้องซ่อน
}

// แสดงเบอร์โทรศัพท์แบบเต็ม
export function maskPhone(phone: string): string {
  if (!phone) return '';
  return phone; // คืนค่าเบอร์เต็มตรงๆ ไม่ต้องซ่อน
}