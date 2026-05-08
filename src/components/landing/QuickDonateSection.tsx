import { useState, useEffect } from "react";
import { CheckCircle2, Copy, User, MapPin, Edit3, X } from "lucide-react";
import { BANK_DETAILS } from "../../data/mockData";

export default function QuickDonateSection() {
  const [selectedOption, setSelectedOption] = useState<number | "custom">(2);
  const [customValue, setCustomValue] = useState<number>(10);
  const [copied, setCopied] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedGroup, setDebouncedGroup] = useState("");
  const [isUpdatingQR, setIsUpdatingQR] = useState(false);
  
  const [isMessageEdited, setIsMessageEdited] = useState(false);
  const [manualMessage, setManualMessage] = useState("");

  useEffect(() => {
    setIsUpdatingQR(true);
    const handler = setTimeout(() => {
      setDebouncedName(name);
      setDebouncedGroup(group);
      setIsUpdatingQR(false);
    }, 800);
    return () => clearTimeout(handler);
  }, [name, group]);

  const PRICE_PER_SQM = 280000;
  const currentSqm = selectedOption === "custom" ? customValue : selectedOption;
  const calculatedAmount = currentSqm * PRICE_PER_SQM;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const options = [
    { value: 1, label: "1 m²", subtext: "280.000đ" },
    { value: 2, label: "2 m²", subtext: "560.000đ" },
    { value: 5, label: "5 m²", subtext: "1.400.000đ" },
    { value: "custom", label: "Khác", subtext: "Tùy chọn" },
  ];

  const generateMessage = (n: string, g: string, sqm: number) => {
    const nStr = n.trim() ? n.trim().toUpperCase() : "";
    const gStr = g.trim() ? g.trim().toUpperCase() : "";
    
    if (!nStr && !gStr) return `Ung ho ${sqm}m2 san bong Phuong Vien`;
    
    const parts = [];
    if (nStr) parts.push(nStr);
    if (gStr) parts.push(gStr);
    
    return `${parts.join(" ")} ung ho ${sqm}m2 san bong`;
  };

  const defaultTransferMessage = generateMessage(debouncedName, debouncedGroup, currentSqm as number);
  const defaultDisplayMessage = generateMessage(name, group, currentSqm as number);

  const finalTransferMessage = isMessageEdited ? manualMessage : defaultTransferMessage;
  const finalDisplayMessage = isMessageEdited ? manualMessage : defaultDisplayMessage;

  const qrUrl = `https://img.vietqr.io/image/techcombank-${BANK_DETAILS.accountNumber}-compact2.png?amount=${calculatedAmount}&addInfo=${encodeURIComponent(finalTransferMessage)}&accountName=${encodeURIComponent(BANK_DETAILS.accountName)}`;

  const handleOptionClick = (val: number | "custom") => {
    setSelectedOption(val);
    if (val !== "custom") {
      setIsModalOpen(true);
    }
  };

  return (
    <section className="py-10 md:py-16 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent pb-2">
            Bạn muốn phủ xanh bao nhiêu mét vuông?
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium">
            Mỗi mét vuông của bạn là một phần tương lai của phong trào làng.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-100 transition-all duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {options.map((option) => {
              const isSelected = selectedOption === option.value;
              return (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option.value as number | "custom")}
                  className={`relative cursor-pointer rounded-2xl p-4 md:p-6 text-center border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] ${
                    isSelected 
                      ? "border-emerald-500 bg-emerald-50 shadow-md transform -translate-y-1" 
                      : "border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm hover:-translate-y-1"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-emerald-500 animate-in zoom-in duration-300">
                      <CheckCircle2 size={20} className="fill-emerald-100" />
                    </div>
                  )}
                  <span className={`text-2xl font-bold mb-1 ${isSelected ? "text-emerald-700" : "text-gray-800"}`}>
                    {option.label}
                  </span>
                  <span className={`text-sm font-medium ${isSelected ? "text-emerald-600" : "text-gray-500"}`}>
                    {option.subtext}
                  </span>
                </div>
              );
            })}
          </div>

          {selectedOption === "custom" && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Nhập số mét vuông bạn muốn đóng góp
              </label>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center flex-1 w-full">
                  <input 
                    type="number" 
                    min="1"
                    value={customValue || ""}
                    onChange={(e) => setCustomValue(parseInt(e.target.value) || 0)}
                    className="w-full text-xl font-bold px-6 py-4 border-2 border-emerald-300 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all bg-white"
                    placeholder="Ví dụ: 10"
                  />
                  <span className="ml-4 font-black text-2xl text-gray-400">m²</span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  disabled={!customValue || customValue <= 0}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  Tiến hành ({formatCurrency(customValue * PRICE_PER_SQM)}đ)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Content - Left: QR */}
            <div className="w-full md:w-2/5 bg-emerald-50 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-emerald-100 relative">
              <h3 className="text-xl font-bold text-emerald-900 mb-6 text-center">Quét mã thanh toán</h3>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden group">
                {isUpdatingQR && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src={qrUrl} 
                  alt="QR Code" 
                  className={`w-48 md:w-56 h-auto object-contain rounded-xl transition-all duration-300 ${isUpdatingQR ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`} 
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Số tiền quyên góp ({currentSqm} m²)</p>
                <p className="text-3xl font-black text-emerald-600 tracking-tight">{formatCurrency(calculatedAmount)}<span className="text-lg text-emerald-400 ml-1">VNĐ</span></p>
              </div>
            </div>

            {/* Modal Content - Right: Info */}
            <div className="w-full md:w-3/5 p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Thông tin chuyển khoản</h3>
                <p className="text-gray-500 text-sm">Techcombank - {BANK_DETAILS.accountName}</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500 font-medium">Số tài khoản</span>
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
                    <span className="font-black text-2xl text-gray-900 tracking-wider">{BANK_DETAILS.accountNumber}</span>
                    <button 
                      onClick={() => handleCopy(BANK_DETAILS.accountNumber, "stk")} 
                      className="text-emerald-600 hover:text-emerald-700 p-1 transition-colors"
                    >
                      {copied === "stk" ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl space-y-3">
                  <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                    <Edit3 size={16} /> Nhập thông tin để ghi nhận (Không bắt buộc):
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Họ và Tên"
                        className="w-full pl-9 pr-3 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" value={group} onChange={(e) => setGroup(e.target.value)}
                        placeholder="Thôn / Đội bóng"
                        className="w-full pl-9 pr-3 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <span className="text-gray-500 font-medium text-sm">Nội dung chuyển khoản (Có thể sửa trực tiếp)</span>
                    <div className="flex items-center justify-between bg-white rounded-xl p-2 border border-emerald-100 shadow-sm focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
                      <input 
                        type="text"
                        value={finalDisplayMessage}
                        onChange={(e) => {
                          setIsMessageEdited(true);
                          setManualMessage(e.target.value);
                        }}
                        className="font-bold text-gray-900 bg-transparent outline-none w-full px-2"
                      />
                      <button 
                        onClick={() => handleCopy(finalDisplayMessage, "msg")} 
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors flex items-center gap-1 font-semibold text-sm shrink-0"
                      >
                        {copied === "msg" ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        {copied === "msg" ? "Đã chép" : "Copy"}
                      </button>
                    </div>
                    <p className="text-xs text-yellow-600 italic">Mã QR sẽ tự cập nhật nội dung tương ứng.</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors mt-4"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
