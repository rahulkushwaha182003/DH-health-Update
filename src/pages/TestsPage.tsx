import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Sparkles, Building2, CheckCircle2, ArrowRight, ShieldCheck, Home } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { LabLogos } from "@/components/ui/LabLogos";
import { labTests } from "@/data/labTests";
import { drLalTests } from "@/data/drLalTests";
import { metropolisTests } from "@/data/metropolisTests";
import { pathkindTests } from "@/data/pathkindTests";
import { bharatTests } from "@/data/bharatTests";
import { diagnosticsHubTests } from "@/data/diagnosticsHubTests";
import { thyrocareTests } from "@/data/thyrocareTests";
import { useCart } from "@/context/CartContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { generateSlug } from "@/data/testsData";
import { RemoveConfirmDialog } from "@/components/ui/RemoveConfirmDialog";

const partnerLabs = [
  { name: "Bharat Lab", logo: "" },
  { name: "Pathkind Labs", logo: "" },
  { name: "Metropolis Healthcare", logo: "" },
  { name: "Dr. Lal PathLabs", logo: "" },
  { name: "Thyrocare", logo: "" },
  { name: "Redcliffe Labs", logo: "" },
  { name: "Agilus Diagnostics", logo: "" },
  { name: "Labwala Health Diagnostics", logo: "" }
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

  // 👉 OTHER LABS PARTNER SELECTION PAGE
  if (selectedLab === "Other Labs") {
    return (
      <Layout>
        <SEOHead
          title="Choose Partner Pathology Lab - Compare Tests & Packages in MP"
          description="Choose from India's top trusted partner pathology labs including Bharat Lab, Pathkind, Metropolis, Dr. Lal PathLabs and book home collection."
          canonical="/tests?lab=Other+Labs"
        />
        <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
          <div className="container max-w-7xl mx-auto mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors pl-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-semibold">Back to All Options</span>
            </Button>
          </div>

          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-[#003B73] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Partner Network
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0b417c] tracking-tight mb-2">
              Choose Your Lab
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-medium mx-auto flex items-center justify-center gap-3">
              <span className="w-10 h-[2px] bg-green-500 rounded-full hidden sm:block"></span>
              India's top trusted partner pathology labs
              <span className="w-10 h-[2px] bg-green-500 rounded-full hidden sm:block"></span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {partnerLabs.map((lab, index) => {
              const LogoComponent = LabLogos[lab.name as keyof typeof LabLogos] || LabLogos["Other Labs"];
              const isAvailable = lab.name === "Bharat Lab" || lab.name === "Pathkind Labs" || lab.name === "Metropolis Healthcare" || lab.name === "Thyrocare";
              return (
                <Card 
                  key={index} 
                  className={`rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-white hover:-translate-y-1.5 cursor-pointer ${
                    isAvailable 
                      ? 'border-emerald-500/40 ring-2 ring-emerald-500/10' 
                      : 'border-slate-200'
                  }`}
                  onClick={() => handleNavigate(lab.name)}
                >
                  {isAvailable ? (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.35)] uppercase tracking-wider flex items-center gap-1.5 border border-emerald-400/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Available
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200">
                      Coming Soon
                    </div>
                  )}
                  <CardContent className="p-5 flex flex-col items-center gap-4 text-center">
                    <div className="w-full bg-white rounded-xl p-3 flex justify-center items-center h-28 border border-slate-100 shadow-sm">
                      <LogoComponent className="w-full h-full object-contain max-h-24" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{lab.name}</h2>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {isAvailable ? "Tests & Packages Available" : "Catalog Under Integration"}
                      </p>
                    </div>

                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                      Home Collection Available
                    </span>

                    <Button 
                      className="w-full font-bold bg-[#003B73] hover:bg-[#002B54] text-white shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(lab.name);
                      }}
                    >
                      View Packages & Test
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600">Only Home Collection Service Available</p>
          </div>
        </div>
      </Layout>
    );
  }

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
      "SWASTH BHARAT HORMONE PROFILE",
      "DH HEALTH PACKAGE 1",
      "DH HEALTH PACKAGE 2",
      "DH HEALTH PACKAGE 3"
    ].map(name => name.trim().toUpperCase()));

    const baseTests = selectedLab === "Diagnostics Hub"
      ? (diagnosticsHubTests as typeof labTests)
      : selectedLab === "Dr. Lal PathLabs"
        ? ([] as typeof labTests)
        : selectedLab === "Metropolis Healthcare"
          ? (metropolisTests as typeof labTests)
          : selectedLab === "Pathkind Labs"
            ? (pathkindTests as typeof labTests)
            : selectedLab === "Bharat Lab"
              ? (bharatTests as typeof labTests)
              : selectedLab === "Thyrocare"
                ? (thyrocareTests as typeof labTests)
                : labTests;

    const activeTests = baseTests.map(test => {
      const normalizedName = test.name.trim().toUpperCase();
      let isPackage = false;
      if (selectedLab === "Diagnostics Hub") {
        isPackage = normalizedName === "DH HEALTH PACKAGE 1" ||
                    normalizedName === "DH HEALTH PACKAGE 2" ||
                    normalizedName === "DH HEALTH PACKAGE 3";
      } else {
        isPackage = normalizedName !== "UREA, SERUM" && (allowedPackageNames.has(normalizedName) || test.category === "Health Package");
      }
      
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

    const isCatalogAvailable = selectedLab === "Diagnostics Hub" || selectedLab === "Bharat Lab" || selectedLab === "Pathkind Labs" || selectedLab === "Metropolis Healthcare" || selectedLab === "Thyrocare";

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
            onClick={() => {
              if (selectedLab === "Diagnostics Hub") {
                handleNavigate(null);
              } else {
                handleNavigate("Other Labs");
              }
            }}
          >
            ← {selectedLab === "Diagnostics Hub" ? "Back to All Options" : "Back to Partner Labs"}
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
                  { id: "Routine & Special", label: selectedLab === "Thyrocare" ? "Profiles" : "Routine & Special" },
                  { id: "Health Package", label: selectedLab === "Thyrocare" ? "Packages" : "Health Package" }
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
                          <Link to={`/test/${generateSlug(test.name)}?lab=${encodeURIComponent(selectedLab || "")}&id=${encodeURIComponent(test.id)}`} className="text-[13px] font-bold text-[#003B73] hover:text-[#002B54] cursor-pointer">
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
                  onClick={() => handleNavigate("Other Labs")}
                  variant="outline"
                  className="w-full sm:w-auto bg-white border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-sm transition-all"
                >
                  Back to Partner Labs
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

  // 👉 FIRST PAGE (Main Landing: Diagnostics Hub & Other Labs)
  const DHLogo = LabLogos["Diagnostics Hub"];
  const OtherLabsLogo = LabLogos["Other Labs"];

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

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 sm:gap-8 items-stretch">
          {/* Diagnostics Hub Card */}
          <Card 
            className="group rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-[#003B73] ring-4 ring-blue-500/10 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 hover:-translate-y-2 cursor-pointer flex flex-col"
            onClick={() => handleNavigate("Diagnostics Hub")}
          >
            {/* Top Badge */}
            <div className="absolute top-3.5 right-3.5 z-10 bg-gradient-to-r from-[#003B73] to-[#005bb5] text-white text-[10px] font-black px-3.5 py-1 rounded-full shadow-[0_4px_12px_rgba(0,59,115,0.35)] uppercase tracking-wider flex items-center gap-1.5 border border-blue-400/30">
              <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              By Bharat Lab
            </div>

            <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center flex-1 justify-between gap-5">
              {/* Logo Area */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full bg-white rounded-2xl p-4 flex justify-center items-center h-28 border border-slate-100 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <DHLogo className="w-full h-full object-contain max-h-24" />
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Diagnostics Hub</h2>
                  <p className="text-xs font-bold text-blue-700 mt-1 uppercase tracking-wider">
                    DH Health Packages & Lab Tests
                  </p>
                </div>
              </div>

              {/* Value Propositions / Key Features */}
              <div className="w-full bg-white/90 rounded-2xl p-3.5 border border-blue-100/70 text-left space-y-2 text-xs shadow-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>3 DH Health Packages</strong> (Upto 78% Off)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>550+ Individual</strong> Routine & Special Tests</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Quality Assured by <strong>Bharat Lab</strong></span>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  <Home className="w-3.5 h-3.5 text-emerald-600" />
                  Free Home Collection Available
                </span>

                <Button 
                  className="w-full font-bold bg-[#003B73] hover:bg-[#002B54] text-white shadow-md py-3 h-auto text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate("Diagnostics Hub");
                  }}
                >
                  <span>View Packages & Test</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Other Labs Card */}
          <Card 
            className="group rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-slate-200 hover:border-emerald-500/50 ring-4 ring-slate-100 bg-gradient-to-b from-slate-50/50 via-white to-emerald-50/20 hover:-translate-y-2 cursor-pointer flex flex-col"
            onClick={() => handleNavigate("Other Labs")}
          >
            {/* Top Badge */}
            <div className="absolute top-3.5 right-3.5 z-10 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] font-black px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1.5 border border-emerald-400/30">
              <Building2 className="w-3 h-3 text-emerald-200" />
              8+ Partner Labs
            </div>

            <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center flex-1 justify-between gap-5">
              {/* Logo Area */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full bg-white rounded-2xl p-4 flex justify-center items-center h-28 border border-slate-100 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <OtherLabsLogo className="w-full h-full object-contain max-h-24" />
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Other Labs</h2>
                  <p className="text-xs font-bold text-emerald-700 mt-1 uppercase tracking-wider">
                    Top Certified Partner Pathology Labs
                  </p>
                </div>
              </div>

              {/* Value Propositions / Key Features */}
              <div className="w-full bg-white/90 rounded-2xl p-3.5 border border-emerald-100/70 text-left space-y-2 text-xs shadow-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Dr. Lal, Metropolis, Pathkind</strong> & more</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Compare prices & book from top brands</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct certified lab report delivery</span>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  <Home className="w-3.5 h-3.5 text-emerald-600" />
                  Home Collection Available
                </span>

                <Button 
                  className="w-full font-bold bg-[#003B73] hover:bg-[#002B54] text-white shadow-md py-3 h-auto text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate("Other Labs");
                  }}
                >
                  <span>Choose your labs</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">Only Home Collection Service Available</p>
        </div>
      </div>
    </Layout>
  );
}
