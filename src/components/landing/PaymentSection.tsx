import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BANK_DETAILS } from "@/data/mockData";

export default function PaymentSection() {
  const [copied, setCopied] = useState("");

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <section id="payment-section" className="py-16 md:py-20 bg-emerald-900 text-white relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-white/5 rotate-12 transform origin-top-right"></div>
      </div>
      
      <div className="container px-4 mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Thông Tin Đóng Góp</h2>
          <p className="text-emerald-100 text-sm md:text-base">Quét mã QR hoặc chuyển khoản thủ công theo thông tin bên dưới.</p>
        </div>

        <div className="bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-5/12 bg-gray-50 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-4">
              <img src={BANK_DETAILS.qrCodeUrl} alt="QR Code" className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-xl" />
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
              <p className="font-bold text-lg md:text-xl uppercase">{BANK_DETAILS.accountName}</p>
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
              <p className="text-sm text-yellow-800 font-semibold mb-2">Nội dung chuyển khoản:</p>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white border border-yellow-200 px-3 py-2 rounded-lg gap-2 sm:gap-0">
                <code className="font-bold text-gray-800 text-base md:text-lg">{BANK_DETAILS.transferSyntax}</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100 font-semibold"
                  onClick={() => handleCopy(BANK_DETAILS.transferSyntax, "syntax")}
                >
                  {copied === "syntax" ? "Đã copy!" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
