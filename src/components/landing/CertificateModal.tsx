import { useState, useEffect, useRef } from "react";
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
    
    setTimeout(updateScale, 50);
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [ratio, isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#064e3b",
        logging: false,
        onclone: (clonedDoc) => {
          const scaler = clonedDoc.getElementById('certificate-scaler');
          if (scaler) {
            scaler.style.transform = 'scale(1)';
          }
        }
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
          
          {/* Certificate Scaler Wrapper */}
          <div 
            id="certificate-scaler"
            style={{ 
              width: RATIOS[ratio].width, 
              height: RATIOS[ratio].height,
              minWidth: RATIOS[ratio].width,
              minHeight: RATIOS[ratio].height,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'all 0.3s ease-out'
            }}
            className="flex items-center justify-center relative shrink-0"
          >
            {/* The Actual Certificate */}
            <div 
              ref={certificateRef}
              className="w-full h-full shrink-0 relative bg-[#064e3b] p-3 flex flex-col justify-center items-center"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <div className="w-full h-full bg-white relative flex flex-col justify-center items-center border-[6px] border-double border-[#d4af37] overflow-hidden">
                
                {/* Sports Background Pattern (Subtle Soccer Field elements) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                  {/* Center Circle */}
                  <div className="absolute w-[40%] aspect-square rounded-full border-[8px] border-emerald-900"></div>
                  {/* Center Line */}
                  <div className="absolute w-[8px] h-full bg-emerald-900 left-1/2 -translate-x-1/2"></div>
                  {/* Penalty Box Left */}
                  <div className="absolute left-0 w-[15%] h-[40%] border-y-[8px] border-r-[8px] border-emerald-900"></div>
                  {/* Penalty Box Right */}
                  <div className="absolute right-0 w-[15%] h-[40%] border-y-[8px] border-l-[8px] border-emerald-900"></div>
                </div>

                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-10 py-4 text-center">
                  
                  <div className="flex flex-col items-center mb-2">
                    <Medal className="w-12 h-12 text-[#d4af37] mb-2" strokeWidth={1.5} />
                    <h1 className="text-4xl font-black text-emerald-900 uppercase mb-0 tracking-normal">
                      Bằng Ghi Nhận
                    </h1>
                    <div className="w-32 h-[2px] bg-[#d4af37] mt-3 mb-2"></div>
                    <p className="text-sm font-bold text-[#d4af37] uppercase tracking-widest mt-1">
                      Tấm Lòng Vàng
                    </p>
                  </div>

                  <div className="flex flex-col items-center w-full max-w-lg mt-4 mb-3">
                    <p className="text-gray-600 mb-1 italic text-base">Trân trọng cảm ơn</p>
                    
                    <h2 className={`font-black text-emerald-900 uppercase ${name.length > 20 ? 'text-2xl' : 'text-3xl'} px-6 py-2 border-b-2 border-[#d4af37]/30 w-full`}>
                      {name || "Tên Người Ủng Hộ"}
                    </h2>
                  </div>

                  <div className="flex flex-col items-center my-3">
                    <p className="text-gray-700 mb-2 text-sm">Đã chung tay ủng hộ số tiền</p>
                    <p className="text-2xl font-black text-[#d4af37] bg-yellow-50/60 px-8 py-2 rounded-xl border border-[#d4af37]/20 shadow-sm">
                      {Number(amount) > 0 ? formatCurrency(Number(amount)) : "0 VNĐ"}
                    </p>
                  </div>

                  <p className="text-sm text-gray-700 max-w-[85%] mt-4 mb-0 leading-relaxed">
                    Sự đóng góp của Quý vị là nguồn động lực to lớn giúp dự án cải tạo Sân Bóng Phương Viên sớm hoàn thành, 
                    góp phần thúc đẩy phong trào thể dục thể thao và xây dựng một sân chơi lành mạnh cho cộng đồng.
                  </p>

                  {/* Date & Signature block - Hidden per user request */}
                  {/*
                  <div className="absolute bottom-3 right-6 md:bottom-4 md:right-8 flex flex-col items-center bg-white/80 px-2 py-1 rounded">
                    <p className="text-[9px] md:text-[10px] text-gray-600 italic mb-0.5">
                      Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                    </p>
                    <p className="text-[10px] md:text-xs font-bold uppercase text-emerald-900 tracking-wider">
                      Ban Quản Lý Dự Án
                    </p>
                  </div>
                  */}

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
