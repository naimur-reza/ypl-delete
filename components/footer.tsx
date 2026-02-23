import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Instagram, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Setting from "@/lib/models/setting";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Our Services" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ],
  candidates: [
    { href: "/jobs", label: "Search Jobs" },
    { href: "/submit-cv", label: "Join CV Bank" },
    { href: "/insights", label: "Career Advice" },
  ],
  employers: [
    { href: "/services", label: "Hiring Solutions" },
    { href: "/contact", label: "Talent Acquisition" },
    { href: "/services", label: "Recruitment Services" },
  ],
};

async function getSettings() {
  try {
    await connectDB();
    const setting = await Setting.findOne().lean();
    return JSON.parse(JSON.stringify(setting));
  } catch (error) {
    console.error("Failed to fetch settings for footer:", error);
    return null;
  }
}

export async function Footer() {
  const settings = await getSettings();

  const socialIcons: Record<string, any> = {
    Facebook: Facebook,
    LinkedIn: Linkedin,
    Twitter: Twitter,
    Instagram: Instagram,
  };

  return (
    <footer className="relative border-t border-border bg-slate-950 text-slate-200 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/50 via-secondary/50 to-primary/50" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/images/ypl-logo.png"
                alt="YPL"
                width={120}
                height={48}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              {settings?.footerDescription || "Supporting the full talent lifecycle with expert recruitment and career management services."}
            </p>
            <div className="flex items-center gap-3">
              {(settings?.socialLinks || []).map((link: any) => {
                const Icon = socialIcons[link.platform];
                if (!link.url || !Icon) return null;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 transition-all hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1"
                    aria-label={link.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
              Contact Info
            </h3>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>{settings?.address || "123 Business Street, London, EC1A 1BB, UK"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href={`tel:${settings?.phone}`} className="hover:text-white transition-colors">
                  {settings?.phone || "+44 (0) 20 1234 5678"}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href={`mailto:${settings?.email}`} className="hover:text-white transition-colors">
                  {settings?.email || "info@ypl.com"}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
              For Clients & Talents
            </h3>
            <ul className="space-y-3">
              {[...footerLinks.candidates, ...footerLinks.employers.slice(0, 2)].map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium tracking-wide">
          <p>
            &copy; {new Date().getFullYear()} {settings?.siteName || "YPL"}. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Designed and developed by</span>
            <a 
              href="https://codexaa.com" 
              target="_blank" 
              rel="noopener"
              className="font-bold text-slate-300 hover:text-primary transition-colors"
            >
              Codexaa Limited
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
