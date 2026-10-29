'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { IBM_Plex_Sans_Thai } from 'next/font/google';

const plex = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

interface MedicalRecordItem {
  id: number;
  diagnosis: string;
  prescription: string | null;
  createdAt: string;
}

interface PatientUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  gender: string | null;
  createdAt: string;
  medicalRecords?: MedicalRecordItem[];
}

const Icon = ({ d, className = 'w-4 h-4' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  back: 'M19 12H5M11 6l-6 6 6 6',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-4.5-4.5',
  chevron: 'M9 6l6 6-6 6',
  record: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M12 11v6M9 14h6',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z',
  plus: 'M12 5v14M5 12h14',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
};

const genderLabel = (g: string | null) => (g === 'MALE' ? 'ชาย' : g === 'FEMALE' ? 'หญิง' : '-');

const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#2f5597] focus:ring-2 focus:ring-[#2f5597]/15 transition';

// 🟢 แยกส่วนที่ยังไม่ได้เลือกผู้ป่วยออกมาเป็น Component ย่อย
function EmptyPatientSelection() {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-xl px-6 py-20 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-[#e9eff7] text-[#2f5597] flex items-center justify-center">
        <Icon d={icons.record} className="w-6 h-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">ยังไม่ได้เลือกผู้ป่วย</h3>
      <p className="mt-1 text-sm text-slate-500">เลือกรายชื่อผู้ป่วยจากรายการ เพื่อดูประวัติหรือบันทึกเวชระเบียน</p>
    </div>
  );
}

// 🟢 แยกส่วนแสดงประวัติการรักษาเก่าออกมาเป็น Component ย่อย
function MedicalHistoryList({ 
  records, 
  editingRecordId, 
  onStartEdit 
}: { 
  readonly records?: MedicalRecordItem[]; 
  readonly editingRecordId: number | null; 
  readonly onStartEdit: (rec: MedicalRecordItem) => void; 
}) {
  if (!records || records.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#e9eff7] text-[#2f5597] flex items-center justify-center">
              <Icon d={icons.history} />
            </span>
            <h3 className="text-sm font-semibold text-slate-900">ประวัติการรักษาเดิมทั้งหมด</h3>
          </div>
          <span className="text-xs text-slate-400">0 ครั้ง</span>
        </div>
        <p className="text-sm text-slate-400 py-12 px-6 text-center">
          ยังไม่มีประวัติการบันทึกเวชระเบียนสำหรับผู้ป่วยรายนี้
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#e9eff7] text-[#2f5597] flex items-center justify-center">
            <Icon d={icons.history} />
          </span>
          <h3 className="text-sm font-semibold text-slate-900">ประวัติการรักษาเดิมทั้งหมด</h3>
        </div>
        <span className="text-xs text-slate-400">{records.length} ครั้ง</span>
      </div>

      <ul className="divide-y divide-slate-100">
        {records.map((rec) => {
          const isEditing = editingRecordId === rec.id;
          return (
            <li key={rec.id} className={`relative px-5 py-4 transition-colors ${isEditing ? 'bg-[#f1f5fb]' : ''}`}>
              {isEditing && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2f5597]" />}

              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon d={icons.calendar} className="w-3.5 h-3.5" />
                  {new Date(rec.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
                <button
                  type="button"
                  onClick={() => onStartEdit(rec)}
                  disabled={isEditing}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#2f5597] hover:text-[#1e3a6e] transition-colors cursor-pointer disabled:text-slate-400 disabled:cursor-default"
                >
                  <Icon d={icons.edit} className="w-3.5 h-3.5" />
                  {isEditing ? 'กำลังแก้ไข' : 'แก้ไข'}
                </button>
              </div>

              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">การวินิจฉัย</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">{rec.diagnosis}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">การสั่งจ่ายยา / คำแนะนำ</dt>
                  <dd className="mt-0.5 font-medium text-slate-900 whitespace-pre-wrap">{rec.prescription || '-'}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<PatientUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientUser | null>(null);

  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [diagnosisText, setDiagnosisText] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const currentDocId = user.id || user.doctorId;
        setDoctorId(currentDocId);
        fetchPatients(currentDocId);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPatient && typeof window !== 'undefined' && window.innerWidth < 1024) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedPatient]);

  const fetchPatients = async (docId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/patients?doctorId=${docId}`);
      const result = await res.json();
      if (result.success) {
        setPatients(result.data || []);
        if (selectedPatient) {
          const updated = result.data.find((p: PatientUser) => p.id === selectedPatient.id);
          if (updated) setSelectedPatient(updated);
        }
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (patient: PatientUser) => {
    setSelectedPatient(patient);
    setEditingRecordId(null);
    setDiagnosisText('');
    setPrescriptionText('');
  };

  const handleStartEdit = (record: MedicalRecordItem) => {
    setEditingRecordId(record.id);
    setDiagnosisText(record.diagnosis);
    setPrescriptionText(record.prescription || '');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCancelEdit = () => {
    setEditingRecordId(null);
    setDiagnosisText('');
    setPrescriptionText('');
  };

  const handleSubmitRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !doctorId) return;

    setSaving(true);
    try {
      let res;
      if (editingRecordId) {
        res = await fetch('/api/doctors/patients', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recordId: editingRecordId,
            diagnosis: diagnosisText,
            prescription: prescriptionText,
          }),
        });
      } else {
        res = await fetch('/api/doctors/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctorId: doctorId,
            patientId: selectedPatient.id,
            diagnosis: diagnosisText,
            prescription: prescriptionText,
          }),
        });
      }

      const result = await res.json();

      if (res.ok || result.success) {
        showMessage(editingRecordId ? 'อัปเดตเวชระเบียนเรียบร้อยแล้ว' : 'บันทึกเวชระเบียนใหม่เรียบร้อยแล้ว');
        setEditingRecordId(null);
        setDiagnosisText('');
        setPrescriptionText('');
        fetchPatients(doctorId);
      } else {
        showMessage(result.message || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
      }
    } catch (err) {
      showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <div className={`${plex.className} min-h-screen bg-[#f6f8fb] text-slate-800 pb-20`}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/doctors/main"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2f5597] hover:text-[#1e3a6e] transition-colors"
          >
            <Icon d={icons.back} />
            กลับหน้าหลักแพทย์
          </Link>
          <div className="text-xs text-slate-500 font-medium hidden sm:block">ระบบสารสนเทศโรงพยาบาล</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a6e]">เวชระเบียนและประวัติการรักษา</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            เรียกดูประวัติการรักษาเดิม แก้ไขข้อมูล หรือบันทึกผลการวินิจฉัยครั้งใหม่
          </p>
        </div>

        {message && (
          <div
            role="status"
            className={`mb-5 flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm border ${
              message.type === 'success'
                ? 'bg-[#e9eff7] text-[#1e3a6e] border-[#d6e0ee]'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-[#2f5597]' : 'bg-red-500'}`} />
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* ซ้าย: รายชื่อผู้ป่วย */}
          <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-slate-900">ผู้ป่วยในความดูแล</h2>
                {!loading && <span className="text-xs text-slate-400">{patients.length} ราย</span>}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon d={icons.search} />
                </span>
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อ หรือเบอร์โทรศัพท์"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>

            <div className="lg:max-h-[calc(100vh-22rem)] lg:min-h-[320px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-14 text-sm text-slate-400">กำลังโหลดข้อมูลผู้ป่วย...</div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-14 px-6 text-sm text-slate-400">ไม่พบรายชื่อผู้ป่วยในความดูแลของท่าน</div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => {
                    const active = selectedPatient?.id === patient.id;
                    return (
                      <li key={patient.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(patient)}
                          className={`relative w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors cursor-pointer ${
                            active ? 'bg-[#f1f5fb]' : 'hover:bg-slate-50'
                          }`}
                        >
                          {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2f5597]" />}
                          <div
                            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              active ? 'bg-[#2f5597] text-white' : 'bg-[#e9eff7] text-[#2f5597]'
                            }`}
                          >
                            {patient.firstName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900 truncate">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500 truncate">
                              USR-{patient.id} {patient.medicalRecords?.length ? `· ประวัติ ${patient.medicalRecords.length} ครั้ง` : ''}
                            </div>
                          </div>
                          <span className={active ? 'text-[#2f5597]' : 'text-slate-300'}>
                            <Icon d={icons.chevron} />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* ขวา: รายละเอียดและประวัติการรักษา */}
          <section ref={panelRef} className="lg:col-span-3 space-y-6">
            {!selectedPatient ? (
              <EmptyPatientSelection />
            ) : (
              <>
                {/* ข้อมูลทั่วไปผู้ป่วย */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-14 h-14 rounded-full bg-[#2f5597] text-white flex items-center justify-center text-xl font-semibold">
                      {selectedPatient.firstName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-[#1e3a6e] truncate">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h2>
                      <p className="text-xs text-slate-500">รหัสผู้ป่วย USR-{selectedPatient.id}</p>
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                      <dt className="text-xs text-slate-500">เพศ</dt>
                      <dd className="mt-0.5 font-medium text-slate-900">{genderLabel(selectedPatient.gender)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">เบอร์โทรศัพท์</dt>
                      <dd className="mt-0.5 font-medium text-slate-900">{selectedPatient.phone || '-'}</dd>
                    </div>
                  </dl>
                </div>

                {/* ฟอร์มบันทึกเวชระเบียนใหม่ หรือแก้ไขข้อมูลเดิม */}
                <div ref={formRef} className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#e9eff7] text-[#2f5597] flex items-center justify-center">
                        <Icon d={editingRecordId ? icons.edit : icons.plus} />
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {editingRecordId ? 'แก้ไขบันทึกเวชระเบียนเดิม' : 'บันทึกเวชระเบียนครั้งใหม่'}
                      </h3>
                    </div>
                    {editingRecordId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-xs font-medium text-slate-500 hover:text-[#2f5597] transition-colors cursor-pointer"
                      >
                        ยกเลิกการแก้ไข
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitRecord} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">ผลการวินิจฉัยโรค (Diagnosis)</label>
                      <input
                        type="text"
                        value={diagnosisText}
                        onChange={(e) => setDiagnosisText(e.target.value)}
                        placeholder="ระบุผลการวินิจฉัยโรค..."
                        className={inputCls}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">คำสั่งการรักษา / สั่งจ่ายยา (Prescription)</label>
                      <textarea
                        rows={3}
                        value={prescriptionText}
                        onChange={(e) => setPrescriptionText(e.target.value)}
                        placeholder="ระบุรายการยาหรือคำแนะนำ..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-lg bg-[#2f5597] hover:bg-[#274a85] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {saving ? 'กำลังบันทึก...' : editingRecordId ? 'บันทึกการแก้ไข' : 'บันทึกเวชระเบียนใหม่'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* ประวัติการรักษาเดิมย้อนหลัง */}
                <MedicalHistoryList
                  records={selectedPatient.medicalRecords}
                  editingRecordId={editingRecordId}
                  onStartEdit={handleStartEdit}
                />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}