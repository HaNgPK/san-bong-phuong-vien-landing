import { useEffect, useState } from "react";
import { AlertOctagon, X } from "lucide-react";
import { REFUND_NOTICE } from "@/config/campaign";
import { RefundProgress } from "./RefundStatus";

const STORAGE_KEY = "refund-notice-dismissed";

// Popup thông báo dừng dự án, hiện một lần mỗi phiên truy cập.
export default function RefundNoticeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // sessionStorage có thể bị chặn (chế độ riêng tư) – vẫn hiện popup
    }
    if (!dismissed) setOpen(true);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // bỏ qua
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="refund-notice-title"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
          aria-label="Đóng thông báo"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-r from-red-600 to-amber-500 px-6 pt-8 pb-6 text-white text-center">
          <AlertOctagon className="w-12 h-12 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90">Thông báo quan trọng</p>
          <h2 id="refund-notice-title" className="text-2xl md:text-3xl font-black mt-1">
            {REFUND_NOTICE.title}
          </h2>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">{REFUND_NOTICE.message}</p>
          <p className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-3">
            {REFUND_NOTICE.refundMethod}
          </p>
          <RefundProgress />
          <button
            onClick={() => {
              close();
              document.getElementById("transparency-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            Xem trạng thái hoàn tiền từng khoản
          </button>
        </div>
      </div>
    </div>
  );
}
