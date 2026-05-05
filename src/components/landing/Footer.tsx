import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 py-8 text-center border-t border-gray-900">
      <div className="container px-4 mx-auto">
        <Heart className="h-5 w-5 text-emerald-500 mx-auto mb-3" />
        <p className="mb-4 font-medium text-gray-300">Dự án cộng đồng Sân Bóng Phương Viên</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-6 text-gray-400">
          <a href="#" className="hover:text-emerald-400 transition-colors">Về chúng tôi</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Báo cáo tài chính</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Liên hệ BQL</a>
        </div>
        <p className="text-xs text-gray-600">Built with React & Tailwind CSS.</p>
      </div>
    </footer>
  );
}
