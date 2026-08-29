import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'بازار طلا | قیمت لحظه‌ای طلا و سکه',
  description: 'داشبورد لحظه‌ای طلا، سکه، دلار و اونس با تحلیل هوشمند',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}