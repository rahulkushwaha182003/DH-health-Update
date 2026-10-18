import React, { useState } from "react";
import { 
  ShoppingCart, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Star,
  ThumbsUp,
  Heart,
  Eye,
  MessageCircle,
  Home,
  FlaskConical,
  ChevronRight,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { RemoveConfirmDialog } from "@/components/ui/RemoveConfirmDialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface Package {
  id: number;
  name: string;
  subtitle: string;
  tests: string[];
  mrp: number;
  offerPrice: number;
  color: string;
  textColor: string;
  tag?: string;
  fasting: boolean;
  sampleType: string;
  duration: string;
}

const packages: Package[] = [
  {
    id: 1,
    name: "DH Health Package 1",
    subtitle: "Full Body Checkup",
    tests: [
      "Glucose Fasting (BSF) (1)",
      "Haemogram (CBC + ESR) (27)",
      "HbA1C (Glycosylated Haemoglobin) (2)",
      "Kidney Function Test (KFT) (12)",
      "Lipid Profile (9)",
      "Iron Profile Test (7)",
      "Thyroid Profile Total (3)",
      "Urine Routine & Microscopic Examination (23)",
      "Vitamin B12/Cyanocobalamin (1)",
      "Vitamin D 25 Hydroxy (1)",
      "Liver Function Test (LFT) (12)"
    ],
    mrp: 7500,
    offerPrice: 1599,
    color: "from-blue-600 via-indigo-600 to-indigo-700",
    textColor: "text-blue-600",
    tag: "Popular Choice",
    fasting: true,
    sampleType: "Home Sample Collection Available",
    duration: "24 Hours"
  },
  {
    id: 2,
    name: "DH Health Package 2",
    subtitle: "Full Body Checkup",
    tests: [
      "CBC + ESR (26)",
      "Liver Function Test (11)",
      "Kidney Function Test (7)",
      "Lipid Profile (9)",
      "Thyroid Function Test (3)",
      "Fasting Blood Sugar",
      "Iron Profile (4)",
      "HbA1C (Glycosylated Haemoglobin) (2)",
      "Urine Routine & Microscopic Examination (23)"
    ],
    mrp: 4500,
    offerPrice: 1099,
    color: "from-blue-600 via-indigo-600 to-indigo-700",
    textColor: "text-blue-600",
    tag: "Best Value",
    fasting: true,
    sampleType: "Home Sample Collection Available",
    duration: "12-24 Hours"
  },
  {
    id: 3,
    name: "DH Health Package 3",
    subtitle: "Full Body Checkup",
    tests: [
      "CBC + ESR (26 Tests)",
      "Liver Function Test (11)",
      "Kidney Function Test (7)",
      "Lipid Profile (9)",
      "Thyroid Function Test (3)",
      "Fasting Blood Sugar"
    ],
    mrp: 3050,
    offerPrice: 799,
    color: "from-blue-600 via-indigo-600 to-indigo-700",
    textColor: "text-blue-600",
    tag: "Essential Care",
    fasting: false,
    sampleType: "Home Sample Collection Available",
    duration: "12 Hours"
  }
];

const getTagIcon = (id: number) => {
  switch (id) {
    case 1:
      return <Star className="w-2.5 h-2.5 shrink-0 fill-current" />;
    case 2:
      return <ThumbsUp className="w-2.5 h-2.5 shrink-0" />;
    case 3:
      return <Heart className="w-2.5 h-2.5 shrink-0 fill-current" />;
    default:
      return <Sparkles className="w-2.5 h-2.5 shrink-0" />;
  }
};

interface HealthPackagesProps {
  hideBanner?: boolean;
  isPage?: boolean;
}

