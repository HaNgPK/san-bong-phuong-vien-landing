import { useRef, useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { TOURNAMENT_IMAGES } from "@/data/mockData";

export default function TournamentGallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Lặp lại mảng ảnh nhiều lần để tạo cảm giác vô tận (infinite scroll)
  const displayImages = [...TOURNAMENT_IMAGES, ...TOURNAMENT_IMAGES, ...TOURNAMENT_IMAGES, ...TOURNAMENT_IMAGES];

  // Logic tự động chạy (Auto-scroll)
  useEffect(() => {
    let animationFrameId: number;
    const scroll = () => {
      if (scrollRef.current && !isHovered && !isDragging) {
        scrollRef.current.scrollLeft += 1.5; // Tốc độ trượt
        
        // Khi trượt quá 2/3 tổng chiều dài, reset về 1/3 để tạo vòng lặp vô tận
        if (scrollRef.current.scrollLeft >= (scrollRef.current.scrollWidth / 4) * 3) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 4;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging]);

  // Logic kéo thả (Drag to scroll)
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  
  const onMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const onMouseUp = () => setIsDragging(false);
  
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Nhân 2 để kéo nhạy hơn (nhanh hơn)
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-100 overflow-hidden select-none">
      <div className="container px-4 mx-auto max-w-4xl text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Camera className="w-6 h-6 mr-3 text-emerald-600" />
          Nhìn Lại Các Giải Đấu Phong Trào
        </h2>
        <p className="text-gray-500">Những khoảnh khắc rực cháy đam mê trên sân bóng quê hương</p>
      </div>

      <div className="relative bg-gray-900 py-6 shadow-inner">
        {/* Lớp phủ mờ 2 bên cạnh */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

        {/* Khung cuộn ảnh */}
        <div 
          ref={scrollRef}
          className={`flex items-center overflow-x-auto px-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollBehavior: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {displayImages.map((src, idx) => (
            <div key={idx} className="mx-2 md:mx-4 shrink-0 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg pointer-events-none">
              <img 
                src={src} 
                alt={`Giải đấu ${idx}`} 
                className="w-64 md:w-80 h-40 md:h-56 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1575361204481-48a2b5e28bf6?q=80&w=2000&auto=format&fit=crop";
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        /* Ẩn thanh cuộn mặc định của trình duyệt */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
