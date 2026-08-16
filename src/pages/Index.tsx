import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import OfferBanner from "@/components/home/OfferBanner";
import CitySelector from "@/components/home/CitySelector";
import HeroSection from "@/components/home/HeroSection";
import QuickActions from "@/components/home/QuickActions";
import DiagnosticShowcase from "@/components/home/DiagnosticShowcase";
import ServicesSection from "@/components/home/ServicesSection";
import PartnerLabs from "@/components/home/PartnerLabs";

import WhyChooseSection from "@/components/home/WhyChooseSection";
import AboutPreview from "@/components/home/AboutPreview";
import CTASection from "@/components/home/CTASection";
import HomeSlider from "@/components/home/HomeSlider";
import HealthPackages from "@/components/home/HealthPackages";
import { Droplet, Award, Zap, GitCompare } from "lucide-react";

const Index = () => {
  return (
    <>
      <SEOHead
        title="Blood Test & Diagnostic Services Across MP | Diagnostics Hub"
        description="Book blood tests, full body checkups and home sample collection across Madhya Pradesh through Diagnostics Hub's verified partner lab network."
        canonical="/"
        keywords="online blood test booking in Madhya Pradesh, blood test MP, diagnostic services Madhya Pradesh, full body checkup MP, home sample collection Madhya Pradesh, pathology lab MP, NABL lab Madhya Pradesh, blood test centers MP, diagnostic labs in MP, health checkup packages Madhya Pradesh"
      />
      <OfferBanner />
      <CitySelector />
      <Layout>
        <HeroSection />
        
        <div className="bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/80 border-y border-emerald-100/80 py-8 my-4 shadow-sm relative overflow-hidden">
          {/* Decorative subtle background bubbles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Card 1 */}
              <div className="flex items-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-md group-hover:scale-110 transition-all duration-300 shrink-0">
                  <Droplet className="h-7 w-7 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    Home Blood Collection
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Safe & Convenient Testing</p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="flex items-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-md group-hover:scale-110 transition-all duration-300 shrink-0">
                  <Award className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    Expert Phlebotomy
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Certified Professionals</p>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="flex items-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-md group-hover:scale-110 transition-all duration-300 shrink-0">
                  <Zap className="h-7 w-7 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    Fast Services
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Quick & Accurate Results</p>
                </div>
              </div>
              
              {/* Card 4 */}
              <div className="flex items-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center text-[#003B73] shadow-md group-hover:scale-110 transition-all duration-300 shrink-0">
                  <GitCompare className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    Compare Labs or Price
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Compare diagnostics labs, services & more</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <HealthPackages hideBanner={true} />
        <HomeSlider />
        <DiagnosticShowcase />
        <PartnerLabs />
        <ServicesSection />

        <WhyChooseSection />
        <AboutPreview />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
