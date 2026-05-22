import '../src/index.css';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import { DonationProvider } from '../src/contexts/DonationContext';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  weight: ['600', '700', '800', '900'],
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-cormorant',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata = {
  title: 'Sân Bóng Phương Viên - Kiến tạo tương lai',
  description: 'Chiến dịch chung tay gây quỹ xây dựng sân cỏ nhân tạo cho làng Phương Viên. Một hành động nhỏ, tạo ra thay đổi lớn cho cả thế hệ.',
  keywords: 'sân bóng Phương Viên, gây quỹ sân bóng, từ thiện, Phương Viên, cỏ nhân tạo',
  openGraph: {
    title: 'Chiến dịch xây dựng Sân Bóng Phương Viên',
    description: 'Chỉ với 280.000đ để phủ xanh 1 mét vuông sân bóng. Cùng chung tay mang lại sân chơi khang trang cho thanh niên làng!',
    url: 'https://sanbongphuongvien.com',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518605368461-1e1e38cd3543?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Sân bóng Phương Viên',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chiến dịch xây dựng Sân Bóng Phương Viên',
    description: 'Chỉ với 280.000đ để phủ xanh 1 mét vuông sân bóng. Cùng chung tay mang lại sân chơi khang trang cho thanh niên làng!',
    images: ['https://images.unsplash.com/photo-1518605368461-1e1e38cd3543?q=80&w=1200&auto=format&fit=crop'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const revalidate = 300; // 5 phút cập nhật tĩnh một lần trên Vercel

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1yHmRSx16zLBLQubtJ4RYhhfxixfetLIMsUcA-97kkjQ/export?format=csv";
  let initialCsvText = "";
  
  try {
    // Gọi API trên Server (Vercel) với cơ chế cache 5 phút
    const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 300 } });
    if (res.ok) {
      initialCsvText = await res.text();
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu SSR:", error);
  }

  return (
    <html lang="vi" className={`${playfair.variable} ${cormorant.variable}`}>
      <body className={inter.className}>
        <DonationProvider initialCsvText={initialCsvText}>
          {children}
        </DonationProvider>
      </body>
    </html>
  );
}
