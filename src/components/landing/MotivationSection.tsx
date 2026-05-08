import { Flame, Sprout, Users } from "lucide-react";

export default function MotivationSection() {
  const cards = [
    {
      id: 1,
      icon: <Flame size={32} />,
      iconColor: "text-amber-500",
      title: "Lòng Tự Hào Làng Xã",
      description: "Làng bên đã sáng đèn, đá rầm rộ. Phương Viên ta với hơn 2.400 hộ dân, phong trào mạnh mẽ, quyết không để thanh niên chịu cảnh sân đất mù mịt. Làng người ta làm được, làng mình quyết tâm làm đẹp hơn, khang trang hơn!"
    },
    {
      id: 2,
      icon: <Sprout size={32} />,
      iconColor: "text-emerald-500",
      title: "Ươm Mầm Tương Lai",
      description: "Đừng để con cháu Phương Viên lủi thủi đá bóng sân đất gập ghềnh, ngã xước đầu gối. Chỉ cần người lớn bớt đi một bao thuốc, một cốc bia, tụi nhỏ sẽ có một sân chơi an toàn, sạch đẹp trong mùa hè này."
    },
    {
      id: 3,
      icon: <Users size={32} />,
      iconColor: "text-blue-500",
      title: "Mỗi Hộ 1 Mét Vuông",
      description: "Sân bóng rộng 1.632m², tương đương chưa tới 1 mét vuông cho mỗi hộ gia đình. Chỉ cần mỗi nhà chung tay 'phủ xanh 1 mét vuông' (tương đương 280.000đ), chúng ta sẽ có ngay một thảm cỏ xanh mướt giữa lòng làng."
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-emerald-50/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-emerald-700 to-teal-500 bg-clip-text text-transparent leading-tight pb-2">
            Tại sao Phương Viên cần sự chung tay của bạn?
          </h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Chỉ một hành động nhỏ, tạo ra sự thay đổi lớn cho cả thế hệ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div 
              key={card.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-emerald-100/50 flex flex-col items-start text-left group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-emerald-50 ${card.iconColor} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
