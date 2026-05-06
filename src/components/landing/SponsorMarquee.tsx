import { useDonations } from "@/contexts/DonationContext";
import { formatCurrency } from "@/lib/format";
import { Star } from "lucide-react";

export default function SponsorMarquee() {
  const { allTopSponsors } = useDonations();

  return (
    <section className="bg-gray-50 pt-16 md:pt-20 pb-4 overflow-hidden relative">
      <div className="text-center mb-6 px-4">
        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-emerald-400" />
          Những Tấm Lòng Vàng
          <Star className="w-4 h-4 text-emerald-400" />
        </h3>
      </div>
      
      {/* Marquee Container */}
      <div className="relative flex overflow-x-hidden group bg-white py-4 border-y border-gray-200 shadow-sm">
        {/* Gradients for smooth fade on edges */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

        <div className="animate-marquee flex items-center whitespace-nowrap">
          {/* We map twice to create an infinite loop effect */}
          {[...allTopSponsors, ...allTopSponsors].map((sponsor, idx) => (
            <div key={`${sponsor.id}-${idx}`} className="flex items-center mx-6">
              <span className="font-bold text-gray-800 text-lg mr-2">{sponsor.name}</span>
              <span className="text-emerald-600 font-black">{formatCurrency(sponsor.amount)}</span>
              <span className="mx-6 text-gray-300">•</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
