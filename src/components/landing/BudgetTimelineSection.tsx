import {
  Banknote,
  Calendar,
  Clock,
  Trophy,
  Sparkles,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BUDGET_BREAKDOWN, FUNDING_GOAL } from "@/data/mockData";
import { formatCurrency } from "@/lib/format";

export default function BudgetTimelineSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Budget Breakdown */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Banknote className="mr-3 w-6 h-6 text-emerald-600" />
              Dự Toán Chi Phí
            </h3>
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex h-5 rounded-full overflow-hidden mb-6">
                  {BUDGET_BREAKDOWN.map((item, idx) => {
                    const width = (item.amount / FUNDING_GOAL) * 100;
                    return (
                      <div
                        key={idx}
                        style={{ width: `${width}%` }}
                        className={`${item.color}`}
                        title={item.item}
                      ></div>
                    );
                  })}
                </div>
                <div className="space-y-4">
                  {BUDGET_BREAKDOWN.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 shrink-0 ${item.color}`}
                        ></div>
                        <span className="text-gray-700 font-medium text-sm md:text-base">
                          {item.item}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900 ml-6 sm:ml-0">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Timeline */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="mr-3 w-6 h-6 text-blue-600" />
              Tiến Độ Dự Án
            </h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="space-y-6 md:space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-emerald-400 before:via-gray-200 before:to-gray-100">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(16,185,129,0.2)] z-10 animate-pulse">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 md:p-5 rounded-2xl border-2 border-emerald-400 bg-emerald-50 shadow-md transform transition-transform duration-300 hover:-translate-y-1">
                    <div className="font-black text-emerald-800 text-base md:text-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      GĐ 1: Đang kêu gọi
                    </div>
                    <div className="text-sm text-emerald-700 mt-2 font-medium">
                      Khởi động: Tháng 5/2026 - Hiện tại
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-100 text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors group-hover:bg-blue-100 group-hover:text-blue-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 md:p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 opacity-80 hover:opacity-100 transition-all hover:border-blue-300 hover:bg-blue-50">
                    <div className="font-bold text-gray-700 text-sm md:text-base transition-colors group-hover:text-blue-800">
                      GĐ 2: Bắt đầu thi công
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-2 transition-colors group-hover:text-blue-600">
                      Dự kiến khi đạt 50% mục tiêu quỹ
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-100 text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors group-hover:bg-orange-100 group-hover:text-orange-500">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 md:p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 opacity-80 hover:opacity-100 transition-all hover:border-orange-300 hover:bg-orange-50">
                    <div className="font-bold text-gray-700 text-sm md:text-base transition-colors group-hover:text-orange-800">
                      GĐ 3: Khánh thành
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-2 transition-colors group-hover:text-orange-600">
                      Bàn giao sân bóng & Báo cáo thu chi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
