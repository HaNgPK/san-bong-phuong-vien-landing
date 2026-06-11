"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-300">
      
      {/* Nút đóng góc màn hình - sử dụng fixed để luôn nổi ở góc màn hình khi cuộn */}
      <button 
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-2.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
        title="Đóng"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container - Tối ưu max-w-[420px] và sử dụng grid place-items-center của cha để căn giữa hoàn hảo */}
      <div 
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
        <div className="mt-4 flex flex-col items-center gap-3 w-full">
          <Button 
            onClick={onClose}
            className="w-full bg-[#0B3C26] hover:bg-[#072517] text-[#faf6ed] border border-[#D4AF37]/45 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 font-cinzel text-xs tracking-wider shadow-md"
          >
            Quay lại Danh sách Sao kê
          </Button>
        </div>

      </div>
    </div>
  );
}
