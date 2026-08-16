import React, { useState, useEffect } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import { Button } from "./button";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "917649885936";
const MESSAGE = "Hi Diagnostics Hub, I want to book a diagnostic test.";

const WhatsAppWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    // Show widget after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip after 1.5 more seconds
      setTimeout(() => setShowTooltip(true), 1500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleChat = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
    window.open(url, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed right-4 md:right-6 z-50 flex flex-col items-end gap-3 md:gap-3.5 transition-all duration-300 ${
      cartItems.length > 0 ? "bottom-24 md:bottom-28" : "bottom-4 md:bottom-6"
    }`}>
      {/* Premium Chat Bubble */}
      {showTooltip && (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100/80 flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-500 w-[calc(100vw-32px)] sm:w-72 max-w-[280px] mb-1 relative overflow-hidden group">
          {/* Subtle green top bar decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success to-primary" />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <p className="text-xs font-bold text-slate-800">Diagnostics Hub Support</p>
            </div>
            
            <p className="text-[11px] md:text-[12px] text-slate-500 leading-normal">
              Need assistance? Book your home sample collection on WhatsApp or over a direct Call!
            </p>
            
            <div className="flex items-center gap-3 pt-1">
              <button 
                onClick={handleChat}
                className="text-[11px] font-extrabold text-success hover:text-success/80 transition-colors uppercase tracking-wider font-bold"
              >
                Chat Now
              </button>
              <span className="text-slate-200 text-[10px]">|</span>
              <a 
                href="tel:+917649885936"
                className="text-[11px] font-extrabold text-[#007AFF] hover:text-[#007AFF]/80 transition-colors uppercase tracking-wider font-bold"
              >
                Call Now
              </a>
            </div>
          </div>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
            aria-label="Close message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Improved Premium Floating WhatsApp Button */}
      <div className="relative group/wa">
        {/* Glowing aura effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] animate-ping opacity-25 scale-110 pointer-events-none"></span>
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] opacity-0 group-hover/wa:opacity-30 blur-md transition-opacity duration-300"></span>
        
        <Button
          onClick={handleChat}
          size="icon"
          className="relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] hover:from-[#0f7569] hover:to-[#1ebe55] text-white shadow-[0_8px_25px_rgba(37,211,102,0.35)] group-hover/wa:shadow-[0_12px_30px_rgba(37,211,102,0.5)] group-hover/wa:-translate-y-1 transition-all duration-300 border border-white/10 flex items-center justify-center"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="h-8 w-8 md:h-9 md:w-9 text-white fill-current transition-transform duration-300 group-hover/wa:scale-110"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute right-full mr-4 bg-slate-900/95 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/wa:opacity-100 transition-all duration-300 shadow-2xl scale-95 group-hover/wa:scale-100 origin-right whitespace-nowrap pointer-events-none border border-white/10 hidden md:block">
            Book on WhatsApp
          </span>
        </Button>
      </div>

      {/* Improved Premium Floating Call Button */}
      <div className="relative group/call">
        {/* Glowing aura effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#004A99] to-[#007AFF] animate-ping opacity-20 scale-110 pointer-events-none"></span>
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#004A99] to-[#007AFF] opacity-0 group-hover/call:opacity-35 blur-md transition-opacity duration-300"></span>
        
        <Button
          onClick={() => window.open("tel:+917649885936", "_self")}
          size="icon"
          className="relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-tr from-[#004A99] to-[#007AFF] hover:from-[#003875] hover:to-[#0069db] text-white shadow-[0_8px_25px_rgba(0,122,255,0.35)] group-hover/call:shadow-[0_12px_30px_rgba(0,122,255,0.5)] group-hover/call:-translate-y-1 transition-all duration-300 border border-white/10 flex items-center justify-center"
        >
          <Phone className="h-6.5 w-6.5 md:h-7 md:w-7 text-white transition-transform duration-300 group-hover/call:scale-110" />
          <span className="absolute right-full mr-4 bg-slate-900/95 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/call:opacity-100 transition-all duration-300 shadow-2xl scale-95 group-hover/call:scale-100 origin-right whitespace-nowrap pointer-events-none border border-white/10 hidden md:block">
            Call to Book Test
          </span>
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppWidget;
