import type { Metadata } from 'next';
import Script from 'next/script';
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

        {/* โหลดสคริปต์ Google Translate */}
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}