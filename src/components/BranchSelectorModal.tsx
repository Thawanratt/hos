'use client';

import { useState } from 'react';
import { BRANCHES_DATA, Branch, getDistanceInKm } from '@/app/api/branches/branches';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBranch: (branch: Branch) => void;
}

export default function BranchSelectorModal({ isOpen, onClose, onSelectBranch }: ModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ทั้งหมด');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  // ฟังก์ชันดึงพิกัด GPS ผู้ใช้เพื่อหา รพ. ใกล้ฉัน
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        alert('ไม่สามารถดึงตำแหน่งของคุณได้ กรุณาอนุญาตสิทธิ์การเข้าถึงตำแหน่ง');
        setIsLocating(false);
      }
    );
  };

  // ครองและเรียงลำดับสาขา
  let filteredBranches = BRANCHES_DATA.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.address.includes(searchTerm);
    const matchRegion = selectedRegion === 'ทั้งหมด' || b.region === selectedRegion;
    return matchSearch && matchRegion;
  });

  // ถ้ามี GPS ให้คำนวณระยะทางและเรียงจากใกล้ไปไกล
  if (userCoords) {
    filteredBranches = filteredBranches
      .map((b) => ({
        ...b,
        distance: getDistanceInKm(userCoords.lat, userCoords.lng, b.lat, b.lng),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  const regions = ['ทั้งหมด', 'กรุงเทพฯ', 'ภาคกลาง', 'ภาคเหนือ', 'ภาคใต้', 'ภาคตะวันออก'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-[#1a2b6d]">เลือกโรงพยาบาล / สาขา</h3>
            <p className="text-xs text-gray-400">ค้นหาเครือโรงพยาบาลโนวาเลียใกล้บ้านคุณ</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Search & GPS Bar */}
        <div className="p-6 pb-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ค้นหาชื่อสาขา หรือจังหวัด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1a2b6d]/30 text-gray-800"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="bg-[#1a2b6d] hover:bg-blue-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L12 22.343l-5.657-5.657a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{isLocating ? 'กำลังค้นหา...' : 'รพ. ใกล้ฉัน'}</span>
            </button>
          </div>

          {/* Region Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedRegion === reg
                    ? 'bg-amber-500 text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Branch Cards List */}
        <div className="p-6 pt-2 overflow-y-auto space-y-3 flex-1">
          {filteredBranches.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">ไม่พบสาขาที่คุณค้นหา</div>
          ) : (
            filteredBranches.map((branch: any) => (
              <div
                key={branch.id}
                onClick={() => {
                  onSelectBranch(branch);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-400 hover:shadow-md transition cursor-pointer flex justify-between items-center group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-[#1a2b6d] group-hover:text-amber-600 transition">
                      {branch.name}
                    </span>
                    {branch.isMain && (
                      <span className="bg-blue-100 text-[#1a2b6d] text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                        สำนักงานใหญ่
                      </span>
                    )}
                    {branch.distance !== undefined && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ห่าง {branch.distance} กม.
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-tight">{branch.address}</p>
                  <p className="text-[11px] text-gray-500 font-medium">โทร. {branch.phone}</p>
                </div>

                <div className="text-[#1a2b6d] group-hover:translate-x-1 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}