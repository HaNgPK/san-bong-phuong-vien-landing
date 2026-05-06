import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sun, Moon, Users, ShieldCheck, Zap, CalendarDays } from 'lucide-react';

export default function SchedulePlanSection() {
  const [activeTab, setActiveTab] = useState(0);

  const schedules = [
    {
      id: 0,
      time: "05:00 - 17:00",
      title: "Giờ Hành Chính",
      type: "MIỄN PHÍ 100%",
      desc: "Mở cửa tự do cho bà con nhân dân, người cao tuổi tập thể dục, thanh thiếu niên và trẻ em vui chơi, sinh hoạt cộng đồng.",
      icon: <Sun className="w-10 h-10 text-sky-500" />,
      bgClass: "bg-sky-50",
      borderClass: "border-sky-200",
      textClass: "text-sky-800",
      badgeClass: "bg-white text-sky-700",
      activeBar: "bg-sky-400",
      progressWidth: "50%",
    },
    {
      id: 1,
      time: "17:00 - 18:00",
      title: "Giờ Phong Trào",
      type: "MIỄN PHÍ 100%",
      desc: "Khung giờ vàng cho phong trào thể thao Thôn. Ưu tiên các cháu học sinh, thanh thiếu niên rèn luyện thể lực sau giờ học.",
      icon: <Users className="w-10 h-10 text-amber-500" />,
      bgClass: "bg-amber-50",
      borderClass: "border-amber-200",
      textClass: "text-amber-800",
      badgeClass: "bg-white text-amber-700",
      activeBar: "bg-amber-400",
      progressWidth: "20%",
    },
    {
      id: 2,
      time: "18:00 - 22:00",
      title: "Giờ Lên Đèn",
      type: "CÓ THU PHÍ (ĐỘI THUÊ)",
      desc: "Dành cho các đội bóng giao lưu đặt trước. Toàn bộ kinh phí sung vào Quỹ Sân Bóng để duy trì tiền điện chiếu sáng và bảo dưỡng.",
      icon: <Moon className="w-10 h-10 text-indigo-500" />,
      bgClass: "bg-indigo-50",
      borderClass: "border-indigo-200",
      textClass: "text-indigo-800",
      badgeClass: "bg-white text-indigo-700",
      activeBar: "bg-indigo-400",
      progressWidth: "30%",
    }
  ];

  const activeData = schedules[activeTab];

  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-emerald-900 mb-6 tracking-tight">
            Kế Hoạch Khai Thác & Quản Lý
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Khung giờ được phân bổ khoa học, minh bạch. Đảm bảo quyền lợi vui chơi miễn phí cho nhân dân và duy trì nguồn quỹ bảo dưỡng sân bền vững.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Interactive Timeline Bar */}
          <div className="mb-12 relative">
            <div className="flex justify-between text-xs md:text-sm font-bold text-gray-400 mb-3 px-1 md:px-2">
              <span>05:00</span>
              <span className="ml-[35%]">17:00</span>
              <span className="ml-[5%]">18:00</span>
              <span>22:00</span>
            </div>
            
            {/* The Bar */}
            <div className="h-6 bg-gray-100 rounded-full flex overflow-hidden shadow-inner cursor-pointer p-1">
              {schedules.map((s, idx) => (
                <div 
                  key={s.id}
                  onClick={() => setActiveTab(idx)}
                  className={`h-full rounded-full transition-all duration-500 relative ${activeTab === idx ? s.activeBar : 'bg-gray-200 hover:bg-gray-300'} mr-1 last:mr-0 flex items-center justify-center`}
                  style={{ width: s.progressWidth }}
                >
                  {activeTab === idx && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Clickable Tabs */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6">
              {schedules.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(idx)}
                  className={`py-3 px-2 rounded-2xl text-sm md:text-base font-bold transition-all duration-300 border-2 flex flex-col items-center gap-1 ${activeTab === idx ? `${s.borderClass} ${s.bgClass} ${s.textClass} shadow-md scale-[1.02] -translate-y-1` : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                >
                  <Clock className={`w-4 h-4 ${activeTab === idx ? '' : 'opacity-50'}`} />
                  <span className="hidden md:block">{s.title}</span>
                  <span className="block md:hidden text-xs">{s.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Display Card */}
          <div className={`rounded-3xl border-2 ${activeData.borderClass} ${activeData.bgClass} p-6 md:p-10 transition-colors duration-500 shadow-xl shadow-gray-200/50`}>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              
              {/* Icon & Time */}
              <div className="shrink-0 flex flex-col items-center justify-center w-32 h-32 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white">
                {activeData.icon}
                <div className={`mt-3 font-black text-lg ${activeData.textClass}`}>
                  {activeData.time}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className={`inline-block px-4 py-1.5 ${activeData.badgeClass} font-bold rounded-full text-sm mb-4 shadow-sm border border-white/50`}>
                  {activeData.type}
                </div>
                <h3 className={`text-2xl md:text-3xl font-black ${activeData.textClass} mb-4`}>
                  {activeData.title}
                </h3>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium">
                  {activeData.desc}
                </p>
                
                {/* Additional contextual features */}
                <div className="mt-6 pt-6 border-t border-black/5 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-600 text-sm font-medium bg-white/50 px-3 py-1.5 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Đảm bảo an ninh trật tự
                  </div>
                  {activeData.id === 2 && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium bg-white/50 px-3 py-1.5 rounded-lg">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Hệ thống đèn LED tự động
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/quan-ly-san" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1 hover:shadow-indigo-600/50">
              <CalendarDays className="w-5 h-5 mr-2" />
              Xem Lịch Sân & Quản Lý Đăng Ký
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
