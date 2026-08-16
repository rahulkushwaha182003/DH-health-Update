import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FlaskConical, Microscope } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppWidget from "../ui/WhatsAppWidget";
import CartStickyBanner from "../ui/CartStickyBanner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450); // Simulated transition time to keep load times snappy

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Sleek top progress loading bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003B73] via-[#3B8B41] to-[#0b417c] z-[9999] transition-all duration-300">
          <div 
            className="h-full bg-white/30 animate-pulse" 
            style={{
              width: '100%',
              animation: 'running-progress 1.5s infinite linear'
            }}
          />
        </div>
      )}

      {/* Center Glassmorphic Pathology Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/15 backdrop-blur-[2px] flex justify-center items-center z-[9998] transition-opacity duration-300 pointer-events-none">
          <div className="bg-white/95 p-6 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center gap-4 animate-fade-in min-w-[180px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Spinning gradient outer glow ring */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-[#3B8B41]/20 border-t-[#003B73] border-r-[#003B73] animate-spin" 
                style={{ animationDuration: '0.8s' }}
              />
              
              {/* Inner Circle with pulsing Flask/Microscope */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#003B73]/5 to-[#3B8B41]/5 rounded-full flex items-center justify-center shadow-inner relative">
                <FlaskConical className="w-6 h-6 text-[#003B73] animate-pulse" />
                <Microscope className="w-3.5 h-3.5 text-[#3B8B41] absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm" />
              </div>
            </div>
            
            <div className="text-center flex flex-col gap-0.5">
              <span className="text-xs font-extrabold text-[#003B73] tracking-widest uppercase">Diagnostics Hub</span>
              <span className="text-[10px] font-bold text-slate-400 animate-pulse tracking-wide">Analyzing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for progress animation */}
      <style>{`
        @keyframes running-progress {
          0% { margin-left: 0px; margin-right: 100%; }
          50% { margin-left: 25%; margin-right: 0%; }
          100% { margin-left: 100%; margin-right: 0%; }
        }
      `}</style>

      <Header />
      
      {/* Content wrapper with smooth fade and blur transitions */}
      <main className={`flex-1 transition-all duration-300 ${
        isLoading 
          ? "opacity-40 filter blur-[1px] pointer-events-none select-none" 
          : "opacity-100 filter blur-0"
      }`}>
        {children}
      </main>

      <Footer />
      {location.pathname !== "/book-appointment" && <WhatsAppWidget />}
      {location.pathname !== "/book-appointment" && <CartStickyBanner />}
    </div>
  );
};

export default Layout;
