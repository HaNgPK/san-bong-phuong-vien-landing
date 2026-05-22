"use client";

import { useState, useEffect, useRef } from "react";
import { X, Calendar, Hash, Quote, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation?: {
    name: string;
    amount: number;
    message?: string;
    date?: string;
    category?: string;
    id?: string | number;
  } | null;
  initialName?: string;
  initialAmount?: number;
}

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  donation,
  initialName = "",
  initialAmount = 500000 
}: CertificateModalProps) {
  
  const displayName = donation?.name || initialName || "Mạnh Thường Quân";
  const displayAmount = donation?.amount || initialAmount || 0;
  const displayMessage = donation?.message || "";
  const displayDate = donation?.date || new Date().toLocaleDateString("vi-VN");
  const displayCategory = donation?.category || "Cá nhân";
  const displayId = donation?.id || "202605";

  // Helper function to render customized premium badges for the 3 categories
  const getCategoryBadgeStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("doanh nghiệp") || cat.includes("công ty")) {
      return {
        className: "bg-gradient-to-r from-[#881337] via-[#b91c1c] to-[#881337] text-yellow-100 border-[#c5a85c] shadow-sm",
        label: "Nhà Tài Trợ Doanh Nghiệp"
      };
    } else if (cat.includes("đội bóng") || cat.includes("tập thể") || cat.includes("clb") || cat.includes("team") || cat.includes("câu lạc bộ")) {
      return {
        className: "bg-gradient-to-r from-[#b3882f] via-[#fff5cc] to-[#b3882f] text-[#032b1a] border-[#c5a85c] shadow-sm",
        label: "Nhà Tài Trợ Đội Bóng"
      };
    } else {
      return {
        className: "bg-gradient-to-r from-[#047857] via-[#10b981] to-[#047857] text-white border-[#c5a85c] shadow-sm",
        label: "Nhà Tài Trợ Cá Nhân"
      };
    }
  };

  const badgeStyles = getCategoryBadgeStyles(displayCategory);

  const [animate, setAnimate] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300">
      
      {/* Tối ưu hóa CSS để tạo hiệu ứng giấy da Canvas kết hợp lưới kỹ thuật chìm và khung viền hoàng gia nổi khối */}
      <style>{`
        .font-cinzel {
          font-family: var(--font-playfair), 'Playfair Display', serif;
        }
        .font-cormorant {
          font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
        }
        .parchment-bg {
          background-color: #faf7ed;
          background-image: 
            radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(250, 246, 232, 0.97) 55%, rgba(236, 230, 204, 0.99) 100%),
            linear-gradient(to right, rgba(197, 168, 92, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(197, 168, 92, 0.04) 1px, transparent 1px),
            repeating-linear-gradient(45deg, rgba(197, 168, 92, 0.015) 0px, rgba(197, 168, 92, 0.015) 1px, transparent 1px, transparent 10px);
          background-size: auto, 24px 24px, 24px 24px, auto;
        }
        .royal-emerald-frame {
          border: 7px solid #032b1a;
          box-shadow: 
            0 15px 45px rgba(0, 0, 0, 0.45),
            inset 0 0 35px rgba(197, 168, 92, 0.35);
        }
        .inner-gold-frame {
          border: 3px double #c5a85c;
        }
        .signature-sharp {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          filter: drop-shadow(0.5px 0.5px 0px rgba(0, 50, 150, 0.25)) contrast(1.4) saturate(1.3) brightness(0.94);
        }
      `}</style>

      {/* Nút đóng góc màn hình */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
        title="Đóng"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container - Tăng kích thước rộng tối đa từ 440px lên 480px để rõ ràng và hoành tráng */}
      <div 
        className={`flex flex-col items-center justify-center max-w-[480px] w-full transition-all duration-500 ease-out transform ${
          animate ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        
        {/* THẺ VINH DANH HOÀNG GIA IVORY (Tỷ lệ 9:16 chuẩn chỉnh, tăng padding) */}
        <div 
          ref={cardRef}
          className="relative overflow-hidden w-full aspect-[9/16.2] rounded-[32px] parchment-bg royal-emerald-frame flex flex-col justify-between p-6 sm:p-9 text-center text-slate-800 select-none"
        >
          {/* Logo CLB Bóng đá Phương Viên ở góc trên bên trái */}
          <div className="absolute top-[26px] left-[26px] w-[52px] h-[52px] rounded-full bg-white border-[2px] border-[#c5a85c] shadow-[0_3px_8px_rgba(0,0,0,0.12)] p-0.5 z-20 flex items-center justify-center">
            <img 
              src="/images/phuong_vien_fc.png" 
              alt="Logo CLB Phương Viên" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Logo Đoàn Thanh Niên ở góc trên bên phải */}
          <div className="absolute top-[26px] right-[26px] w-[52px] h-[52px] rounded-full bg-white border-[2px] border-[#c5a85c] shadow-[0_3px_8px_rgba(0,0,0,0.12)] p-0.5 z-20 flex items-center justify-center">
            <img 
              src="/images/doan_thanh_nien.png" 
              alt="Logo Đoàn Thanh Niên" 
              className="w-full h-full object-contain"
            />
          </div>
          <svg className="absolute bottom-[18px] left-[18px] w-11 h-11 text-[#c5a85c]/95 scale-y-[-1]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M 10 50 L 10 10 L 50 10 M 10 10 L 35 35 M 10 25 L 25 10 M 15 15 C 20 20, 20 25, 25 25 C 25 20, 20 20, 15 15 Z M 10 40 C 13 40, 15 37, 15 35 M 40 10 C 40 13, 37 15, 35 15" />
            <circle cx="10" cy="10" r="3.5" fill="currentColor" />
            <circle cx="50" cy="10" r="2.5" fill="currentColor" />
            <circle cx="10" cy="50" r="2.5" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-[18px] right-[18px] w-11 h-11 text-[#c5a85c]/95 scale-x-[-1] scale-y-[-1]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M 10 50 L 10 10 L 50 10 M 10 10 L 35 35 M 10 25 L 25 10 M 15 15 C 20 20, 20 25, 25 25 C 25 20, 20 20, 15 15 Z M 10 40 C 13 40, 15 37, 15 35 M 40 10 C 40 13, 37 15, 35 15" />
            <circle cx="10" cy="10" r="3.5" fill="currentColor" />
            <circle cx="50" cy="10" r="2.5" fill="currentColor" />
            <circle cx="10" cy="50" r="2.5" fill="currentColor" />
          </svg>
          
          {/* Đường viền chỉ vàng kép hoàng gia chạy phía trong */}
          <div className="absolute inset-[10px] inner-gold-frame rounded-[22px] pointer-events-none"></div>
          {/* Đường chỉ xanh ngọc lục bảo sắc nét sát sườn */}
          <div className="absolute inset-4 border-2 border-[#032b1a]/15 rounded-[18px] pointer-events-none"></div>

          {/* BACKGROUND SÂN BÓNG BLUEPRINT CHI TIẾT KỸ THUẬT */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 p-10">
            <svg className="w-full h-full text-[#c5a85c]" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.14">
              {/* Biên ngoài */}
              <rect x="5" y="5" width="90" height="140" rx="2" />
              {/* Vạch giữa sân và vạch sút phạt */}
              <line x1="5" y1="75" x2="95" y2="75" />
              <circle cx="50" cy="75" r="18" />
              <circle cx="50" cy="75" r="1.8" fill="currentColor" fillOpacity="0.15" />
              {/* Cấm địa trên */}
              <rect x="22" y="5" width="56" height="24" />
              <rect x="35" y="5" width="30" height="8" />
              <circle cx="50" cy="18" r="1" fill="currentColor" fillOpacity="0.15" />
              <path d="M 38,29 A 15,15 0 0 0 62,29" />
              
              {/* Cấm địa dưới */}
              <rect x="22" y="121" width="56" height="24" />
              <rect x="35" y="137" width="30" height="8" />
              <circle cx="50" cy="132" r="1" fill="currentColor" fillOpacity="0.15" />
              <path d="M 38,121 A 15,15 0 0 1 62,121" />
              
              {/* Cung phạt góc */}
              <path d="M 5,9 A 4,4 0 0 0 9,5" />
              <path d="M 95,9 A 4,4 0 0 1 91,5" />
              <path d="M 5,141 A 4,4 0 0 1 9,145" />
              <path d="M 95,141 A 4,4 0 0 0 91,145" />
            </svg>
          </div>

          {/* 1. TOP HEADER SECTION */}
          <div className="relative z-10 flex flex-col items-center pt-3">
            <div className="relative mb-3 flex items-center justify-center">
              {/* Cành nguyệt quế vàng và ngôi sao trung tâm sang trọng */}
              <div className="relative z-10 flex items-center justify-center">
                <svg className="w-20 h-16 text-[#c5a85c]" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {/* Cành nguyệt quế trái */}
                  <path d="M 35 48 C 22 45, 12 35, 15 20 C 16 15, 20 10, 25 8" strokeWidth="2.5" />
                  {/* Lá nguyệt quế trái */}
                  <path d="M 33 46 C 28 43, 27 38, 30 36 C 33 34, 35 39, 33 46 Z" fill="currentColor" />
                  <path d="M 25 40 C 19 36, 18 31, 22 29 C 26 27, 27 32, 25 40 Z" fill="currentColor" />
                  <path d="M 18 31 C 12 28, 11 22, 16 20 C 21 18, 21 24, 18 31 Z" fill="currentColor" />
                  <path d="M 16 20 C 12 16, 13 10, 18 9 C 23 8, 22 14, 16 20 Z" fill="currentColor" />
                  <path d="M 21 12 C 18 7, 21 2, 26 3 C 31 4, 27 9, 21 12 Z" fill="currentColor" />

                  {/* Cành nguyệt quế phải */}
                  <path d="M 65 48 C 78 45, 88 35, 85 20 C 84 15, 80 10, 75 8" strokeWidth="2.5" />
                  {/* Lá nguyệt quế phải */}
                  <path d="M 67 46 C 72 43, 73 38, 70 36 C 67 34, 65 39, 67 46 Z" fill="currentColor" />
                  <path d="M 75 40 C 81 36, 82 31, 78 29 C 74 27, 73 32, 75 40 Z" fill="currentColor" />
                  <path d="M 82 31 C 88 28, 89 22, 84 20 C 79 18, 79 24, 82 31 Z" fill="currentColor" />
                  <path d="M 84 20 C 88 16, 87 10, 82 9 C 77 8, 78 14, 84 20 Z" fill="currentColor" />
                  <path d="M 79 12 C 82 7, 79 2, 74 3 C 69 4, 73 9, 79 12 Z" fill="currentColor" />

                  {/* Ngôi sao vàng phát sáng ở giữa */}
                  <polygon points="50,13 53,20 61,21 55,26 57,33 50,29 43,33 45,26 39,21 47,20" fill="currentColor" />
                  {/* Hạt cườm tinh tế */}
                  <circle cx="50" cy="40" r="1.5" fill="currentColor" />
                  <circle cx="44" cy="42" r="1" fill="currentColor" />
                  <circle cx="56" cy="42" r="1" fill="currentColor" />
                </svg>
              </div>
            </div>
            
            <h4 className="text-[11px] sm:text-[12.5px] font-black tracking-[0.3em] text-[#9c7a2b] uppercase mb-1 font-sans">
              Bảng Vàng Danh Dự
            </h4>
            <h2 className="text-2xl sm:text-[26px] font-black tracking-wide uppercase font-sans text-[#032b1a] leading-tight drop-shadow-[0_0.5px_1px_rgba(255,255,255,0.9)]">
              Tri Ân Tấm Lòng Vàng
            </h2>
            
            {/* Họa tiết phân cách vàng nhã nhặn kèm ngôi sao vàng chính giữa */}
            <div className="flex items-center gap-2 mt-2 w-32 justify-center">
              <div className="h-[1.5px] bg-gradient-to-r from-transparent to-[#c5a85c] flex-1"></div>
              <svg className="w-3.5 h-3.5 text-[#c5a85c]" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
              </svg>
              <div className="h-[1.5px] bg-gradient-to-l from-transparent to-[#c5a85c] flex-1"></div>
            </div>
          </div>

          {/* 2. MIDDLE CONTENT SECTION - Đầy đặn, các thẻ lớn hơn và rõ ràng */}
          <div className="relative z-10 flex flex-col justify-center my-auto px-1 gap-3.5">
            <p className="text-[#3b5446] text-xs sm:text-[14px] font-bold italic tracking-wide">
              Ban Quản lý Sân bóng Phương Viên trân trọng vinh danh và tri ân:
            </p>
            
            {/* TÊN NGƯỜI ĐÓNG GÓP - Tải bằng Font Serif Playfair Display cực kỳ rõ nét, uy nghiêm */}
            <div className="px-1 py-0.5">
              <h1 className="text-2.5xl sm:text-[34px] font-black tracking-wide text-[#991b1b] uppercase font-cinzel leading-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                {displayName}
              </h1>
              
              {/* Dải chỉ họa tiết hoa văn dưới tên nhà tài trợ */}
              <div className="flex items-center justify-center gap-1.5 mt-2 text-[#c5a85c]/85">
                <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#c5a85c]"></span>
                <span className="text-[8px]">✦</span>
                <span className="text-[12px]">★</span>
                <span className="text-[8px]">✦</span>
                <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#c5a85c]"></span>
              </div>
            </div>

            {/* NHÃN PHÂN LOẠI BADGE */}
            <div className="flex justify-center">
              <span className={`px-5 py-1 text-[10px] sm:text-[11px] font-black rounded-full tracking-widest uppercase border ${badgeStyles.className}`}>
                {badgeStyles.label}
              </span>
            </div>

            {/* KHỐI SỐ TIỀN ỦNG HỘ - Thiết kế lớn hơn, font không chân rõ ràng và uy nghiêm */}
            <div className="relative px-6 py-5 rounded-2xl bg-gradient-to-b from-[#c5a85c]/14 to-[#c5a85c]/6 border-2 border-double border-[#c5a85c] shadow-[0_5px_18px_rgba(197,168,92,0.14),inset_0_1px_1px_rgba(255,255,255,0.8)] max-w-[360px] mx-auto w-full flex flex-col items-center justify-center">
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#8c6d26] tracking-widest uppercase mb-1">
                Số Tiền Ủng Hộ
              </span>
              <h3 className="text-3xl sm:text-[36px] font-black tracking-wide font-sans text-[#15803d] leading-none drop-shadow-[0_1.5px_2px_rgba(255,255,255,0.95)]">
                +{formatCurrency(displayAmount)}
              </h3>
            </div>

            {/* HỘP LỜI TRI ÂN CỦA BÀ CON LÀNG PHƯƠNG VIÊN */}
            <div className="relative px-[22px] py-4 rounded-xl bg-[#faf6ed]/70 border border-[#c5a85c]/35 max-w-[360px] mx-auto w-full min-h-[76px] flex flex-col justify-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.03)] backdrop-blur-xs">
              <Quote className="absolute -top-2.5 -left-1 w-[22px] h-[22px] text-[#c5a85c]/45 rotate-180" />
              <p className="text-xs sm:text-[14px] text-[#2c3e35] leading-relaxed font-semibold italic font-cormorant px-1.5">
                {displayMessage ? `"${displayMessage}"` : `"Bà con nhân dân làng Phương Viên xin gửi lời cảm ơn chân thành và sâu sắc nhất đến Quý Mạnh Thường Quân đã chung sức đồng lòng, tài trợ kinh phí xây dựng Sân cỏ nhân tạo quê hương!"`}
              </p>
              <Quote className="absolute -bottom-2.5 -right-1 w-[22px] h-[22px] text-[#c5a85c]/45" />
            </div>
          </div>

          {/* 3. FOOTER SECTION - Bố cục đối xứng hai bên cực kỳ gọn gàng và thoáng đãng */}
          <div className="relative z-10 border-t border-[#c5a85c]/35 pt-5 flex items-end justify-between px-2">
            {/* Thông tin mã vinh danh */}
            <div className="text-left flex flex-col gap-1 shrink-0 pb-1.5">
              <p className="text-[11px] font-black text-[#032b1a] tracking-widest uppercase font-cinzel">
                BQL SÂN BÓNG
              </p>
              
              <div className="flex items-center gap-1.5 text-[9px] text-[#5c7063] font-semibold">
                <Hash className="w-2.5 h-2.5 text-[#c5a85c]" />
                <span>Mã số: PV-{displayId}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[9px] text-[#5c7063] font-semibold">
                <Calendar className="w-2.5 h-2.5 text-[#c5a85c]" />
                <span>Ngày: {displayDate}</span>
              </div>
            </div>

            {/* CHỮ KÝ THẬT TÁCH NỀN CHÍNH XÁC & DẤU ĐỎ HÌNH CHỮ NHẬT CLB BÓNG ĐÁ PHƯƠNG VIÊN */}
            <div className="flex flex-col items-center justify-center relative shrink-0">
              <p className="text-[8.5px] font-black text-[#5c7063] uppercase tracking-wider mb-1">
                Chủ nhiệm CLB
              </p>
              
              {/* Chữ ký tách nền PNG được làm đậm nét và sắc sảo */}
              <div className="relative h-12 w-28 flex items-center justify-center my-0.5">
                <img 
                  src="/images/signature.png" 
                  alt="Chữ ký Chủ nhiệm" 
                  className="h-12 w-auto object-contain z-10 signature-sharp" 
                />
                
                {/* Dấu đỏ CLB đặt ở z-0 dưới chữ ký z-10 để chữ ký đè lên dấu cực kỳ chân thực, dịch trái để không đè chữ */}
                <div className="absolute -left-9 top-[-4px] border-2 border-[#b91c1c]/80 text-[#b91c1c]/80 px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider -rotate-12 rounded-[1.5px] select-none pointer-events-none bg-[#faf6ed]/30 backdrop-blur-[0.2px] z-0 opacity-85">
                  <div className="text-[6.5px] leading-tight text-center font-bold">CLB BÓNG ĐÁ</div>
                  <div className="text-[8.5px] leading-none text-center font-extrabold tracking-widest mt-0.5">PHƯƠNG VIÊN</div>
                </div>
              </div>
              
              <p className="text-[9.5px] font-black text-[#032b1a] uppercase font-sans tracking-wide mt-1 leading-none">
                Nguyễn Phạm Khắc Hà
              </p>
              <p className="text-[6.5px] sm:text-[7px] font-bold text-[#5c7063] uppercase tracking-wider mt-1 text-center leading-normal max-w-[150px]">
                Bí thư Đoàn Phương Viên 4 <br />
                UV BTV BCH Đoàn Xã Sơn Đồng
              </p>
            </div>
          </div>

        </div>

        {/* Hướng dẫn thao tác và nút đóng chính (Nằm ngoài thẻ vinh danh để ảnh chụp được sạch đẹp) */}
        <div className="mt-4 flex flex-col items-center gap-3 w-full">
          <div className="flex items-center gap-2 text-white/90 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-center shadow-lg backdrop-blur-md">
            <Camera className="w-[18px] h-[18px] text-[#ffeb3b] animate-bounce shrink-0" />
            <span>Mẹo: Hãy chụp màn hình (Screenshot) để lưu bằng vinh danh tuyệt đẹp này!</span>
          </div>

          <Button 
            onClick={onClose}
            className="w-full bg-[#032b1a] hover:bg-[#021f13] text-[#faf6ed] border border-[#c5a85c]/45 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 font-cinzel text-xs tracking-wider shadow-md"
          >
            Quay lại Danh sách Sao kê
          </Button>
        </div>

      </div>
    </div>
  );
}
