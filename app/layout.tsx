import '../src/index.css';
import { Inter } from 'next/font/google';
import { DonationProvider } from '../src/contexts/DonationContext';

const inter = Inter({ subsets: ['latin'] });

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <DonationProvider>
          {children}
        </DonationProvider>
      </body>
    </html>
  );
}
