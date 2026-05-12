import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Edit3, User, MapPin, XCircle, Download, ExternalLink, Loader2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BANK_DETAILS } from "@/data/mockData";

export default function PaymentSection() {
  const [copied, setCopied] = useState("");
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedGroup, setDebouncedGroup] = useState("");
  const [isUpdatingQR, setIsUpdatingQR] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isClearingName, setIsClearingName] = useState(false);
  const [isClearingGroup, setIsClearingGroup] = useState(false);
  
  const [amount, setAmount] = useState<string>("");
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const handleClearName = () => {
    setIsClearingName(true);
    setTimeout(() => {
      setName("");
    }, 350); // Đợi overlay quét qua rồi mới xóa text
    setTimeout(() => {
      setIsClearingName(false);
    }, 600);
  };

  const handleClearGroup = () => {
    setIsClearingGroup(true);
    setTimeout(() => {
      setGroup("");
    }, 350);
    setTimeout(() => {
      setIsClearingGroup(false);
    }, 600);
  };

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    
    setIsUpdatingQR(true);
    const handler = setTimeout(() => {
      setDebouncedName(name);
      setDebouncedGroup(group);
      setTimeout(() => setIsUpdatingQR(false), 400); // Thêm chút thời gian giả lập render ảnh
    }, 1000); // 1s debounce

    return () => clearTimeout(handler);
  }, [name, group]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  }

  const transferMessage = (debouncedName.trim() || debouncedGroup.trim())
    ? `${debouncedName.trim() ? debouncedName.trim().toUpperCase() : "HO TEN"} ${debouncedGroup.trim() ? debouncedGroup.trim().toUpperCase() : "THON"} ung ho san bong`
    : BANK_DETAILS.transferSyntax;

  const displayMessage = (name.trim() || group.trim())
    ? `${name.trim() ? name.trim().toUpperCase() : "HO TEN"} ${group.trim() ? group.trim().toUpperCase() : "THON"} ung ho san bong`
    : BANK_DETAILS.transferSyntax;

  const parsedAmount = parseInt(amount.replace(/\D/g, '')) || 0;
  // Generate dynamic QR URL based on the user's input message
  const dynamicQrUrl = `https://img.vietqr.io/image/techcombank-${BANK_DETAILS.accountNumber}-compact2.jpg?accountName=${encodeURIComponent(BANK_DETAILS.accountName)}&amount=${parsedAmount}&addInfo=${encodeURIComponent(transferMessage)}`;

  const handlePayosPayment = async () => {
    const numAmount = parseInt(amount.replace(/\D/g, ''));
    if (!numAmount || numAmount < 10000) {
      alert("Vui lòng nhập số tiền (tối thiểu 10.000đ) để sử dụng cổng thanh toán tự động.");
      return;
    }
    
    setIsCreatingPayment(true);
    try {
      const response = await fetch('/api/payos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: numAmount,
          description: displayMessage, // Let backend trim to 25 chars
          returnUrl: window.location.href,
          cancelUrl: window.location.href,
        })
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Lỗi: " + (data.error || "Không thể tạo link thanh toán"));
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi kết nối cổng thanh toán.");
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(dynamicQrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_Ung_Ho_San_Bong.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải mã QR:", error);
      window.open(dynamicQrUrl, "_blank");
    }
  };

  return (
    <section id="payment-section" className="py-10 md:py-16 bg-emerald-900 text-white relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-white/5 rotate-12 transform origin-top-right"></div>
      </div>
      
      <div className="container px-4 mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Thông Tin Đóng Góp</h2>
          <p className="text-emerald-100 text-sm md:text-base">Quét mã QR hoặc chuyển khoản thủ công theo thông tin bên dưới.</p>
        </div>

        <div className="bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row">
          <div className="md:w-5/12 bg-gray-50 p-6 md:p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-gray-200">
            <div className="bg-white p-2 md:p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 relative overflow-hidden">
              {isUpdatingQR && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 transition-opacity">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-bold text-emerald-700 mt-2 uppercase tracking-widest animate-pulse">Đang tạo mã...</span>
                </div>
              )}
              <img 
                src={dynamicQrUrl} 
                alt="QR Code" 
                className={`w-48 md:w-56 h-auto object-contain rounded-xl transition-all duration-300 ${isUpdatingQR ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`} 
              />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase">Quét mã VietQR</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 w-full md:w-auto justify-center"
              onClick={handleDownloadQR}
            >
              <Download className="w-4 h-4" />
              Tải mã QR
            </Button>

            <div className="w-full mt-6 flex flex-col items-center">
              <div className="flex items-center gap-2 w-full max-w-[250px] mb-3">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hoặc</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              <button
                onClick={handlePayosPayment}
                disabled={isCreatingPayment}
                className="w-full max-w-[250px] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isCreatingPayment ? <Loader2 size={18} className="animate-spin" /> : <ExternalLink size={18} />}
                Mở App Ngân Hàng
              </button>
              <p className="text-[11px] text-gray-500 mt-2 text-center w-full max-w-[250px] font-medium leading-tight">
                Vui lòng nhập "Số tiền" bên cạnh trước khi bấm.
              </p>
            </div>
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
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-sm text-yellow-800 font-semibold">Nhập thông tin để tạo nội dung chuyển khoản chuẩn:</p>
                <Edit3 className="w-3 h-3 text-yellow-600" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative group/input overflow-hidden rounded-lg">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within/input:text-yellow-600 z-10" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và Tên (VD: Nguyen Van A)"
                    className="w-full pl-9 pr-9 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow shadow-sm bg-transparent relative z-10"
                  />
                  {/* Hiệu ứng quét từ phải sang trái */}
                  <div 
                    className={`absolute inset-y-0 right-0 bg-gradient-to-l from-emerald-50/90 to-emerald-200/90 backdrop-blur-sm border-l-[3px] border-emerald-500 shadow-[-8px_0_20px_rgba(16,185,129,0.3)] pointer-events-none z-20 ${isClearingName ? 'w-full opacity-100 transition-all duration-500 ease-out' : 'w-0 opacity-0 transition-none border-l-0'}`}
                  ></div>
                  <button 
                    onClick={handleClearName}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-300 ease-out transform z-30 ${name && !isClearingName ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90 pointer-events-none'}`}
                    title="Xóa"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative group/input overflow-hidden rounded-lg">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within/input:text-yellow-600 z-10" />
                  <input 
                    type="text" 
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder="Thôn / Đội bóng (VD: Xom 1)"
                    className="w-full pl-9 pr-9 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow shadow-sm bg-transparent relative z-10"
                  />
                  {/* Hiệu ứng quét từ phải sang trái */}
                  <div 
                    className={`absolute inset-y-0 right-0 bg-gradient-to-l from-emerald-50/90 to-emerald-200/90 backdrop-blur-sm border-l-[3px] border-emerald-500 shadow-[-8px_0_20px_rgba(16,185,129,0.3)] pointer-events-none z-20 ${isClearingGroup ? 'w-full opacity-100 transition-all duration-500 ease-out' : 'w-0 opacity-0 transition-none border-l-0'}`}
                  ></div>
                  <button 
                    onClick={handleClearGroup}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-300 ease-out transform z-30 ${group && !isClearingGroup ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90 pointer-events-none'}`}
                    title="Xóa"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative group/input overflow-hidden rounded-lg sm:col-span-2">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within/input:text-yellow-600 z-10" />
                  <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAmount(val ? new Intl.NumberFormat('vi-VN').format(Number(val)) : '');
                    }}
                    placeholder="Số tiền quyên góp (Cần thiết nếu dùng Mở App Ngân Hàng)"
                    className="w-full pl-9 pr-9 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow shadow-sm bg-white relative z-10 font-bold text-emerald-700"
                  />
                  <button 
                    onClick={() => setAmount("")}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-300 ease-out transform z-30 ${amount ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90 pointer-events-none'}`}
                    title="Xóa"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white border border-yellow-300 px-3 py-2 rounded-lg gap-2 focus-within:ring-2 focus-within:ring-yellow-400 transition-all shadow-inner">
                <div className="font-bold text-emerald-700 text-sm md:text-base bg-transparent border-none outline-none w-full break-all">
                  {displayMessage}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100 font-semibold shrink-0"
                  onClick={() => handleCopy(displayMessage, "syntax")}
                >
                  {copied === "syntax" ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied === "syntax" ? "Đã copy" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-yellow-600 italic">Mã QR sẽ tự động cập nhật theo Tên và Thôn bạn nhập.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
