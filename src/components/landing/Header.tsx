"use client";

import { Facebook } from "lucide-react";

export default function Header() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-emerald-950/90 backdrop-blur-md">
      <div className="container px-4 mx-auto flex h-16 items-center justify-between">
        {/* Left Side: Brand/Logo */}
        <button onClick={scrollToTop} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left">
          {/* Logo Đoàn Thanh Niên chính thống */}
          <div className="bg-white rounded-full p-0.5 w-9 h-9 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.15)] shrink-0">
            <img 
              src="/images/doan_thanh_nien.png" 
              alt="Logo Đoàn Thanh Niên" 
              className="w-[88%] h-[88%] object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-base md:text-lg uppercase tracking-wide leading-none">
              Đoàn Thanh Niên
            </span>
            <span className="text-emerald-400 font-semibold text-xs md:text-sm uppercase tracking-widest leading-none mt-1">
              Phương Viên
            </span>
          </div>
        </button>

        {/* Right Side: Social Link */}
        <div className="flex items-center">
          <a
            href="https://www.facebook.com/doanthanhnienphuongvien"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-sm hover:shadow-md"
            title="Đến trang Facebook của Đoàn Thanh Niên"
          >
            <Facebook className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            <span className="hidden sm:inline text-sm">Theo dõi Facebook</span>
          </a>
        </div>
      </div>
    </header>
  );
}
