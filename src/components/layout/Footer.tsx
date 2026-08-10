import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Instagram, Users, Youtube, Linkedin } from "lucide-react";
import logo from "@/assets/diagnostics-hub-logo.png";

const WHATSAPP_NUMBER = "917649885936";
const WHATSAPP_GROUP = "https://chat.whatsapp.com/LCTbVSvUDGDE311fwvTYvT?s=cl&p=a&ilr=1&amv=1";
const INSTAGRAM_URL = "https://www.instagram.com/diagnostics_hub?igsh=MzNzanJpN2tlODhs";
const TELEGRAM_BOT = "https://t.me/DiagnosticHub_bot";
const YOUTUBE_URL = "https://youtube.com/@diagnostics_hub?si=NbI4-ay4QPOYSZEY";
const LINKEDIN_URL = "https://www.linkedin.com/in/diagnostics-hub-834060420?utm_source=share_via&utm_content=profile&utm_medium=member_android";
const EMAIL = "pathologyhubdiagnostics@gmail.com";

const Footer = () => {
  return (
    <footer className="relative bg-background text-muted-foreground border-t border-border overflow-hidden">
      {/* Top colorful gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />
      
      {/* Subtle background glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container py-12 md:py-16 px-4 relative z-10 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src={logo}
                  alt="Diagnostics Hub Logo"
                  className="h-12 w-12 rounded-xl object-cover border border-border shadow-md group-hover:border-emerald-500/50 transition-all duration-300"
                  loading="lazy"
                  decoding="async"
                  width={48}
                  height={48}
                />
                <div className="absolute inset-0 rounded-xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300">
                  Diagnostics Hub
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold font-mono">
                  Your Health Partner
                </p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner in diagnostic healthcare. NABL accredited laboratory providing accurate, secure, and timely test results.
            </p>
            
            {/* Social Icons list */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/5 hover:shadow-[0_0_15px_rgba(37,211,102,0.15)]"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-[#128C7E] hover:border-[#128C7E]/40 hover:bg-[#128C7E]/5 hover:shadow-[0_0_15px_rgba(18,140,126,0.15)]"
                title="Join WhatsApp Group"
              >
                <Users className="h-5 w-5" />
              </a>
              <a
                href={TELEGRAM_BOT}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-[#0088cc] hover:border-[#0088cc]/40 hover:bg-[#0088cc]/5 hover:shadow-[0_0_15px_rgba(0,136,204,0.15)]"
                title="Telegram Bot"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-[#E1306C] hover:border-[#E1306C]/40 hover:bg-[#E1306C]/5 hover:shadow-[0_0_15px_rgba(225,48,108,0.15)]"
                title="Follow on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5 hover:shadow-[0_0_15px_rgba(255,0,0,0.15)]"
                title="Subscribe on YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:bg-[#0077B5]/5 hover:shadow-[0_0_15px_rgba(0,119,181,0.15)]"
                title="Follow on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="font-bold text-foreground text-base mb-4 tracking-tight border-b border-border pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-emerald-600 transition-all duration-300 hover:translate-x-1 inline-block text-sm font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-emerald-600 transition-all duration-300 hover:translate-x-1 inline-block text-sm font-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/tests" className="text-muted-foreground hover:text-emerald-600 transition-all duration-300 hover:translate-x-1 inline-block text-sm font-medium">
                  Tests & Packages
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-emerald-600 transition-all duration-300 hover:translate-x-1 inline-block text-sm font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-emerald-600 transition-all duration-300 hover:translate-x-1 inline-block text-sm font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-emerald-600 transition-all duration-300 hover:translate-x-1 inline-block text-sm font-medium">
                  Help & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground text-base mb-4 tracking-tight border-b border-border pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">In front of New Krishi Upaj Mandi, Beside Kotak Mahindra Bank, Karahiya No.1, Rewa (Madhya Pradesh) 486001</span>
              </li>
              <li>
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-3 text-muted-foreground hover:text-emerald-600 transition-colors text-sm font-medium">
                  <Phone className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>+91 7649885936</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-[#25D366] transition-colors text-sm font-medium">
                  <MessageCircle className="h-4 w-4 text-[#25D366] flex-shrink-0" />
                  <span className="text-[#25D366]">WhatsApp Chat</span>
                </a>
              </li>
              <li>
                <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-[#128C7E] transition-colors text-sm font-medium">
                  <Users className="h-4 w-4 text-[#128C7E] flex-shrink-0" />
                  <span className="text-[#128C7E]">Join WhatsApp Group</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-muted-foreground hover:text-emerald-600 transition-colors text-sm font-medium">
                  <Mail className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="break-all">{EMAIL}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Clock className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Mon-Sat: 7:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-base mb-4 tracking-tight border-b border-border pb-2">
              Newsletter
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Subscribe to get updates on health checkups and diagnostic offers.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter email address"
                required
                className="w-full bg-card border border-input focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-foreground rounded-xl px-4 py-2.5 text-sm transition-all outline-none placeholder:text-muted-foreground/60 shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 font-medium py-2.5 rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-emerald-500/20 shadow-emerald-500/10 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
            <div className="flex gap-3 pt-2">
              <div className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest bg-card border border-border px-2 py-1.5 rounded-lg shadow-sm">
                NABL ISO
              </div>
              <div className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest bg-card border border-border px-2 py-1.5 rounded-lg shadow-sm">
                100% SECURE
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-6 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/80">
            <p>© {new Date().getFullYear()} Diagnostics Hub. All rights reserved.</p>
            <div className="flex gap-4 md:gap-6">
              <Link to="/about" className="hover:text-emerald-600 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link>
              <Link to="/help" className="hover:text-emerald-600 transition-colors">Help</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
