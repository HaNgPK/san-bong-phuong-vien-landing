import { useState } from "react";
import { Copy, CheckCircle2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BANK_DETAILS } from "@/data/mockData";

export default function PaymentSection() {
  const [copied, setCopied] = useState("");
  const [transferMessage, setTransferMessage] = useState(BANK_DETAILS.transferSyntax);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  }

  // Generate dynamic QR URL based on the user's input message
  const dynamicQrUrl = `https://img.vietqr.io/image/techcombank-${BANK_DETAILS.accountNumber}-compact2.jpg?accountName=${encodeURIComponent(BANK_DETAILS.accountName)}&amount=0&addInfo=${encodeURIComponent(transferMessage)}`;

  return (
    <section id="payment-section" className="py-16 md:py-20 bg-emerald-900 text-white relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-white/5 rotate-12 transform origin-top-right"></div>
      </div>
      
      <div className="container px-4 mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Thông Tin Đóng Góp</h2>
          <p className="text-emerald-100 text-sm md:text-base">Quét mã QR hoặc chuyển khoản thủ công theo thông tin bên dưới.</p>
          <div className="mt-6 inline-block bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-lg md:text-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] border-2 border-red-400 transform hover:scale-105 transition-transform cursor-default animate-pulse">
            ⚠️ CHÚ Ý: ĐANG TRONG THỜI GIAN PHÁT TRIỂN DỰ ÁN ⚠️
          </div>
        </div>

        <div className="bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-5/12 bg-gray-50 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
            <div className="bg-white p-2 md:p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
              <img src={dynamicQrUrl} alt="QR Code" className="w-48 md:w-56 h-auto object-contain rounded-xl" />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase">Quét mã VietQR</p>
          </div>

          <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-center space-y-5 md:space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngân hàng</p>
              <p className="font-bold text-lg md:text-xl">{BANK_DETAILS.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Chủ tài khoản</p>
              <p className="font-bold text-lg md:text-xl uppercase text-emerald-800">{BANK_DETAILS.accountName}</p>
              <div className="mt-2 flex flex-col text-sm text-gray-600 font-medium space-y-1">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> UV BTV BCH Đoàn Xã Sơn Đồng
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Chủ Nhiệm CLB bóng đá Phương Viên
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Số tài khoản</p>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">
                <p className="font-black text-2xl md:text-3xl text-emerald-600 tracking-wider">
                  {BANK_DETAILS.accountNumber}
                </p>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="shrink-0 h-9 w-9 border-gray-200 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
                  onClick={() => handleCopy(BANK_DETAILS.accountNumber, "stk")}
                >
                  {copied === "stk" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm text-yellow-800 font-semibold">Nội dung chuyển khoản (có thể sửa):</p>
                <Edit3 className="w-3 h-3 text-yellow-600" />
              </div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white border border-yellow-300 px-3 py-2 rounded-lg gap-2 sm:gap-2 focus-within:ring-2 focus-within:ring-yellow-400 transition-all">
                <input 
                  type="text" 
                  value={transferMessage}
                  onChange={(e) => setTransferMessage(e.target.value)}
                  className="font-bold text-gray-800 text-base md:text-lg bg-transparent border-none outline-none w-full"
                  placeholder="Nhập nội dung..."
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100 font-semibold shrink-0"
                  onClick={() => handleCopy(transferMessage, "syntax")}
                >
                  {copied === "syntax" ? "Đã copy!" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-yellow-600 mt-2 italic">Mã QR sẽ tự động cập nhật theo nội dung bạn nhập.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
