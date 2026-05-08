import { useState } from 'react';
import FootballField3D from './FootballField3D';
import { Ruler, Maximize2, Minimize2 } from 'lucide-react';

export default function FootballFieldSection() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ length: 51, width: 32 });

  const options = [
    { name: 'Phương án hiện tại', length: 51, width: 32 },
    { name: 'Phương án kéo dài (+2m)', length: 53, width: 32 },
  ];

  return (
    <section id="3d-model" className="py-8 md:py-10 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-3 text-emerald-600">
            <Ruler className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Mô Hình Sân Bóng Phương Viên
          </h2>
          <p className="text-slate-600 max-w-2xl text-lg">
            Khám phá sân bóng Phương Viên với mô hình 3D chân thực. Hãy thử chuyển đổi các phương án kích thước để so sánh tỷ lệ thực tế.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-5">
          {options.map((opt, index) => (
            <button
              key={index}
              onClick={() => setDimensions({ length: opt.length, width: opt.width })}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                dimensions.length === opt.length && dimensions.width === opt.width
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.name} ({opt.length}m x {opt.width}m)
            </button>
          ))}
        </div>

        <div className={`transition-all duration-500 ease-in-out mx-auto ${isFullscreen ? 'fixed inset-4 z-50' : 'max-w-5xl relative'}`}>
          {isFullscreen && (
            <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm -z-10" />
          )}
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-lg transition-colors border border-white/20"
            title={isFullscreen ? "Thu nhỏ" : "Phóng to"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <div className={`w-full ${isFullscreen ? 'h-full' : 'h-[500px]'} rounded-xl overflow-hidden shadow-2xl`}>
          <FootballField3D length={dimensions.length} width={dimensions.width} />
        </div>
        </div>
      </div>
    </section>
  );
}