const HealthPackages = ({ hideBanner = false, isPage = false }: HealthPackagesProps) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [selectedPkgToRemove, setSelectedPkgToRemove] = useState<Package | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkgForModal, setSelectedPkgForModal] = useState<Package | null>(null);

  const isAlreadyInCart = (packageId: number) => {
    return cartItems.some(item => item.id === `pkg-${packageId}`);
  };

  const handleBookNow = (pkg: Package) => {
    const cartId = `pkg-${pkg.id}`;
    if (isAlreadyInCart(pkg.id)) {
      setSelectedPkgToRemove(pkg);
      setConfirmRemoveOpen(true);
    } else {
      addToCart({
        id: cartId,
        name: pkg.name,
        price: pkg.mrp,
        discountPrice: pkg.offerPrice,
        parametersCount: pkg.tests.length,
        fastingRequired: pkg.fasting,
        labName: "Diagnostics Hub"
      });
    }
  };

  const handleWhatsApp = (packageId: number) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      const message = `Hi Diagnostics Hub, I want to book ${pkg.name} (${pkg.subtitle}) for ₹${pkg.offerPrice}. Please assist me.`;
      const url = `https://wa.me/917649885936?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-slate-50 via-blue-50/10 to-white relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header Hero Banner or Clean Centered Header */}
        {!hideBanner ? (
          <div className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent border border-blue-500/10 rounded-3xl p-6 lg:p-8 mb-12 relative overflow-hidden">
            {/* Subtle glow circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left side: Image (Enlarged and Background Removed) */}
              <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
                <div className="relative group max-w-[260px] md:max-w-full">
                  <img 
                    src="/images/phlebotomists_white_bg.jpg" 
                    alt="Diagnostics Hub Phlebotomists" 
                    className="object-cover w-full h-auto relative z-10 group-hover:scale-[1.03] transition-transform duration-500 mix-blend-multiply"
                  />
                </div>
              </div>
              
              {/* Right side: Text */}
              <div className="md:col-span-7 lg:col-span-8 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100/50 mb-4 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Preventative Healthcare
                </div>
                {isPage ? (
                  <h1 className="text-3xl lg:text-4xl font-black text-[#003B73] mb-4 tracking-tight leading-tight">
                    Health Checkup Packages in Madhya Pradesh
                  </h1>
                ) : (
                  <h2 className="text-3xl lg:text-4xl font-black text-[#003B73] mb-4 tracking-tight leading-tight">
                    DH Health Packages
                  </h2>
                )}
                <p className="text-slate-600 text-base lg:text-lg leading-relaxed max-w-3xl">
                  Specially curated diagnostic screenings to safeguard your health and identify potential health risks early.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100/50 mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Popular Checkups
            </div>
            {isPage ? (
              <h1 className="text-3xl md:text-4xl font-black text-[#003B73] mb-3 tracking-tight">
                Health Checkup Packages in Madhya Pradesh
              </h1>
            ) : (
              <h2 className="text-3xl md:text-4xl font-black text-[#003B73] mb-3 tracking-tight">
                DH Health Packages
              </h2>
            )}
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium">
              Curated healthcare panels to keep you and your family protected. Book your sample collection today.
            </p>
          </div>
        )}

        {/* Full Body Profile Package - Main Master Card Container */}
        <div className="bg-white rounded-3xl border-2 border-blue-100/80 shadow-xl p-6 lg:p-8 relative overflow-hidden">
          {/* Subtle background glow elements */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

          {/* Master Card Header */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-[#003B73] border border-blue-200/60 mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                Featured Health Care
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#003B73] tracking-tight leading-tight">
                Full Body Profile Package
              </h3>
              <p className="text-slate-600 text-sm md:text-base font-medium mt-1 max-w-2xl">
                Comprehensive health checkups designed to assess your vital organs and overall wellness.
              </p>
            </div>

            {/* Quick Benefits Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-extrabold shadow-sm">
                <Home className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Home Sample Collection Available</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-800 text-xs font-extrabold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>NABL-Accredited Partner Labs</span>
              </div>
            </div>
          </div>

          {/* Cards Grid Inside Full Body Profile Package */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {packages.map((pkg) => {
              const inCart = isAlreadyInCart(pkg.id);
              const savings = pkg.mrp - pkg.offerPrice;
              const discountPercent = Math.round((savings / pkg.mrp) * 100);

              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPkgForModal(pkg);
                    setModalOpen(true);
                  }}
                  className={`group flex flex-col justify-between bg-white rounded-3xl border transition-all duration-500 relative overflow-hidden h-full border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-300 hover:shadow-blue-500/10 hover:-translate-y-2 cursor-pointer`}
                >
                  {/* Package Main Details */}
                  <div className="p-6 pb-4 flex-grow flex flex-col justify-start">
                    {/* Decorative background visual per card type */}
                    <div className={`absolute -top-10 -left-10 w-24 h-24 rounded-full blur-2xl opacity-40 transition-transform group-hover:scale-125 duration-500 bg-gradient-to-r ${pkg.color}`} />
                    
                    {/* Top Category Tag and Certification Row */}
                    <div className="relative z-10 flex items-center justify-between mb-6 gap-2">
                      {pkg.tag ? (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm bg-blue-600 text-white`}>
                          {getTagIcon(pkg.id)}
                          {pkg.tag}
                        </span>
                      ) : (
                        <div />
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        Accredited Lab
                      </span>
                    </div>

                    {/* Package Name Container (No Icon) */}
                    <div className="relative z-10 mb-5">
                      <h3 className="text-xl font-extrabold text-slate-800 leading-tight break-words">
                        {pkg.name}
                      </h3>
                    </div>

                    {/* Highlights/Chips - Home Sample Collection Available */}
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">
                        <Home className="w-3.5 h-3.5 text-white" />
                        <span>{pkg.sampleType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Footer Actions */}
                  <div className="p-6 bg-gradient-to-b from-slate-50/30 to-slate-50 border-t border-slate-100/50 rounded-b-3xl">
                    {/* Pricing Details */}
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold mb-0.5">Special Price</p>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-slate-800 tracking-tight">₹{pkg.offerPrice}</span>
                          <span className="text-sm text-slate-400 line-through font-semibold">₹{pkg.mrp}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-red-100/80 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full mb-1">
                          {discountPercent}% OFF
                        </span>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                          Save ₹{savings}
                        </p>
                      </div>
                    </div>

                    {/* Actions Buttons: Book Now & WhatsApp */}
                    <div className="flex gap-2.5">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAlreadyInCart(pkg.id)) {
                            addToCart({
                              id: `pkg-${pkg.id}`,
                              name: pkg.name,
                              price: pkg.mrp,
                              discountPrice: pkg.offerPrice,
                              parametersCount: pkg.tests.length,
                              fastingRequired: pkg.fasting,
                              labName: "Diagnostics Hub"
                            });
                          }
                          navigate("/book-appointment");
                        }}
                        className="flex-1 font-bold h-11 rounded-2xl bg-[#003B73] hover:bg-[#002B54] text-white shadow-md gap-1.5 transition-all duration-300 text-xs sm:text-sm"
                      >
                        Book Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsApp(pkg.id);
                        }}
                        className="flex-1 font-bold h-11 border-emerald-500/40 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 rounded-2xl gap-1.5 transition-all duration-300 shadow-sm text-xs sm:text-sm"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0 text-[#25D366]" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Card: Others / Custom Tests */}
            <div
              onClick={() => navigate("/tests")}
              className="group flex flex-col justify-between bg-white rounded-3xl border transition-all duration-500 relative overflow-hidden h-full border-slate-100 shadow-sm hover:shadow-2xl hover:border-amber-300 hover:shadow-amber-500/10 hover:-translate-y-2 cursor-pointer"
            >
              {/* Package Main Details */}
              <div className="p-6 pb-4 flex-grow flex flex-col justify-start">
                {/* Decorative background visual */}
                <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full blur-2xl opacity-40 transition-transform group-hover:scale-125 duration-500 bg-gradient-to-r from-amber-500 to-orange-500" />
                
                {/* Top Category Tag and Certification Row */}
                <div className="relative z-10 flex items-center justify-between mb-6 gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm bg-amber-500 text-white">
                    <FlaskConical className="w-2.5 h-2.5 shrink-0" />
                    500+ Tests
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    Accredited Lab
                  </span>
                </div>

                {/* Title */}
                <div className="relative z-10 mb-2">
                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                    Others / Custom Tests
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-bold mb-4">Select Individual Tests & Labs</p>

                {/* Bullet Points */}
                <div className="space-y-2.5 relative z-10 mt-2">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Choose individual blood tests like CBC, Thyroid, B12, sugar, etc.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Compare prices and choose from multiple certified local lab partners.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Instant appointment scheduling and home sample collection available.</span>
                  </div>
                </div>
              </div>

              {/* Footer / Action Buttons */}
              <div className="p-6 bg-gradient-to-b from-slate-50/30 to-slate-50 border-t border-slate-100/50 rounded-b-3xl">
                <div className="flex gap-2.5">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/tests");
                    }}
                    className="flex-1 font-bold h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-amber-500/10 rounded-2xl gap-1.5 transition-all duration-300 shadow-md text-xs sm:text-sm"
                  >
                    Browse Tests
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      const message = "Hi Diagnostics Hub, I want to inquire about custom blood tests and health packages. Please assist me.";
                      window.open(`https://wa.me/917649885936?text=${encodeURIComponent(message)}`, "_blank");
                    }}
                    className="flex-1 font-bold h-11 border-emerald-500/40 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 rounded-2xl gap-1.5 transition-all duration-300 shadow-sm text-xs sm:text-sm"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0 text-[#25D366]" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Master Card Bottom Bar with Call Now & WhatsApp */}
          <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">Need help choosing the right package?</p>
                <p className="text-xs text-slate-500">Call directly or connect instantly with our lab team on WhatsApp.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                onClick={() => window.open("tel:+917649885936", "_self")}
                className="flex-1 sm:flex-none font-bold h-11 px-6 rounded-2xl bg-[#003B73] hover:bg-[#002B54] text-white shadow-md gap-2 transition-all duration-300"
              >
                <Phone className="w-4 h-4 shrink-0" />
                Call Now
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const message = "Hi Diagnostics Hub, I want to book a Full Body Profile Package. Please assist me.";
                  window.open(`https://wa.me/917649885936?text=${encodeURIComponent(message)}`, "_blank");
                }}
                className="flex-1 sm:flex-none font-bold h-11 px-6 border-green-500/40 text-green-700 bg-green-50/60 hover:bg-green-100 hover:text-green-800 rounded-2xl gap-2 transition-all duration-300 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-[#25D366]" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      {selectedPkgToRemove && (
        <RemoveConfirmDialog
          isOpen={confirmRemoveOpen}
          onClose={() => {
            setConfirmRemoveOpen(false);
            setSelectedPkgToRemove(null);
          }}
          onConfirm={() => {
            removeFromCart(`pkg-${selectedPkgToRemove.id}`);
          }}
          itemName={selectedPkgToRemove.name}
          isPackage={true}
        />
      )}

      {/* Know More Dialog Modal */}
      {selectedPkgForModal && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="rounded-3xl max-w-lg p-6 bg-white border border-slate-100 shadow-2xl">
            <DialogHeader className="pb-4 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-800 text-left">
                {selectedPkgForModal.name}
              </h3>
              <p className={`text-xs font-bold uppercase tracking-wider text-left mt-0.5 ${selectedPkgForModal.textColor}`}>
                {selectedPkgForModal.subtitle}
              </p>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-extrabold text-slate-700">
                  Included Tests ({selectedPkgForModal.tests.length})
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/15 border border-emerald-500/10">
                  <Home className="w-3.5 h-3.5 text-white animate-pulse" />
                  {selectedPkgForModal.sampleType}
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {selectedPkgForModal.tests.map((test, index) => (
                  <li
                    key={index}
                    className="text-xs font-semibold text-slate-750 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100/50 hover:bg-slate-100/40 transition-colors duration-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Package Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">₹{selectedPkgForModal.offerPrice}</span>
                  <span className="text-xs text-slate-400 line-through font-semibold">₹{selectedPkgForModal.mrp}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleBookNow(selectedPkgForModal);
                    setModalOpen(false);
                  }}
                  className={`font-bold h-11 px-6 rounded-2xl shadow-md gap-2 ${
                    isAlreadyInCart(selectedPkgForModal.id)
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-600/10"
                      : "bg-[#003B73] hover:bg-[#002B54] text-white hover:shadow-blue-900/10"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  {isAlreadyInCart(selectedPkgForModal.id) ? "Added" : "+ Add"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleWhatsApp(selectedPkgForModal.id);
                    setModalOpen(false);
                  }}
                  className="font-bold h-11 border-green-500/30 text-green-600 hover:text-green-700 hover:bg-green-50/50 rounded-2xl px-4 flex gap-1.5 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  Chat
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default HealthPackages;
