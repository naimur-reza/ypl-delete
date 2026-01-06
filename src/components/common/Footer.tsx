import { Facebook, Youtube, Linkedin, Phone, MapPin, Mail, ArrowRight } from "lucide-react";
import { CountryAwareLink } from "./navbar/country-aware-link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/80 to-primary/50"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        
 

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: About & Social */}
          <div className="space-y-6">
            <div>
                     <CountryAwareLink href="/" className=" shrink-0">
                       <Image src="/logo.svg" alt="Logo" width={110} height={110} />
                     </CountryAwareLink>
              <p className="text-slate-400 leading-relaxed text-sm mt-3">
                Empowering students to achieve their global education dreams through expert guidance and personalized support.
              </p>
            </div>
            
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", color: "hover:bg-[#1877F2]" },
                { icon: Youtube, href: "#", color: "hover:bg-[#FF0000]" },
                { icon: Linkedin, href: "#", color: "hover:bg-[#0A66C2]" },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className={`w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Destinations */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Study Destinations</h3>
            <ul className="space-y-3 text-sm">
              {["United Kingdom", "USA", "Canada", "Australia", "New Zealand", "Ireland"].map((country) => (
                <li key={country}>
                  <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></span>
                    {country}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {["About Us", "Our Services", "University Partners", "Student Testimonials", "Events & Fairs", "Contact Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Call Us</p>
                  <a href="tel:+442034881195" className="text-white hover:text-blue-400 transition-colors font-medium">
                    +44 (0)203 488 1195
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Email Us</p>
                  <a href="mailto:info@nwceducation.com" className="text-white hover:text-blue-400 transition-colors font-medium">
                    info@nwceducation.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Visit Us</p>
                  <p className="leading-relaxed">
                    Unit 1, Sky View Tower, <br />
                    London E15 2GR, UK
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-900 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>
            © {new Date().getFullYear()} <span className="text-slate-400 font-medium">NWC Education</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
