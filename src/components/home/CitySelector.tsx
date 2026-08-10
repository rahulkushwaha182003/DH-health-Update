import { useState, useEffect } from "react";
import { MapPin, ChevronRight, Navigation, ChevronDown, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const states = [
  { value: "madhya-pradesh", label: "Madhya Pradesh" },
];

const citiesByState: Record<string, { value: string; label: string }[]> = {
  "madhya-pradesh": [
    { value: "agar-malwa", label: "Agar Malwa" },
    { value: "alirajpur", label: "Alirajpur" },
    { value: "anuppur", label: "Anuppur" },
    { value: "ashoknagar", label: "Ashoknagar" },
    { value: "balaghat", label: "Balaghat" },
    { value: "barwani", label: "Barwani" },
    { value: "betul", label: "Betul" },
    { value: "bhind", label: "Bhind" },
    { value: "bhopal", label: "Bhopal" },
    { value: "burhanpur", label: "Burhanpur" },
    { value: "chhatarpur", label: "Chhatarpur" },
    { value: "chhindwara", label: "Chhindwara" },
    { value: "damoh", label: "Damoh" },
    { value: "datia", label: "Datia" },
    { value: "dewas", label: "Dewas" },
    { value: "dhar", label: "Dhar" },
    { value: "dindori", label: "Dindori" },
    { value: "guna", label: "Guna" },
    { value: "gwalior", label: "Gwalior" },
    { value: "harda", label: "Harda" },
    { value: "indore", label: "Indore" },
    { value: "jabalpur", label: "Jabalpur" },
    { value: "jhabua", label: "Jhabua" },
    { value: "katni", label: "Katni" },
    { value: "khandwa", label: "Khandwa" },
    { value: "khargone", label: "Khargone" },
    { value: "maihar", label: "Maihar" },
    { value: "mandla", label: "Mandla" },
    { value: "mandsaur", label: "Mandsaur" },
    { value: "mauganj", label: "Mauganj" },
    { value: "morena", label: "Morena" },
    { value: "narmadapuram", label: "Narmadapuram" },
    { value: "narsinghpur", label: "Narsinghpur" },
    { value: "neemuch", label: "Neemuch" },
    { value: "niwari", label: "Niwari" },
    { value: "pandhurna", label: "Pandhurna" },
    { value: "panna", label: "Panna" },
    { value: "raisen", label: "Raisen" },
    { value: "rajgarh", label: "Rajgarh" },
    { value: "ratlam", label: "Ratlam" },
    { value: "rewa", label: "Rewa" },
    { value: "sagar", label: "Sagar" },
    { value: "satna", label: "Satna" },
    { value: "sehore", label: "Sehore" },
    { value: "seoni", label: "Seoni" },
    { value: "shahdol", label: "Shahdol" },
    { value: "shajapur", label: "Shajapur" },
    { value: "sheopur", label: "Sheopur" },
    { value: "shivpuri", label: "Shivpuri" },
    { value: "sidhi", label: "Sidhi" },
    { value: "singrauli", label: "Singrauli" },
    { value: "tikamgarh", label: "Tikamgarh" },
    { value: "ujjain", label: "Ujjain" },
    { value: "umaria", label: "Umaria" },
    { value: "vidisha", label: "Vidisha" },
  ],
};

const CitySelector = () => {
  const [selectedState, setSelectedState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selected_state") || "madhya-pradesh";
    }
    return "madhya-pradesh";
  });
  const [selectedCity, setSelectedCity] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selected_city") || "rewa";
    }
    return "rewa";
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openCityPopover, setOpenCityPopover] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_state", selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_city", selectedCity);
    }
  }, [selectedCity]);

  // Find current city label for display
  const currentCityObj = citiesByState[selectedState]?.find(c => c.value === selectedCity);
  const selectedCityLabel = currentCityObj ? currentCityObj.label : "Rewa";


  const triggerUpdateEffect = (cityName: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Location Updated",
        description: `Now showing diagnostic services and partner labs for ${cityName}.`,
      });
    }, 700);
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      setSelectedState("madhya-pradesh");
      setSelectedCity("rewa");
      triggerUpdateEffect("Rewa");
    }, 1200); // 1.2s to enjoy the scanning laser animation!
  };

  // Listen to isUpdating and apply smooth transition & blur to main page content
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;
    
    // Ensure smooth CSS transitions are enabled on the main content
    mainEl.classList.add('transition-all', 'duration-300', 'ease-in-out');
    
    if (isUpdating) {
      mainEl.classList.add('opacity-40', 'blur-[2px]', 'scale-[0.995]', 'pointer-events-none');
    } else {
      mainEl.classList.remove('opacity-40', 'blur-[2px]', 'scale-[0.995]', 'pointer-events-none');
    }

    return () => {
      mainEl.classList.remove('opacity-40', 'blur-[2px]', 'scale-[0.995]', 'pointer-events-none');
    };
  }, [isUpdating]);

  return (
    <>
      <style>{`
        @keyframes scanner-sweep {
          0% { transform: translateY(-15px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }
      `}</style>

      {/* Page-wide loading overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-[9999] flex items-center justify-center pointer-events-auto animate-fade-in">
          <div className="bg-white/95 border border-blue-100/80 p-5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-[90%] sm:max-w-md animate-scale-in border-t-4 border-t-primary">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                Updating Diagnostics Hub
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Fetching services for {selectedCityLabel}...
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-gradient-to-r from-blue-50/50 via-white to-emerald-50/10 border-b border-blue-100/50 py-2.5 sm:py-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] relative z-30 overflow-hidden">
        
        {/* GPS Scanning Laser Line Sweep */}
        {isDetecting && (
          <div 
            className="absolute inset-x-0 top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent pointer-events-none"
            style={{ animation: 'scanner-sweep 1.2s infinite ease-in-out' }}
          />
        )}

        <div className="container max-w-7xl flex flex-row items-center justify-between gap-3 px-4 mx-auto">
          
          {/* Left: Location Pin & Serving Badge with Hover Card */}
          <div className="flex items-center">
            <HoverCard openDelay={150}>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2.5 group cursor-pointer">
                  <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-blue-100/60 border border-blue-200/50 shadow-[0_2px_6px_rgba(59,130,246,0.08)] group-hover:scale-105 transition-all duration-300">
                    <MapPin className="h-4 w-4 text-primary animate-pulse" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wider uppercase leading-none select-none">
                      Your Location
                    </span>
                    <span className="hidden sm:inline-flex items-center text-[9px] font-semibold text-emerald-600 mt-0.5 tracking-wide">
                      Serving 55+ Cities in MP
                    </span>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 rounded-2xl border-blue-100/80 shadow-2xl p-4 bg-white/95 backdrop-blur-md relative z-[999]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Diagnostics Hub Network</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Coverage</span>
                      <span className="text-slate-800 font-semibold text-right">Madhya Pradesh (55+ Districts)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Lab Status</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        NABL Accredited
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Home Collection</span>
                      <span className="text-primary font-bold">Free in {selectedCityLabel}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-2 border border-blue-100/30">
                    <p className="text-[10px] text-slate-600 leading-normal">
                      ✨ Book online today and get your digital reports sent directly to WhatsApp within 12 hours.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>


          </div>

          {/* Right: Unified Search/Select Pill */}
          <div className="flex items-center bg-white border border-blue-100/80 p-1 rounded-2xl shadow-[0_2px_10px_-2px_rgba(59,130,246,0.03)] hover:border-primary/30 transition-colors">
            
            {/* State Select */}
            <Select 
              value={selectedState} 
              onValueChange={(val) => {
                if (val !== selectedState) {
                  setSelectedState(val);
                  const firstCity = citiesByState[val]?.[0];
                  setSelectedCity(firstCity?.value || "");
                  triggerUpdateEffect(firstCity?.label || val);
                }
              }}
            >
              <SelectTrigger className="border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 h-8 sm:h-9 text-[11px] sm:text-xs w-[110px] sm:w-40 font-semibold text-slate-700 hover:bg-blue-50/40 rounded-xl px-2 sm:px-3 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-blue-100 shadow-xl max-h-[300px]">
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value} className="text-xs focus:bg-blue-50 focus:text-primary rounded-lg mx-1 my-0.5">
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Vertical Divider */}
            <div className="w-px h-4.5 sm:h-5.5 bg-blue-100/80 mx-0.5 sm:mx-1 shrink-0" />

            {/* Searchable City ComboBox */}
            <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-between border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 h-8 sm:h-9 text-[11px] sm:text-xs w-[90px] sm:w-32 font-semibold text-slate-700 hover:bg-blue-50/40 rounded-xl px-2 sm:px-3 transition-colors outline-none text-left">
                  <span className="truncate flex-1">{selectedCityLabel}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0 ml-1.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0 rounded-xl border-blue-100 shadow-xl" align="start">
                <Command>


                  <CommandInput placeholder="Search city..." className="h-9 text-xs border-none focus:ring-0" />
                  <CommandList className="max-h-[250px] overflow-y-auto">
                    <CommandEmpty className="py-2 text-[11px] text-center text-slate-400">No city found.</CommandEmpty>
                    <CommandGroup>
                      {citiesByState[selectedState]?.map((city) => (
                        <CommandItem
                          key={city.value}
                          value={city.label}
                          onSelect={() => {
                            if (city.value !== selectedCity) {
                              setSelectedCity(city.value);
                              triggerUpdateEffect(city.label);
                            }
                            setOpenCityPopover(false);
                          }}
                          className="text-xs rounded-lg mx-1 my-0.5 cursor-pointer flex items-center justify-between py-1.5 px-2.5 data-[selected='true']:bg-blue-50 data-[selected='true']:text-primary"
                        >
                          <span className="truncate">{city.label}</span>
                          {selectedCity === city.value && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* GPS Auto-Detect Button */}
            <button 
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="flex items-center justify-center h-8 sm:h-9 w-8 sm:w-9 rounded-xl bg-blue-50/50 hover:bg-primary text-primary hover:text-white border border-blue-100/30 hover:border-primary transition-all active:scale-95 disabled:opacity-60 shrink-0 ml-1"
              title="Auto-Detect Location"
            >
              <Navigation className={`h-3.5 w-3.5 ${isDetecting ? 'animate-spin text-primary' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CitySelector;
