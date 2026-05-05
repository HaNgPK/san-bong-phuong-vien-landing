import React, { useState, useEffect, useRef } from "react";
import { X, Download, Medal, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { formatCurrency } from "@/lib/format";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialAmount?: number;
}

type Ratio = "16:9" | "4:3" | "9:16" | "1:1";

const RATIOS: Record<Ratio, { label: string; width: number; height: number }> = {
  "16:9": { label: "Ngang (16:9)", width: 800, height: 450 },
  "4:3": { label: "Ngang (4:3)", width: 800, height: 600 },
  "9:16": { label: "Dọc (9:16)", width: 450, height: 800 },
  "1:1": { label: "Vuông (1:1)", width: 640, height: 640 },
};

export default function CertificateModal({ isOpen, onClose, initialName = "", initialAmount = 500000 }: CertificateModalProps) {
  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState<string>(initialAmount.toString());
  const [ratio, setRatio] = useState<Ratio>("16:9");
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(1);
  
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setAmount(initialAmount ? initialAmount.toString() : "500000");
    }
  }, [isOpen, initialName, initialAmount]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && isOpen) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const targetWidth = RATIOS[ratio].width;
        const targetHeight = RATIOS[ratio].height;
        
        // Add 32px padding margin
        const scaleX = (containerWidth - 32) / targetWidth;
        const scaleY = (containerHeight - 32) / targetHeight;
        
        // Use the smaller scale to ensure it fits both width and height, but cap at 1
        setScale(Math.min(scaleX, scaleY, 1));
      }
    };
    
    // Initial calculate and set up resize listener
    // Small timeout to ensure DOM is fully rendered before calculating
    setTimeout(updateScale, 50);
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [ratio, isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    
    // Temporarily reset transform on wrapper if needed, though html2canvas on inner ref usually ignores parent transform
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // High quality
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `chung-nhan-ung-ho-${name || "nha-tai-tro"}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error generating certificate", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative max-h-[95vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 md:bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cột trái: Form nhập liệu */}
        <div className="w-full md:w-1/3 p-6 md:p-8 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-start overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Medal className="text-[#d4af37] w-6 h-6" />
              Tạo Chứng Nhận
            </h3>
            <p className="text-gray-500 text-sm">Tùy chỉnh thông tin và tỉ lệ khung hình để có ảnh chứng nhận đẹp nhất.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên của bạn (hoặc Tập thể)</label>
              <input 
                type="text" 
                placeholder="VD: Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                maxLength={40}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số tiền ủng hộ (VNĐ)</label>
              <input 
                type="number" 
                placeholder="VD: 500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tỉ lệ khung hình (Khuyên dùng 16:9)</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(RATIOS) as Ratio[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setRatio(key)}
                    className={`px-3 py-2 text-sm rounded-lg border flex items-center justify-center gap-2 transition-all ${
                      ratio === key 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {ratio === key ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <ImageIcon className="w-4 h-4 shrink-0" />}
                    {RATIOS[key].label}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={isDownloading || !name.trim()}
              className="w-full py-6 bg-[#d4af37] hover:bg-[#c5a028] text-white rounded-xl font-bold text-lg shadow-lg shadow-yellow-200 transition-all mt-4"
            >
              {isDownloading ? "Đang xử lý..." : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Lưu Ảnh Chứng Nhận
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Cột phải: Preview Chứng nhận */}
        <div ref={containerRef} className="w-full md:w-2/3 h-[400px] md:h-auto bg-gray-200 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            {/* Watermark/Pattern for background */}
          </div>
          
          {/* Certificate Scaler Wrapper */}
          <div 
            style={{ 
              width: RATIOS[ratio].width, 
              height: RATIOS[ratio].height,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'all 0.3s ease-out'
            }}
            className="flex items-center justify-center relative"
          >
            {/* The Actual Certificate */}
            <div 
              ref={certificateRef}
              className="w-full h-full shrink-0 relative bg-white overflow-hidden shadow-2xl border-[12px] border-double border-[#d4af37] flex flex-col justify-center items-center"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f0fdf4\' fill-opacity=\'0.8\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h100v100H0V0zm50 50c-27.614 0-50 22.386-50 50h100c0-27.614-22.386-50-50-50z\'/%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '100px 100px'
              }}
            >
              {/* Inner border */}
              <div className="absolute inset-2 border-2 border-[#d4af37] opacity-40"></div>
              <div className="absolute inset-3 border border-[#d4af37] opacity-20"></div>

              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#166534]"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#166534]"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#166534]"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#166534]"></div>

              {/* Glowing background behind text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/90 blur-3xl rounded-full z-0"></div>

              <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-12 py-8 text-center gap-4">
                
                <div className="flex flex-col items-center mb-2">
                  <Medal className="w-16 h-16 text-[#d4af37] mb-3" strokeWidth={1.5} />
                  <h1 className="text-4xl md:text-5xl font-black text-emerald-900 uppercase mb-1 font-serif">
                    Bằng Ghi Nhận
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2"></div>
                  <p className="text-sm font-bold text-[#d4af37] uppercase mt-3">
                    Tấm Lòng Vàng
                  </p>
                </div>

                <div className="flex flex-col items-center w-full max-w-lg my-2">
                  <p className="text-gray-600 mb-3 italic text-lg font-serif">Trân trọng cảm ơn</p>
                  
                  <h2 className={`font-black text-emerald-900 uppercase ${name.length > 20 ? 'text-2xl' : 'text-4xl'} px-4 py-2 border-b-2 border-[#d4af37]/30 w-full`}>
                    {name || "Tên Người Ủng Hộ"}
                  </h2>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-gray-700 mb-2 font-serif">Đã chung tay ủng hộ số tiền</p>
                  <p className="text-3xl font-black text-[#d4af37] bg-yellow-50/80 px-6 py-2 rounded-xl border border-yellow-200/50 shadow-sm">
                    {Number(amount) > 0 ? formatCurrency(Number(amount)) : "0 VNĐ"}
                  </p>
                </div>

                <p className="text-sm text-gray-600 max-w-[85%] mt-4 leading-relaxed font-medium">
                  Sự đóng góp của Quý vị là nguồn động lực to lớn giúp dự án cải tạo Sân Bóng Phương Viên sớm hoàn thành, 
                  góp phần thúc đẩy phong trào thể dục thể thao và xây dựng một sân chơi lành mạnh cho cộng đồng.
                </p>

                {/* Date & Signature block */}
                <div className="absolute bottom-8 right-12 flex flex-col items-center opacity-80">
                  <p className="text-xs text-gray-500 italic mb-1">
                    Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-gray-600">Ban Quản Lý Dự Án</p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
