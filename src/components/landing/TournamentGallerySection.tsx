import { useRef, useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import { TOURNAMENT_IMAGES } from "@/data/mockData";

export default function TournamentGallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [didDrag, setDidDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // State quản lý ảnh đang được xem phóng to
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Lặp lại mảng ảnh nhiều lần để tạo cảm giác vô tận (infinite scroll)
  const displayImages = [...TOURNAMENT_IMAGES, ...TOURNAMENT_IMAGES, ...TOURNAMENT_IMAGES, ...TOURNAMENT_IMAGES];

  // Logic tự động chạy (Auto-scroll)
  useEffect(() => {
    let animationFrameId: number;
    const scroll = () => {
      // Chỉ tự động cuộn khi không có thao tác kéo, không hover và không mở ảnh
      if (scrollRef.current && !isHovered && !isDragging && !selectedImage) {
        scrollRef.current.scrollLeft += 1.5; 
        
        if (scrollRef.current.scrollLeft >= (scrollRef.current.scrollWidth / 4) * 3) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 4;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging, selectedImage]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDidDrag(false); // Reset trạng thái drag khi bắt đầu bấm
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
    setDidDrag(true); // Đánh dấu là người dùng đang kéo chứ không phải click
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleImageClick = (src: string) => {
    if (!didDrag) {
      setSelectedImage(src);
    }
  };

  return (
    <section className="py-10 md:py-12 bg-white border-b border-gray-100 overflow-hidden select-none">
      <div className="container px-4 mx-auto max-w-4xl text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Camera className="w-6 h-6 mr-3 text-emerald-600" />
          Nhìn Lại Các Giải Đấu Phong Trào
        </h2>
        <p className="text-gray-500">Những khoảnh khắc rực cháy đam mê trên sân bóng quê hương</p>
      </div>

      <div className="relative bg-gray-900 py-6 shadow-inner">
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

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
            <div 
              key={idx} 
              onClick={() => handleImageClick(src)}
              className="mx-2 md:mx-4 shrink-0 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg transition-transform duration-300 hover:scale-105 hover:border-emerald-500"
            >
              <img 
                draggable="false"
                src={src} 
                alt={`Giải đấu ${idx}`} 
                className="w-64 md:w-80 h-40 md:h-56 object-cover pointer-events-none"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1575361204481-48a2b5e28bf6?q=80&w=2000&auto=format&fit=crop";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal xem ảnh phóng to */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-md transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Phóng to" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} // Ngăn việc bấm vào ảnh làm đóng modal
          />
        </div>
      )}

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
