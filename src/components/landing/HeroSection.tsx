import { useState, useEffect } from "react";
import { Heart, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FUNDING_GOAL, CURRENT_RAISED } from "@/data/mockData";
import { formatCurrency } from "@/lib/format";

export default function HeroSection() {
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Danh sách ảnh sân cũ (Load từ thư mục public/images/old-field/)
  const oldFieldImages = [
    "/images/old-field/1.jpg",
    "/images/old-field/2.jpg",
    "/images/old-field/3.jpg"
  ];

  // Danh sách ảnh sân mới (Load từ thư mục public/images/new-field/)
  const newFieldImages = [
    "/images/new-field/1.jfif",
    "/images/new-field/2.jfif",
    "/images/new-field/3.jfif"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % oldFieldImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? oldFieldImages.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((CURRENT_RAISED / FUNDING_GOAL) * 100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-emerald-950 py-12 md:py-20 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative z-10 container px-4 mx-auto flex flex-col items-center text-center">
        
        <div className="inline-flex items-center rounded-full bg-emerald-800/50 px-4 py-1.5 text-sm font-medium text-emerald-100 mb-6 border border-emerald-700/50">
          <MapPin className="w-4 h-4 mr-2 text-emerald-400" /> Thôn Phương Viên
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-normal md:leading-snug">
          Chiến dịch 1632m² "Cỏ xanh"<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-200 inline-block mt-2 md:mt-4">Cho làng Phương Viên</span>
        </h1>
        
        <p className="text-emerald-50 max-w-3xl text-base md:text-xl mb-12 leading-relaxed font-light">
          Một viên gạch nhỏ hôm nay sẽ xây nên sân chơi lớn cho thế hệ ngày mai. Hãy chung tay cùng chúng tôi nuôi dưỡng đam mê, rèn luyện sức khỏe và thắp sáng phong trào thể thao quê hương!
        </p>

        {/* Before / After Images & Slider */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl mb-12">
          
          {/* SLIDER SÂN CŨ */}
          <div className="relative w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-gray-900">
            <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 text-xs md:text-sm font-bold rounded-lg z-20">
              Hiện tại (Đang xuống cấp)
            </div>
            
            <div 
              className="flex w-full h-48 md:h-72 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {oldFieldImages.map((src, idx) => (
                <img 
                  key={idx}
                  src={src} 
                  alt={`Sân đất hiện tại - Ảnh ${idx + 1}`} 
                  className="w-full h-full object-cover flex-shrink-0 filter grayscale-[20%]"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1628882885449-37e127394c8e?q=80&w=2000&auto=format&fit=crop";
                  }}
                />
              ))}
            </div>

            {/* Slider Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 z-20 transition-colors opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 z-20 transition-colors opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {oldFieldImages.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center -mx-6 z-20">
            <div className="bg-emerald-500 rounded-full p-2 shadow-xl border-4 border-emerald-950">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* SÂN MỚI (MỤC TIÊU) */}
          <div className="relative w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-emerald-900">
            <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs md:text-sm font-bold rounded-lg z-20">
              Mục tiêu (Cỏ nhân tạo 3D)
            </div>
            
            <div 
              className="flex w-full h-48 md:h-72 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {newFieldImages.map((src, idx) => (
                <img 
                  key={idx}
                  src={src} 
                  alt={`Mô phỏng sân mới - Ảnh ${idx + 1}`} 
                  className="w-full h-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518605368461-1e1e38cd3543?q=80&w=2000&auto=format&fit=crop";
                  }}
                />
              ))}
            </div>

            {/* Slider Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 z-20 transition-colors opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 z-20 transition-colors opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {newFieldImages.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentSlide ? 'bg-emerald-400' : 'bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Stats Card */}
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-2">Đã Quyên Góp Được</p>
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600 drop-shadow-sm">
              {formatCurrency(CURRENT_RAISED)}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold text-gray-600">
              <span>Tiến độ: {progress.toFixed(1)}%</span>
              <span>Mục tiêu: {formatCurrency(FUNDING_GOAL)}</span>
            </div>
            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-[2000ms] ease-out rounded-full"
                style={{ width: `${progress}%` }}
              >
                <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_100%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              size="lg" 
              className="w-full md:w-auto px-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full h-14 text-lg font-bold shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-1 animate-pulse"
              onClick={() => document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Heart className="mr-2 w-5 h-5" /> Đóng góp ngay
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
