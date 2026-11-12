import { AlertTriangle, ArrowDown } from "lucide-react";
import { REFUND_NOTICE } from "@/config/campaign";

// Dải thông báo bám ngay dưới Header khi cuộn trang.
export default function RefundBanner() {
  return (
    <div className="sticky top-16 z-40 w-full bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2 font-bold text-sm md:text-base">
          <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
          <span>{REFUND_NOTICE.title.toUpperCase()} · Vui lòng không chuyển khoản thêm</span>
        </div>
        <button
          onClick={() => document.getElementById("transparency-section")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-1 text-xs md:text-sm font-semibold bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 shrink-0"
        >
          Xem trạng thái hoàn tiền <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
