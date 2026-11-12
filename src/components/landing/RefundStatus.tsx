import { CheckCircle2, Clock } from "lucide-react";
import { useDonations } from "@/contexts/DonationContext";
import { formatCurrency } from "@/lib/format";

export function RefundBadge({ refunded, refundDate }: { refunded: boolean; refundDate?: string }) {
  if (refunded) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Đã hoàn{refundDate ? ` ${refundDate}` : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap">
      <Clock className="w-3.5 h-3.5" />
      Chờ hoàn
    </span>
  );
}

// Thanh tiến độ hoàn tiền: số khoản đã hoàn / tổng, số tiền đã hoàn / tổng.
export function RefundProgress({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { donations, currentRaised, refundedCount, refundedAmount, loading } = useDonations();
  if (loading || donations.length === 0) return null;

  const percent = currentRaised > 0 ? (refundedAmount / currentRaised) * 100 : 0;
  const remaining = currentRaised - refundedAmount;
  const muted = tone === "dark" ? "text-amber-100" : "text-gray-600";
  const strong = tone === "dark" ? "text-white" : "text-gray-900";

  return (
    <div className="w-full space-y-2">
      <div className={`flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm font-semibold ${muted}`}>
        <span>
          Đã hoàn: <span className={strong}>{refundedCount}/{donations.length}</span> lượt ·{" "}
          <span className={strong}>{formatCurrency(refundedAmount)}</span>
        </span>
        <span>
          Còn lại: <span className={strong}>{formatCurrency(remaining)}</span>
        </span>
      </div>
      <div className="relative h-4 md:h-5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-1000"
          style={{ width: `${Math.max(percent, refundedCount > 0 ? 3 : 0)}%` }}
        />
      </div>
    </div>
  );
}
