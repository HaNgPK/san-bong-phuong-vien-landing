import { Facebook, RotateCcw, ShieldCheck } from "lucide-react";
import { REFUND_NOTICE } from "@/config/campaign";
import { useDonations } from "@/contexts/DonationContext";
import { formatCurrency } from "@/lib/format";
import { RefundProgress } from "./RefundStatus";

// Thay thế PaymentSection khi chiến dịch tạm dừng. Giữ id="payment-section"
// để các nút cuộn tới phần này (Hero, banner) vẫn hoạt động.
export default function RefundNoticeSection() {
  const { currentRaised, donations, loading } = useDonations();

  return (
    <section id="payment-section" className="py-10 md:py-16 bg-emerald-900 text-white relative">
      <div className="container px-4 mx-auto max-w-3xl relative z-10">
        <div className="bg-white text-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-7 h-7" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">{REFUND_NOTICE.title}</h2>
            <p className="text-gray-600 md:text-lg">{REFUND_NOTICE.message}</p>
          </div>

          <RefundProgress />

          {!loading && donations.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500">Số lượt ủng hộ cần hoàn</p>
                <p className="text-2xl md:text-3xl font-black text-emerald-700">{donations.length}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500">Tổng số tiền hoàn lại</p>
                <p className="text-2xl md:text-3xl font-black text-emerald-700">{formatCurrency(currentRaised)}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm md:text-base text-emerald-900">{REFUND_NOTICE.refundMethod}</p>
          </div>

          <div className="flex justify-center">
            <a
              href={REFUND_NOTICE.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
            >
              <Facebook className="w-5 h-5 fill-current" />
              {REFUND_NOTICE.contactLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
