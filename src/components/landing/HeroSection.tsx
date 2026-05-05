import { useState, useEffect } from "react";
import { Heart, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FUNDING_GOAL, CURRENT_RAISED } from "@/data/mockData";
import { formatCurrency } from "@/lib/format";

export default function HeroSection() {
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressSlider, setProgressSlider] = useState(50);
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);

  // Danh sách ảnh sân cũ
  const oldFieldImages = [
    "/images/old-field/1.jpg",
    "/images/old-field/2.jpg",
    "/images/old-field/3.jpg"
  ];

  // Danh sách ảnh sân mới
  const newFieldImages = [
    "/images/new-field/1.jfif",
    "/images/new-field/2.jfif",
    "/images/new-field/3.jfif"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % oldFieldImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? oldFieldImages.length - 1 : prev - 1));

  // Progress bar cho quyên góp
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((CURRENT_RAISED / FUNDING_GOAL) * 100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Tự động chuyển ảnh mỗi 9 giây
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % oldFieldImages.length);
    }, 9000);
    return () => clearInterval(slideInterval);
  }, [oldFieldImages.length]);

  // Hiệu ứng "quét" (sweep) khi đổi ảnh
  useEffect(() => {
    setIsAutoAnimating(true);
    // 1. Kéo nhanh về 100% để hiển thị toàn bộ ảnh CŨ
    setProgressSlider(100);
    
    // 2. Chờ 1s, bắt đầu quét sang 0% để lộ ảnh MỚI
    const t1 = setTimeout(() => {
      setProgressSlider(0);
    }, 1000);

    // 3. Giữ nguyên ảnh MỚI trong 2s, sau đó quét về lại mức 50% (hiển thị nửa/nửa)
    const t2 = setTimeout(() => {
      setProgressSlider(50);
    }, 4000);

    // 4. Kết thúc hiệu ứng để người dùng có thể tự kéo thả mượt mà
    const t3 = setTimeout(() => {
      setIsAutoAnimating(false);
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentSlide]);

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

        {/* DESKTOP: Side-by-side Comparison (Màn hình lớn) */}
        <div className="hidden md:flex flex-row w-full max-w-6xl mb-16 relative items-center justify-center group">
          
          {/* SLIDER SÂN CŨ */}
          <div className="relative w-1/2 h-[450px] lg:h-[500px] rounded-l-3xl overflow-hidden shadow-2xl border-y-2 border-l-2 border-white/10 bg-gray-900 z-10">
            <div className="absolute top-6 left-6 bg-red-600/90 backdrop-blur-sm text-white px-5 py-2.5 font-bold rounded-xl z-20 shadow-lg">
              Hiện tại (Đang xuống cấp)
            </div>
            <img 
              src={oldFieldImages[currentSlide]} 
              alt="Sân đất hiện tại" 
              className="w-full h-full object-cover filter grayscale-[20%] transition-all duration-700 hover:scale-105 hover:grayscale-0"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1628882885449-37e127394c8e?q=80&w=2000&auto=format&fit=crop"; }}
            />
          </div>
          
          {/* Mũi tên ở giữa */}
          <div className="absolute z-30 bg-emerald-500 rounded-full p-4 shadow-[0_0_30px_rgba(16,185,129,0.8)] border-4 border-emerald-950 transition-transform duration-500 group-hover:scale-110">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>

          {/* SÂN MỚI (MỤC TIÊU) */}
          <div className="relative w-1/2 h-[450px] lg:h-[500px] rounded-r-3xl overflow-hidden shadow-2xl border-y-2 border-r-2 border-white/10 bg-emerald-900 z-10">
            <div className="absolute top-6 left-12 bg-emerald-500/90 backdrop-blur-sm text-white px-5 py-2.5 font-bold rounded-xl z-20 shadow-lg">
              Mục tiêu (Cỏ nhân tạo 3D)
            </div>
            <img 
              src={newFieldImages[currentSlide]} 
              alt="Mô phỏng sân mới" 
              className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518605368461-1e1e38cd3543?q=80&w=2000&auto=format&fit=crop"; }}
            />
          </div>

          {/* Controls chung cho Desktop */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-8 bg-emerald-950/90 px-8 py-4 rounded-full backdrop-blur-md border border-white/10 shadow-2xl z-40">
            <button onClick={prevSlide} className="text-white hover:text-emerald-400 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-4">
              {oldFieldImages.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all rounded-full ${idx === currentSlide ? 'w-10 h-2.5 bg-emerald-400' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="text-white hover:text-emerald-400 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* MOBILE: Before / After Interactive Slider (Màn hình nhỏ) */}
        <div className="flex md:hidden w-full max-w-5xl mb-12 flex-col items-center">
          <div className="relative w-full h-[60vh] min-h-[350px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-white/10 group">
            
            {/* Ảnh MỚI (Mục tiêu) nằm dưới */}
            <img 
              src={newFieldImages[currentSlide]} 
              alt="Mục tiêu" 
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518605368461-1e1e38cd3543?q=80&w=2000&auto=format&fit=crop"; }}
            />
            <div className="absolute bottom-6 right-4 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-bold rounded-lg z-10 pointer-events-none shadow-lg border border-white/20">
              Mục tiêu (Cỏ nhân tạo 3D)
            </div>

            {/* Ảnh CŨ (Hiện tại) bị cắt bởi clip-path */}
            <div 
              className={`absolute inset-0 w-full h-full pointer-events-none ${isAutoAnimating ? 'transition-all duration-1000 ease-in-out' : ''}`}
              style={{ clipPath: `polygon(0 0, ${progressSlider}% 0, ${progressSlider}% 100%, 0 100%)` }}
            >
              <img 
                src={oldFieldImages[currentSlide]} 
                alt="Hiện tại" 
                className="absolute inset-0 w-full h-full object-cover filter grayscale-[20%]"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1628882885449-37e127394c8e?q=80&w=2000&auto=format&fit=crop"; }}
              />
              <div 
                className="absolute bottom-6 left-4 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-bold rounded-lg shadow-lg border border-white/20 transition-opacity duration-200"
                style={{ opacity: progressSlider > 30 ? 1 : 0 }}
              >
                Hiện tại (Đang xuống cấp)
              </div>
            </div>

            {/* Thanh trượt (Slider handle) */}
            <div 
              className={`absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.8)] ${isAutoAnimating ? 'transition-all duration-1000 ease-in-out' : ''}`}
              style={{ left: `calc(${progressSlider}% - 2px)` }}
            >
              <div className="w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-500 text-emerald-600 pointer-events-none">
                <ChevronLeft className="w-5 h-5 -mr-1.5" />
                <ChevronRight className="w-5 h-5 -ml-1.5" />
              </div>
            </div>

            {/* Input range ẩn để nhận sự kiện kéo thả (Touch & Mouse) */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progressSlider} 
              onPointerDown={() => setIsAutoAnimating(false)}
              onChange={(e) => setProgressSlider(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 touch-pan-y"
            />
          </div>

          {/* Carousel controls (Mobile) */}
          <div className="flex items-center justify-center mt-6 gap-6 bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 shadow-lg">
            <button onClick={prevSlide} className="p-2 bg-white/10 active:bg-emerald-500 rounded-full text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-3">
              {oldFieldImages.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all rounded-full ${idx === currentSlide ? 'w-8 h-2.5 bg-emerald-400' : 'w-2.5 h-2.5 bg-white/30'}`}
                />
              ))}
            </div>

            <button onClick={nextSlide} className="p-2 bg-white/10 active:bg-emerald-500 rounded-full text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
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
