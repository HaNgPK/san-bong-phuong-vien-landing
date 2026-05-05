import { useState } from "react";
import { DONORS_BUSINESS, DONORS_TEAM, DONORS_INDIVIDUAL } from "@/data/mockData";
import { formatCurrency } from "@/lib/format";

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

  const currentLeaderboardData = 
    activeTab === "doanh-nghiep" ? DONORS_BUSINESS :
    activeTab === "doi-bong" ? DONORS_TEAM : DONORS_INDIVIDUAL;

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Bảng Vàng Tri Ân</h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full"></div>
          <p className="text-gray-500 mt-4 text-lg">Chân thành cảm ơn những tấm lòng vàng đã chắp cánh cho thể thao quê nhà</p>
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
