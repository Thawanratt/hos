import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleProvider from '../components/GoogleProvider'; 

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
        {/* 🟢 ครอบด้วย GoogleProvider เพื่อให้ทุกหน้าเรียกใช้ Google OAuth ได้ */}
        <GoogleProvider>
          <div>
            <Navbar />
            <main>{children}</main>
          </div>
          <Footer />
        </GoogleProvider>
      </body>
    </html>
  );
}