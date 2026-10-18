import { Sparkles } from "lucide-react";

const OfferBanner = () => {
  const items = [...Array(8)];

  return (
    <div className="bg-[#002B54] text-white py-2.5 sm:py-3 overflow-hidden flex whitespace-nowrap relative border-b border-white/10 shadow-[inset_0_-1px_4px_rgba(0,0,0,0.1)]">
      {/* subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      
      <div className="flex animate-marquee hover:[animation-play-state:paused] w-max items-center relative z-10">
        {items.map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 sm:gap-6 px-4 sm:px-8">
            <div className="flex items-center gap-2 shrink-0 text-[12px] sm:text-[14px] md:text-[15px]">
              <Sparkles className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 text-[#FBBF24] fill-[#FBBF24]" />
              <span className="font-bold tracking-wide text-white">
                Get Upto <span className="text-[#FBBF24] font-extrabold px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-300">40% Off</span> On Routine And Special Test Booking
              </span>
            </div>
            
            {/* Elegant Separator */}
            <div className="flex items-center justify-center gap-1.5 opacity-60 ml-3 sm:ml-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]"></div>
              <div className="w-1 h-1 rounded-full bg-white/40"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferBanner;
