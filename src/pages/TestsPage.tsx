import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { LabLogos } from "@/components/ui/LabLogos";
import { labTests } from "@/data/labTests";
import { drLalTests } from "@/data/drLalTests";
import { metropolisTests } from "@/data/metropolisTests";
import { pathkindTests } from "@/data/pathkindTests";
import { bharatTests } from "@/data/bharatTests";
import { useCart } from "@/context/CartContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { generateSlug } from "@/data/testsData";
import { RemoveConfirmDialog } from "@/components/ui/RemoveConfirmDialog";

const FALLBACK_LOGO = "https://via.placeholder.com/60?text=Lab";

const labs = [
  { name: "Dr. Lal PathLabs", logo: "" },
  { name: "Metropolis Healthcare", logo: "" },
  { name: "Thyrocare", logo: "" },
  { name: "Pathkind Labs", logo: "" },
  { name: "Redcliffe Labs", logo: "" },
  { name: "Agilus Diagnostics", logo: "" },
  { name: "Bharat Lab", logo: "" },
  { name: "Labwala Health Diagnostics", logo: "" },
  { name: "Other Labs", logo: "" }
];

export default function DiagnosticsUI() {
  const { addToCart, cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLab = searchParams.get("lab");
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [selectedTestToRemove, setSelectedTestToRemove] = useState<{ id: string; name: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const activeCategory = searchParams.get("category") || "All";
  const setActiveCategory = (catId: string) => {
    const params = new URLSearchParams(searchParams);
    if (catId === "All") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    setSearchParams(params);
  };
  const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});

  const handleNavigate = (labName: string | null) => {
    if (labName) {
      setSearchParams({ lab: labName });
      localStorage.setItem('active_hub_lab', labName);
    } else {
      setSearchParams({});
      localStorage.removeItem('active_hub_lab');
    }
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 👉 SECOND PAGE (Lab Details - View 200+ Tests)
  if (selectedLab) {
    const allowedPackageNames = new Set([
      "BODY PROFILE",
      "SWASTH BHARAT MINI",
      "SWASTH BHARAT BASIC",
      "SWASTH BHARAT ADVANCE",
      "SWASTH BHARAT HORMONAL PROFILE ADVANCE MALE",
      "SWASTH BHARAT HORMONAL PROFILE BASIC FOR FEMALE",
      "SWASTH BHARAT HORMONAL PROFILE ADVANCE FOR FEMALE",
      "SWASTH BHARAT FEVER PROFILE BASIC",
      "SWASTH BHARAT FEVER PROFILE ADVANCE",
      "SWASTH BHARAT DIABETES PANEL",
      "SWASTH BHARAT ARTHRITIS PROFILE",
      "SWASTH BHARAT CANCER CARE PROFILE MALE",
      "SWASTH BHARAT CANCER CARE PROFILE FEMALE",
      "SWASTH BHARAT WINTER PROFILE",
      "AAROGYA FEVER PANEL",
      "AAROGYA FEVER PANEL 2",
      "AAROGYA ARTHRITIS PROFILE",
      "MEDICAL PROFILE RANDOM",
      "MEDICAL PROFILE FASTING",
      "BASIC HEALTH PROFILE FEMALE",
      "VITAMINS B COMPLEX PROFILE",
      "BASIC HEALTH PROFILE MALE",
      "SWASTH BHARAT CAMP PROFILE-1",
      "SWASTH BHARAT CAMP PROFILE-2",
      "SWASTH BHARAT CAMP PROFILE-3",
      "CARDIAC MARKER PROFILE",
      "SWASTH BHARAT PACKAGE PLUS",
      "SWASTH BHARAT HEART CARE PROFILE",
      "FULL BODY PACKAGE",
      "ICU PROFILE",
      "SWASTH MOM/DAD PACKAGE",
      "SWASTH DADI PACKAGE",
      "ANTENATAL CARE (ANC) PACKAGE",
      "CANCER MARKER FEMALE",
      "CANCER MARKER MALE",
      "SWASTH DADA PACKAGE",
      "SWASTH BHARAT HORMONE PROFILE"
    ].map(name => name.trim().toUpperCase()));

    const baseTests = selectedLab === "Dr. Lal PathLabs"
      ? (drLalTests as typeof labTests)
      : selectedLab === "Metropolis Healthcare"
        ? (metropolisTests as typeof labTests)
        : selectedLab === "Pathkind Labs"
          ? (pathkindTests as typeof labTests)
          : selectedLab === "Bharat Lab"
            ? (bharatTests as typeof labTests)
            : labTests;

    const activeTests = baseTests.map(test => {
      const normalizedName = test.name.trim().toUpperCase();
      const isPackage = normalizedName !== "UREA, SERUM" && (allowedPackageNames.has(normalizedName) || test.category === "Health Package");
      
      let displayCategory = test.testCategory;
      if (!displayCategory || displayCategory === "Routine & Special") {
        displayCategory = isPackage ? "Health Package" : "Routine & Special";
      }

      return {
        ...test,
        category: isPackage ? "Health Package" : "Routine & Special",
        testCategory: displayCategory
      };
    });

    const filteredTests = activeTests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesCategory = activeCategory === "All" || test.category === activeCategory;
      if (activeCategory === "Health Package" && test.name.trim().toUpperCase() === "UREA, SERUM") {
        matchesCategory = false;
      }
      return matchesSearch && matchesCategory;
    });

    const LogoComponent = LabLogos[selectedLab as keyof typeof LabLogos] || LabLogos["Other Labs"];

    const isCatalogAvailable = selectedLab === "Bharat Lab" || selectedLab === "Pathkind Labs" || selectedLab === "Metropolis Healthcare";

    return (
      <Layout>
        <SEOHead
          title={`${selectedLab} - View & Book Tests`}
          description={isCatalogAvailable ? `Compare and book diagnostic tests and health packages from ${selectedLab} with home sample collection in MP.` : `${selectedLab} is coming soon to Diagnostics Hub.`}
          canonical="/tests"
        />
        <div className="p-4 md:p-8 min-h-screen bg-slate-50">
          <button
            className="mb-6 text-slate-500 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors group"
            onClick={() => handleNavigate(null)}
          >
            ← Back to Labs
          </button>

          {/* Lab Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-24 bg-white rounded-xl p-2 flex justify-center items-center h-24 border border-slate-100 shadow-sm shrink-0">
                <LogoComponent className="w-full h-full object-contain max-h-20" />
              </div>
              <div className="pt-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                  {selectedLab} Tests & Health Packages
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-bold tracking-wide">
                    ✓ Home Collection
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold tracking-wide">
                    ⭐ Trusted Partner
                  </span>
                </div>
              </div>
            </div>

            {/* Search - show if catalog is available */}
            {isCatalogAvailable && (
              <div className="w-full md:w-80 mt-2 md:mt-4">
                <input
                  type="text"
                  placeholder="Search tests & packages..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-slate-50 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          {isCatalogAvailable ? (
            <>
              {/* Categories Filter */}
              <div className="flex overflow-x-auto pb-2 gap-2 mb-6 scrollbar-hide">
                {[
                  { id: "All", label: "All" },
                  { id: "Routine & Special", label: "Routine & Special" },
                  { id: "Health Package", label: "Health Package" }
                ].filter(cat => {
                  if (cat.id === "All") return true;
                  const count = activeTests.filter(t => t.category === cat.id).length;
                  return count > 0;
                }).map(cat => {
                  const count = cat.id === "All" 
                    ? activeTests.length 
                    : activeTests.filter(t => t.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat.id
                        ? "bg-slate-800 text-white shadow-md transform scale-105"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      {cat.label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Tests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTests.map((test) => {
                  return (
                    <Card key={test.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white border border-slate-100 flex flex-col h-full overflow-hidden p-5">
                      <div className="flex-grow">
                        <h3 className="font-bold text-[#003B73] text-[15px] hover:text-[#002B54] transition-colors uppercase leading-snug mb-1 cursor-pointer">
                          {test.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-4 mt-3">
                          <span className="text-xl font-bold text-slate-900">₹ {test.discountPrice || test.price}</span>
                          {test.discountPrice && test.discountPrice < test.price && (
                            <span className="text-sm line-through text-slate-400 font-medium">₹{test.price}</span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {test.homeCollection && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#3B8B41]">
                              <span className="flex items-center justify-center bg-[#3B8B41] text-white rounded-full w-3.5 h-3.5 text-[9px] font-bold">✓</span>
                              Home Collection
                            </span>
                          )}
                          {test.testCategory && (
                            <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-md font-bold border border-blue-100 uppercase">
                              {test.testCategory}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2">
                        {cartItems.some(i => i.id === test.id) ? (
                          <Button
                            className="bg-[#3B8B41] hover:bg-[#2F7034] text-white rounded-lg px-6 py-2 h-auto text-sm font-semibold active:scale-95 transition-all"
                            onClick={() => {
                              setSelectedTestToRemove({ id: test.id, name: test.name });
                              setConfirmRemoveOpen(true);
                            }}
                          >
                            Added
                          </Button>
                        ) : (
                          <Button
                            className="bg-[#003B73] hover:bg-[#002B54] text-white rounded-lg px-6 py-2 h-auto text-sm font-semibold active:scale-95 transition-all"
                            onClick={() => {
                              addToCart({
                                id: test.id,
                                name: test.name,
                                price: test.price,
                                discountPrice: test.discountPrice,
                                parametersCount: test.includedTests ? test.includedTests.length : Math.floor(Math.random() * 20 + 2),
                                fastingRequired: test.fastingRequired,
                                labName: selectedLab
                              });
                            }}
                          >
                            + Add
                          </Button>
                        )}
                        <div className="flex items-center gap-3">
                          <Link to={`/test/${generateSlug(test.name)}?lab=${encodeURIComponent(selectedLab || "")}`} className="text-[13px] font-bold text-[#003B73] hover:text-[#002B54] cursor-pointer">
                            Know More
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {filteredTests.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                    <span className="text-4xl block mb-3">🔍</span>
                    <h3 className="text-xl font-bold text-slate-700 mb-1">
                      {activeTests.length === 0 ? "No tests available" : "No matches found"}
                    </h3>
                    <p className="text-slate-500 font-medium">
                      {activeTests.length === 0
                        ? `Currently, there are no tests or packages listed for ${selectedLab}.`
                        : "Try adjusting your search or category filter."}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Premium Coming Soon State */
            <div className="max-w-3xl mx-auto mt-6 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 rounded-3xl p-8 sm:p-12 text-center shadow-lg border border-indigo-100 flex flex-col items-center">
              <div className="relative mb-6">
                {/* Visual Ring and Icon */}
                <div className="absolute inset-0 bg-indigo-200/40 rounded-full blur-xl scale-125 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-white rounded-2xl shadow-md border border-indigo-100/50 flex justify-center items-center">
                  <Clock className="w-10 h-10 text-indigo-600 animate-spin-slow" style={{ animation: 'spin 8s linear infinite' }} />
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100/60 rounded-full text-indigo-800 text-xs font-bold tracking-wide uppercase mb-4 border border-indigo-200/50">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Catalog Under Integration
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4 max-w-lg">
                Coming Soon to Diagnostics Hub
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-medium">
                We are currently cataloging and quality-checking the tests for <strong className="text-indigo-900">{selectedLab}</strong>. Our team is working to bring you the best online booking experience soon.
              </p>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                <Button 
                  onClick={() => handleNavigate("Bharat Lab")}
                  className="w-full sm:w-auto bg-[#0b417c] hover:bg-[#08305c] text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all transform active:scale-95"
                >
                  Explore Bharat Lab Catalog
                </Button>
                <Button
                  onClick={() => handleNavigate(null)}
                  variant="outline"
                  className="w-full sm:w-auto bg-white border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-sm transition-all"
                >
                  Back to All Labs
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {selectedTestToRemove && (
          <RemoveConfirmDialog
            isOpen={confirmRemoveOpen}
            onClose={() => {
              setConfirmRemoveOpen(false);
              setSelectedTestToRemove(null);
            }}
            onConfirm={() => {
              removeFromCart(selectedTestToRemove.id);
            }}
            itemName={selectedTestToRemove.name}
            isPackage={
              activeTests.find(t => t.id === selectedTestToRemove.id)?.category === "Health Package"
            }
          />
        )}
      </Layout>
    );
  }

  // 👉 FIRST PAGE
  return (
    <Layout>
      <SEOHead
        title="Compare Blood Test Prices & Labs in MP"
        description="Compare blood test prices, health packages and trusted diagnostic lab partners. Select a lab and book home sample collection across Madhya Pradesh."
        canonical="/tests"
        keywords="compare blood test prices MP, diagnostic lab partners Madhya Pradesh, pathology tests Rewa, book home sample collection MP"
      />
      <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
        <div className="container max-w-7xl mx-auto mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors pl-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Back</span>
          </Button>
        </div>
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0b417c] tracking-tight mb-2 selection:bg-blue-200">
            Compare Blood Tests, Prices and Diagnostic Labs
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium mx-auto flex items-center justify-center gap-3">
            <span className="w-10 h-[2px] bg-green-500 rounded-full hidden sm:block"></span>
            India's top trusted partner pathology labs
            <span className="w-10 h-[2px] bg-green-500 rounded-full hidden sm:block"></span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {labs.map((lab, index) => {
            const LogoComponent = LabLogos[lab.name as keyof typeof LabLogos] || LabLogos["Other Labs"];
            const isAvailable = lab.name === "Bharat Lab" || lab.name === "Pathkind Labs" || lab.name === "Metropolis Healthcare";
            return (
              <Card key={index} className={`rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${isAvailable ? 'border-emerald-500/40 ring-2 ring-emerald-500/10 bg-gradient-to-b from-emerald-50/10 to-white hover:-translate-y-1.5' : ''}`}>
                {isAvailable && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.35)] uppercase tracking-wider flex items-center gap-1.5 border border-emerald-400/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Available
                  </div>
                )}
                <CardContent className="p-5 flex flex-col items-center gap-4 text-center">

                  <div className="w-full bg-slate-50 rounded-xl p-3 flex justify-center items-center h-28 border border-slate-100">
                    <LogoComponent className="w-full h-full object-contain max-h-24" />
                  </div>

                  <h2 className="text-lg font-semibold">{lab.name}</h2>

                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Home Collection Available
                  </span>

                  <Button className="w-full" onClick={() => handleNavigate(lab.name)}>
                    View Packages & Test
                  </Button>

                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">Only Home Collection Service Available</p>
        </div>
      </div>
    </Layout>
  );
}
