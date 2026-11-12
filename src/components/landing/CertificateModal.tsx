"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CertificateCard from "./CertificateCard";

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
    refunded?: boolean;
    refundDate?: string;
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
  
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Nút back của điện thoại / trình duyệt sẽ đóng popup thay vì rời khỏi trang.
  // Esc cũng đóng popup, và khoá cuộn trang phía sau khi popup đang mở.
  useEffect(() => {
    if (!isOpen) return;
    let closedByBack = false;
    window.history.pushState({ certificateModal: true }, "");
    const onPop = () => {
      closedByBack = true;
      onCloseRef.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Đóng bằng nút X / Quay lại / bấm ra ngoài: bỏ mục lịch sử đã thêm
      if (!closedByBack && window.history.state?.certificateModal) window.history.back();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto px-4 pt-16 pb-6 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      
      {/* Nút đóng góc màn hình - sử dụng fixed để luôn nổi ở góc màn hình khi cuộn */}
      <button 
        onClick={onClose}
        className="fixed top-3 right-3 z-[80] flex items-center gap-1.5 pl-3 pr-3.5 py-2 text-white bg-black/70 hover:bg-black/90 border border-white/40 rounded-full shadow-lg transition-all duration-200 text-sm font-semibold"
        title="Đóng"
        aria-label="Đóng"
      >
        <X className="w-5 h-5" />
        Đóng
      </button>

      {/* Main Container - Tối ưu max-w-[420px] và sử dụng grid place-items-center của cha để căn giữa hoàn hảo */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col items-center justify-center max-w-[420px] w-full transition-all duration-500 ease-out transform ${
          animate ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        
        {/* THẺ VINH DANH HOÀNG GIA IVORY */}
        <CertificateCard 
          donation={donation}
          initialName={initialName}
          initialAmount={initialAmount}
        />

        {/* Hướng dẫn thao tác và nút đóng chính (Nằm ngoài thẻ vinh danh để ảnh chụp được sạch đẹp) */}
        <div className="sticky bottom-0 mt-3 pb-1 flex flex-col items-center gap-3 w-full">
          <Button 
            onClick={onClose}
            className="w-full bg-[#0B3C26] hover:bg-[#072517] text-[#faf6ed] border border-[#D4AF37]/45 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 font-cinzel text-xs tracking-wider shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Danh sách Sao kê
          </Button>
        </div>

      </div>
    </div>
  );
}
