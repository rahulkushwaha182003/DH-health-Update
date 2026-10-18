import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Clock, User, LogOut, ShoppingCart, Home, Activity, FlaskConical, Info, HelpCircle, Calendar, ChevronRight, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/diagnostics-hub-logo.png";

const WHATSAPP_NUMBER = "917649885936";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : (user?.user_metadata?.first_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
        : (user?.email ? user.email.split('@')[0] : null));

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleBookAppointment = () => {
    navigate("/tests");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Tests", path: "/tests" },
    { name: "DH Health Packages", path: "/health-packages" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Help", path: "/help" },
  ];

  return (
    <header className={`sticky top-0 bg-card shadow-sm transition-all ${isMenuOpen ? "z-[999]" : "z-50"}`}>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container flex flex-wrap justify-between items-center text-xs sm:text-sm gap-2 px-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-1 sm:gap-2 hover:underline">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>+91 7649885936</span>
            </a>
            <div className="hidden sm:flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Mon-Sat: 7:00 AM - 7:00 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/dashboard" className="flex items-center gap-1 hover:underline">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{displayName || "My Account"}</span>
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-1 hover:underline opacity-80">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center gap-1 hover:underline">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container py-3 sm:py-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8 xl:gap-12">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <img 
                src={logo} 
                alt="Diagnostics Hub Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover shadow-sm"
                loading="eager"
                decoding="async"
                width={48}
                height={48}
              />
              <div>
                <div className="text-base sm:text-xl font-bold text-foreground leading-tight">Diagnostics Hub</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Your Health Partner</p>
              </div>
            </Link>

            {/* Desktop Navigation - Positioned Left next to Logo */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || 
                  (link.path === "/tests" && (location.pathname.startsWith("/tests") || location.pathname.startsWith("/test/")));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-semibold transition-colors text-sm xl:text-base whitespace-nowrap relative py-1 ${
                      isActive 
                        ? "text-[#003B73]" 
                        : "text-slate-600 hover:text-[#003B73]"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003B73] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/cart")} className="relative border-slate-200 hover:bg-slate-50 text-slate-700 mr-2 rounded-full w-10 h-10 p-0">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4.5 w-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Button>
            {user && (
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-primary hover:bg-primary/10">
                <User className="h-4 w-4 mr-1.5" /> My Bookings
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/results-inquiry")} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Result Inquiry
            </Button>
            <Button onClick={handleBookAppointment} className="bg-secondary hover:bg-secondary/90">
              Book Test
            </Button>
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="lg:hidden flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/cart")} className="relative border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full w-9 h-9 p-0">
              <ShoppingCart className="h-4 w-4" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4.5 w-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Button>
            <button
              className="text-foreground p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-200">
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-white shrink-0">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2.5">
                <img 
                  src={logo} 
                  alt="Diagnostics Hub Logo" 
                  className="h-10 w-10 rounded-lg object-cover shadow-xs"
                />
                <div>
                  <div className="text-base font-bold text-slate-900 leading-tight">Diagnostics Hub</div>
                  <p className="text-[10px] text-slate-500 font-medium">Your Health Partner</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => { navigate("/cart"); setIsMenuOpen(false); }} 
                  className="relative border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full w-9 h-9 p-0"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 min-w-[16px] min-h-[16px] flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Menu Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* User Account / Welcome Card */}
              {user ? (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#003B73] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      {displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-500 font-medium leading-none mb-1">Signed in</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{displayName || "Patient"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xs font-bold text-[#003B73] bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs hover:bg-blue-50 transition-colors"
                    >
                      Account
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                      className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-100 rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Welcome to Diagnostics Hub</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sign in to book tests & track reports</p>
                  </div>
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs font-bold bg-[#003B73] text-white px-3.5 py-1.5 rounded-xl shadow-xs hover:bg-[#002B54] transition-all whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Group 1: Healthcare Services */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Healthcare Services
                </p>
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
                  {/* Home */}
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname === "/"
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname === "/" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Home className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Home</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${location.pathname === "/" ? "text-[#003B73]" : "text-slate-300"}`} />
                  </Link>

                  {/* Tests */}
                  <Link
                    to="/tests"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname.startsWith("/tests") || location.pathname.startsWith("/test/")
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname.startsWith("/tests") || location.pathname.startsWith("/test/") ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <FlaskConical className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Tests</span>
                        <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Popular
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${location.pathname.startsWith("/tests") || location.pathname.startsWith("/test/") ? "text-[#003B73]" : "text-slate-300"}`} />
                  </Link>

                  {/* DH Health Packages */}
                  <Link
                    to="/health-packages"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname === "/health-packages"
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname === "/health-packages" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">DH Health Packages</span>
                        <span className="text-[9px] font-extrabold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Best Value
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${location.pathname === "/health-packages" ? "text-[#003B73]" : "text-slate-300"}`} />
                  </Link>

                  {/* Services */}
                  <Link
                    to="/services"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname === "/services"
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname === "/services" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Specialized Services</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${location.pathname === "/services" ? "text-[#003B73]" : "text-slate-300"}`} />
                  </Link>
                </div>
              </div>

              {/* Group 2: Orders & Reports */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Orders & Reports
                </p>
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
                  {/* My Bookings */}
                  {user && (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                        location.pathname === "/dashboard"
                          ? "bg-blue-50/80 text-[#003B73] font-bold"
                          : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          location.pathname === "/dashboard" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          <Calendar className="h-4 w-4" />
                        </div>
                        <span className="text-sm">My Bookings & Reports</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${location.pathname === "/dashboard" ? "text-[#003B73]" : "text-slate-300"}`} />
                    </Link>
                  )}

                  {/* Result Inquiry */}
                  <Link
                    to="/results-inquiry"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname === "/results-inquiry"
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname === "/results-inquiry" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Check Test Report / Status</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${location.pathname === "/results-inquiry" ? "text-[#003B73]" : "text-slate-300"}`} />
                  </Link>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname === "/cart"
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname === "/cart" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <span className="text-sm">My Cart</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {cartItems.length > 0 && (
                        <span className="text-[11px] font-bold bg-[#003B73] text-white px-2 py-0.5 rounded-full">
                          {cartItems.length} items
                        </span>
                      )}
                      <ChevronRight className={`h-4 w-4 ${location.pathname === "/cart" ? "text-[#003B73]" : "text-slate-300"}`} />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Group 3: Support & Information */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Support & Company
                </p>
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
                  {/* About */}
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname === "/about"
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname === "/about" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Info className="h-4 w-4" />
                      </div>
                      <span className="text-sm">About Us</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${location.pathname === "/about" ? "text-[#003B73]" : "text-slate-300"}`} />
                  </Link>

                  {/* Contact */}
                  <Link
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname === "/contact"
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname === "/contact" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Contact & Hub Locations</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${location.pathname === "/contact" ? "text-[#003B73]" : "text-slate-300"}`} />
                  </Link>

                  {/* Help */}
                  <Link
                    to="/help"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                      location.pathname === "/help"
                        ? "bg-blue-50/80 text-[#003B73] font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        location.pathname === "/help" ? "bg-[#003B73] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Help & Customer Support</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${location.pathname === "/help" ? "text-[#003B73]" : "text-slate-300"}`} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Action & Helpline */}
            <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-2.5 shrink-0 shadow-lg">
              <Button 
                onClick={handleBookAppointment} 
                className="bg-[#003B73] hover:bg-[#002B54] text-white font-bold h-12 rounded-xl shadow-md transition-all active:scale-98 w-full flex items-center justify-center gap-2 text-sm"
              >
                <FlaskConical className="h-4 w-4" />
                <span>Book Test Now</span>
              </Button>

              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Need Help?</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">+91 7649885936</p>
                  </div>
                </div>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;
