export interface Branch {
  id: string;
  name: string;
  region: 'กรุงเทพฯ' | 'ภาคกลาง' | 'ภาคเหนือ' | 'ภาคใต้' | 'ภาคตะวันออก';
  address: string;
  phone: string;
  lat: number;
  lng: number;
  isMain?: boolean;
}

export const BRANCHES_DATA: Branch[] = [
  {
    id: 'novaria-main',
    name: 'โรงพยาบาลโนวาเลีย สำนักงานใหญ่ (กรุงเทพ)',
    region: 'กรุงเทพฯ',
    address: '123 ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ',
    phone: '02-165-5555',
    lat: 13.746,
    lng: 100.553,
    isMain: true,
  },
  {
    id: 'novaria-pattaya', 
    name: 'โรงพยาบาลโนวาเลีย พัทยา',
    region: 'ภาคตะวันออก',
    address: 'หมู่ 6 ต.นาเกลือ อ.บางละมุง จ.ชลบุรี',
    phone: '038-123-456',
    lat: 12.953,
    lng: 100.889,
  },
  {
    id: 'novaria-chiangmai',
    name: 'โรงพยาบาลโนวาเลีย เชียงใหม่',
    region: 'ภาคเหนือ',
    address: 'ถ.ซุปเปอร์ไฮเวย์ ต.วัดเกต อ.เมือง จ.เชียงใหม่',
    phone: '053-999-888',
    lat: 18.790,
    lng: 99.012,
  },
  {
    id: 'novaria-phuket',
    name: 'โรงพยาบาลโนวาเลีย ภูเก็ต',
    region: 'ภาคใต้',
    address: 'ถ.เยาวราช ต.ตลาดใหญ่ อ.เมือง จ.ภูเก็ต',
    phone: '076-777-666',
    lat: 7.888,
    lng: 98.389,
  },
  {
    id: 'novaria-nakhonpathom',
    name: 'โรงพยาบาลโนวาเลีย นครปฐม',
    region: 'ภาคกลาง',
    address: 'ถ.พหลโยธิน ต.บางเลน อ.เมือง จ.นครปฐม',
    phone: '044-555-666',
    lat: 13.812,
    lng: 100.523,
  },
  {
    id: 'novaria-hatyai',
    name: 'โรงพยาบาลโนวาเลีย หาดใหญ่',
    region: 'ภาคใต้',
    address: 'ถ.เพชรเกษม ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา',
    phone: '074-888-999',
    lat: 7.008,
    lng: 100.474,
  },
  {
    id: 'novaria-rayong',
    name: 'โรงพยาบาลโนวาเลีย ระยอง',
    region: 'ภาคตะวันออก',
    address: 'ถ.สุขุมวิท ต.ในเมือง อ.เมือง จ.ระยอง',
    phone: '038-123-456',
    lat: 12.678,
    lng: 101.012,
  }

];

// ฟังก์ชันคำนวณระยะทางจาก GPS (Haversine Formula)
export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // รัศมีโลก (กิโลเมตร)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}