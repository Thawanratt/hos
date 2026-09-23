//โครงสร้างหลักของ Layout ของแอปพลิเคชัน React ที่ใช้ TypeScript และ Next.js โดยมีการนำเข้าโมดูลและคอมโพเนนต์ที่จำเป็นสำหรับการสร้าง Layout ของหน้าเว็บ

import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'โรงพยาบาลโนวาเลีย - Novaria Hospital',
  description: 'มาตรฐานการรักษาระดับสากล เพื่อทุกชีวิตที่ไว้วางใจ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col justify-between bg-slate-50">
        <div>
          <Navbar />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}