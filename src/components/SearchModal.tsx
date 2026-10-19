'use client';

import { useState, useEffect } from 'react';
import { Search, X, User, Stethoscope, Package, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface SearchResult {
  type: 'doctor' | 'service' | 'package' | 'page';
  title: string;
  subtitle?: string;
  url: string;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce ค้นหาหลังจากหยุดพิมพ์ 300ms

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // เลือกแสดงไอคอนตามประเภทของผลลัพธ์
  const renderIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'doctor':
        return <User className="w-4 h-4 text-emerald-600" />;
      case 'service':
        return <Stethoscope className="w-4 h-4 text-sky-600" />;
      case 'package':
        return <Package className="w-4 h-4 text-indigo-600" />;
      case 'page':
      default:
        return <FileText className="w-4 h-4 text-[#1a2b6d]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Input Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="ค้นหาแพทย์, ศูนย์บริการ, แพ็กเกจตรวจสุขภาพ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-sm md:text-base outline-none text-slate-800 placeholder-slate-400"
          />
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {loading && <p className="text-xs text-center py-6 text-slate-400">กำลังค้นหา...</p>}

          {!loading && query && results.length === 0 && (
            <p className="text-xs text-center py-6 text-slate-400">ไม่พบผลลัพธ์สำหรับ "{query}"</p>
          )}

          {!loading && results.map((item, idx) => (
            <Link
              key={idx}
              href={item.url}
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                {renderIcon(item.type)}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                {item.subtitle && <p className="text-xs text-slate-500">{item.subtitle}</p>}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}