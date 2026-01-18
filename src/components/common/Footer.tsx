import {
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Instagram,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import { CountryAwareLink } from "./navbar/country-aware-link";
import Image from "next/image";
import {
  fetchFooterSettings,
  getFooterDestinations,
  getFooterQuickLinks,
  getSocialLinks,
  getFooterGlobalOffices,
} from "@/lib/footer";

export default async function Footer({
  countrySlug,
}: {
  countrySlug?: string;
}) {
  // Fetch all footer data
  const [settings, destinations, globalOffices] = await Promise.all([
    fetchFooterSettings(),
    getFooterDestinations(),
    getFooterGlobalOffices(countrySlug),
  ]);

  console.log(globalOffices);
  const quickLinks = getFooterQuickLinks(settings.quickLinks);
  const socialLinks = getSocialLinks(settings);

  // Social media icons mapping
  const socialIcons = [
    {
      icon: Facebook,
      key: "facebook",
      href: socialLinks.facebook,
      color: "hover:bg-[#1877F2]",
    },
    {
      icon: Youtube,
      key: "youtube",
      href: socialLinks.youtube,
      color: "hover:bg-[#FF0000]",
    },
    {
      icon: Linkedin,
      key: "linkedin",
      href: socialLinks.linkedin,
      color: "hover:bg-[#0A66C2]",
    },
    {
      icon: Twitter,
      key: "twitter",
      href: socialLinks.twitter,
      color: "hover:bg-[#1DA1F2]",
    },
    {
      icon: Instagram,
      key: "instagram",
      href: socialLinks.instagram,
      color: "hover:bg-[#E4405F]",
    },
  ].filter((social) => social.href); // Only show social links that have URLs

  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/80 to-primary/50"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: About & Social */}
          <div className="space-y-6">
            <div>
              <CountryAwareLink href="/" className="shrink-0">
                <Image src="/logo.svg" alt="Logo" width={110} height={110} />
              </CountryAwareLink>
              <p className="text-slate-400 leading-relaxed text-sm mt-3">
                {settings.footerDescription ||
                  "Empowering students to achieve their global education dreams through expert guidance and personalized support."}
              </p>
            </div>

            {socialIcons.length > 0 && (
              <div className="flex gap-3">
                {socialIcons.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2: Destinations */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Study Destinations
            </h3>
            <ul className="space-y-3 text-sm">
              {destinations.map((destination) => (
                <li key={destination.id || destination.name}>
                  {destination.id ? (
                    <CountryAwareLink
                      href={`/study-abroad/${destination.slug}`}
                      className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></span>
                      {destination.name}
                    </CountryAwareLink>
                  ) : (
                    <span className="flex items-center gap-2 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                      {destination.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <CountryAwareLink
                    href={link.url}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></span>
                    {link.label}
                  </CountryAwareLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <div className="space-y-5 text-sm">
              {settings.contactPhone && (
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      Call Us
                    </p>
                    <a
                      href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                      className="text-white hover:text-blue-400 transition-colors font-medium"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {settings.contactEmail && (
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      Email Us
                    </p>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-white hover:text-blue-400 transition-colors font-medium"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {settings.contactAddress && (
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      Visit Us
                    </p>
                    <p className="leading-relaxed whitespace-pre-line">
                      {settings.contactAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Offices Row */}
      {globalOffices.length > 0 && (
        <div className="border-t border-slate-900 bg-[#020617]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-slate-500 font-semibold">
                Global Offices:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {globalOffices.map((office, index) => (
                  <span key={office.id} className="flex items-center gap-3">
                    <CountryAwareLink
                      href={`/global-branches/${
                        office.countries[0] || "global"
                      }/${office.slug}`}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {office.name}
                    </CountryAwareLink>
                    {index < globalOffices.length - 1 && (
                      <span className="text-slate-700">•</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copyright Bar */}
      <div className="border-t border-slate-900 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-400 font-medium">NWC Education</span>.
            All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {settings.privacyPolicyUrl && (
              <CountryAwareLink
                href={settings.privacyPolicyUrl}
                className="hover:text-slate-400 transition-colors"
              >
                Privacy Policy
              </CountryAwareLink>
            )}
            {settings.termsOfServiceUrl && (
              <CountryAwareLink
                href={settings.termsOfServiceUrl}
                className="hover:text-slate-400 transition-colors"
              >
                Terms of Service
              </CountryAwareLink>
            )}
            {settings.cookiePolicyUrl && (
              <CountryAwareLink
                href={settings.cookiePolicyUrl}
                className="hover:text-slate-400 transition-colors"
              >
                Cookie Policy
              </CountryAwareLink>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
