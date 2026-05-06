import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { useDonations } from "@/contexts/DonationContext";
import { Briefcase, Users, User, LayoutGrid, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const FriendlyCard = ({ donor }: { donor: any }) => {
  if (!donor) return null;
  const isTop1 = donor.rank === 1;

  return (
    <div className={`relative w-full rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-lg border ${
      isTop1 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'
    }`}>
      {/* Rank Circle instead of huge Trophy */}
      <div className={`absolute -top-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border-4 border-white ${
        donor.rank === 1 ? 'bg-emerald-500 text-white' : 
        donor.rank === 2 ? 'bg-gray-200 text-gray-700' : 
        'bg-orange-100 text-orange-700'
      }`}>
        #{donor.rank}
      </div>
      
      <div className="mt-4 mb-2">
        <p className="font-bold text-lg text-gray-800 line-clamp-2">
          {donor.name}
        </p>
      </div>
      
      <p className="font-black text-2xl text-emerald-600 tracking-tight mb-4">
        {formatCurrency(donor.amount)}
      </p>

      <p className="text-sm text-gray-500 italic bg-gray-50/50 p-3 rounded-lg w-full">
        "{donor.message}"
      </p>
    </div>
  )
}

export default function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState("doanh-nghiep");
  const [compositionViewMode, setCompositionViewMode] = useState<"grid" | "progress">("progress");
  
  const { donorsBusiness, donorsTeam, donorsIndividual, categoryTotals, currentRaised } = useDonations();

  const currentLeaderboardData = 
    activeTab === "doanh-nghiep" ? donorsBusiness :
    activeTab === "doi-bong" ? donorsTeam : donorsIndividual;

  const getPercent = (amount: number) => {
    return currentRaised > 0 ? ((amount / currentRaised) * 100).toFixed(1) : "0";
  };

  const doanhNghiepAmount = categoryTotals["Doanh nghiệp"] || 0;
  const doiBongAmount = categoryTotals["Đội bóng"] || 0;
  const caNhanAmount = categoryTotals["Cá nhân"] || 0;
  const khacAmount = Object.entries(categoryTotals)
    .filter(([key]) => !["Doanh nghiệp", "Đội bóng", "Cá nhân"].includes(key))
    .reduce((sum, [_, val]) => sum + val, 0);

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Bảng Vàng Tri Ân</h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full"></div>
          <p className="text-gray-500 mt-4 text-lg">Chân thành cảm ơn những tấm lòng vàng đã chắp cánh cho thể thao quê nhà</p>
        </div>

        {/* Cơ cấu nguồn quỹ */}
        <div className="mb-10 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <h3 className="text-base font-bold text-gray-800 flex items-center">
              Cơ cấu nguồn quỹ
            </h3>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setCompositionViewMode("progress")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center ${compositionViewMode === "progress" ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <BarChart3 className="w-4 h-4 mr-2" /> Gộp chung
              </button>
              <button 
                onClick={() => setCompositionViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center ${compositionViewMode === "grid" ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid className="w-4 h-4 mr-2" /> Tách chi tiết
              </button>
            </div>
          </div>

          <div className="min-h-[180px] md:min-h-[220px] flex flex-col justify-center transition-all duration-300">
            {compositionViewMode === "progress" ? (() => {
              const chartData = [
                { name: "Doanh nghiệp", value: doanhNghiepAmount, color: "#3b82f6" },
                { name: "Đội bóng", value: doiBongAmount, color: "#10b981" },
                { name: "Cá nhân", value: caNhanAmount, color: "#f59e0b" },
              ];
              if (khacAmount > 0) chartData.push({ name: "Khác", value: khacAmount, color: "#9ca3af" });

              return (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-2 md:py-2 md:px-4 h-full">
                  {/* Biểu đồ Pie (Recharts) */}
                  <div className="w-[160px] md:w-[180px] h-[160px] md:h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={15}
                          outerRadius={75}
                          paddingAngle={6}
                          dataKey="value"
                          labelLine={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                            if (percent < 0.05) return null; // Hide small labels
                            return (
                              <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold text-[10px] md:text-[11px] drop-shadow-sm">
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            );
                          }}
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              style={{ filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.15))" }} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chú thích (Legend) */}
                  <div className="flex flex-col justify-center gap-2 w-full sm:w-56 h-full">
                    <div className="flex items-center justify-between p-2 px-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm transition-transform hover:scale-105">
                      <div className="flex items-center text-sm font-semibold text-gray-700">
                        <span className="w-3 h-3 rounded bg-blue-500 mr-2.5 shadow-sm"></span> Doanh nghiệp 
                      </div>
                      <span className="text-blue-700 font-bold text-sm">{getPercent(doanhNghiepAmount)}%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 px-3 bg-emerald-50/50 rounded-xl border border-emerald-100 shadow-sm transition-transform hover:scale-105">
                      <div className="flex items-center text-sm font-semibold text-gray-700">
                        <span className="w-3 h-3 rounded bg-emerald-500 mr-2.5 shadow-sm"></span> Đội bóng
                      </div>
                      <span className="text-emerald-700 font-bold text-sm">{getPercent(doiBongAmount)}%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 px-3 bg-amber-50/50 rounded-xl border border-amber-100 shadow-sm transition-transform hover:scale-105">
                      <div className="flex items-center text-sm font-semibold text-gray-700">
                        <span className="w-3 h-3 rounded bg-amber-500 mr-2.5 shadow-sm"></span> Cá nhân
                      </div>
                      <span className="text-amber-700 font-bold text-sm">{getPercent(caNhanAmount)}%</span>
                    </div>
                    {khacAmount > 0 && (
                      <div className="flex items-center justify-between p-2 px-3 bg-gray-50 rounded-xl border border-gray-200 shadow-sm transition-transform hover:scale-105">
                        <div className="flex items-center text-sm font-semibold text-gray-700">
                          <span className="w-3 h-3 rounded bg-gray-400 mr-2.5 shadow-sm"></span> Khác
                        </div>
                        <span className="text-gray-600 font-bold text-sm">{getPercent(khacAmount)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full items-center">
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all h-full flex flex-col justify-between">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-blue-200">
                      {getPercent(doanhNghiepAmount)}%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xs md:text-sm font-semibold text-gray-500 mb-1">Doanh nghiệp</h4>
                    <div className="text-lg md:text-xl font-black text-gray-900 truncate" title={formatCurrency(doanhNghiepAmount)}>
                      {formatCurrency(doanhNghiepAmount)}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all h-full flex flex-col justify-between">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-emerald-200">
                      {getPercent(doiBongAmount)}%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xs md:text-sm font-semibold text-gray-500 mb-1">Đội bóng</h4>
                    <div className="text-lg md:text-xl font-black text-gray-900 truncate" title={formatCurrency(doiBongAmount)}>
                      {formatCurrency(doiBongAmount)}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all h-full flex flex-col justify-between">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-amber-200">
                      {getPercent(caNhanAmount)}%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xs md:text-sm font-semibold text-gray-500 mb-1">Cá nhân</h4>
                    <div className="text-lg md:text-xl font-black text-gray-900 truncate" title={formatCurrency(caNhanAmount)}>
                      {formatCurrency(caNhanAmount)}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all h-full flex flex-col justify-between">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gray-500/10 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shadow-inner">
                      <span className="font-serif font-bold text-lg leading-none">+</span>
                    </div>
                    <span className="text-xs font-bold text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-gray-200">
                      {getPercent(khacAmount)}%
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xs md:text-sm font-semibold text-gray-500 mb-1">Khác</h4>
                    <div className="text-lg md:text-xl font-black text-gray-900 truncate" title={formatCurrency(khacAmount)}>
                      {formatCurrency(khacAmount)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'doanh-nghiep', label: 'Doanh Nghiệp' },
            { id: 'doi-bong', label: 'Đội Bóng' },
            { id: 'ca-nhan', label: 'Cá Nhân' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto px-4 md:px-0">
          <div className="order-2 md:order-1"><FriendlyCard donor={currentLeaderboardData.find(d => d.rank === 2)} /></div>
          <div className="order-1 md:order-2"><FriendlyCard donor={currentLeaderboardData.find(d => d.rank === 1)} /></div>
          <div className="order-3 md:order-3"><FriendlyCard donor={currentLeaderboardData.find(d => d.rank === 3)} /></div>
        </div>
      </div>
    </section>
  );
}
