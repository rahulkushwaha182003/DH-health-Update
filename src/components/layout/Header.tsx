import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Clock, User, LogOut, ShoppingCart, Home, Activity, FlaskConical, Info, HelpCircle, Calendar, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/diagnostics-hub-logo.png";

const WHATSAPP_NUMBER = "917649885936";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart();

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
    <header className="sticky top-0 z-50 bg-card shadow-sm">
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
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-foreground hover:text-primary font-medium transition-colors text-sm xl:text-base whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-6 border-t border-slate-100 pt-5 animate-fade-in">
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => {
                // Determine icon and description for each link
                let IconComponent = Home;
                let description = "";
                let badge = null;
                let iconColors = "bg-blue-50 text-blue-600";

                switch (link.name) {
                  case "Home":
                    IconComponent = Home;
                    description = "Main dashboard & highlights";
                    iconColors = "bg-blue-50 text-blue-600";
                    break;
                  case "Services":
                    IconComponent = Activity;
                    description = "Our healthcare specializations";
                    iconColors = "bg-teal-50 text-teal-600";
                    badge = "Home Pickup";
                    break;
                  case "Tests":
                    IconComponent = FlaskConical;
                    description = "500+ Pathology & Radiology tests";
                    iconColors = "bg-emerald-50 text-emerald-600";
                    badge = "Popular";
                    break;
                  case "DH Health Packages":
                    IconComponent = FlaskConical;
                    description = "Affordable health checkup packages";
                    iconColors = "bg-purple-50 text-purple-600";
                    badge = "Best Value";
                    break;
                  case "About":
                    IconComponent = Info;
                    description = "Accreditations & our team";
                    iconColors = "bg-violet-50 text-violet-600";
                    break;
                  case "Contact":
                    IconComponent = Phone;
                    description = "Hub locations & contact details";
                    iconColors = "bg-amber-50 text-amber-600";
                    break;
                  case "Help":
                    IconComponent = HelpCircle;
                    description = "FAQs & Customer Support";
                    iconColors = "bg-rose-50 text-rose-600";
                    break;
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-blue-50/30 border border-slate-200 hover:border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center h-10 w-10 rounded-xl ${iconColors} transition-transform group-hover:scale-105 duration-300`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                            {link.name}
                          </span>
                          {badge && (
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                              badge === 'Popular' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                            }`}>
                              {badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">
                          {description}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}

              {user && (
                <Link
                  to="/dashboard"
                  className="group flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-blue-50/30 border border-slate-200 hover:border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-105 duration-300">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                        My Bookings
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">
                        Track status & download reports
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              )}

              {/* Bottom Premium Action Button */}
              <Button 
                onClick={handleBookAppointment} 
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold h-11 rounded-2xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all active:scale-98 w-full mt-3 flex items-center justify-center gap-2"
              >
                <FlaskConical className="h-4 w-4" />
                <span>Book Test Now</span>
              </Button>
              
              {/* WhatsApp / Call Helpline info */}
              <div className="mt-4 p-3.5 bg-blue-50/40 border border-blue-100/30 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Need assistance?</span>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call/WhatsApp: +91 7649885936</span>
                </a>
                <span className="text-[9px] text-slate-500 font-medium mt-1">Our support agents are available 7 AM - 7 PM</span>
              </div>

            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
